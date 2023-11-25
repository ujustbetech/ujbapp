import * as $ from 'jquery'

import {
  // App,
  // IonicPage,
  MenuController,
  NavController,
  IonSlides,
  ToastController,
} from '@ionic/angular'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { Component, NgZone, ViewChild, OnInit } from '@angular/core'

import { ActionSheetController } from '@ionic/angular'
import { BannerImageInfo } from '../../../../app/models/BannerImageInfo'
import { CategoryInfo } from '../../../../app/models/CategoryInfo'
import { ClientPartnerInfo } from '../../../../app/models/ClientPartnerInfo'
import { Constants } from '../../../Utils/Constants'
import { Device } from '@ionic-native/device/ngx'
import { File } from '@ionic-native/file/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
// import { ImageViewerController } from 'ionic-img-viewer/dist/es2015/src/image-viewer.controller'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { ModalController } from '@ionic/angular'
import { NetworkUtils } from '../../../Utils/NetworkUtils'
import { PartnerInfo } from '../../../../app/models/PartnerInfo'
import { PartnerPage } from '../partner/partner'
import { Platform } from '@ionic/angular'
import { ProductImageInfo } from '../../../../app/models/ProductImageInfo'
import { ProductInfo } from '../../../../app/models/CPProductInfo'

import { ReferralDataInfo } from '../../../../app/models/ReferralDataInfo'
import { Storage } from '@ionic/storage'

import { UploadCompanyLogoInfo } from '../../../../app/models/companyLogo_info'
import { Urls } from '../../../Utils/urls'
import { UserInfo } from '../../../../app/models/userInfo'
import { Utility } from '../../../Utils/Utility'
import { businessList } from '../../../../app/models/getBusinessList_res'
import { window } from 'rxjs/operators/window'
import { ActivatedRoute, Router } from '@angular/router'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { DashboardService } from '../../../services/dashboard.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { BusinessDetailsService } from '../../../services/business-details.service'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { BusinessListingService } from '../../../services/business-listing.service'
import { PopupConfirmationAlertComponent } from '../../../components/popups/popup-confirmation-alert/popup-confirmation-alert'
import { ProfileCpPersonalTabComponent } from '../../../components/profile-cp-personal-tab/profile-cp-personal-tab'

//import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

//import { ProductServiceAddEditPage } from '../../product-service/product-service-add-edit/product-service-add-edit';

declare var cordova
// import { ProfileCpPersonalTabComponent } from '../../../components/profile-cp-personal-tab/profile-cp-personal-tab';

/**
 * Generated class for the ClientPartnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// // @IonicPage()
@Component({
  selector: 'page-client-partner',
  templateUrl: 'client-partner.html',
  styleUrls: ['client-partner.scss'],
})
export class ClientPartnerPage implements OnInit {
  activePage: string
  // @ViewChild('actionSheetcntrl') actionSheetcntrl :ActionSheetController;
  @ViewChild('slider', { static: true }) slider: IonSlides
  @ViewChild('slider2', { static: true }) slider2: IonSlides
  @ViewChild('serviceSlider', { static: true }) serviceSlider: IonSlides
  @ViewChild('productSlider', { static: true }) productSlider: IonSlides

  @ViewChild(ProfileCpPersonalTabComponent, { static: true })
  ProfileCpPersonalTabComponent: ProfileCpPersonalTabComponent
  segmentSlider = '0'
  segmentSlider2 = '0'
  userId: any
  categoryName
  scrollBlock: any
  productDetailsList: ProductInfo[]
  cpBusinessDetails: ClientPartnerInfo
  type: any
  showAddButton: any
  isProductOrService: boolean
  userinfoobj = new UserInfo()
  mentorUserInfo: UserInfo[]
  connectorUserInfo: UserInfo[]
  firstconnects: UserInfo[]
  userprofilelist: UserInfo[]
  userinfoconnectobj = new UserInfo()
  connectCounters: any
  countofconnects: any
  showEdit: any
  connect_text_class: any
  showAddUrl: boolean = false
  showNoDes: boolean
  viewBusiness
  openEditLogo
  imageUri
  imageUri1
  addressInfo: any
  categoriesInfo: CategoryInfo
  categoryName1
  categoryName2
  catIdList: CategoryInfo[]
  showCircle: boolean
  catId
  viewOtherProfile
  businessId
  hidePersonalTab
  showEditIcon
  hideEditIcon
  hideEditUrl
  showAdd: boolean = false
  showEditOther: boolean
  showReferNow: boolean = false

  //myMentorCode
  updatedData
  hideBackArrow
  partnerDetails: PartnerInfo = new PartnerInfo()
  //coverImage = 'assets/imgs/content-imgs/banner-cp-default.jpg'
  //logoImage = 'assets/imgs/content-imgs/businessprofileCopy@2x.png'
  coverImage
  logoImage
  isLogoUploaded: boolean = false
  isCoverUploaded: boolean = false
  page
  dashBoardActive
  moreMenuActive
  // _imageViewerCtrl: ImageViewerController
  imageToShow
  loading
  addProductNotification
  businessinfoobj
  headerArrow: string = 'hideBackArrow'
  actionSheetCtrl
  hidestat
  isKycAdded
  kycApprovalStatus
  showCategory: boolean
  showAddDescription: boolean = false
  hideEditDesription: any
  hideAddUrl
  removeImage
  currentPlatform = ''
  showNoUrl
  hideImg
  showNoSerives: boolean = false
  showNoProduct: boolean = false
  hideInput
  checkCategory
  restrictEdit: boolean = false
  companyLogoDetails: UploadCompanyLogoInfo = new UploadCompanyLogoInfo()
  bannerImageInfo: BannerImageInfo
  url
  margin
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  noTagline: boolean = false
  isTagline: boolean = false
  referBtnText: string = 'Refer now'
  hideNameofPartner: boolean = false
  showNameofPartner: boolean = false
  params
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private storage: Storage,
    public logErrorService: InserErrorLogService,
    public dashboardService: DashboardService,
    public businessListService: BusinessListingService,
    public toastCtrl: ToastController,
    public actionSheet: ActionSheetController,
    private zone: NgZone,
    public provider: UserProfileService,
    public camera: Camera,
    public platform: Platform,
    public file: File,
    // private imageViewerCtrl: ImageViewerController,
    public filePath: FilePath,
    // private app: App,
    public cpLogoProvider: BusinessDetailsService,
    public utilsProvider: CommonUtilsService,
    private device: Device,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private menu: MenuController,
    private router: Router
  ) /*, private iab: InAppBrowser*/ {
    //this.hideEditIcon = 'view'
    route.queryParams.subscribe((params: any) => {
      this.params = params
      this.cpBusinessDetails = new ClientPartnerInfo()
      this.bannerImageInfo = new BannerImageInfo()
      this.storage.get('specialCategory').then((val) => {
        this.checkCategory = val
        // this.storage.set('specialCategory',this.checkCategory)
        if (
          val == '5d88e505240f0263e42c615c' ||
          val == '5d88e546240f0263e42c62ff' ||
          val == '5d88e55b240f0263e42c63aa'
        ) {
          this.hideInput = false
        } else {
          this.hideInput = true
        }
      })
      this.scrollBlock = false
      this.type = 'Service'
      this.storage.get('userInfo').then((val) => {
        this.businessId = val.businessId
      })
      this.addProductNotification = params.addProductNotification
      this.mentorUserInfo = new Array<UserInfo>()
      this.connectorUserInfo = new Array<UserInfo>()
      this.userprofilelist = new Array<UserInfo>()
      this.firstconnects = new Array<UserInfo>()
      this.categoriesInfo = new CategoryInfo()
      this.catIdList = new Array<CategoryInfo>()
      this.cpBusinessDetails = new ClientPartnerInfo()
      //productDetail
      this.productDetailsList = new Array<ProductInfo>()
      this.showEdit = 'hide'
  
      this.businessinfoobj = params.businessinfoobj
      this.isKycAdded = params.KYCAdded
      this.kycApprovalStatus = params.KYCApprovalStatus
      this.platform.backButton.subscribe(async () => {
        console.log('client partner1')
        const getOpen: any = await this.menu.getOpen()
        if (getOpen) {
          //console.log("menu open", getOpen.isOpen)
          if (getOpen.isOpen == true) {
            this.menu.close()
            //this.registerBackButton()
          }
        } else {
          if (this.viewOtherProfile == true) {
            this.navCtrl.pop()
          } else if (this.actionSheetCtrl) {
            this.actionSheetCtrl.dismiss()
            this.actionSheetCtrl = undefined
          } else {
            if (
              this.router.url.split('?')[0] == '/ClientPartnerPage'
              // this.app.getActiveNav().getActive().instance instanceof
              // ClientPartnerPage
            ) {
              this.navCtrl.navigateRoot('DashboardPage')
              Utility.removeInstances(ClientPartnerPage, this.navCtrl)
            } else {
              this.navCtrl.pop()
            }
          }
        }
      })
  
      // IOS Footer hide on focus
      if (platform.is('ios')) {
        //hide footer when input box is on focus
        $(document).on('focus', 'input', function () {
          // $(".footer-med").hide();
          $('.footer-adj').css('display', 'none')
          $('.scroll-content').css('margin-bottom', '0')
        })
        //show footer when input is NOT on focus
        $(document).on('blur', 'input', function () {
          // $(".footer-med").show();
          $('.footer-adj').css('display', 'block')
          $('.scroll-content').css('margin-bottom', '45px')
        })
      }
      if (device.model == 'iPhone10,6' || device.model == 'iPhone11,6') {
        this.margin = 'margin'
      } else {
        this.margin = ' '
      }
      
      this.ionViewCanEnterNew()

    })
  }

  ionViewCanEnterNew(): any {
    /* this.loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
    this.loading.present() */
    console.log('ionViewCanEnter1 ', new Date().toISOString())
    // return new Promise((resolve) => {
      this.storage
        .get('userInfo')
        .then((val) => {
          console.log('ionViewCanEnter2 ', new Date().toISOString())
          this.userId = val.userId

          this.viewOtherProfile = this.params.viewOtherProfile
          if (this.viewOtherProfile == true) {
            this.userId = this.params.userId
            this.businessId = this.params.businessId
          }
          this.ProfileCpPersonalTabComponent.getMentorsList(this.userId)
          console.log('ionViewCanEnter3 ', new Date().toISOString())
          let resp
          if (this.utilsProvider.checkNetwork(this.storage, this.navCtrl)) {
            resp = this.ProfileCpPersonalTabComponent.getProfile(
              this.userId,
              this.viewOtherProfile
            )
            console.log('ionViewCanEnter4 ', new Date().toISOString())
            console.log('getProfile resp', resp)
            /* if(this.loading)
          this.loading.dismiss() */
            console.log('ionViewCanEnter5 ', new Date().toISOString())
            // resolve(resp)
          }

          console.log('ionViewCanEnter6 ', new Date().toISOString())
          this.getBusinessDetails()
          this.getProductServices()
          this.hidePersonalTab = false

          console.log('ionViewWillEnter7 client partner')

          if (this.viewOtherProfile == true) {
            console.log('ionViewCanEnter8 ', new Date().toISOString())
            this.headerArrow = ''
            this.showEditIcon = ''
            this.showAdd = false
            this.showEditOther = false
            //this.showReferNow = true
            this.hidestat = 'hide'
            this.hideEditUrl = 'hide'
            this.hideEditDesription = 'hide'
            this.hideEditIcon = 'hide'
            this.showAddUrl = false
            this.showAddDescription = false
            this.hideAddUrl = 'hide'
            this.hideNameofPartner = true
          } else {
            console.log('ionViewCanEnter9 ', new Date().toISOString())
            this.activePage = 'Profile'
            // this.showReferNow = false
            this.showEditIcon = 'editModeOn'
            this.hideEditIcon = 'view'
            this.showAddUrl = false
            this.showAddDescription = false
            this.showEditOther = true
            this.showAdd = true
            this.hidestat = 'view'
            this.hideEditDesription = 'view'
            this.hideNameofPartner = false
          }
          if (this.platform.is('android')) {
            console.log('ionViewCanEnter10 ', new Date().toISOString())
            this.currentPlatform = 'md-device'
          }
        })
        .catch((err) => {
          console.log('ionViewCanEnter11 ', new Date().toISOString())
          // resolve(false)
        })
    // })
  }

  /* async getNetwork(){
    return await NetworkUtils.checkNetwork(this.storage, this.navCtrl)
  } */

  ionViewDidEnter() {
    // if (this.viewOtherProfile == true || this.updatedData == "updated") {
    //   this.hidePersonalTab = true
    //   this.selectedBusiness(1)
    //   this.segmentSlider = "1"
    // }
    if (this.addProductNotification == true) {
      this.selectedBusiness(1)
      this.segmentSlider = '1'
    }
  }

  /* Header Segment */
  selectedReferral(i) {
    this.slider.lockSwipes(false)
    this.slider.slideTo(i)
    this.slider.lockSwipes(true)
    $('div').scrollTop(0)
  }

  selectedBusiness(i) {
    this.slider.lockSwipes(false)
    this.slider.slideTo(i)
    this.slider.lockSwipes(true)
    $('div').scrollTop(0)
  }

  //SegmentSlider: Change Slide on Segment Button click
  selectedSegment(i, val) {
    this.productDetailsList = new Array<ProductInfo>()
    this.showAddButton = 'hide'
    this.slider2.lockSwipes(false)
    this.slider2.slideTo(i)
    this.slider2.lockSwipes(true)
    this.type = val
    this.getProductServices()
  }

  //SegmentSlider: Change Segment Button on slide change
  selectedSlide($event) {
    this.segmentSlider2 = $event._snapIndex.toString()
  }

  ngOnInit() {
    this.slider.lockSwipes(true)
    this.slider2.lockSwipes(true)
    // this.ionViewCanEnterNew()
    // TODO
    // this.slider.autoHeight = true
  }

  async getServices() {
    // this.storage.set('specialCategory',this.checkCategory)
    await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
      selectedItem: 'services',
      from: 'CPPage',
      specialCategory: this.cpBusinessDetails.categories,
    }})
  }

  async getProducts() {
    await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
      selectedItem: 'products',
      from: 'CPPage',
    }})
  }

  /*      getProfile(id) {
        
        this.provider.getProfile(id).subscribe(res => {
          console.log("userdata in client partner", res)
          //this.userProfile = res.json.data.userInfo
          this.partnerDetails.ujbId = res.json.data.userInfo.mentorCode
          this.partnerDetails.myMentorCode = res.json.data.userInfo.myMentorCode
          console.log("mentor code", this.partnerDetails.myMentorCode)
          this.storage.get("userData").then(data => {
            let userInfo: UserInfo = data
            if (userInfo == null || userInfo == undefined) {
              userInfo = new UserInfo()
            }
            if (this.viewOtherProfile == true) {
              if (userInfo.myMentorCode == this.partnerDetails.ujbId) {
                this.hidePersonalTab == true
              } else {
                this.hidePersonalTab == false
              }
            }
          })
    
        }, err => {
          
    
          //// this.navCtrl.push(ErrorPage)
          this.url=Urls.baseUrl+Urls.port+Constants.getUserProfile
          this.stackTrace=err.stack
          this.message=err.message
          this.method="getProfile"
          this.inserErrorApi()
        })
      }  */
  // ngAfterViewInit() {

  // }

  async getBusinessDetails() {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.dashboardService.getCpBusiness(this.userId).subscribe(
      (data: any) => {
        if (loading) loading.dismiss()
        console.log('data in ts cp', data)
        this.zone.run(() => {
          console.log('force update the screen')
          if (data != null) {
            if (data.status == 200) {
              this.cpBusinessDetails = new ClientPartnerInfo()
              let res = data.json.data
              console.log('data in ts cp 200', res)

              if (res.businessName == null) res.businessName = ''
              this.cpBusinessDetails.businessName = res.businessName
              this.cpBusinessDetails.businessId = res.businessId
              this.cpBusinessDetails.myMentorCode = res.myMentorCode
              this.cpBusinessDetails.userTypeId = res.userTypeId
              this.cpBusinessDetails.userType = res.userType
              if (
                this.cpBusinessDetails.userType == 'PartnerShipFirm' ||
                this.cpBusinessDetails.userType == 'LLP'
              ) {
                this.showNameofPartner = true
              } else {
                this.showNameofPartner = false
              }
              this.cpBusinessDetails.nameofPartner = res.nameofPartner
              console.log(
                'name of partner',
                this.cpBusinessDetails.nameofPartner
              )
              console.log(
                'mymentor code in businessdetail',
                this.cpBusinessDetails.myMentorCode
              )
              this.cpBusinessDetails.userId = res.userId
              console.log('name', this.cpBusinessDetails.businessName)
              if (res.tagline == null || res.tagline == '') {
                if (this.viewOtherProfile == true) {
                  this.noTagline = false
                  this.isTagline = false
                  this.cpBusinessDetails.tagline = ''
                } else {
                  this.noTagline = true
                  this.isTagline = false
                }
              } else {
                this.noTagline = false
                this.isTagline = true
                this.cpBusinessDetails.tagline = res.tagline
              }

              if (res.address.location == null) res.address.location = ''
              this.cpBusinessDetails.addressInfo.location = res.address.location
              if (res.address.locality == null) res.address.locality = ''
              this.cpBusinessDetails.addressInfo.Locality = res.address.locality
              if (res.address.flat_Wing == null) res.address.flat_Wing = ''
              this.cpBusinessDetails.addressInfo.Flat_Wing =
                res.address.flat_Wing

              if (
                res.businessDescription == null ||
                res.businessDescription == ''
              ) {
                if (this.viewOtherProfile != true) {
                  this.showNoDes = false
                  this.showAddDescription = true
                  this.hideEditDesription = 'hide'
                } else {
                  this.showNoDes = true
                  this.showAddDescription = false
                  this.hideEditDesription = 'hide'
                }
              } else if (
                res.businessDescription != null ||
                res.businessDescription != ''
              ) {
                if (this.viewOtherProfile != true) {
                  this.cpBusinessDetails.businessDescription =
                    res.businessDescription
                  this.showAddDescription = false
                  this.hideEditDesription = 'view'
                } else {
                  this.cpBusinessDetails.businessDescription =
                    res.businessDescription
                  this.showAddDescription = false
                  this.hideEditDesription = 'hide'
                }
              }
              if (res.businessUrl == null || res.businessUrl == '') {
                if (this.viewOtherProfile != true) {
                  res.businessUrl = ''
                  this.showAddUrl = true
                  this.hideEditUrl = 'hide'
                  this.showNoUrl = false
                  this.hideImg = true
                } else {
                  // res.businessUrl = ""
                  this.hideImg = false
                  this.showNoUrl = true
                  this.showAddUrl = false
                  this.hideEditUrl = 'hide'
                }
              } else if (res.businessUrl != null || res.businessUrl != '') {
                if (this.viewOtherProfile != true) {
                  this.cpBusinessDetails.websiteUrl = res.businessUrl
                  this.hideImg = true
                  this.showAddUrl = false
                  this.hideEditUrl = 'view'
                } else {
                  this.cpBusinessDetails.websiteUrl = res.businessUrl
                  this.hideImg = true
                  this.showAddUrl = false
                  this.hideEditUrl = 'hide'
                }
              }
              this.cpBusinessDetails.rating = res.rating

              if (res.businessEmail == null) res.businessEmail = ''
              this.cpBusinessDetails.businessEmail = res.businessEmail

              this.companyLogoDetails = new UploadCompanyLogoInfo()
              this.companyLogoDetails.businessId = res.businessId
              if (res.businessLogo) {
                this.companyLogoDetails.logoImageURL =
                  res.businessLogo.logoImageURL
                this.companyLogoDetails.logoImgName =
                  res.businessLogo.logoImgName
                this.companyLogoDetails.logoImgType =
                  res.businessLogo.logoImgType
                if (res.businessLogo.logoImageURL)
                  this.companyLogoDetails.logoBase64 = Utility.getImageUrl(
                    res.businessLogo.logoImageURL
                  ) //res.businessLogo.logoBase64
              }

              if (res.bannerDetails) {
                if (res.bannerDetails.imageURL) {
                  this.bannerImageInfo.Base64string = Utility.getImageUrl(
                    res.bannerDetails.imageURL
                  )
                  this.bannerImageInfo.imageURL = res.bannerDetails.imageURL
                  this.bannerImageInfo.FileName = res.bannerDetails.imageName
                }
              }
              for (let i = 0; i <= res.categories.length - 1; i++) {
                this.categoriesInfo = new CategoryInfo()
                this.categoriesInfo.catId = res.categories[i].id
                this.categoriesInfo.categoryName = res.categories[i].name

                this.cpBusinessDetails.categories.push(this.categoriesInfo)
                if (this.viewOtherProfile == false) {
                  this.storage
                    .set(
                      'specialCategory',
                      this.cpBusinessDetails.categories[i].catId
                    )
                    .then((val) => {
                      console.log('val cate', val)
                      if (
                        val == '5d88e505240f0263e42c615c' ||
                        val == '5d88e546240f0263e42c62ff' ||
                        val == '5d88e55b240f0263e42c63aa'
                      ) {
                        this.hideInput = false
                      } else {
                        this.hideInput = true
                      }
                    })
                  console.log('categorylist', this.cpBusinessDetails.categories)
                } else {
                  for (
                    let j = 0;
                    j < this.cpBusinessDetails.categories.length;
                    j++
                  ) {
                    if (
                      this.cpBusinessDetails.categories[j].categoryName ==
                        'Legal' ||
                      this.cpBusinessDetails.categories[j].categoryName ==
                        'Doctor' ||
                      this.cpBusinessDetails.categories[j].categoryName ==
                        'Chartered Accountant'
                    ) {
                      this.hideInput = false
                      break
                    } else {
                      this.hideInput = true
                    }
                  }
                }
              }

              for (
                let j = 0;
                j < this.cpBusinessDetails.categories.length;
                j++
              ) {
                if (
                  this.cpBusinessDetails.categories[j].categoryName ==
                    'Legal' ||
                  this.cpBusinessDetails.categories[j].categoryName ==
                    'Doctor' ||
                  this.cpBusinessDetails.categories[j].categoryName ==
                    'Chartered Accountant'
                ) {
                  this.referBtnText = 'Connect'
                }
              }

              if (res.categories[0] && res.categories[0].name != undefined) {
                this.categoryName1 = res.categories[0].name
              }
              if (res.categories[1] != undefined) {
                this.showCircle = true
                this.categoryName2 = res.categories[1].name
              }

              if (res.categories && res.categories.length == 1) {
                this.showCircle = false
                this.categoryName2 = ''
              }
              console.log('obj in 200', this.cpBusinessDetails)
            }
          }
        })

        this.zone.run(() => {
          console.log('force update the screen')
        })
      },
      (err) => {
        if (loading) loading.dismiss()
        console.log('err', err)
        this.url = Urls.baseUrl + Urls.port + Constants.getCpBusinessApi
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getBusinessDetail'
        this.inserErrorApi()
      },
      () => {
        if (loading) loading.dismiss()
      }
    )
  }

  async getProductServices() {
    this.productDetailsList = new Array<ProductInfo>()
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.loading.present()
    this.businessListService
      .getProductOrServices(this.userId, this.type)
      .subscribe(
        (res: any) => {
          if (this.loading) this.loading.dismiss()
          if (res != null) {
            if (res.status == 200) {
              let data = res.json.data
              console.log('a', data)
              for (let i = 0; i < data.length; i++) {
                let productDetail = new ProductInfo()
                productDetail.name = data[i].name
                console.log('prodname', productDetail.name)
                productDetail.type = data[i].type
                productDetail.description = data[i].description
                productDetail.url = data[i].url
                productDetail.productPrice = data[i].productPrice
                productDetail.minimumDealValue = data[i].minimumDealValue
                productDetail.shareType = data[i].shareType
                productDetail.typeOf = data[i].typeOf
                if (data[i].productImages) {
                  for (let k = 0; k < data[i].productImages.length; k++) {
                    let prodImg = new ProductImageInfo()
                    if (data[i].productImages[k].prodImgName == null)
                      data[i].productImages[k].prodImgName = ''
                    prodImg.prodImgName = data[i].productImages[k].prodImgName
                    prodImg.ImageURL = data[i].productImages[k].imageURL

                    if (data[i].productImages[k].imageURL == null) {
                      data[i].productImages[k].prodImgBase64 =
                        Constants.businessLogoConst
                    } else {
                      prodImg.prodImgBase64 = Utility.getImageUrl(
                        data[i].productImages[k].imageURL
                      )
                    }
                    prodImg.isDefaultImg = data[i].productImages[k].isDefaultImg

                    //
                    /*  if (data[i].productImages[k].isDefaultImg==true) {
                   productDetail.selectedImage = data[i].productImages[k].prodImgBase64
                 } */
                    productDetail.productImages.push(prodImg)
                  }
                }

                if (productDetail.productImages.length == 0) {
                  let prodImg = new ProductImageInfo()
                  prodImg.prodImgBase64 = 'assets/imgs/content-imgs/intro-1.jpg'
                  prodImg.isDefaultImg = true
                  productDetail.productImages.push(prodImg)
                }

                for (let l = 0; l < productDetail.productImages.length; l++) {
                  if (productDetail.productImages[l].isDefaultImg == true) {
                    let temp = productDetail.productImages[0]
                    productDetail.productImages[0] =
                      productDetail.productImages[l]
                    productDetail.productImages[l] = temp
                  }
                }
                if (data[i].productsOrServices) {
                  for (let j = 0; j < data[i].productsOrServices.length; j++) {
                    let productOrServceObj = new ReferralDataInfo()
                    if (data[i].productsOrServices[j].from == null)
                      data[i].productsOrServices[j].from = ''
                    productOrServceObj.from = data[i].productsOrServices[j].from
                    if (data[i].productsOrServices[j].to == null)
                      data[i].productsOrServices[j].to = ''
                    productOrServceObj.to = data[i].productsOrServices[j].to

                    productOrServceObj.productDetailsId =
                      data[i].productsOrServices[j].productDetailsId
                    if (data[i].productsOrServices[j].productName == null)
                      data[i].productsOrServices[j].productName = ''
                    productOrServceObj.productName =
                      data[i].productsOrServices[j].productName
                    if (data[i].productsOrServices[j].type == null)
                      data[i].productsOrServices[j].type = ''
                    productOrServceObj.type = data[i].productsOrServices[j].type
                    if (data[i].productsOrServices[j].value == null)
                      data[i].productsOrServices[j].value = ''
                    productOrServceObj.value =
                      data[i].productsOrServices[j].value
                    productDetail.ProductsOrServices.push(productOrServceObj)
                  }
                }
                //
                //this.productDetailsList = new Array<ProductInfo>()
                this.productDetailsList.push(productDetail)
                if (this.productDetailsList.length > 0) {
                  this.showAddButton = 'hide'
                  this.showEdit = 'view'
                  // this.serviceSlider.slideTo(0)
                  // this.productSlider.slideTo(0)
                } else {
                  this.showAddButton = 'view'
                  this.showEdit = 'hide'
                }
                console.log('listDetail', this.productDetailsList)
              }
            }
          }
        },
        (err) => {
          if (this.loading) this.loading.dismiss()
          if (err.message == 404) {
            this.showAddButton = 'view'
            this.showEdit = 'hide'
            if (this.viewOtherProfile == true) {
              if (this.type == 'Service') {
                if (this.productDetailsList.length > 0) {
                  this.showNoSerives = false
                } else {
                  this.showNoSerives = true
                }
              } else if (this.type == 'Product') {
                if (this.productDetailsList.length > 0) {
                  this.showNoProduct = false
                } else {
                  this.showNoProduct = true
                }
              }
            }
          }
          this.url = Urls.baseUrl + Urls.port + Constants.getProductOrService
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'getProductServices'
          this.inserErrorApi()
          console.log('errpr', err)
          // Utility.showToast(this.toastCtrl, "NO " + this.type + " added", false, "")
        }
      )
  }

  async viewBusinessStat() {
    await this.navCtrl.navigateForward('ReferralsGivenPage', { queryParams: { segmentSlider: 'business' }})
  }

  openEditMode() {
    console.log('open edit mode')
    if (this.openEditLogo == 'editModeOn') {
      this.openEditLogo = ''
      this.isLogoUploaded = false
      this.isCoverUploaded = false
      this.hideEditIcon = 'view'
    } else {
      this.openEditLogo = 'editModeOn'
      this.isLogoUploaded = true
      this.isCoverUploaded = true
      this.hideEditIcon = 'hide'
    }
  }

  // uploadLogo() {
  //
  //   this.actionSheetCtrl = this.actionSheet.create({
  //     title: "Upload from Phone",
  //     buttons: [{
  //       text: 'Camera',
  //       handler: () => {
  //         const options: CameraOptions = {
  //           quality: 70,
  //         }
  //         this.camera.getPicture(options).then((imageData) => {

  //           // this.imageUri = imageData.substring(imageData.lastIndexOf('/') + 1, imageData.length);
  //           this.cpBusinessDetails.logoBase64 = normalizeURL(imageData);
  //           this.isLogoUploaded = false
  //           this.openEditLogo = ''

  //         }, (err) => {
  //           console.log(err);
  //         })
  //       }
  //     }, {
  //       text: 'Gallery',
  //       handler: () => {
  //         const options: CameraOptions = {
  //           quality: 100,
  //           sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
  //         }
  //         this.camera.getPicture(options).then((imageData) => {
  //           if (this.platform.is('android')) {
  //             this.filePath.resolveNativePath(imageData).then((entry) => {

  //               this.cpBusinessDetails.logoBase64 = entry
  //               this.isLogoUploaded = false
  //               this.openEditLogo = ''
  //             })
  //           }
  //           else {

  //             let mimageData = imageData.replace("/private", "file://");

  //             this.cpBusinessDetails.logoBase64 = normalizeURL(imageData)
  //             this.isLogoUploaded = false
  //             this.openEditLogo = ''

  //             console.log("mimagedata", mimageData)
  //           }
  //         }, (err) => {
  //           console.log(err);
  //         })
  //       }
  //     }
  //     ]
  //   })
  //   if (this.cpBusinessDetails.logoBase64 != '' && this.cpBusinessDetails.logoBase64 != undefined && this.cpBusinessDetails.logoBase64 != null) {
  //     this.actionSheetCtrl.addButton({
  //       text: 'Remove', handler: () => {
  //         this.cpBusinessDetails.logoBase64 = '';
  //         this.isLogoUploaded = false

  //       }
  //     });

  //   }
  //   this.actionSheetCtrl.present();
  //   this.platform.backButton.subscribe(() => {

  //     this.actionSheetCtrl.dismiss()

  //   });
  // }

  uploadLogoDetail() {
    console.log(
      'json company logo on cp',
      JSON.stringify(this.companyLogoDetails)
    )
    this.cpLogoProvider.updateLogo(this.companyLogoDetails).subscribe(
      (res: any) => {
        if (this.removeImage == true) {
          Utility.showToast(
            this.toastCtrl,
            'Logo image removed',
            false,
            '',
            false
          )
        } else {
          Utility.showToast(
            this.toastCtrl,
            'Logo image updated successfully',
            false,
            '',
            false
          )
        }
      },
      (err) => {
        //// this.navCtrl.push(ErrorPage)
        this.url = Urls.baseUrl + Urls.port + Constants.uploadLogo
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'uploadLogoDetail'
        this.inserErrorApi()
      }
    )
  }

  async openActionSheet() {
    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.utilsProvider.getImagePromise('Camera').subscribe(
            (res: any) => {
              console.log('res', res)
  
              // this.imageURI = normalizeURL(res.imageUrl)
              this.removeImage = false
              this.companyLogoDetails.businessId = this.businessId
              this.companyLogoDetails.logoBase64 = res.base64
              this.companyLogoDetails.logoImgName = res.fileName
              this.companyLogoDetails.logoImgType = res.fileType
              this.uploadLogoDetail()
              this.isLogoUploaded = false
              this.isCoverUploaded = false
              this.openEditLogo = 'editModeOn'
              this.hideEditIcon = 'view'
  
              // console.log("company logo", this.companyLogoDetails)
            },
            (err) => {}
          )
        },
      }, {
        text: 'Gallery',
        handler: () => {
          this.utilsProvider.getImagePromise('Gallery').subscribe(
            (res: any) => {
              console.log('res', res)
  
              this.companyLogoDetails.businessId = this.businessId
              this.companyLogoDetails.logoBase64 = res.base64
              this.companyLogoDetails.logoImgName = res.fileName
              this.companyLogoDetails.logoImgType = res.fileType
              this.uploadLogoDetail()
              this.isLogoUploaded = false
              this.isCoverUploaded = false
              this.openEditLogo = 'editModeOn'
              this.hideEditIcon = 'view'
              this.removeImage = false
              console.log('company logo', this.cpBusinessDetails)
            },
            (err) => {}
          )
        },
      }, (this.companyLogoDetails.logoBase64 != '' &&
        this.companyLogoDetails.logoBase64 != undefined &&
        this.companyLogoDetails.logoBase64 != null && {
        text: 'Remove',
        handler: async () => {
          let profileModal = await this.modalCtrl.create({
            component:PopupConfirmationAlertComponent,
            componentProps: { text: Constants.areYouSureToRemovePhoto },
            cssClass: 'popupConfirmationAlert singleLineHeight' 
          })
          profileModal.present()
          if (this.platform.is('ios')) {
            this.scrollBlock = true
          }
          const {data} = await profileModal.onDidDismiss()
            if (this.platform.is('ios')) {
              this.scrollBlock = false
            }
            if (data == 'ok') {
              this.removeImage = true
              this.companyLogoDetails.logoBase64 = ''
              this.companyLogoDetails.businessId = this.businessId
              this.companyLogoDetails.logoImgName = ''
              this.companyLogoDetails.logoImgType = ''
              this.uploadLogoDetail()
              this.isLogoUploaded = false
              this.isCoverUploaded = false
              this.openEditLogo = 'editModeOn'
              this.hideEditIcon = 'view'
            }
        },
      })]
    })

    // this.actionSheetCtrl.addButton()
    // this.actionSheetCtrl.addButton()
    // if (
    //   this.companyLogoDetails.logoBase64 != '' &&
    //   this.companyLogoDetails.logoBase64 != undefined &&
    //   this.companyLogoDetails.logoBase64 != null
    // ) {
    //   this.actionSheetCtrl.addButton()
    // }
    // if (this.cpBusinessDetails.logoBase64) {
    //   actionSheetCtrl.addButton({
    //     text: 'View Image', handler: () => {
    //
    //       const imageViewer = this._imageViewerCtrl.create(this.imageToShow);
    //       imageViewer.present();
    //     }
    //   })
    // }
    this.actionSheetCtrl.present()
  }

  presentImage(myImage) {
    this.imageToShow = myImage
  }

  async uploadCover() {
    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.utilsProvider.getImagePromise('Camera').subscribe(
            (res: any) => {
              console.log('res in gallery cover', res)
  
              // this.imageURI = normalizeURL(res.imageUrl)
  
              this.coverImage = res.base64
              this.bannerImageInfo.Base64string = res.base64
              this.bannerImageInfo.FileName = res.fileName
              this.bannerImageInfo.imageURL = ''
              console.log('res in gallery cover converted', this.coverImage)
              this.isLogoUploaded = false
              this.isCoverUploaded = false
              this.openEditLogo = 'editModeOn'
              this.hideEditIcon = 'view'
              this.uploadCoverImage()
            },
            (err) => {}
          )
        },
      }, {
        text: 'Gallery',
        handler: () => {
          this.utilsProvider.getImagePromise('Gallery').subscribe(
            (res: any) => {
              console.log('res in gallery cover', res)
              this.coverImage = res.base64
              this.bannerImageInfo.Base64string = res.base64
              this.bannerImageInfo.FileName = res.fileName
              this.bannerImageInfo.imageURL = ''
              this.isLogoUploaded = false
              this.isCoverUploaded = false
              this.openEditLogo = 'editModeOn'
              this.hideEditIcon = 'view'
              this.uploadCoverImage()
            },
            (err) => {}
          )
        },
      }, (
        this.bannerImageInfo.Base64string != null &&
        this.bannerImageInfo.Base64string != undefined &&
        this.bannerImageInfo.Base64string != '' &&
        {
          text: 'Remove',
          handler: async () => {
            let profileModal = await this.modalCtrl.create({
              component:PopupConfirmationAlertComponent,
              componentProps: { text: Constants.areYouSureToRemovePhoto },
              cssClass: 'popupConfirmationAlert singleLineHeight' 
            })
            profileModal.present()
            if (this.platform.is('ios')) {
              this.scrollBlock = true
            }
            const {data} = await profileModal.onDidDismiss()
              if (this.platform.is('ios')) {
                this.scrollBlock = false
              }
              if (data == 'ok') {
                this.removeImage = true
                this.bannerImageInfo.Base64string = ''
                this.bannerImageInfo.FileName = ''
                this.bannerImageInfo.URL = ''
                this.coverImage = ''
                this.isLogoUploaded = false
                this.isCoverUploaded = false
                this.openEditLogo = 'editModeOn'
                this.hideEditIcon = 'view'
                this.uploadCoverImage()
              }
          },
      })]
    })

    // this.actionSheetCtrl.addButton()
    // this.actionSheetCtrl.addButton()
    
    this.actionSheetCtrl.present()
  }

  uploadCoverImage() {
    this.bannerImageInfo.UserId = this.userId
    this.bannerImageInfo.BusinessId = this.businessId
    console.log('req banner update', JSON.stringify(this.bannerImageInfo))
    this.cpLogoProvider.updateBannerImage(this.bannerImageInfo).subscribe(
      (res: any) => {
        console.log('cpLogoProvider.updateBannerImage res', res)
        if (this.removeImage == true) {
          Utility.showToast(
            this.toastCtrl,
            Constants.bannerRemoveSuccessfully,
            false,
            '',
            true
          )
        } else {
          Utility.showToast(
            this.toastCtrl,
            Constants.bannerUpdatedSuccessfully,
            false,
            '',
            true
          )
        }
      },
      (err) => {
        console.log('cpLogoProvider.updateBannerImage err', err)
        Utility.showToast(
          this.toastCtrl,
          Constants.someErrorOccurred,
          false,
          '',
          true
        )
        this.url = Urls.baseUrl + Urls.port + Constants.updateBanner
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'uploadCoverImage'
        this.inserErrorApi()
      }
    )
  }
  goToReferNow() {
    this.storage
      .get('userData')
      .then(async (res: any) => {
        let userinfoobj = res
        if (userinfoobj.role == Constants.clientPartner) {
          this.businessinfoobj = new businessList()
          this.businessinfoobj.businessId = this.cpBusinessDetails.businessId
          this.businessinfoobj.businessName =
            this.cpBusinessDetails.businessName
          this.businessinfoobj.userId = this.cpBusinessDetails.userId
          this.businessinfoobj.logo.logoBase64 =
            this.cpBusinessDetails.logoBase64
          this.businessinfoobj.categories = this.cpBusinessDetails.categories
          await this.navCtrl.navigateForward('ReferNowPage', { queryParams: {
            userbusinesslist: this.businessinfoobj,
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
            this.businessinfoobj = new businessList()
            this.businessinfoobj.businessId = this.cpBusinessDetails.businessId
            this.businessinfoobj.businessName =
              this.cpBusinessDetails.businessName
            this.businessinfoobj.userId = this.cpBusinessDetails.userId
            this.businessinfoobj.logo.logoBase64 =
              this.cpBusinessDetails.logoBase64
            this.businessinfoobj.categories = this.cpBusinessDetails.categories
            await this.navCtrl.navigateForward('ReferNowPage',{ queryParams:  {
              mode: 'edit',
              userbusinesslist: this.businessinfoobj,
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
      })
      .catch((err) => {})
  }

  async editService() {
    await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
      selectedItem: 'services',
      from: 'CPPage',
    }})
  }

  async editProduct() {
    await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
      selectedItem: 'products',
      from: 'CPPage',
    }})
  }

  async openProductDetails(val) {
  console.log('val', val)
    await this.navCtrl.navigateForward('ProductServiceViewPage', { queryParams: {
      productDetail: val,
      type: 'Product',
    }})
  }

  async openServiceDetails(val) {
    await this.navCtrl.navigateForward('ProductServiceViewPage', { queryParams: {
      productDetail: val,
      type: 'Service',
    }})
  }

  async addProductServices(val) {
    this.type = val
    if (val == 'Product') {
      await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
        selectedItem: 'products',
        from: 'CPPage',
      }})
    } else {
      await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
        selectedItem: 'services',
        from: 'CPPage',
      }})
    }
  }

  async editcategories() {
    console.log('in edit categories')
    this.catIdList = new Array<CategoryInfo>()
    for (let i = 0; i < this.cpBusinessDetails.categories.length; i++) {
      this.catId = this.cpBusinessDetails.categories[i].catId
      this.catIdList.push(this.catId)
    }
    await this.navCtrl.navigateForward('BusinessListing1Page', { queryParams: {
      nameOfPartner: this.cpBusinessDetails.nameofPartner,
      edit: 'editCat',
      catId: this.catIdList,
      companyTagline: this.cpBusinessDetails.tagline,
      userType: this.cpBusinessDetails.userType,
      userTypeId: this.cpBusinessDetails.userTypeId,
      companyName: this.cpBusinessDetails.businessName,
    }})
  }

  async editBusinessName() {
    this.catIdList = new Array<CategoryInfo>()
    for (let i = 0; i < this.cpBusinessDetails.categories.length; i++) {
      this.catId = this.cpBusinessDetails.categories[i].catId
      this.catIdList.push(this.catId)
    }
    await this.navCtrl.navigateForward('BusinessListing2Page', { queryParams: {
      edit: 'editName',
      catId: this.catIdList,
      nameOfPartner: this.cpBusinessDetails.nameofPartner,
      companyName: this.cpBusinessDetails.businessName,
      userType: this.cpBusinessDetails.userType,
      userTypeId: this.cpBusinessDetails.userTypeId,
      companyTagline: this.cpBusinessDetails.tagline,
  }})
  }

  async editBusinessAddress() {
    await this.navCtrl.navigateForward('BusinessListing6Page', { queryParams: {
      edit: 'editAddress',
      companyAddress: this.cpBusinessDetails.addressInfo,
    }})
  }

  async editBusinessDescription() {
    this.showAddDescription = false
    await this.navCtrl.navigateForward('BusinessListing7Page', { queryParams: {
      edit: 'editDescription',
      companyDescription: this.cpBusinessDetails.businessDescription,
    }})
  }

  async editBusinessUrl() {
    await this.navCtrl.navigateForward('BusinessListing8Page', { queryParams: {
      edit: 'editUrl',
      companyUrl: this.cpBusinessDetails.websiteUrl,
    }})
  }

  async editBusinessTagline() {
    this.catIdList = new Array<CategoryInfo>()
    for (let i = 0; i < this.cpBusinessDetails.categories.length; i++) {
      this.catId = this.cpBusinessDetails.categories[i].catId
      this.catIdList.push(this.catId)
    }
    await this.navCtrl.navigateForward('BusinessListing3Page', { queryParams: {
      nameOfPartner: this.cpBusinessDetails.nameofPartner,
      edit: 'editTagline',
      catId: this.catIdList,
      companyName: this.cpBusinessDetails.businessName,
      companyTagline: this.cpBusinessDetails.tagline,
      userType: this.cpBusinessDetails.userType,
      userTypeId: this.cpBusinessDetails.userTypeId,
    }})
  }
  async editNameOfPartner() {
    this.catIdList = new Array<CategoryInfo>()
    for (let i = 0; i < this.cpBusinessDetails.categories.length; i++) {
      this.catId = this.cpBusinessDetails.categories[i].catId
      this.catIdList.push(this.catId)
    }
    if (this.cpBusinessDetails.userType == 'PartnerShipFirm') {
      await this.navCtrl.navigateForward('BusinessListing11Page', { queryParams: {
        nameOfPartner: this.cpBusinessDetails.nameofPartner,
        edit: 'editNameOfPartner',
        catId: this.catIdList,
        companyName: this.cpBusinessDetails.businessName,
        userType: this.cpBusinessDetails.userType,
        userTypeId: this.cpBusinessDetails.userTypeId,
        companyTagline: this.cpBusinessDetails.tagline,
      }})
    } else if (this.cpBusinessDetails.userType == 'LLP') {
      await this.navCtrl.navigateForward('BusinessListing12Page', { queryParams: {
        edit: 'editNameOfPartner',
        catId: this.catIdList,
        companyName: this.cpBusinessDetails.businessName,
        userType: this.cpBusinessDetails.userType,
        userTypeId: this.cpBusinessDetails.userTypeId,
        companyTagline: this.cpBusinessDetails.tagline,
        nameOfPartner: this.cpBusinessDetails.nameofPartner,
    }})
    }
  }
  goToDashboard() {
    this.viewOtherProfile = false
    this.navCtrl.pop()
  }

  openUrl(url) {
    // const options: InAppBrowserOptions = {
    //   zoom: 'no'
    // }
    // const browser = this.iab.create(url, "_system", options)
    // browser.on(url).subscribe(val=>{
    //   console.log("cpLogoProvider.url", val)
    // })

    this.platform.ready().then(() => {
      this.url = 'https://' + url
      console.log('url', this.url)
      var inAppBrowserRef
      inAppBrowserRef = cordova.InAppBrowser.open(this.url, '_blank')
    })
  }

  showReferChange(event) {
    this.showReferNow = event
  }
  restrictEditDetails(event) {
    console.log('event restrict', event)
    console.log('partneraggrmnt', event.isPartnerAgreementAccepted)
    console.log('membership', event.isMembershipAgreementAccepted)
    if (event.isMembershipAgreementAccepted == true) {
      this.restrictEdit = false
    } else {
      this.restrictEdit = true
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
    this.logError.screen = 'ClientPartnerPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
