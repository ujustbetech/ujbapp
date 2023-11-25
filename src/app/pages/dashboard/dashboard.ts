/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/06/14        Dakshata Patil
 *  API Integration   2019/07/10        Yogesh Chavan
 */

import * as $ from 'jquery'

import {
  // App,
  // 
  MenuController,
  NavController,
  Platform,
  IonSlides,
  ToastController,
} from '@ionic/angular'
import { Component, NgZone, ViewChild } from '@angular/core'
import {
  GetBusinessListRes,
  businessList,
  shareDetails,
} from '../../../app/models/getBusinessList_res'
import {
  StreamingMedia,
  StreamingVideoOptions,
} from '@ionic-native/streaming-media/ngx'
import {
  notificationListRes,
  notifications,
} from '../../../app/models/notificationList_res'

import { AppVersion } from '@ionic-native/app-version/ngx'
import { CategoryInfo } from '../../../app/models/CategoryInfo'
import { ClientPartnerPage } from '../profile/client-partner/client-partner'
import { Constants } from '../../Utils/Constants'
import { IonContent } from '@ionic/angular'
import { Device } from '@ionic-native/device/ngx'
import { File } from '@ionic-native/file/ngx'
import { GetBusinessListInfo } from '../../../app/models/getBusinessList_info'
import { GuestPage } from '../profile/guest/guest'
// import { ImageViewerController } from 'ionic-img-viewer'
import { InsertErrorLog } from '../../../app/models/insertErrorLog'
// import { IonicApp } from '@ionic/angular/components/app/app-root'
import { Keyboard } from '@ionic-native/keyboard/ngx'
import { ListedPartnerStatsInfo } from '../../../app/models/ListedPartnerStatsInfo'
import { LoadingController } from '@ionic/angular'
import { ModalController } from '@ionic/angular'
import { Network } from '@ionic-native/network/ngx'
import { PartnerPage } from '../profile/partner/partner'
// import { Scroll } from '@ionic/angular/components/scroll/scroll'

import { UjbData } from '../../../app/models/ujbData'
import { Urls } from '../../Utils/urls'
import { UserData } from '../../../app/models/userData'
import { UserInfo } from '../../../app/models/userInfo'
import { Utility } from '../../Utils/Utility'
import { PartnerPopupComponent } from '../../components/popups/partner-popup/partner-popup'
import { Router } from '@angular/router'
import { InserErrorLogService } from '../../services/inser-error-log.service'
import { DemoService } from '../../services/demo.service'
import { DashboardService } from '../../services/dashboard.service'
import { SearchService } from '../../services/search.service'
import { CategoriesService } from '../../services/categories.service'
import { BusinessDetailsService } from '../../services/business-details.service'
import { UserProfileService } from '../../services/user-profile.service'
import { NotificationService } from '../../services/notification.service'
import { NetworkService } from '../../services/network.service'
import { CommonUtilsService } from '../../services/common-utils.service'
import { PopupBecomePartnerComponent } from '../../components/popup-become-partner/popup-become-partner'
import { Storage } from '@ionic/storage'




/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
//var window
// // @IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
  styleUrls: ['./dashboard.scss'],
  providers: [SearchService],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class DashboardPage {
  @ViewChild('Content', { static: true })
  content: IonContent
  // @ViewChild(Scroll, { static: true }) scrollElement: Scroll
  activePage: string = 'DashboardPage'
  @ViewChild('slider', {static: false}) slider: IonSlides
  segmentSlider = '0'
  ujbStat: UjbData
  userData: UserData
  ujbSegDashboard: string
  ujbSegPartnerDashboard: string
  myClass: any
  pageTitle: string = 'Content Panel'

  myDate: any
  items = []
  searchTerm: string = ''
  CurrentPage: any
  userinfoobj = new UserInfo()
  userRole: any
  isGuest: boolean = false
  isPartner: boolean = false
  isClientPartner: boolean = false
  userFirstName: any
  day
  blurName: any
  viewOtherProfile: boolean = false
  totalRefs
  myClass2: any
  myClass3: any
  myClass4: any
  myClass5: any
  myClass6: any
  //myClass2: any
  hideSearch: boolean = false
  @ViewChild('slider2', { static: true }) slides: IonSlides
  logError: InsertErrorLog = new InsertErrorLog()
  userInfo
  userId: any
  // _imageViewerCtrl: ImageViewerController
  businame
  partnerStatInfo: ListedPartnerStatsInfo
  showNotificationCount: boolean = false
  //catList: CategoryInfo[]
  userinfolist: UserInfo[]

  getBusinessListRes: GetBusinessListRes
  getNotificationCount: notificationListRes
  businessListObj = new businessList()
  categoryName
  showCircle: any
  showKyc: boolean
  longitude
  latitude
  mentorIdList: string[]
  notifications: notifications[]
  notificationIds: string[]
  skipTotal
  showRupee
  showUserStat: boolean = false
  showToPartner: any
  zoomImage: boolean = true
  profileActive: any
  scrollBlock: boolean = false
  showValue: boolean = false
  showArrow: boolean = false
  pdfSrc
  kycPnding: any
  kycRejected: any
  kycIncomplete: any

  businessClosedAmount
  listedPartnersCount
  partnersCount
  refsPassedCount
  refAmtEarnedAmount
  refsEarnedTotal
  totalBusinessClosed
  url
  stackTrace
  message
  method
  showAmount: boolean
  showPercent: boolean
  businessListings: any
  height
  placeholderBusinessSearch: string = ''
  
  slideOptions = {
    zoom:false,
    autoplay:true,
    loop:true,
    speed:500,
    spaceBetween:10,
    centeredSlides:true,
    pager: true,
    slidesPerView:1.2
  }

  constructor(
    private storage: Storage,
    private modalCtrl: ModalController,
    public logErrorService: InserErrorLogService,
    public navCtrl: NavController,
    public demoService: DemoService,
    public dashboardService: DashboardService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private searchProvider: SearchService,
    // private imageViewerCtrl: ImageViewerController,
    public getCategoryList: CategoriesService,
    public businessProvider: BusinessDetailsService,
    public streamingMedia: StreamingMedia,
    public profileProvider: UserProfileService,
    public notificationService: NotificationService,
    public network: Network,
    public platform: Platform,
    // public app: App,
    private menu: MenuController,
    // public ionicApp: IonicApp,
    private zone: NgZone,
    private kb: Keyboard,
    private device: Device,
    private file: File,
    private networkProvider: NetworkService,
    private appVersion: AppVersion,
    private utilsProvider: CommonUtilsService,
    private router: Router
  ) {
    this.showToPartner = 'hide'
    //this.downloadFile()
    this.CurrentPage = 1
    this.items = []
    this.userData = new UserData()
    // this._imageViewerCtrl = imageViewerCtrl
    this.notifications = new Array<notifications>()
    this.notificationIds = new Array<string>()
    this.getBusinessListRes = new GetBusinessListRes()
    this.getNotificationCount = new notificationListRes()

    this.ujbStat = new UjbData()
    this.userinfolist = new Array<UserInfo>()
    this.partnerStatInfo = new ListedPartnerStatsInfo()
    this.ujbStat.getUjbDataBusinessList = new Array<businessList>()
    this.myDate = new Date().toISOString()
    let currentDate = new Date()

    // this.getCategories()
    // this.getBusinessList()
    this.getUjbStats()
    this.day = Constants.weekdays[currentDate.getDay()]
    /*     platform.backButton.subscribe(() => {
          console.log("dashboard", this.app.getActiveNav().getActive())
         
          
          /* if(menu){
            console.log("menu open", menu.getOpen().isOpen)
           if (menu.getOpen().isOpen == true) {
            menu.close()
           }
          } else { 
            if (this.app.getActiveNav().getActive().instance instanceof DashboardPage) {
              platform.exitApp()
            } else {
              navCtrl.pop()
            }
          //}
        }); */

    console.log('date', this.myDate)
    console.log('day', this.day)
    this.myClass = 'hide'
    this.ujbSegDashboard = 'referral'
    this.ujbSegPartnerDashboard = 'referralOnly'

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
    if (
      device.model == 'iPhone10,3' ||
      device.model == 'iPhone10,6' ||
      device.model == 'iPhone11,8' ||
      device.model == 'iPhone11,2' ||
      device.model == 'iPhone11,6' ||
      device.model == 'iPhone11,4'
    ) {
      this.businessListings = 'businessListings_p-50'
      this.height = 'height'
    } else {
      this.businessListings = 'businessListings'
      this.height = ''
    }
  }

  ionViewWillEnter() {
    //
    this.myClass2 = 'hide'
    this.myClass3 = 'hide'
    this.myClass4 = 'hide'
    this.myClass5 = 'hide'
    this.myClass6 = 'hide'
    console.log('activePage', this.activePage)
    this.scrollBlock = false
    this.hideSearch = false

    this.getStorageUjbStat()
    this.getStorageUserStat()
    this.registerBackButton()
    this.setRoleWiseUI()
    /* let filePath = this.file.applicationDirectory + 'www/assets'
    const options: DocumentViewerOptions = {
      title: 'my Pdf'
    }
    this.document.viewDocument(filePath+'/pdf.pdf', 'application/pdf', options) */
    //this.document.viewDocument('http://www.pdf995.com/samples/pdf.pdf', 'application/pdf', options)
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter Dashboard')
    if (this.slides) {
      console.log('Dashboard slides', this.slides)
      // this.slides.autoplayDisableOnInteraction = false
      this.slides.stopAutoplay()
      this.slides.startAutoplay()
    }
  }

  async gotoPartnerAgreement() {
    await this.navCtrl.navigateForward('PartneragreementPage')
  }

  registerBackButton() {
    this.platform.backButton.subscribe(async () => {
      const getOpen: any = await this.menu.getOpen() 
      if (getOpen) {
        //console.log("menu open", this.menu.getOpen().isOpen)
        if (getOpen.isOpen == true) {
          this.menu.close()
          //this.registerBackButton()
        }
      } else {
        if (
          this.router.url.split('?')[0] == '/DashboardPage'
          // this.app.getActiveNav().getActive().instance instanceof DashboardPage
        ) {
          // TODO
          // this.platform.exitApp()
        } else {
          this.navCtrl.pop()
        }
      }
    })

    /* this.platform.backButton.subscribe(() => {
      console.log("dashboard")
     
      // let activePortal = this.ionicApp._loadingPortal.getActive() ||
      //   this.ionicApp._modalPortal.getActive() ||
      //   this.ionicApp._toastPortal.getActive() ||
      //   this.ionicApp._overlayPortal.getActive();
      // console.log("this.ionicApp._getActivePortal", this.ionicApp._getActivePortal)
      // if (activePortal) {
      //   activePortal.dismiss();
      // } else {
      if (this.app.getActiveNav().getActive().instance instanceof DashboardPage) {
        this.platform.exitApp()
      } else {
        this.navCtrl.pop()
      }
      //}
    }); */
  }

  getStorageUserStat() {
    /* let loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
    loading.present(); */
    this.storage
      .get('userInfo')
      .then((val) => {
        //
        /* if (loading)
        loading.dismiss() */
        console.log('storage value user stat', val)
        if (val) {
          this.userData = val
          this.userId = this.userData.userId
          this.sendVersionCode()
          // this.userData.otp = this.userData.otp
          // this.userData.userStatInfo = this.userData.userStatInfo
          // this.userData.userReferralEarnedInfo = this.userData.userReferralEarnedInfo
          // this.userData.firstName = this.userData.firstName
          // this.userData.is_Otp_Verified = this.userData.is_Otp_Verified
          // this.userData.languagePreference = this.userData.languagePreference
          // this.userData.mobileNumber = this.userData.mobileNumber
          this.userRole = this.userData.userRole
        }
        console.log(
          'networkProvider.getNetworkType',
          this.networkProvider.getNetworkType()
        )
        console.log('before getNetworkStatus')
        console.log('getNetworkStatus', this.networkProvider.getNetworkStatus())
        console.log('after getNetworkStatus')
        this.getBusinessList()
        this.getCategories()
        // this.getUjbStats()
        this.setRoleWiseUI()
        if (
          this.userRole == 'Partner' ||
          this.userRole == Constants.clientPartner
        ) {
          this.getUserStats()

          this.placeholderBusinessSearch = Constants.partnerSearchText
        } else {
          this.placeholderBusinessSearch = Constants.guestSearchText
        }
        this.getuserInfo()
        //this.getMentorsList()
        this.getNotificationCount = new notificationListRes()
        this.getUnreadNotificationCount()

        // setInterval(function () {
        //
        //   this.getNotificationCount = new notificationListRes()
        //   this.getUnreadNotificationCount()

        // }.bind(this), 60000)

        /* setInterval(function () {
       console.log("SignalStrength")
        window.SignalStrength.dbm(
          function(measuredDbm){
            console.log('SignalStrength current dBm is: '+measuredDbm)
          }
        )
      }.bind(this), 1000) */
        //console.log("startAutoplay before")
        //if (this.app.getActiveNav().getActive().instance instanceof DashboardPage) {
        setInterval(
          function () {
            //console.log("startAutoplay in")
            if (this.slides) {
              //console.log("Dashboard slides2", this.slides)
              //console.log("startAutoplay in before")
              this.slides.startAutoplay()
              this.slides.autoplayDisableOnInteraction = false
              /* this.zone.run(() => {
            console.log('force update the screen');
          }); */
              //console.log("startAutoplay start")
            }
          }.bind(this),
          2000
        )
        //}
        console.log('refearned123', this.userData.userStatInfo)
      })
      .catch((err) => {
        /* if (loading)
      loading.dismiss() */
        console.log("storage.get('userInfo')", err)
      })
  }

  getStorageUjbStat() {
    // let loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
    // loading.present();
    this.storage
      .get('UjbStatInfo')
      .then((val) => {
        //  if (loading)
        //   loading.dismiss()
        console.log('storage value entire ujb data', val)

        this.ujbStat.getUjbDataStat = val.getUjbDataStat
        this.ujbStat.getUjbDataBusinessList = val.getUjbDataBusinessList
        this.ujbStat.getUjbDataCategories = val.getUjbDataCategories

        console.log('storage value set in entire ujb data', this.ujbStat)
      })
      .catch((err) => {
        console.log("storage.get('UjbStatInfo')", err)
        // if (loading)
        // loading.dismiss()
      })
  }

  getCategories() {
    //
    /* let loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
    loading.present(); */

    this.getCategoryList
      .getcategoriesApi(this.searchTerm, this.CurrentPage)
      .subscribe(
        (res: any) => {
          /* if (loading)
      loading.dismiss() */
          console.log('category list on dashboard', res)
          if (res.json.message[0].type == 'SUCCESS') {
            let data = res.json.data.categories

            this.ujbStat.getUjbDataCategories = new Array<CategoryInfo>()
            for (let i = 0; i <= 3; i++) {
              let categoryinfoobj = new CategoryInfo()
              categoryinfoobj.catId = data[i].catId
              categoryinfoobj.categoryName = data[i].categoryName
              categoryinfoobj.categoryImgBase64 = Utility.getImageUrl(
                data[i].categoryImgBase64
              )
              //console.log("obj", categoryinfoobj)
              this.ujbStat.getUjbDataCategories.push(categoryinfoobj)
            }
            this.storage
              .set('UjbStatInfo', this.ujbStat)
              .then((val) => {
                //
                console.log('obj cat storage set', val)
              })
              .catch((err) => {
                console.log("storage.set('UjbStatInfo', this.ujbStat)", err)
              })
          }
        },
        (err) => {
          /* if (loading)
      loading.dismiss() */
          console.log('getCategoryList.getcategoriesApi err', err)
        }
      )
  }

  async selectCategory(data: any) {
    //
    console.log('data', data)

    await this.navCtrl.navigateForward('SearchResultsPage', { queryParams: {
      searchTerm: data.categoryName,
      KYCAdded: this.userinfoobj.isKycAdded,
      KYCApprovalStatus: this.userinfoobj.kycApprovalStatus,
    }})
  }

  //SegmentSlider: Change Slide on Segment Button click
  selectedSegment(i) {
    this.slider.slideTo(i)
  }

  //SegmentSlider: Change Segment Button on slide change
  selectedSlide($event) {
    // this.segmentSlider = $event._snapIndex.toString()
  }

  async viewBusiness() {
    this.items = []
    this.searchTerm = ''
    await this.navCtrl.navigateForward('BusinessListPage', { queryParams: {
      KYCAdded: this.userinfoobj.isKycAdded,
      KYCApprovalStatus: this.userinfoobj.kycApprovalStatus,
      fName: this.userinfoobj.firstName,
      lName: this.userinfoobj.lastName,
    }})
  }

  async businessListing() {
    if (
      this.userinfoobj.isKycAdded == false ||
      this.userinfoobj.kycApprovalStatus == 'Rejected' ||
      this.userinfoobj.kycApprovalStatus == 'Pending'
    ) {
      Utility.showToast(
        this.toastCtrl,
        'KYC not submitted/approved',
        false,
        '',
        false
      )
    } else {
      if (this.userinfoobj.isPartnerAgreementAccepted == true) {
        let popup = await this.modalCtrl.create({
          component: PartnerPopupComponent,
          componentProps: {},
          cssClass: 'ujb_popup_partner' 
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

  async viewCategories() {
    this.items = []
    this.searchTerm = ''
    await this.navCtrl.navigateForward('CategoryListPage', { queryParams: {
      KYCAdded: this.userinfoobj.isKycAdded,
      KYCApprovalStatus: this.userinfoobj.kycApprovalStatus,
    }})
  }

  setFilteredItems() {
    if (
      this.userRole == 'Partner' ||
      this.userRole == Constants.clientPartner
    ) {
      if (this.searchTerm.length >= 2) {
        this.searchProvider
          .getSearchData(this.searchTerm, this.userId)
          .subscribe(
            (res: any) => {
              this.items = res.json.data
            },
            (err) => {
              this.items = [
                {
                  businessName: 'No data found',
                  businessId: '',
                },
              ]
              console.log('searchProvider.getSearchData(', err)
            }
          )
        this.hideSearch = true
      } else {
        this.items = []
        this.hideSearch = false
      }
      console.log('catname', this.items)
    }
  }

  async selectValue(item, data) {
    console.log('item', item)
    // this.searchTerm = item.catName;
    if (item.businessId != '') {
      this.hideSearch = false
      setTimeout(async () => {
        if (this.isGuest != true) {
          // if (this.mentorIdList) {
          //   this.storage.get("mentorIdList").then(data => {
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
          //
          //       // this.navCtrl.push(ClientPartnerPage, {
          //         "businessinfoobj": item,
          //         "viewOtherProfile": this.viewOtherProfile,
          //         "userId": item.userId,
          //         "businessId": item.businessId,
          //         "KYCAdded": this.userinfoobj.isKycAdded,
          //         "KYCApprovalStatus": this.userinfoobj.kycApprovalStatus
          //       })
          //     } else {
          //
          //       // this.navCtrl.push(ClientPartnerViewPage, {
          //         "businessinfoobj": item,
          //         "viewOtherProfile": this.viewOtherProfile,
          //         "userId": item.userId,
          //         "businessId": item.businessId,
          //         "KYCAdded": this.userinfoobj.isKycAdded,
          //         "KYCApprovalStatus": this.userinfoobj.kycApprovalStatus
          //       })
          //     }
          //   }).catch(err => {
          //     console.log("storage.get(mentorIdList)", err)
          //   })
          // } else {

          this.viewOtherProfile = true
          await this.navCtrl.navigateForward('ClientPartnerViewPage', { queryParams: {
            businessinfoobj: item,
            viewOtherProfile: this.viewOtherProfile,
            userId: item.userId,
            businessId: item.businessId,
            KYCAdded: this.userinfoobj.isKycAdded,
            KYCApprovalStatus: this.userinfoobj.kycApprovalStatus,
          }})
          //}
        } else {
          await this.navCtrl.navigateForward('SearchResultsPage', { queryParams: {
            KYCAdded: this.userinfoobj.isKycAdded,
            KYCApprovalStatus: this.userinfoobj.kycApprovalStatus,
            searchItem: item.catName,
            searchTerm: data,
          }})
        }

        this.searchTerm = ''
      }, 1000)
    }
  }

  searchData(data) {
    console.log('data search click search')

    this.kb.hide()
    console.log('item secrh', data)
    //this.myClass = 'hide'
    setTimeout(async () => {
      await this.navCtrl.navigateForward('SearchResultsPage', { queryParams: {
        searchTerm: data,
        KYCAdded: this.userinfoobj.isKycAdded,
        KYCApprovalStatus: this.userinfoobj.kycApprovalStatus,
      }})
      this.searchTerm = ''
    }, 300)
    this.hideSearch = false
  }

  async gotoComingSoon() {
    await this.navCtrl.navigateForward('ComingSoonPage')
  }

  async gotoKYC() {
    if (this.userRole == 'Partner')
      await this.navCtrl.navigateForward('KycPanCardPage', { queryParams: { isFirstTime: false }})
    else if (this.userRole == Constants.clientPartner)
      await this.navCtrl.navigateForward('BusinessKycPanPage')
  }

  async becomePartner() {
    let popup = await this.modalCtrl.create({
      component:PartnerPopupComponent,
      componentProps: { value: 'Partner' },
      cssClass: 'ujb_popup_partner' 
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

  async gotoUserProfile() {
    await this.navCtrl.navigateForward('ComingSoonPage')
  }

  async viewBusinessDetail(i) {
    if (this.isGuest == true) {
      //If ujb_popup_becomePartner has 2 buttons add - "twoButtonHeight" with existing class
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
    } else {
      //  let isMentorConnect: boolean = false
      // if (this.mentorIdList) {

      //   for (let j = 0; j < this.mentorIdList.length; j++) {
      //     if (this.mentorIdList[j] == this.ujbStat.getUjbDataBusinessList[i].userId) {
      //       isMentorConnect = true
      //       break
      //     }
      //   }
      //   if (isMentorConnect == true) {
      //     // this.navCtrl.push(ClientPartnerPage, {
      //       "businessinfoobj": this.ujbStat.getUjbDataBusinessList[i],
      //       "viewOtherProfile": true,
      //       "userId": this.ujbStat.getUjbDataBusinessList[i].userId,
      //       "businessId": this.ujbStat.getUjbDataBusinessList[i].businessId,
      //       "KYCAdded": this.userinfoobj.isKycAdded,
      //       "KYCApprovalStatus": this.userinfoobj.kycApprovalStatus
      //     })
      //   } else {

      //     // this.navCtrl.push(ClientPartnerViewPage, {
      //       "businessinfoobj": this.ujbStat.getUjbDataBusinessList[i],
      //       "viewOtherProfile": true,
      //       "myMentorCode": this.userinfoobj.myMentorCode,
      //       "userId": this.ujbStat.getUjbDataBusinessList[i].userId,
      //       "businessId": this.ujbStat.getUjbDataBusinessList[i].businessId,
      //       "KYCAdded": this.userinfoobj.isKycAdded,
      //       "KYCApprovalStatus": this.userinfoobj.kycApprovalStatus
      //     })
      //   }
      // } else {

      await this.navCtrl.navigateForward('ClientPartnerViewPage', { queryParams: {
        businessinfoobj: this.ujbStat.getUjbDataBusinessList[i],
        viewOtherProfile: true,
        myMentorCode: this.userinfoobj.myMentorCode,
        userId: this.ujbStat.getUjbDataBusinessList[i].userId,
        businessId: this.ujbStat.getUjbDataBusinessList[i].businessId,
        KYCAdded: this.userinfoobj.isKycAdded,
        KYCApprovalStatus: this.userinfoobj.kycApprovalStatus,
      }})
      //}
    }
  }

  async gotoReferNow(businessListObj) {
    console.log('a', businessListObj)
    if (this.isGuest == true) {
      //If ujb_popup_becomePartner has 2 buttons add - "twoButtonHeight" with existing class
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
    } else {
      if (this.isClientPartner) {
        await this.navCtrl.navigateForward('ReferNowPage', { queryParams: {
          userbusinesslist: businessListObj,
          fName: this.userinfoobj.firstName,
          lName: this.userinfoobj.lastName,
        }})
      } else if (
        this.userinfoobj.isKycAdded == false ||
        this.userinfoobj.kycApprovalStatus == 'Rejected' ||
        this.userinfoobj.kycApprovalStatus == 'Pending'
      ) {
        Utility.showToast(
          this.toastCtrl,
          'KYC not submitted/approved',
          false,
          '',
          false
        )
      } else {
        if (this.userinfoobj.isPartnerAgreementAccepted == true) {
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
  }

  async openBusinessStat(segmentSlider) {
    console.log('ujb', this.ujbStat)
    await this.navCtrl.navigateForward('ReferralsGivenPage', { queryParams: {
      segmentSlider: segmentSlider,
      ujbstatistics: this.ujbStat,
      activeincome: this.partnerStatInfo,
    }})
  }

  getUjbStats() {
    // let loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
    // loading.present();
    this.dashboardService.getUjbStatsApi().subscribe(
      (data) => {
        // if (loading)
        //   loading.dismiss()
        console.log('responce in ts file ujb stat', data)
        if (data != null) {
          if (true || data.status == 200) {
            let res = data.json
            console.log('res in 200', res)

            if (res.data.refAmtEarned == null) res.data.refAmtEarned = 0
            this.ujbStat.getUjbDataStat.refAmtEarned = res.data.refAmtEarned
            if (res.data.refAmtEarned.length > 8) {
              this.ujbStat.getUjbDataStat.refAmtEarnedAmount = 'amountdigit'
            } else {
              this.ujbStat.getUjbDataStat.refAmtEarnedAmount = 'amount'
            }

            if (
              res.data.businessClosed == null ||
              res.data.businessClosed == ''
            )
              res.data.businessClosed = 0
            this.ujbStat.getUjbDataStat.businessClosed = res.data.businessClosed
            if (res.data.businessClosed.length > 8) {
              this.ujbStat.getUjbDataStat.businessClosedAmount = 'amountdigit'
            } else {
              this.ujbStat.getUjbDataStat.businessClosedAmount = 'amount'
            }

            console.log(
              'length char',
              this.ujbStat.getUjbDataStat.businessClosed.length
            )

            if (res.data.listedPartners.length > 8) {
              this.ujbStat.getUjbDataStat.listedPartnersCount = 'countdigit'
            } else {
              this.ujbStat.getUjbDataStat.listedPartnersCount = 'count'
            }
            if (res.data.listedPartners == null) res.data.listedPartners = 0
            this.ujbStat.getUjbDataStat.listedPartners = res.data.listedPartners
            if (res.data.partners.length > 8) {
              this.ujbStat.getUjbDataStat.partnersCount = 'countdigit'
            } else {
              this.ujbStat.getUjbDataStat.partnersCount = 'count'
            }
            if (res.data.partners == null) res.data.partners = 0
            this.ujbStat.getUjbDataStat.partners = res.data.partners

            console.log('length ref passed', res.data.refsPassed)
            if (res.data.refsPassed.length > 8) {
              this.ujbStat.getUjbDataStat.refsPassedCount = 'countdigit'
            } else {
              this.ujbStat.getUjbDataStat.refsPassedCount = 'count'
            }
            if (res.data.refsPassed == null) res.data.refsPassed = 0
            this.ujbStat.getUjbDataStat.refsPassed = res.data.refsPassed

            console.log('stats for ujb', this.ujbStat)
            this.storage
              .set('UjbStatInfo', this.ujbStat)
              .then((val) => {
                console.log('stats set for ujb storage', val)
              })
              .catch((err) => {
                console.log("storage.set('UjbStatInfo'", err)
              })
            if (this.slides) this.slides.startAutoplay()
          } else {
            // if (loading)
            //   loading.dismiss()
            //this.getStorageUjbStat()
          }
        }
      },
      (err) => {
        // if (loading)
        //   loading.dismiss()
        console.log('dashboardService.getUjbStatsApi()', err)
        this.url = Urls.baseUrl + Urls.port + Constants.getUjbStats
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getUjbStats'
        this.inserErrorApi()
        //this.getStorageUjbStat()
      }
    )
  }

  getuserInfo() {
    this.dashboardService.getUserInfoApi(this.userId).subscribe(
      (res: any) => {
        if (res != null) {
          if (true || res.status == 200) {
            let data = res.json.data

            console.log('userifo on dashboard', data)
            console.log('d', this.userinfoobj)
            this.userinfoobj.userId = data.userId
            this.userinfoobj.firstName = data.firstName
            this.userData.firstName = data.firstName
            this.userinfoobj.lastName = data.lastName
            this.userData.lastName = data.lastName
            this.userinfoobj.kycApprovalStatus = data.kycApprovalStatus
            this.userinfoobj.isKycAdded = data.isKycAdded
            this.userinfoobj.isPartnerAgreementAccepted =
              data.isPartnerAgreementAccepted
            this.userinfoobj.isMembershipAgreementAccepted =
              data.isMembershipAgreementAccepted
            this.userinfoobj.role = data.role
            this.userData.userRole = data.role
            this.userinfoobj.address = data.address
            this.userinfoobj.mentorName = data.mentorName
            this.userinfoobj.businessDetails.companyName =
              data.businessDetails.companyName
            this.userinfoobj.businessDetails.businessEmail =
              data.businessDetails.businessEmail
            this.userinfoobj.businessDetails.bsnsAdd =
              data.businessDetails.bsnsAdd
            this.userinfoobj.businessDetails.userType =
              data.businessDetails.userType
            console.log(
              'usertype partner aggrmnt',
              this.userinfoobj.businessDetails.userType
            )
            this.userinfoobj.businessDetails.useTypeId =
              data.businessDetails.useTypeId
            this.userinfoobj.businessDetails.partnerName =
              data.businessDetails.partnerName

            // this.userinfoobj.businessDetails.bsnsAdd.Flat_Wing =data.businessDetails.bsnsAdd.Flat_Wing
            // this.userinfoobj.businessDetails.bsnsAdd.Locality =data.businessDetails.bsnsAdd.Locality
            // this.userinfoobj.businessDetails.bsnsAdd.location =data.businessDetails.bsnsAdd.location
            console.log('businessdetails', this.userinfoobj.businessDetails)
            if (this.userinfoobj.isPartnerAgreementAccepted == false)
              this.userinfoobj.partnerAgreementURL = Utility.getImageUrl(
                data.partnerAgreementURL
              )
            if (
              this.userinfoobj.isMembershipAgreementAccepted == false &&
              this.userinfoobj.isPartnerAgreementAccepted == true
            )
              this.userinfoobj.partnerAgreementURL = Utility.getImageUrl(
                data.listedPartnerAgreementURL
              )
            this.userinfoobj.myMentorCode = data.myMentorCode
            this.userData.myMentorCode = data.myMentorCode
            this.userinfoobj.ujbId = data.ujbId

            this.userRole = data.role
            if (data.imgUrl)
              this.userinfoobj.base64Image = Utility.getImageUrl(data.imgUrl)
            this.userinfoobj.noOfLeads = data.noOfLeads
            this.setRoleWiseUI()

            console.log('userinfo', this.userinfoobj)
            this.storage.set('userData', this.userinfoobj)
            this.storage.set('userInfo', this.userData)
            console.log('list', this.userinfolist)
          } else {
            // this.getStorageUserStat()
          }
        }
      },
      (err) => {
        // this.getStorageUserStat()
        console.log('dashboardService.getUserInfoApi err', err)
        this.url = Urls.baseUrl + Urls.port + Constants.getUserInfoApi
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getuserInfo'
        this.inserErrorApi()
      }
    )
  }

  viewImage(imageToView) {
    if (this.userinfoobj.base64Image && this.zoomImage) {
      // TODO
      // const imageViewer = this._imageViewerCtrl.create(imageToView)
      // imageViewer.present()
    }
  }

  gotoProfile() {
    this.storage
      .get('userInfo')
      .then(async (res: any) => {
        this.userRole = res.userRole
        if (this.userRole == 'Guest') {
          if (this.router.url.split('?')[0] == '/GuestPage') {
            //if currently on GuestPage then do nothing
          } else {
            Utility.removeInstances(GuestPage, this.navCtrl)
            await this.navCtrl.navigateForward('GuestPage')
            this.profileActive = 'active'
          }
        } else if (this.userRole == 'Partner') {
          if (this.router.url.split('?')[0] == '/PartnerPage') {
            //if currently on PartnerPage then do nothing
          } else {
            Utility.removeInstances(PartnerPage, this.navCtrl)
            await this.navCtrl.navigateForward('PartnerPage', { queryParams: { viewOtherProfile: false } })
            this.profileActive = 'active'
          }
        } else if (this.userRole == Constants.clientPartner) {
          if (this.router.url.split('?')[0] == '/ClientPartnerPage') {
            //if currently on ClientPartnerPage then do nothing
          } else {
            Utility.removeInstances(ClientPartnerPage, this.navCtrl)
            await this.navCtrl.navigateForward('ClientPartnerPage', { queryParams: { viewOtherProfile: false }})
            this.profileActive = 'active'
          }
        }
      })
      .catch((err) => {
        console.log("storage.get('userInfo')2", err)
      })
  }

  getUserStats() {
    // let loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
    // loading.present();
    this.dashboardService.getUserStatsApi(this.userId, this.userRole).subscribe(
      (data) => {
        // if (loading)
        //   loading.dismiss()
        //this.showUserStat = true

        console.log('userstat in ts file dashboard', data)
        if (data != null) {
          if (true || data.status == 200) {
            let res = data.json
            console.log('res in 200', res)
            if (res.data.dealsClosed == null) res.data.dealsClosed = 0
            this.userData.userStatInfo.referralStats.dealsClosed =
              res.data.dealsClosed

            if (res.data.refsEarnedTotal > 8) {
              this.refsEarnedTotal = 'counts'
            } else {
              this.refsEarnedTotal = 'counts-partnerStats'
            }
            if (res.data.refsEarnedTotal != null) {
              this.totalRefs = res.data.refsEarnedTotal
            } else {
              this.totalRefs = 0
            }
            /* if (res.data.refsEarned != null) {
            let a = +res.data.refsEarned.activeIncome
            let b = +res.data.refsEarned.passiveIncome
            this.totalRefs = a + b
          } else {
            this.totalRefs = 0
          } */
            this.userData.userStatInfo.referralStats.refsEarned =
              res.data.refsEarned
            if (res.data.refsGiven == null) res.data.refsGiven = 0
            this.userData.userStatInfo.referralStats.refsGiven =
              res.data.refsGiven
            if (res.data.businessStats.totalBusinessClosed > 8) {
              this.totalBusinessClosed = 'counts'
            } else {
              this.totalBusinessClosed = 'counts-partnerStats'
            }
            if (res.data.businessStats.totalBusinessClosed == null)
              res.data.businessStats.totalBusinessClosed = 0
            this.userData.userStatInfo.businessStats.totalBusinessClosed =
              res.data.businessStats.totalBusinessClosed
            console.log(
              ' stat info user total businessclsed',
              this.userData.userStatInfo.businessStats.totalBusinessClosed
            )
            if (res.data.businessStats.totalDealsClosed == null)
              res.data.businessStats.totalDealsClosed = 0
            this.userData.userStatInfo.businessStats.totalDealsClosed =
              res.data.businessStats.totalDealsClosed
            // this.userData.userStatInfo.businessStats.totalDealsClosed = res.data.businessStats.totalDealsClosed
            console.log(' stat info user', this.userData)
            this.storage.set('userInfo', this.userData)
          } else {
            // if (loading)
            //   loading.dismiss()
            //this.getStorageUserStat()
          }
        }
      },
      (err) => {
        // this.showUserStat = false
        console.log('dashboardService.getUserStatsApi', err)
        this.url = Urls.baseUrl + Urls.port + Constants.getUserStats
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getUserStats'
        this.inserErrorApi()
        // if (loading)
        //   loading.dismiss()
        //this.getStorageUserStat()
      }
    )
  }

  //If ujb_popup_becomePartner has 2 buttons add - "twoButtonHeight" with existing class
  /* Popup: Become Partner */
  /*letsBecomePartner() {
    let letsBecomePartner = await this.modalCtrl.create(PopupBecomePartnerComponent, {}, { cssClass: 'ujb_popup_becomePartner ujb_theme' });
    letsBecomePartner.present();
  } */

  async getBusinessList() {
    let getBusinessListInfo = new GetBusinessListInfo()
    getBusinessListInfo.userId = this.userId
    console.log('data in req', JSON.stringify(getBusinessListInfo))
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.searchProvider.getBusinessList(getBusinessListInfo).subscribe(
      (data) => {
        //
        if (loading) loading.dismiss()
        console.log('res in ts file get busineslist', data)
        if (data != null) {
          if (true || data.status == 200) {
            //
            let res = data.json.data

            console.log('res in ts file get busineslist in 200', res)
            this.getBusinessListRes.googleApiNextToken = res.googleApiNextToken

            this.getBusinessListRes.listCount = res.listCount
            this.ujbStat.getUjbDataBusinessList = new Array<businessList>()
            for (let i = 0; i <= res.businessList.length - 1; i++) {
              let businessListObj = new businessList()
              businessListObj.userId = res.businessList[i].userId
              businessListObj.businessId = res.businessList[i].businessId
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
                if (res.businessList[i].shareDetails.length == 1) {
                  console.log('sharevalue', businessListObj.shareDatailValue)
                  // for (let k = 0; k <= res.businessList[i].shareDetails.length - 1; k++) {
                  //   let shareDetailsObj = new shareDetails()
                  //   shareDetailsObj.shareType = res.businessList[i].shareDetails[k].shareType
                  //   shareDetailsObj.value = res.businessList[i].shareDetails[k].value

                  //   businessListObj.shareDetails.push(shareDetailsObj)

                  //   console.log("share val type", businessListObj.shareDetails[k].shareType)
                  if (
                    res.businessList[i].shareDetails[0].shareType == 'Amount'
                  ) {
                    businessListObj.showAmount = true
                    businessListObj.showPercent = false
                    businessListObj.showArrow = false
                    businessListObj.showValue = true
                    businessListObj.shareDatailValue =
                      res.businessList[i].shareDetails[0].value
                  } else if (
                    res.businessList[i].shareDetails[0].shareType == 'Percent'
                  ) {
                    businessListObj.showAmount = false
                    businessListObj.showPercent = true
                    businessListObj.showArrow = false
                    businessListObj.showValue = true
                    businessListObj.shareDatailValue =
                      res.businessList[i].shareDetails[0].value
                  }
                } else if (res.businessList[i].shareDetails.length > 1) {
                  businessListObj.showAmount = false
                  businessListObj.showPercent = false
                  businessListObj.showArrow = true
                  businessListObj.showValue = false
                  businessListObj.shareDatailValue = ''
                }
              }

              if (res.businessList[i].logo == null) {
                businessListObj.logo.logoBase64 = Constants.businessLogoConst
              } else {
                businessListObj.logo.logoBase64 = Utility.getImageUrl(
                  res.businessList[i].logo.logoImageURL
                )
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

              this.ujbStat.getUjbDataBusinessList.push(businessListObj)
            }
            console.log('listview', this.ujbStat.getUjbDataBusinessList)

            this.storage
              .set('UjbStatInfo', this.ujbStat)
              .then((val) => {
                console.log('listvie set storage businesslist', val)
              })
              .catch((err) => {
                console.log("storage.set('UjbStatInfo', this.ujbStat)2", err)
              })
          } else {
          }
        }
      },
      (err) => {
        if (loading) loading.dismiss()
        this.url = Urls.baseUrl + Urls.port + Constants.getBusinessList
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getBusinessList'
        this.inserErrorApi()
        console.log('searchProvider.getBusinessList Err', err)
        console.log('listview in err', this.ujbStat.getUjbDataBusinessList)
      }
    )
  }

  onClick(event) {
    if (event.target.className != 'searchbar-input') {
      this.myClass = 'hide'
    }
  }

  async gotoNotification() {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.notificationService
      .notificationUpdateApi(this.notificationIds)
      .subscribe(
        async (data) => {
          if (loading) loading.dismiss()
          console.log('data in notificationUpdate ts', data)
          this.getNotificationCount = new notificationListRes()
          this.notifications = new Array<notifications>()
          await this.navCtrl.navigateForward('NotificationPage')
        },
        (err) => {
          if (loading) loading.dismiss()
          console.log('notificationService.notificationUpdateApi err', err)
          this.url = Urls.baseUrl + Urls.port + Constants.notificationUpdate
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'gotoNotification'
          this.inserErrorApi()
        }
      )
  }

  async getUnreadNotificationCount() {
    this.skipTotal = 0
    //let loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
    //loading.present();
    this.notificationService
      .notificationListApi(this.userId, this.skipTotal)
      .subscribe(
        (data) => {
          //console.log("data in notification ts on dashboard", data)
          // if(loading)
          // loading.dismiss()
          if (data != null) {
            if (true || data.status == 200) {
              let res = data.json.data
              this.getNotificationCount = new notificationListRes()
              this.getNotificationCount.totalCount = res.totalCount
              this.getNotificationCount.totalUnreadCount = res.totalUnreadCount
              if (this.getNotificationCount.totalUnreadCount == 0) {
                this.showNotificationCount = false
              } else {
                this.showNotificationCount = true
              }
              for (let i = 0; i <= res.notifications.length - 1; i++) {
                let notificationObj = new notifications()
                notificationObj.date = res.notifications[i].date
                notificationObj.id = res.notifications[i].id
                notificationObj.isRead = res.notifications[i].isRead
                notificationObj.isSystemGenerated =
                  res.notifications[i].isSystemGenerated
                notificationObj.message = res.notifications[i].message
                notificationObj.type = res.notifications[i].type
                this.notifications.push(notificationObj)
                this.notificationIds.push(this.notifications[i].id)
              }
            }
          }
        },
        (err) => {
          //if (loading)
          //loading.dismiss()
          console.log('stack messge', err.stack)
          JSON.stringify(err)

          console.log(
            'notificationService.notificationListApi data in err',
            err
          )
          if (err.message == 404) {
            this.getNotificationCount.totalUnreadCount = 0
          } else {
            this.url = Urls.baseUrl + Urls.port + Constants.notificationList
            this.stackTrace = err.stack
            this.message = err.message
            this.method = 'getUnreadNotificationCount'
            this.inserErrorApi()
          }
        }
      )
  }

  // getMentorsList() {
  //   this.mentorIdList = new Array<string>()
  //   this.profileProvider.getconnectors(this.userId).subscribe((res: any) => {
  //
  //     console.log("mentorIds", res)
  //     if (res != null) {
  //       if (res.status == 200) {
  //
  //         let data = res.json.data
  //         for (let i = 0; i < data.mentorUserInfo.length; i++) {
  //           this.mentorIdList.push(data.mentorUserInfo[i]._id)
  //         }
  //         if (data.connectorUserInfo != null) {
  //           for (let i = 0; i < data.connectorUserInfo.length; i++) {
  //
  //             this.mentorIdList.push(data.connectorUserInfo[i]._id)
  //           }
  //         }
  //       }
  //       this.storage.set("mentorIdList", this.mentorIdList)
  //       console.log("mentorIdList", this.mentorIdList)
  //     }
  //   }, err => {
  //
  //     console.log("profileProvider.getconnectors err", err)
  //   })
  // }

  setRoleWiseUI() {
    if (this.userRole == 'Guest') {
      this.showToPartner = 'hide'
      this.isGuest = true
      this.isPartner = false
      this.isClientPartner = false
      this.userRole = 'Guest'
      this.blurName = 'user_guest_Only'
      console.log('guest')
    } else if (this.userRole == 'Partner') {
      this.isGuest = false
      this.isPartner = true
      this.isClientPartner = false
      this.userRole = 'Partner'
      console.log('Partner')
      this.kycPnding = 'Your KYC is pending for approval'
      this.kycIncomplete = 'Your KYC is not complete..Do it'
      this.kycRejected = 'Your KYC is rejected. Please contact Admin'
    } else if (this.userRole == Constants.clientPartner) {
      this.showToPartner = 'hide'
      this.userRole = Constants.clientPartner
      this.isGuest = false
      this.isPartner = false
      this.isClientPartner = true
      this.kycPnding = 'Your business KYC is pending for approval'
      this.kycIncomplete = 'Your business KYC documents are not complete..Do it'
      this.kycRejected = 'Your business KYC is rejected. Please contact Admin'
    }

    console.log('d', this.userinfoobj.isKycAdded)

    //  this.userinfoobj.currentStatus=data.currentStatus;

    if (this.userinfoobj.isKycAdded == false) {
      this.showToPartner = 'view'
      this.myClass2 = 'view'
      this.myClass4 = 'hide'
      this.myClass3 = 'hide'
    } else {
      this.myClass2 = 'hide'
    }

    if (
      this.userinfoobj.isKycAdded == true &&
      this.userinfoobj.kycApprovalStatus == 'Approved'
    ) {
      this.showToPartner = 'hide'
      this.myClass2 = 'hide'
      this.myClass4 = 'hide'
      this.myClass3 = 'hide'
    }
    if (
      this.userinfoobj.isKycAdded == true &&
      this.userinfoobj.kycApprovalStatus == 'Rejected'
    ) {
      this.showToPartner = 'view'
      this.myClass3 = 'view'
      this.myClass2 = 'hide'
      this.myClass4 = 'hide'
    }
    if (
      this.userinfoobj.isKycAdded == true &&
      this.userinfoobj.kycApprovalStatus == 'Pending'
    ) {
      this.showToPartner = 'view'
      this.myClass4 = 'view'
      this.myClass3 = 'hide'
      this.myClass2 = 'hide'
    }

    if (
      this.userinfoobj.kycApprovalStatus == 'Approved' &&
      this.userinfoobj.isKycAdded == true &&
      this.userinfoobj.isPartnerAgreementAccepted == false
    ) {
      this.myClass5 = 'view flashit'
      this.showToPartner = 'view'
    }
    if (
      this.userinfoobj.kycApprovalStatus == 'Approved' &&
      this.userinfoobj.isKycAdded == true &&
      this.userinfoobj.isMembershipAgreementAccepted == false &&
      this.userRole == Constants.clientPartner &&
      this.userinfoobj.isPartnerAgreementAccepted == true
    ) {
      this.myClass6 = 'view flashit'
      this.showToPartner = 'view'
    } else {
      this.myClass6 = 'hide'
      this.showToPartner = 'hide'
    }
  }

  async gotoAgreement(type: string) {
    console.log('userrole in go toaggremnt', this.userRole)
    if (this.userinfoobj.isPartnerAgreementAccepted == false) {
      await this.navCtrl.navigateForward('PartnerAggreementPage', { queryParams: {
        type: type,
        role: this.userRole,
        userInfo: this.userinfoobj,
      }})
    } else if (this.userinfoobj.isMembershipAgreementAccepted == false) {
      //
      //code to be done for llp partnershp frm and individual n company
      if (this.userinfoobj.businessDetails.userType == 'Individual/Proprietor') {
        await this.navCtrl.navigateForward('FreelencerPage', { queryParams: {
          type: type,
          role: this.userRole,
          userInfo: this.userinfoobj,
        }})
      } else if (this.userinfoobj.businessDetails.userType == 'PartnerShipFirm') {
        await this.navCtrl.navigateForward('PartnershipFirmAggreementPage', { queryParams: {
          type: type,
          role: this.userRole,
          userInfo: this.userinfoobj,
        }})
      } else if (this.userinfoobj.businessDetails.userType == 'LLP') {
        await this.navCtrl.navigateForward('LlpAggreementPage', { queryParams: {
          type: type,
          role: this.userRole,
          userInfo: this.userinfoobj,
        }})
      } else if (this.userinfoobj.businessDetails.userType == 'Company') {
        await this.navCtrl.navigateForward('CompanyAggreementPage', { queryParams: {
          type: type,
          role: this.userRole,
          userInfo: this.userinfoobj,
        }})
      }
    }
  }

  // gotoAgreement(type: string) {
  //   // this.navCtrl.push(PartneragreementPage, {
  //     "type": type,
  //     "role": this.userRole,
  //     "url": this.userinfoobj.partnerAgreementURL
  //   })
  // }

  onPageScroll(event) {
    console.log('activePage scroll')
    console.log('activePage scroll keyboar event', this.kb.isVisible)
    if (this.kb.isVisible) {
      this.kb.hide()
    }
  }

  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'Dashboard'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe(
      (res: any) => {
        console.log('res in 200 logs', res)
      },
      (err) => {
        console.log('err in 200 logs', err)
      }
    )
  }

  sendVersionCode() {
    this.appVersion
      .getVersionNumber()
      .then((ver) => {
        console.log('sendVersionCode ver', ver)
        this.utilsProvider.sendAppVersion(this.userId, ver).subscribe(
          (res: any) => {
            console.log('sendVersionCode res', res)
          },
          (err) => {
            console.log('sendVersionCode err', err)
          }
        )
      })
      .catch((err) => {
        console.log('getVersionNumber err', err)
      })
  }
}
