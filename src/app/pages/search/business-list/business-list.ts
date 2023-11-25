/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/07/11        Dakshata Patil
 */

import * as $ from 'jquery'
import * as Enums from '../../../../app/models/Enums'

import { Component, ViewChild } from '@angular/core'
import {
  GetBusinessListRes,
  businessList,
  shareDetails,
} from '../../../../app/models/getBusinessList_res'
import {
  
  MenuController,
  NavController,
  IonSlides,
  ToastController,
} from '@ionic/angular'

import { CategoryInfo } from '../../../../app/models/CategoryInfo'
import { CategoryListPage } from '../../search/category-list/category-list'
import { ClientPartnerPage } from '../../profile/client-partner/client-partner'
import { Constants } from '../../../Utils/Constants'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { GetBusinessListInfo } from '../../../../app/models/getBusinessList_info'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { ModalController } from '@ionic/angular'
import { ModalSortFilterComponent } from '../../../../app/components/modals/modal-sort-filter/modal-sort-filter'
import { Platform } from '@ionic/angular'
import { PopupBecomePartnerComponent } from '../../../../app/components/popup-become-partner/popup-become-partner'
import { PromotionInfo } from '../../../../app/models/PromotionInfo'
import { SearchResultsPage } from '../search-results/search-results'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { UserInfo } from '../../../../app/models/userInfo'
import { Utility } from '../../../Utils/Utility'
import { SearchService } from '../../../services/search.service'
import { DemoService } from '../../../services/demo.service'
import { CategoriesService } from '../../../services/categories.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { BusinessDetailsService } from '../../../services/business-details.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the BusinessListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-list',
  templateUrl: 'business-list.html',
  styleUrls: ['business-list.scss'],
  providers: [SearchService],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class BusinessListPage {
  pageTitle = 'Business Listing'
  @ViewChild('slider', { static: true }) slides: IonSlides
  catData: any
  userRole
  blurName: any
  //sortResult: any
  myClass: any
  myClass1
  items = []
  searchTerm: string = ''
  hideSearch: any
  filter
  isGuest
  userinfoobj = new UserInfo()
  isPartner
  isClientPartner
  categoryList: CategoryInfo[]
  category
  categoryName
  //searchedItem
  categoryInfo: CategoryInfo
  catList: CategoryInfo[]
  //filterList: CategoryInfo[]
  businessList: businessList[]
  getBusinessListRes: GetBusinessListRes
  circleSeperatorHide: any
  searchedTerm
  userfirstname: any
  userlastname: any
  selectedCategory
  businessListObj = new businessList()
  loading
  noBusinessFound: Boolean = false
  viewOtherProfile: boolean = false
  latitude
  longitude
  listCount: number = 0
  getBusinessListInfo: GetBusinessListInfo
  canLoadMore: boolean = false
  userId: string
  promotions: PromotionInfo[]
  currentPage: number = 0
  totalPages: number = 0
  totalRecords: number = 0
  isKycAdded
  showArrow: boolean = false
  showValue: boolean = false
  kycApprovalStatus
  scrollBlock: any
  showPromotions: boolean = false
  CurrentPage
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  placeholderBusinessSearch: string = ''
  //filterInfo: FilterInfo
  constructor(
    public demoService: DemoService,
    private modalCtrl: ModalController,
    private storage: Storage,
    public navCtrl: NavController,
    private searchProvider: SearchService,
    public getCategoryList: CategoriesService,
    public logErrorService: InserErrorLogService,
    public loadingCtrl: LoadingController,
    public geolocation: Geolocation,
    public toastCtrl: ToastController,
    public platform: Platform,
    public businessDetailsProvider: BusinessDetailsService,
    private menu: MenuController,
    private route: ActivatedRoute
  ) {
    this.CurrentPage = 1
    this.promotions = new Array<PromotionInfo>()
    this.latitude = 0
    this.longitude = 0
    this.items = []
    this.getBusinessListRes = new GetBusinessListRes()
    this.businessList = new Array<businessList>()
    this.catList = new Array<CategoryInfo>()
    this.categoryInfo = new CategoryInfo()
    route.queryParams.subscribe(params => {
      this.isKycAdded = params.KYCAdded
      this.kycApprovalStatus = params.KYCApprovalStatus
      this.categoryInfo.categoryName = params.catName
      this.getBusinessListInfo = new GetBusinessListInfo()
      this.getBusinessListInfo.SearchType = Enums.SearchType.Empty
      this.getBusinessListInfo.skipTotal = 0
      this.userfirstname = params.fName
      this.userlastname = params.lName
      if (this.categoryInfo.categoryName != undefined) {
        this.categoryList.push(this.categoryInfo)
      }

      this.getPromotions()
    })

    this.storage.get('userInfo').then((val) => {
      ////
      this.userRole = val.userRole
      if (this.userRole == 'Guest') {
        this.placeholderBusinessSearch = Constants.guestSearchText
        this.isGuest = true
        this.showPromotions = false
        this.userRole = 'Guest'
        this.blurName = 'user_guest_Only'
        console.log('guest')
      } else if (this.userRole == 'Partner') {
        this.placeholderBusinessSearch = Constants.partnerSearchText
        this.showPromotions = true
        this.isPartner = true
        this.userRole = 'Partner'
        console.log('Partner')
      } else if (this.userRole == Constants.clientPartner) {
        this.placeholderBusinessSearch = Constants.partnerSearchText
        this.showPromotions = true
        this.userRole = Constants.clientPartner
        this.isClientPartner = true
      }
    })
    this.getCategories()
    this.noBusinessFound = false
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
      this.getBusinessListInfo.userId = this.userId
      this.getBusinessList(null)
    })

    if (platform.is('ios')) {
      //hide footer when input box is on focus
      $(document).on('focus', 'input, textarea, select', function () {
        // $(".footer-med").hide();
        $('.footer-adj').css('display', 'none')
        $('.scroll-content').css('margin-bottom', '0')
      })
      //show footer when input is NOT on focus
      $(document).on('blur', 'input, textarea, select', function () {
        // $(".footer-med").show();
        $('.footer-adj').css('display', 'block')
        $('.scroll-content').css('margin-bottom', '45px')
      })
    }
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribe(async () => {
      const getOpen: any = await this.menu.getOpen()
      if (getOpen) {
        //console.log("menu open", getOpen.isOpen)
        if (getOpen.isOpen == true) {
          this.menu.close()
          //this.registerBackButton()
        }
      } else {
        this.navCtrl.pop()
      }
    })
  }

  getCategories() {
    this.getCategoryList
      .getcategoriesApi(this.searchTerm, this.CurrentPage)
      .subscribe(
        (res: any) => {
          console.log('list', res)
          if (res.json.message[0].type == 'SUCCESS') {
            let data = res.json.data.categories
            let limit = 4
            if (data.length < 4) {
              limit = data.length
            }
            for (let i = 0; i < limit; i++) {
              let categoryinfoobj = new CategoryInfo()
              categoryinfoobj.catId = data[i].catId
              categoryinfoobj.categoryName = data[i].categoryName
              categoryinfoobj.categoryImgBase64 = Utility.getImageUrl(
                data[i].categoryImgBase64
              )
              this.catList.push(categoryinfoobj)
            }
            console.log('CategoryList', this.catList)
          }
        },
        (err) => {
          console.log('err', err)
        }
      )
  }

  /**to view categories */
  async viewCategories() {
    await this.navCtrl.navigateForward('CategoryListPage', { queryParams: {
      userbusinesslist: this.businessListObj,
      fName: this.userfirstname,
      lName: this.userlastname,
    }})
  }

  /**opens sortfilter modal */
  async openModal() {
    let popup = await this.modalCtrl.create({
      component: ModalSortFilterComponent,
      componentProps: { filterInfo: this.getBusinessListInfo },
      cssClass: 'ujb_modal_sortFilter ujb_theme' 
    })
    popup.present()
    const {data} = await popup.onDidDismiss()
      console.log('data search', data)
      if (data) {
        this.getBusinessListInfo = Utility.getBusinessListInfo(
          data,
          this.getBusinessListInfo
        )
        this.businessList = new Array<businessList>()
        this.listCount = 0
        this.noBusinessFound = false
        for (
          let i = 0;
          i < this.getBusinessListInfo.categoryListForSort.length;
          i++
        ) {
          this.getBusinessListInfo.categoryIds.push(
            this.getBusinessListInfo.categoryListForSort[i].catId
          )
        }
        this.getBusinessList(null)
        this.myClass1 = ''
        if (
          this.getBusinessListInfo.categoryIds != null &&
          this.getBusinessListInfo.categoryIds != undefined &&
          this.getBusinessListInfo.categoryIds.length != 0
        ) {
          this.myClass1 = 'filterApplied'
        }
        if (
          this.getBusinessListInfo.latitude != null &&
          this.getBusinessListInfo.latitude != undefined &&
          this.getBusinessListInfo.latitude != 0
        ) {
          this.myClass1 = 'filterApplied'
        }
        if (
          this.getBusinessListInfo.longitude != null &&
          this.getBusinessListInfo.longitude != undefined &&
          this.getBusinessListInfo.longitude != 0
        ) {
          this.myClass1 = 'filterApplied'
        }
        if (
          this.getBusinessListInfo.sortValue != null &&
          this.getBusinessListInfo.longitude != undefined
        ) {
          this.myClass1 = 'filterApplied'
        }
      }
  }

  clearVal(value: any, data) {
    if (value == 'category') {
      let ind = this.getBusinessListInfo.categoryListForSort.indexOf(data)
      this.getBusinessListInfo.categoryListForSort.splice(ind, 1)
      if (this.getBusinessListInfo.categoryListForSort.length == 0) {
        this.myClass1 = ''
      }
      this.businessList = new Array<businessList>()
      this.noBusinessFound = false
      this.getBusinessList(null)
    }
  }

  setFilteredItems() {
    if (
      this.userRole == 'Partner' ||
      this.userRole == Constants.clientPartner
    ) {
      if (this.searchTerm.length >= 3) {
        this.searchProvider
          .getSearchData(this.searchTerm, this.userId)
          .subscribe(
            (res: any) => {
              this.items = res.json.data
              this.url = Urls.baseUrl + Urls.port + Constants.searchData
              this.stackTrace = JSON.stringify(this.items)
              this.message = ''
              this.method = 'setFilteredItems'
              this.inserErrorApi()
              // this.searchTerm = ""
            },
            (err) => {
              this.items = [
                {
                  businessName: 'No Data Found',
                  businessId: '',
                },
              ]
              console.log(err)
              this.url = Urls.baseUrl + Urls.port + Constants.searchData
              this.stackTrace = err.stack
              this.message = err.message
              this.method = 'setFilteredItems'
              this.inserErrorApi()
            }
          )
      } else {
        this.items = []
      }
      console.log('catname', this.items)
      // this.filterList.push({ 'categoryName': this.searchTerm })
      this.hideSearch = 'view'
    }
  }

  selectValue(item, data) {
    console.log('item', item)
    this.hideSearch = 'hide'
    //this.searchTerm = item.catName
    this.storage.get('userRole').then((val) => {
      /*       if (val == "Guest") {
              //PopupBecomePartnerComponent
              let popup = await this.modalCtrl.create(PopupBecomePartnerComponent, {}, { cssClass: 'ujb_popup_becomePartner ujb_theme' });
              popup.present();
              //// this.navCtrl.push(ComingSoonPage)
            } else { */

      if (item.businessId != '') {
        setTimeout(async () => {
          //// this.navCtrl.push(SearchResultsPage, { "searchItem": item.catName, "searchTerm": data })
          if (this.isGuest != true) {
            // this.storage.get("mentorIdList").then(data => {
            //   if (data) {
            //     let mentorIdList = data
            //     this.viewOtherProfile = true
            //     let isMentorConnect: boolean = false
            //     for (let j = 0; j < mentorIdList.length; j++) {
            //       if (mentorIdList[j] == item.userId) {
            //         isMentorConnect = true
            //         break
            //       }
            //     }
            //     if (isMentorConnect == true) {
            //       // this.navCtrl.push(ClientPartnerPage, {
            //         "businessinfoobj": item,
            //         "viewOtherProfile": this.viewOtherProfile,
            //         "userId": item.userId,
            //         "businessId": item.businessId
            //       })
            //     } else {
            //       // this.navCtrl.push(ClientPartnerViewPage, {
            //         "businessinfoobj": item,
            //         "viewOtherProfile": this.viewOtherProfile,
            //         "userId": item.userId,
            //         "businessId": item.businessId
            //       })
            //     }
            //   } else {

            await this.navCtrl.navigateForward('ClientPartnerViewPage', { queryParams: {
              businessinfoobj: item,
              viewOtherProfile: true,
              userId: item.userId,
              businessId: item.businessId,
            }})

            // }
            // })
          } else {
            await this.navCtrl.navigateForward('SearchResultsPage', { queryParams: {
              searchItem: item.catName,
              searchTerm: data,
            }})
          }
          this.searchTerm = ''
        }, 1000)
      }

      // }
    })
  }

  searchData(data) {
    console.log('data search click search')

    console.log('item secrh', data)
    //this.myClass = 'hide'

    setTimeout(async () => {
      await this.navCtrl.navigateForward('SearchResultsPage', { queryParams: { searchTerm: data }})
      this.searchTerm = ''
    }, 1000)
    this.hideSearch = 'hide'
  }

  async gotoComingSoon() {
    await this.navCtrl.navigateForward('ComingSoonPage')
  }

  gotoReferNow(businessListObj) {
    //// this.navCtrl.push(ReferNowPage)
    this.storage.get('userData').then(async (val) => {
      let userinfoobj = val
      if (userinfoobj.role == 'Guest') {
        //PopupBecomePartnerComponent
        //If ujb_popup_becomePartner has 2 buttons add - "twoButtonHeight" with existing class
        let popup = await this.modalCtrl.create({
          component: PopupBecomePartnerComponent,
          componentProps: {},
          cssClass: 'ujb_popup_becomePartner ujb_theme' 
        })
        popup.present()
        if (this.platform.is('ios')) {
          this.scrollBlock = true
        }
        const {data} = await popup.onDidDismiss()
          if (this.platform.is('ios')) {
            this.scrollBlock = false
          }
        //// this.navCtrl.push(ComingSoonPage)
      } else {
        if (userinfoobj.role == Constants.clientPartner) {
          await this.navCtrl.navigateForward('ReferNowPage', { queryParams: {
            userbusinesslist: businessListObj,
            fName: this.userinfoobj.firstName,
            lName: this.userinfoobj.lastName,
          }})
        } else if (
          userinfoobj.isKycAdded == false ||
          userinfoobj.kycApprovalStatus == 'Rejected' ||
          userinfoobj.kycApprovalStatus == 'Pending'
        ) {
          Utility.showToast(
            this.toastCtrl,
            'KYC not submitted/approved',
            false,
            '',
            false
          )
        } else {
          if (userinfoobj.isPartnerAgreementAccepted == true) {
            await this.navCtrl.navigateForward('ReferNowPage', { queryParams: {
              userbusinesslist: businessListObj,
              fName: this.userinfoobj.firstName,
              lName: this.userinfoobj.lastName,
            }})
          } else {
            Utility.showToast(
              this.toastCtrl,
              Constants.pleaseAcceptPartnerAgreement,
              false,
              '',
              false
            )
          }
        }
      }
    })
  }

  async selectCategory(data: any) {
    console.log('data', data)
    await this.navCtrl.navigateForward('SearchResultsPage', { queryParams: { searchTerm: data.categoryName }})
  }

  onClick(event) {
    if (event.target.className != 'ujb_searchbar-input') {
      this.hideSearch = 'hide'
    }
  }

  async getBusinessList(event) {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.getBusinessListInfo.userId = this.userId
    console.log(
      'res in ts file get busineslist req',
      JSON.stringify(this.getBusinessListInfo)
    )
    this.searchProvider.getBusinessList(this.getBusinessListInfo).subscribe(
      (data) => {
        loading.dismiss()
        console.log('res in ts file get busineslist', data)
        if (data != null) {
          if (data.status == 200) {
            let res = data.json.data
            console.log('res in ts file get busineslist in 200', res)
            this.getBusinessListRes.googleApiNextToken = res.googleApiNextToken
            this.getBusinessListRes.listCount = res.listCount
            this.listCount = res.listCount
            if (res.businessList.length > 0) {
              this.noBusinessFound = false
            }
            for (let i = 0; i < res.businessList.length; i++) {
              let businessListObj = new businessList()
              if (res.businessList[i].businessName == null)
                res.businessList[i].businessName = ''
              businessListObj.businessName = res.businessList[i].businessName
              if (res.businessList[i].userId == null)
                res.businessList[i].userId = ''
              businessListObj.userId = res.businessList[i].userId

              if (res.businessList[i].businessId == null)
                res.businessList[i].businessId = ''
              businessListObj.businessId = res.businessList[i].businessId

              if (res.businessList[i].address.location == null)
                res.businessList[i].address.location = ''
              businessListObj.address.location =
                res.businessList[i].address.location
              if (res.businessList[i].rating == null)
                res.businessList[i].rating = ''
              businessListObj.rating = res.businessList[i].rating
              if (res.businessList[i].tagline == null)
                res.businessList[i].tagline = ''
              businessListObj.tagline = res.businessList[i].tagline
              if (res.businessList[i].shareDetails.length != undefined) {
                //
                for (
                  let k = 0;
                  k <= res.businessList[i].shareDetails.length - 1;
                  k++
                ) {
                  let shareDetailsObj = new shareDetails()
                  shareDetailsObj.shareType =
                    res.businessList[i].shareDetails[k].shareType
                  shareDetailsObj.value =
                    res.businessList[i].shareDetails[k].value
                  businessListObj.shareDetails.push(shareDetailsObj)
                  console.log('sharewal', businessListObj.shareDetails)
                  console.log(
                    'sharewal length',
                    businessListObj.shareDetails.length
                  )
                  if (businessListObj.shareDetails.length == 1) {
                    console.log(
                      'share val type',
                      businessListObj.shareDetails[k].shareType
                    )
                    if (businessListObj.shareDetails[k].shareType == 'Amount') {
                      businessListObj.showAmount = true
                      businessListObj.showPercent = false
                      businessListObj.showArrow = false
                      businessListObj.showValue = true
                    } else if (
                      businessListObj.shareDetails[k].shareType == 'Percent'
                    ) {
                      //
                      businessListObj.showAmount = false
                      businessListObj.showPercent = true
                      businessListObj.showArrow = false
                      businessListObj.showValue = true
                    }
                  } else if (businessListObj.shareDetails.length > 1) {
                    //
                    businessListObj.showAmount = false
                    businessListObj.showPercent = false
                    businessListObj.showArrow = true
                    businessListObj.showValue = false
                  }
                  // if (businessListObj.shareDetails.length == 1) {
                  //   businessListObj.showArrow = false
                  //   businessListObj.showValue = true
                  // } else if (businessListObj.shareDetails.length == 0) {
                  // }
                  // else {
                  //   businessListObj.showArrow = true
                  //   businessListObj.showValue = false
                  // }
                }
              }
              if (res.businessList[i].logo == null) {
                businessListObj.logo.logoBase64 = Constants.businessLogoConst
              } else {
                businessListObj.logo.logoBase64 = Utility.getImageUrl(
                  res.businessList[i].logo.logoImageURL
                ) //res.businessList[i].logo.logoBase64
              }
              for (let j = 0; j < res.businessList[i].categories.length; j++) {
                let category = new CategoryInfo()
                category.categoryName = res.businessList[i].categories[j]
                businessListObj.categories.push(category)
              }
              for (let j = 0; j < businessListObj.categories.length; j++) {
                if (
                  businessListObj.categories[j].categoryName == 'Legal' ||
                  businessListObj.categories[j].categoryName == 'Doctor' ||
                  businessListObj.categories[j].categoryName ==
                    'Chartered Accountant'
                ) {
                  businessListObj.showShared = false
                  break
                }
              }
              this.businessList.push(businessListObj)
              console.log('listview', this.businessList)
            }

            if (this.businessList.length > 0) {
              if (this.businessList.length < this.listCount) {
                this.canLoadMore = true
              } else {
                this.canLoadMore = false
              }
            } else if (this.businessList.length == 0) {
              this.noBusinessFound = true
              this.canLoadMore = false
            }
            //this.noBusinessFound = true
            this.url = Urls.baseUrl + Urls.port + Constants.getBusinessList
            this.stackTrace = ' '
            this.message = JSON.stringify(res)
            this.method = 'getBusinessList'
            this.inserErrorApi()
          } else {
            this.noBusinessFound = true
            this.canLoadMore = false
          }
          if (event != null || event != undefined) event.complete()
        }
      },
      (err) => {
        console.log('err', err)
        loading.dismiss()
        if (event != null || event != undefined) event.complete()
        this.noBusinessFound = true
        this.url = Urls.baseUrl + Urls.port + Constants.getBusinessList
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getBusinessList'
        this.inserErrorApi()
      }
    )
  }

  async viewBusinessDetail(i) {
    if (this.isGuest != true) {
      /*   let popup = await this.modalCtrl.create(PopupBecomePartnerComponent, {}, { cssClass: 'ujb_popup_becomePartner ujb_theme' });
        popup.present();
      } else { */
      // this.storage.get("mentorIdList").then(data => {
      //   if (data) {
      //     let mentorIdList = data
      //     this.viewOtherProfile = true
      //     let isMentorConnect: boolean = false
      //     for (let j = 0; j < mentorIdList.length; j++) {
      //       if (mentorIdList[j] == this.businessList[i].userId) {
      //         isMentorConnect = true
      //         break
      //       }
      //     }
      //     if (isMentorConnect == true) {
      //       this.viewOtherProfile = true
      //       // this.navCtrl.push(ClientPartnerPage, {
      //         "businessinfoobj": this.businessList[i],
      //         "viewOtherProfile": this.viewOtherProfile,
      //         "userId": this.businessList[i].userId,
      //         "businessId": this.businessList[i].businessId,
      //         "KYCAdded": this.isKycAdded,
      //         "KYCApprovalStatus": this.kycApprovalStatus
      //       })
      //     } else {
      //       this.viewOtherProfile = true
      //       // this.navCtrl.push(ClientPartnerViewPage, {
      //         "businessinfoobj": this.businessList[i],
      //         "viewOtherProfile": this.viewOtherProfile,
      //         "userId": this.businessList[i].userId,
      //         "businessId": this.businessList[i].businessId,
      //         "KYCAdded": this.isKycAdded,
      //         "KYCApprovalStatus": this.kycApprovalStatus
      //       })
      //     }
      //   } else {
      this.viewOtherProfile = true
      await this.navCtrl.navigateForward('ClientPartnerViewPage', { queryParams: {
        businessinfoobj: this.businessList[i],
        viewOtherProfile: this.viewOtherProfile,
        userId: this.businessList[i].userId,
        businessId: this.businessList[i].businessId,
        KYCAdded: this.isKycAdded,
        KYCApprovalStatus: this.kycApprovalStatus,
      }})
      //  }
      // })
    } else {
      let popup = await this.modalCtrl.create({
        component: PopupBecomePartnerComponent,
        componentProps: {},
        cssClass: 'ujb_popup_becomePartner ujb_theme' 
      })
      popup.present()
      if (this.platform.is('ios')) {
        console.log('in ios platform')
        console.log('popup opened')
        this.scrollBlock = true
      }
      const {data} = await popup.onDidDismiss()
        if (this.platform.is('ios')) {
          console.log('in ios platform on dismiss')
          console.log('popup opened on dismiss')
          this.scrollBlock = false
        }
    }
    //// this.navCtrl.push(ComingSoonPage)
  }

  /**
   * called when user reached to end of the screen
   * if all the records are retrieved already then it will not call the api again
   * @param event scroll event
   */
  onScroll(event) {
    console.log('xyz', event)
    if (this.businessList.length < this.listCount) {
      this.getBusinessListInfo.skipTotal =
        this.getBusinessListInfo.skipTotal + 20
      if (this.getBusinessListInfo.skipTotal > this.listCount) {
        this.getBusinessListInfo.skipTotal = this.listCount
      }
      this.noBusinessFound = false
      this.getBusinessList(event)
    } else {
      //console.log("else", this.doctorListInfo)
      this.canLoadMore = false
    }
  }

  async slideEnded() {
    if (this.slides) {
      console.log('slideEnded', this.slides.getActiveIndex())
      let activeIndex = await this.slides.getActiveIndex() 
      if ( activeIndex == this.promotions.length - 2) {
        if (this.currentPage + 1 <= this.totalPages) {
          this.currentPage = this.currentPage + 1
          this.getPromotions()
        }
      }
    }

    /* setTimeout(() => {
      this.promotions.push({ "src": "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823__340.jpg" })
    }, Constants.toastTimeOut); */
  }
  async openProfile(val) {
    console.log('userid for promotion', val)
    if (val)
      if (this.userId != val) {
        this.viewOtherProfile = true
        await this.navCtrl.navigateForward('ClientPartnerViewPage', { queryParams: {
          userId: val,
          // "businessinfoobj": this.businessList[i],
          viewOtherProfile: this.viewOtherProfile,
          // "businessId": this.businessList[i].businessId,
          KYCAdded: this.isKycAdded,
          KYCApprovalStatus: this.kycApprovalStatus,
        }})
      } else {
        //own profile
        Utility.removeInstances(ClientPartnerPage, this.navCtrl)
        await this.navCtrl.navigateForward('ClientPartnerPage', { queryParams: { viewOtherProfile: false }})
      }
  }
  getPromotions() {
    this.businessDetailsProvider.getPromotions(this.currentPage, 5).subscribe(
      (res: any) => {
        if (res.status == 200) {
          if (res.json) {
            let data = res.json.data
            console.log('getPromotions data', data)
            let paging = res.json.paging
            this.currentPage = res.json.paging.currentPage
            this.totalPages = res.json.paging.totalPages
            this.totalRecords = res.json.paging.totalRecords
            for (let i = 0; i < data.length; i++) {
              let promotion = new PromotionInfo()
              promotion.fileName = data[i].fileName
              promotion.imageURL =
                Urls.baseUrl + Urls.port + '/' + data[i].imageURL

              promotion.promotionId = data[i].promotionId
              promotion.userId = data[i].userId
              this.promotions.push(promotion)
            }
            if (this.promotions.length == 0) {
              this.currentPage = 0
              this.totalPages = 0
              this.totalRecords = 0
              let promotion = new PromotionInfo()
              promotion.imageURL =
                'assets/imgs/content-imgs/banner-cp-default.jpg'
              this.promotions.push(promotion)
            }
            if (this.slides) {
              /* this.slides.autoplayDisableOnInteraction = false;
            this.slides.stopAutoplay()
            this.slides.startAutoplay() */
              /* setInterval(function () {
              if (this.slides) {
                this.slides.startAutoplay()
                this.slides.autoplayDisableOnInteraction = false;
              }
            }.bind(this), 2000) */
            }
            console.log('this.promotions', this.promotions)
          }
        }
      },
      (err) => {
        console.log('err', err)
        if (this.promotions.length == 0) {
          this.currentPage = 0
          this.totalPages = 0
          this.totalRecords = 0
          let promotion = new PromotionInfo()
          promotion.imageURL = 'assets/imgs/content-imgs/banner-cp-default.jpg'
          this.promotions.push(promotion)
        }
        this.url = Urls.baseUrl + Urls.port + Constants.getPromotionMedia
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getPromotions'
        this.inserErrorApi()
      }
    )
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'BusinessListPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
