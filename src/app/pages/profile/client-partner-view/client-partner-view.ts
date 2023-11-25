/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/08/09        Dakshata Patil
 */

import {
  // App,
  // IonicPage,
  LoadingController,
  MenuController,
  NavController,
  IonSlides,
  ToastController,
} from '@ionic/angular'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { Component, OnInit, ViewChild } from '@angular/core'
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx'


import { CategoryInfo } from '../../../../app/models/CategoryInfo'
import { ClientPartnerInfo } from '../../../../app/models/ClientPartnerInfo'
import { Constants } from '../../../Utils/Constants'
import { Device } from '@ionic-native/device/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
// import { ImageViewerController } from 'ionic-img-viewer'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { PartnerInfo } from '../../../../app/models/PartnerInfo'
import { Platform } from '@ionic/angular'
import { ProductImageInfo } from '../../../../app/models/ProductImageInfo'
import { ProductInfo } from '../../../../app/models/CPProductInfo'
import { ReferralDataInfo } from '../../../../app/models/ReferralDataInfo'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { UserInfo } from '../../../../app/models/userInfo'
import { Utility } from '../../../Utils/Utility'
import { businessList } from '../../../../app/models/getBusinessList_res'
import { ActivatedRoute, Router } from '@angular/router'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { DashboardService } from '../../../services/dashboard.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { BusinessListingService } from '../../../services/business-listing.service'

//import { ProductServiceAddEditPage } from '../../product-service/product-service-add-edit/product-service-add-edit';
/**
 * Generated class for the ClientPartnerViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova
// // @IonicPage()
@Component({
  selector: 'page-client-partner-view',
  templateUrl: 'client-partner-view.html',
  styleUrls: ['client-partner-view.scss'],
})
export class ClientPartnerViewPage implements OnInit {
  // @ViewChild('slider') slider: IonSlides;
  @ViewChild('slider2', { static: true }) slider2: IonSlides
  segmentSlider = '0'
  segmentSlider2 = '0'
  userId: any
  showNoSerives: boolean = false
  categoryName
  showNoUrl: boolean
  productDetail: ProductInfo
  productDetailsList: ProductInfo[]
  cpBusinessDetails: ClientPartnerInfo
  type: any
  showNoDes: boolean
  showAddButton: any
  isProductOrService: boolean
  showEdit: any
  showAddUrl: boolean = false
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
  userinfoobj = new UserInfo()
  //businessId
  hidePersonalTab
  showEditIcon
  hideEditIcon
  showAdd: boolean
  showEditOther: boolean
  showReferNow: boolean
  myMentorCode
  businessinfoobj
  loading
  isKycAdded
  updatedData
  hidestat
  checkCategory
  hideInput: boolean = false
  showNoProduct: boolean = false
  kycApprovalStatus
  partnerDetails: PartnerInfo = new PartnerInfo()
  hideUrlIcon: boolean
  url
  // _imageViewerCtrl: ImageViewerController
  referBtnText: string = 'Refer now'
  hideMinDeal: boolean = true
  coverImage
  logoImage
  noTagline: boolean = false
  isTagline: boolean = false
  margin: any
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  params
  activePage
  slideOptions = {
    zoom:false,
    // autoplay:true,
    // loop:true,
    // speed:500,
    spaceBetween:10,
    // centeredSlides:true,
    // pager: true,
    slidesPerView:1.4
  }

  constructor(
    public navCtrl: NavController,
    public logErrorService: InserErrorLogService,
    private route: ActivatedRoute,
    private storage: Storage,
    private device: Device,
    public dashboardService: DashboardService,
    public businessListService: BusinessListingService,
    public toastCtrl: ToastController,
    public camera: Camera,
    public platform: Platform,
    // private app: App,
    public filePath: FilePath,
    private iab: InAppBrowser,
    private menu: MenuController,
    // imageViewerCtrl: ImageViewerController,
    public provider: UserProfileService,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {
    route.queryParams.subscribe((params: any) => {
      this.params = params
      // this._imageViewerCtrl = imageViewerCtrl
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
      this.categoriesInfo = new CategoryInfo()
      this.catIdList = new Array<CategoryInfo>()
      this.cpBusinessDetails = new ClientPartnerInfo()
      this.productDetail = new ProductInfo()
      this.productDetailsList = new Array<ProductInfo>()
      this.businessinfoobj = new businessList()
      this.myMentorCode = params.myMentorCode
      this.updatedData = params.updated
      this.businessinfoobj = params.businessinfoobj
      console.log('businessinfoobj', this.businessinfoobj)
  
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
          } else {
            if (
              this.router.url.split('?')[0] == '/ClientPartnerViewPage'
              // this.app.getActiveNav().getActive().instance instanceof
              // ClientPartnerViewPage
            ) {
              await this.navCtrl.navigateRoot('DashboardPage')
              Utility.removeInstances(ClientPartnerViewPage, this.navCtrl)
            } else {
              this.navCtrl.pop()
            }
          }
        }
      })
      if (
        device.model == 'iPhone10,3' ||
        device.model == 'iPhone10,6' ||
        device.model == 'iPhone11,8' ||
        device.model == 'iPhone11,2' ||
        device.model == 'iPhone11,6' ||
        device.model == 'iPhone11,4'
      ) {
        this.margin = 'margin'
      } else {
        this.margin = ' '
      }
      
    })
  }

  ngOnInit(): void {
    this.ionViewCanEnterNew()
  }

  ionViewCanEnterNew(): any {
    // return new Promise((resolve) => {
      this.viewOtherProfile = this.params.viewOtherProfile

      if (this.viewOtherProfile == true) {
        this.userId = this.params.userId
        this.getProfile(this.userId)
        let resp = this.getBusinessDetails()
        console.log('getProfile resp', resp)
        // resolve(resp)
      } else {
        this.storage.get('userInfo').then((val) => {
          console.log('userid', val)
          this.userId = val.userId
          let resp = this.getBusinessDetails()
          console.log('getProfile resp', resp)
          // resolve(resp)
          this.getProfile(this.userId)
        })
      }

      if (this.viewOtherProfile == true) {
        this.userId = this.params.userId
        this.getProfile(this.userId)
        let resp = this.getBusinessDetails()
        console.log('getProfile resp', resp)
        // resolve(resp)
        this.showEditIcon = ''
        this.hidestat = 'hide'
        this.hideEditIcon = 'hide'
        this.showAdd = false
        this.showEditOther = false
        //this.showReferNow = true
      } else {
        this.storage.get('userInfo').then((val) => {
          console.log('userid', val)
          this.userId = val.userId
          let resp = this.getBusinessDetails()
          console.log('getProfile resp', resp)
          // resolve(resp)
          this.getProfile(this.userId)
          this.hidestat = 'view'
        })
        if (this.myMentorCode == this.partnerDetails.ujbId) {
          this.hidePersonalTab == true
        } else {
          this.hidePersonalTab == false
        }
        this.hidePersonalTab == true
        this.showReferNow = false
        this.showEditIcon = 'editModeOn'
        this.hideEditIcon = 'view'
        this.showEditOther = true
      }
    // })
  }

  ionViewDidEnter() {}

  presentImage(myImage) {
    console.log('logo path', myImage.onerror)

    // TODO
    // const imageViewer = this._imageViewerCtrl.create(myImage)
    // imageViewer.present()
  }

  selectedSegment(i, val) {
    this.productDetailsList = new Array<ProductInfo>()

    this.slider2.slideTo(i)
    //this.slider.lockSwipes(true);
    this.type = val
    this.getProductServices()
  }

  //SegmentSlider: Change Segment Button on slide change
  selectedSlide($event) {
    // this.segmentSlider2 = $event._snapIndex.toString()
  }

  //SegmentSlider: Change Segment Button on slide change
  //edit mode for services
  async getServices() {
    await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
      mode: 'editMode',
      type: 'Service',
    }})
  }

  //edit mode for products
  async getProducts() {
    await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
      mode: 'editMode',
      type: 'Product',
    }})
  }

  //business details for cp
  async getBusinessDetails() {
    // this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    // this.loading.present()
    return new Promise((resolve) => {
      console.log('time when req business', new Date().toLocaleTimeString())
      this.dashboardService.getCpBusiness(this.userId).subscribe(
        (data: any) => {
          console.log(
            'time when res receive business',
            new Date().toLocaleTimeString()
          )
          console.log('data in ts cp', data)
          if (data != null) {
            if (data.status == 200) {
              let res = data.json.data
              this.partnerDetails.isRefer = res.isRefer
              console.log('data in ts cp 200', res)
              this.cpBusinessDetails.userId = res.userId
              this.cpBusinessDetails.businessId = res.businessId
              if (res.businessName == null) res.businessName = ''
              this.cpBusinessDetails.businessName = res.businessName
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
                this.showNoDes = true
              } else {
                this.cpBusinessDetails.businessDescription =
                  res.businessDescription
              }
              if (res.businessUrl == null || res.businessUrl == '') {
                this.showNoUrl = true
                //this.hideUrlIcon=false
              } else {
                this.cpBusinessDetails.websiteUrl = res.businessUrl
                //this.hideUrlIcon=true
              }

              if (res.businessEmail == null) res.businessEmail = ''
              this.cpBusinessDetails.rating = res.rating
              this.cpBusinessDetails.businessEmail = res.businessEmail
              if (res.businessLogo.logoBase64 == null)
                res.businessLogo.logoBase64 = this.logoImage
              if (res.businessLogo.logoImageURL)
                this.cpBusinessDetails.logoBase64 = Utility.getImageUrl(
                  res.businessLogo.logoImageURL
                ) //res.businessLogo.logoBase64

              if (res.bannerDetails) {
                if (res.bannerDetails.imageURL) {
                  this.coverImage = Utility.getImageUrl(
                    res.bannerDetails.imageURL
                  )
                }
              }

              for (let i = 0; i <= res.categories.length - 1; i++) {
                this.categoriesInfo = new CategoryInfo()
                this.categoriesInfo.catId = res.categories[i].id
                this.categoriesInfo.categoryName = res.categories[i].name

                this.cpBusinessDetails.categories.push(this.categoriesInfo)
                this.storage
                  .set(
                    'specialCategory',
                    this.cpBusinessDetails.categories[i].catId
                  )
                  .then((val) => {
                    console.log('val cate', val)
                  })
                console.log('categorylist', this.cpBusinessDetails.categories)
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
                  this.hideMinDeal = false
                }
              }
              if (res.categories[0].name != undefined) {
                this.categoryName1 = res.categories[0].name
              }

              if (res.categories[1] != undefined) {
                this.showCircle = true
                this.categoryName2 = res.categories[1].name
              }

              console.log('obj in 200', this.cpBusinessDetails)
            }
            console.log(
              'time when res bind business',
              new Date().toLocaleTimeString()
            )
          }
          if (this.loading) this.loading.dismissAll()
          resolve(data)
        },
        (err) => {
          if (this.loading) this.loading.dismissAll()
          console.log('err', err)
          resolve(false)
          this.url = Urls.baseUrl + Urls.port + Constants.getCpBusinessApi

          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'getBusinessDetails'
          this.inserErrorApi()
        }
      )
    })
  }

  //get product service list
  async getProductServices() {
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
                    productDetail.productImages.push(prodImg)
                  }
                }

                if (productDetail.productImages.length == 0) {
                  let prodImg = new ProductImageInfo()
                  prodImg.prodImgBase64 = 'assets/imgs/content-imgs/intro-1.jpg'
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
          console.log('errpr', err)
          this.url = Urls.baseUrl + Urls.port + Constants.getProductOrService
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'getProductService'
          this.inserErrorApi()
          // Utility.showToast(this.toastCtrl, "NO " + this.type + " added", false, "")
        }
      )
  }

  async viewBusinessStat() {
    await this.navCtrl.navigateForward('ComingSoonPage')
  }

  //open camera to edit logo n cover image
  openEditMode() {
    console.log('open edit mode')
    this.openEditLogo = 'editModeOn'
  }

  backToDashboard() {
    this.navCtrl.pop()
  }

  //get mentor code and my mentor code
  getProfile(id) {
    console.log('getprofile id', id)
    console.log('time when req', new Date().toLocaleTimeString())
    this.provider.getProfile(id).subscribe(
      (res: any) => {
        console.log('time when responce', new Date().toLocaleTimeString())

        this.partnerDetails.ujbId = res.json.data.userInfo.mentorCode
        this.partnerDetails.myMentorCode = res.json.data.userInfo.myMentorCode
        this.partnerDetails.isPartnerAgreementAccepted =
          res.json.data.userInfo.isPartnerAgreementAccepted
        //this.partnerDetails.isMembershipAgreementAccepted = res.json.data.userInfo.isMembershipAgreementAccepted
        // this.partnerDetails.isRefer = res.json.data.isRefer

        /* if (this.partnerDetails.isPartnerAgreementAccepted == true && this.partnerDetails.isMembershipAgreementAccepted == true) {
        this.showReferNow = true
      } else {
        this.showReferNow = false
      } */
        console.log('time when res bind', new Date().toLocaleTimeString())
      },
      (err) => {
        this.url = Urls.baseUrl + Urls.port + Constants.getUserProfile
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getProfile'
        this.inserErrorApi()
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }

  //redirects refer now page
  goToReferNow() {
    // // this.navCtrl.push(ReferNowPage,{"userbusinesslist":this.businessinfoobj,"fName":this.userinfoobj.firstName, "lName":this.userinfoobj.lastName})

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
            await this.navCtrl.navigateForward('ReferNowPage', { queryParams: {
              userbusinesslist: this.businessinfoobj,
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
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  async editService() {
    await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
      mode: 'editMode',
      type: 'Service',
    }})
  }

  async editProduct() {
    await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
      mode: 'editMode',
      type: 'Product',
    }})
  }

  async openProductDetails(val) {
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

  async addProductServices() {
    await this.navCtrl.navigateForward('ProductServiceAddEditPage')
  }

  async editcategories() {
    console.log('in edit categories')
    for (let i = 0; i < this.cpBusinessDetails.categories.length; i++) {
      this.catId = this.cpBusinessDetails.categories[i].catId
      this.catIdList.push(this.catId)
    }
    await this.navCtrl.navigateForward('BusinessListing1Page', { queryParams: {
      edit: 'editCat',
      catId: this.catIdList,
      companyTagline: this.cpBusinessDetails.tagline,
    }})
  }

  async editBusinessName() {
    await this.navCtrl.navigateForward('BusinessListing2Page', { queryParams: {
      edit: 'editName',
      companyName: this.cpBusinessDetails.businessName,
    }})
  }

  async editBusinessAddress() {
    await this.navCtrl.navigateForward('BusinessListing6Page', { queryParams: {
      edit: 'editAddress',
      companyAddress: this.cpBusinessDetails.addressInfo,
    }})
  }

  async editBusinessDescription() {
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
    for (let i = 0; i < this.cpBusinessDetails.categories.length; i++) {
      this.catId = this.cpBusinessDetails.categories[i].catId
      this.catIdList.push(this.catId)
    }
    await this.navCtrl.navigateForward('BusinessListing3Page', { queryParams: {
      edit: 'editTagline',
      catId: this.catIdList,
      companyTagline: this.cpBusinessDetails.tagline,
    }})
  }

  openUrl(url) {
    this.platform.ready().then(() => {
      this.url = 'https://' + url
      console.log('url', this.url)
      var inAppBrowserRef
      inAppBrowserRef = cordova.InAppBrowser.open(this.url, '_blank')
    })
    /*     const options: InAppBrowserOptions = {
          hidenavigationbuttons: 'no',
          location: 'no'
        }
        const browser = this.iab.create(url, "_system", options)
        browser.close(); */
  }

  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'ClientPartnerViewPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
