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

/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     filter / sort bug:        2019/07/01        Yogesh Chavan
 */

import * as $ from 'jquery'
import * as Enums from '../../../../app/models/Enums'
import { Component, OnInit } from '@angular/core'
import {  NavController, ToastController, ModalController, Platform, LoadingController, MenuController } from '@ionic/angular'
import { Constants } from '../../../Utils/Constants'
import { Utility } from '../../../Utils/Utility'
import { Urls } from '../../../Utils/urls'
import { ModalSortFilterComponent } from '../../../components/modals/modal-sort-filter/modal-sort-filter'
import { PopupBecomePartnerComponent } from '../../../components/popup-become-partner/popup-become-partner'
import { CategoryInfo } from '../../../models/CategoryInfo'
import { GetBusinessListInfo } from '../../../models/getBusinessList_info'
import { businessList, GetBusinessListRes, shareDetails } from '../../../models/getBusinessList_res'
import { InsertErrorLog } from '../../../models/insertErrorLog'
import { UserInfo } from '../../../models/userInfo'
import { DemoService } from '../../../services/demo.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { SearchService } from '../../../services/search.service'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { ActivatedRoute } from '@angular/router'
import { Storage } from '@ionic/storage'



/**
 * Generated class for the SearchResultsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-search-results',
  templateUrl: 'search-results.html',
  styleUrls: ['search-results.scss'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class SearchResultsPage {
  pageTitle = 'Search Results'
  categoryName: any
  //searchedItem: any
  userRole: any
  blurName
  myClass
  sortResult: CategoryInfo
  myClass1
  items = []
  //searchTerm: string = '';
  hideSearch: any
  sortFilter_img: string = 'assets/imgs/icons/sortFilter@2x.png'
  sortImage
  userinfoobj = new UserInfo()
  //categoryList: CategoryInfo[]
  searchList: any[]
  filterList: any[]
  isGuest
  isClientPartner
  isPartner
  filter
  //searchedTerm
  category
  categoryInfo: CategoryInfo
  selectedCategory: any
  businessList: businessList[]
  getBusinessListRes: GetBusinessListRes
  latitude
  longitude
  loading
  viewOtherProfile: boolean = false
  noBusinessFound: boolean = false
  getBusinessListInfo: GetBusinessListInfo
  listCount: number = 0
  canLoadMore: boolean
  userId: string
  isKycAdded
  scrollBlock
  kycApprovalStatus
  showArrow: boolean = false
  showValue: boolean = false
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  placeholderBusinessSearch: string = ''

  constructor(
    public demoService: DemoService,
    public navCtrl: NavController,
    public logErrorService: InserErrorLogService,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private storage: Storage,
    public platform: Platform,
    private searchProvider: SearchService,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private menu: MenuController,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.isKycAdded = params.KYCAdded
      this.kycApprovalStatus = params.KYCApprovalStatus
      this.scrollBlock = false
      this.geolocation.getCurrentPosition().then((resp) => {
        this.latitude = resp.coords.latitude
        this.longitude = resp.coords.longitude
      })
      this.getBusinessListRes = new GetBusinessListRes()
      this.getBusinessListInfo = new GetBusinessListInfo()
      this.getBusinessListInfo.SearchType = Enums.SearchType.Advanced
      this.getBusinessListInfo.skipTotal = 0
      this.businessList = new Array<businessList>()
      this.categoryInfo = new CategoryInfo()
      //this.categoryList = new Array<CategoryInfo>()
      this.filterList = new Array<any>()
  
      this.categoryInfo.categoryName = params.catName
      //this.categoryList.push(this.categoryInfo)
      this.categoryInfo.catId = params.catId
  
      if (this.categoryInfo.categoryName != undefined) {
        this.getBusinessListInfo.categoryListForSort.push(this.categoryInfo)
      }
      //this.searchedTerm = params.searchTerm
  
      this.storage.get('userInfo').then((val) => {
        this.userRole = val.userRole
        if (this.userRole == 'Guest') {
          this.placeholderBusinessSearch = Constants.guestSearchText
          this.isGuest = true
          this.userRole = 'Guest'
          this.blurName = 'user_guest_Only'
          console.log('guest')
        } else if (this.userRole == 'Partner') {
          this.placeholderBusinessSearch = Constants.partnerSearchText
          this.isPartner = true
          this.userRole = 'Partner'
          console.log('Partner')
        } else if (this.userRole == Constants.clientPartner) {
          this.placeholderBusinessSearch = Constants.partnerSearchText
          this.userRole = Constants.clientPartner
          this.isClientPartner = true
        }
      })
      this.noBusinessFound = false
      this.storage.get('userInfo').then((val) => {
        this.userId = val.userId
  
        this.getBusinessListInfo.searchTerm = params.searchTerm
        this.getBusinessListInfo.userId = this.userId
        this.getBusinessList(null)
      })
  
      // IOS Footer hide on focus
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
    })
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
  /**opens sort filter modal */
  async openModal() {
    let popup = await this.modalCtrl.create({
      component: ModalSortFilterComponent,
      componentProps: { filterInfo: JSON.parse(JSON.stringify(this.getBusinessListInfo)) },
      cssClass: 'ujb_modal_sortFilter ujb_theme' 
    })
    popup.present()

    const {data} = await popup.onDidDismiss()
    console.log('data search', data)
    if (data) {
      this.sortResult = data
      this.getBusinessListInfo = Utility.getBusinessListInfo(
        data,
        this.getBusinessListInfo
      )
      console.log('getBusinessListInfo', this.getBusinessListInfo)
      this.businessList = new Array<businessList>()
      this.listCount = 0
      this.noBusinessFound = false
      this.getBusinessListInfo.categoryIds = new Array<string>()
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
    if (value == 'searchedTerm') {
      this.getBusinessListInfo.searchTerm = ''
      this.businessList = new Array<businessList>()
      this.listCount = 0
      this.canLoadMore = false
      this.noBusinessFound = false
      this.getBusinessList(null)
    } else if (value == 'category') {
      let ind = this.getBusinessListInfo.categoryListForSort.indexOf(data)
      this.getBusinessListInfo.categoryListForSort.splice(ind, 1)
      if (this.getBusinessListInfo.categoryListForSort.length == 0) {
        this.myClass1 = ''
      }
      this.getBusinessListInfo.categoryIds = new Array<string>()
      for (
        let i = 0;
        i < this.getBusinessListInfo.categoryListForSort.length;
        i++
      ) {
        this.getBusinessListInfo.categoryIds.push(
          this.getBusinessListInfo.categoryListForSort[i].catId
        )
      }
      this.businessList = new Array<businessList>()
      this.listCount = 0
      this.canLoadMore = false
      this.noBusinessFound = false
      this.getBusinessList(null)
    }
  }

  setFilteredItems() {
    if (
      this.userRole == 'Partner' ||
      this.userRole == Constants.clientPartner
    ) {
      if (this.getBusinessListInfo.searchTerm.length >= 3) {
        this.searchProvider
          .getSearchData(this.getBusinessListInfo.searchTerm, this.userId)
          .subscribe(
            (res: any) => {
              this.items = res.json.data
              //this.searchTerm=""
              this.url = Urls.baseUrl + Urls.port + Constants.searchData
              this.stackTrace = JSON.stringify(this.items)
              this.message = ''
              this.method = 'setFilteredItems'
              this.inserErrorApi()
            },
            (err) => {
              this.items = [
                {
                  businessName: 'No data found',
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
      //  this.items = this.demoService.filterItems(this.searchTerm);
      console.log('catname', this.items)
      this.hideSearch = 'view'
    }
  }

  selectValue(item, data) {
    console.log('item', item)
    //this.searchTerm = item.catName
    this.hideSearch = 'hide'

    /*     if (val == "Guest") {
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
          //     this.getBusinessListInfo.searchTerm = ""
          //   } else {
          await this.navCtrl.navigateForward('ClientPartnerViewPage', { queryParams: {
            businessinfoobj: item,
            viewOtherProfile: true,
            userId: item.userId,
            businessId: item.businessId,
          }})
          // }
          //})
        } else {
          this.hideSearch = 'hide'
          this.getBusinessListInfo.searchTerm = data
          this.businessList = new Array<businessList>()
          this.listCount = 0
          this.canLoadMore = false
          this.noBusinessFound = false
          this.getBusinessList(null)
        }
      }, 1000)
    }

    // }
  }

  searchData(data) {
    console.log('data search click search')

    console.log('item secrh', data)
    this.hideSearch = 'hide'
    this.getBusinessListInfo.searchTerm = data
    this.businessList = new Array<businessList>()
    this.listCount = 0
    this.canLoadMore = false
    this.noBusinessFound = false
    this.getBusinessList(null)
    //this.searchedTerm = data
    // this.getBusinessList()
    //this.hideSearch = 'hide'
    //this.myClass = 'hide'
    //     setTimeout(() => {
    //       // this.navCtrl.push(SearchResultsPage, {  "searchTerm": data })
    //       this.searchTerm=""
    //     }, 1000);
    //     this.hideSearch = 'hide'
  }

  async gotoComingSoon() {
    await this.navCtrl.navigateForward('ComingSoonPage')
  }

  gotoReferNow(businessListObj) {
    console.log('business', businessListObj)

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
    //// this.navCtrl.push(ReferNowPage)
  }
  onClick(event) {
    if (event.target.className != 'searchbar-input') {
      this.hideSearch = 'hide'
    }
  }
  async getBusinessList(event) {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.getBusinessListInfo.userId = this.userId
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
                  // if (businessListObj.shareDetails.length == 1) {

                  //   businessListObj.showArrow = false
                  //   businessListObj.showValue = true
                  // } else if (businessListObj.shareDetails.length == 0) {

                  // }
                  // else {
                  //   businessListObj.showArrow = true
                  //   businessListObj.showValue = false
                  // }
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
                      businessListObj.showAmount = false
                      businessListObj.showPercent = true
                      businessListObj.showArrow = false
                      businessListObj.showValue = true
                    }
                  } else if (businessListObj.shareDetails.length > 1) {
                    businessListObj.showAmount = false
                    businessListObj.showPercent = false
                    businessListObj.showArrow = true
                    businessListObj.showValue = false
                  }
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

              // console.log("name",getBusinessListRes.businessName)
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
            this.url = Urls.baseUrl + Urls.port + Constants.getBusinessList
            this.stackTrace = JSON.stringify(res)
            this.message = ''
            this.method = 'getBusinessList'
            this.inserErrorApi()
          } else {
            this.noBusinessFound = true
            this.canLoadMore = false
          }
          if (event != null || event != undefined) event.complete()
        }
        //this.getBusinessListInfo.searchTerm = ""
      },
      (err) => {
        loading.dismiss()
        console.log('error', err)
        this.noBusinessFound = true
        if (event != null || event != undefined) event.complete()
        Utility.showToast(
          this.toastCtrl,
          ' Some Error Occured.',
          false,
          '',
          false
        )
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
      /*  let popup = await this.modalCtrl.create(PopupBecomePartnerComponent, {}, { cssClass: 'ujb_popup_becomePartner ujb_theme' });
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
      //}
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
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'SearchResultsPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
