/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *
 *     API Integration:        2019/07/24       Yogesh Chavan
 *     update all field        2019/08/13       Yogesh Chavan
 */

import * as $ from 'jquery'

import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import { Component, ViewChild, OnInit } from '@angular/core'
import {
  IonSelect,
  // IonicPage,
  MenuController,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular'
import {
  Location,
  PartnerInfo,
  PreferredLocations,
  UserOtherDetails,
} from '../../../../app/models/PartnerInfo'
import { ProfilePhotoInfo, UserInfo } from '../../../../app/models/userInfo'

import { ActionSheetController } from '@ionic/angular'
// import { App } from '@ionic/angular/components/app/app'
import { CallNumber } from '@ionic-native/call-number/ngx'
import { Constants } from '../../../Utils/Constants'
import { EditEmailComponent } from '../../../../app/components/popups/edit-email/edit-email'
import { EditGuestNameComponent } from '../../../../app/components/popups/edit-guest-name/edit-guest-name'
import { EditMobileNumberComponent } from '../../../../app/components/popups/edit-mobile-number/edit-mobile-number'
import { File } from '@ionic-native/file/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
// import { ImageViewerController } from 'ionic-img-viewer'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { PopupBooleanYesNoComponent } from '../../../../app/components/popups/popup-boolean-yes-no/popup-boolean-yes-no'
import { PopupConfirmationAlertComponent } from '../../../../app/components/popups/popup-confirmation-alert/popup-confirmation-alert'
import { SingleInputPopupComponent } from '../../../../app/components/popups/single-input-popup/single-input-popup'
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { ActivatedRoute, Router } from '@angular/router'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { DashboardService } from '../../../services/dashboard.service'

//import { ViewChild } from '@angular/core/src/metadata/di';

/**
 * Generated class for the PartnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// // @IonicPage()
@Component({
  selector: 'page-partner',
  templateUrl: 'partner.html',
  styleUrls: ['partner.scss'],
})
export class PartnerPage implements OnInit {
  @ViewChild('select1', { static: false }) select1: IonSelect
  viewSeet: boolean = false
  userId: any
  userinfoobj = new UserInfo()
  ujb_link: any
  mentorUserInfo: UserInfo[]
  connectorUserInfo: UserInfo[]
  userinfoconnectobj = new UserInfo()
  userprofileobj: UserInfo
  userprofilelist: UserInfo[]
  firstconnects: UserInfo[]
  connectCounters: any
  countofconnects: any
  dashBoardActive: any
  profileActive: any
  connect_text_class: any
  moreMenuActive
  removeImage
  activePage: string
  editHobbies: boolean = false
  editMaritalStatus: boolean = false
  base64Image: string = ''
  loading
  //showBlock:any
  zoomImage: boolean = true
  // _imageViewerCtrl: ImageViewerController
  partnerDetails: PartnerInfo = new PartnerInfo()
  userOtherDetails: UserOtherDetails = new UserOtherDetails()
  locationDetail: Location = new Location()
  localitiesDetail: PreferredLocations = new PreferredLocations()
  localities: string = ''
  adderes: string = ''
  viewOtherProfile
  viewProfile = 'hide'
  actionSheetCtrl
  maritalStaus: any = ['Single', 'Married', 'Divorced']
  isConnectors: boolean = false
  stateName: string
  countryName: string
  selectOption
  showOptions: boolean = false
  showList: boolean = true
  borderBottom: string = 'border-bottom'
  scrollBlock: any
  showBlock: any
  mobileNumber
  message: string = ''
  bypassAppChooser: boolean = false
  url: string = ''
  restrictEdit: boolean = false
  image: string = 'null'
  flagContact: boolean = false
  showContact: boolean = false
  profilePhoto: ProfilePhotoInfo = new ProfilePhotoInfo()
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  method
  params

  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public platform: Platform,
    public logErrorService: InserErrorLogService,
    public actionSheet: ActionSheetController,
    public camera: Camera,
    public imgService: CommonUtilsService,
    public filePath: FilePath,
    public file: File,
    private storage: Storage,
    private socialSharing: SocialSharing,
    private callNumber: CallNumber,
    public loadingCtrl: LoadingController,
    public provider: UserProfileService,
    public dashboardService: DashboardService,
    // private imageViewerCtrl: ImageViewerController,
    private modalCtrl: ModalController,
    // public app: App,
    public toastCtrl: ToastController,
    public menu: MenuController,
    private router: Router
  ) {
    route.queryParams.subscribe((params: any) => {
      this.params = params
      this.showBlock = 'hide'
      this.profilePhoto = new ProfilePhotoInfo()
      console.log('steps toexecute')
      console.log('constructor starts')
      this.scrollBlock = false
      this.showBlock = 'hide'
      this.mentorUserInfo = new Array<UserInfo>()
      this.connectorUserInfo = new Array<UserInfo>()
      this.userprofilelist = new Array<UserInfo>()
      this.firstconnects = new Array<UserInfo>()
      this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
      this.partnerDetails.location = this.locationDetail
  
      this.partnerDetails.otherDetails = this.userOtherDetails
      this.partnerDetails.localities = this.localitiesDetail
      // this._imageViewerCtrl = imageViewerCtrl
  
      console.log('befor back button constructor 123ends')
  
      this.platform.backButton.subscribe(async () => {
        const getOpen: any = await this.menu.getOpen()
        if (getOpen) {
          //console.log("menu open", getOpen.isOpen)
          if (getOpen.isOpen == true) {
            this.menu.close()
            //this.registerBackButton()
          }
        } else {
          this.onBackPressed()
        }
      })
      console.log('constructor ends')
      this.getuserInfo()
  
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
      this.flagContact = params.flagContact
      if (this.flagContact == true) {
        this.showContact = true
      } else {
        this.showContact = false
      }
    })
  }

  ionViewCanEnterNew(): any {
    console.log('enter view can enter')
    // return new Promise((resolve) => {
      this.storage
        .get('userInfo')
        .then((val) => {
          this.userId = val.userId
          this.profilePhoto.userId = this.userId
          //let conneectorData = this.params.data')
          this.viewOtherProfile = this.params.viewOtherProfile
          console.log('this.viewOtherProfile', this.viewOtherProfile)
          if (this.viewOtherProfile == true) {
            this.userId = this.params.userId
          } else {
            this.mentorUserInfo = new Array<UserInfo>()
            this.connectorUserInfo = new Array<UserInfo>()
            this.userprofilelist = new Array<UserInfo>()
            this.firstconnects = new Array<UserInfo>()
          }
          //console.log("this.getMentorsList()", this.getMentorsList());
          let resp = this.getProfile(this.userId)
          console.log('getProfile resp', resp)
          // resolve(resp)
          console.log('this.getMentorsList()', this.getMentorsList())
          if (this.viewOtherProfile == true) {
            this.viewProfile = 'hide'
            this.userId = this.params.userId
            this.isConnectors = true
            this.borderBottom = ''
            console.log('enter view can enter ge userId')
          } else {
            this.activePage = 'Profile'
            console.log('enter view can enter get user id else')
            this.mentorUserInfo = new Array<UserInfo>()
            this.connectorUserInfo = new Array<UserInfo>()
            this.userprofilelist = new Array<UserInfo>()
            this.firstconnects = new Array<UserInfo>()
            this.viewProfile = 'view'
          }
        })
        .catch((err) => {
          // resolve(false)
        })
      console.log('enter view can enter ends')
    // })
  }

  // ionViewWillEnter() {
  //   this.storage.get('userInfo').then((val) => {
  //     this.userId = val.userId
  //     //let conneectorData = this.params.data')
  //     this.viewOtherProfile = this.navParams.get("viewOtherProfile")
  //     if (this.viewOtherProfile == true) {
  //       this.viewProfile = 'hide'
  //       this.userId = this.navParams.get("userId")
  //       this.getMentorsList();
  //       this.getProfile(this.userId)
  //       this.isConnectors = true
  //     }
  //     else {
  //       this.mentorUserInfo = new Array<UserInfo>()
  //       this.connectorUserInfo = new Array<UserInfo>()
  //       this.userprofilelist = new Array<UserInfo>()
  //       this.firstconnects = new Array<UserInfo>()
  //       this.viewProfile = 'view'
  //       this.getMentorsList()
  //       this.getProfile(this.userId)
  //     }
  //   })

  // }

  ngOnInit() {
    console.log('ngOnInit PartnerPage')
    this.ionViewCanEnterNew()
  }

  async gotoConnectlist() {
    await this.navCtrl.navigateForward('CommunityPage', { queryParams: {
      usermentorinfolist: this.mentorUserInfo,
      userconnectinfolist: this.connectorUserInfo,
    }})
  }

  async openProfileConnect(userInfoObj) {
    this.flagContact = true
    this.viewOtherProfile = true
    if (userInfoObj.myMentorCode != Constants.UjbPartnerMentorCode) {
      if (userInfoObj.role == 'Partner') {
        await this.navCtrl.navigateForward('PartnerPage', { queryParams: {
          userId: userInfoObj.userId,
          viewOtherProfile: this.viewOtherProfile,
          flagContact: this.flagContact,
        }})
      } else if (userInfoObj.role == Constants.clientPartner) {
        await this.navCtrl.navigateForward('ClientPartnerPage', { queryParams: {
          KYCAdded: this.userinfoobj.isKycAdded,
          KYCApprovalStatus: this.userinfoobj.kycApprovalStatus,
          userId: userInfoObj.userId,
          viewOtherProfile: this.viewOtherProfile,
          flagContact: this.flagContact,
        }})
      }
    } else {
      await this.navCtrl.navigateForward('CommunityPage', { queryParams: {
        usermentorinfolist: this.mentorUserInfo,
        userconnectinfolist: this.connectorUserInfo,
      }})
    }
  }

  async openProfileMentor(userInfoObj) {
    this.flagContact = true
    if (userInfoObj.myMentorCode != Constants.UjbPartnerMentorCode) {
      this.viewOtherProfile = true
      if (userInfoObj.role == 'Partner') {
        await this.navCtrl.navigateForward('PartnerPage', { queryParams: {
          userId: userInfoObj.userId,
          viewOtherProfile: this.viewOtherProfile,
          flagContact: this.flagContact,
        }})
      } else if (userInfoObj.role == Constants.clientPartner) {
        await this.navCtrl.navigateForward('ClientPartnerPage', { queryParams: {
          KYCAdded: this.userinfoobj.isKycAdded,
          KYCApprovalStatus: this.userinfoobj.kycApprovalStatus,
          userId: userInfoObj.userId,
          viewOtherProfile: this.viewOtherProfile,
          flagContact: this.flagContact,
        }})
      }
    } else {
      await this.navCtrl.navigateForward('CommunityPage', { queryParams: {
        usermentorinfolist: this.mentorUserInfo,
        userconnectinfolist: this.connectorUserInfo,
      }})
    }
  }

  getMentorsList() {
    return new Promise((resolve) => {
      this.provider.getconnectors(this.userId).subscribe(
        (res: any) => {
          this.showBlock = 'hide'
          if (res != null) {
            if (res.status == 200) {
              let data = res.json.data
              this.userinfoobj = new UserInfo()
              for (let i = 0; i < data.mentorUserInfo.length; i++) {
                //this.userinfoobj.base64Image = data.mentorUserInfo[0].base64Image;
                if (data.mentorUserInfo[0].imageURL)
                  this.userinfoobj.base64Image = Utility.getImageUrl(
                    data.mentorUserInfo[0].imageURL
                  )

                this.userinfoobj.role = data.mentorUserInfo[0].role
                this.userinfoobj.firstName = data.mentorUserInfo[0].firstName
                //console.log("e", this.userinfoobj.firstName)
                this.userinfoobj.lastName = data.mentorUserInfo[0].lastName
                this.userinfoobj.mobileNumber =
                  data.mentorUserInfo[0].mobileNumber
                this.userinfoobj.myMentorCode =
                  data.mentorUserInfo[0].myMentorCode
                this.userinfoobj.mentorCode = data.mentorUserInfo[0].mentorCode
                this.userinfoobj.userId = data.mentorUserInfo[0]._id
                this.mentorUserInfo.push(this.userinfoobj)
              }

              if (data.connectorUserInfo != null) {
                for (let i = 0; i < data.connectorUserInfo.length; i++) {
                  this.userinfoconnectobj = new UserInfo()
                  if (data.connectorUserInfo[i].imageURL)
                    this.userinfoconnectobj.base64Image = Utility.getImageUrl(
                      data.connectorUserInfo[i].imageURL
                    )
                  this.userinfoconnectobj.role = data.connectorUserInfo[i].role
                  this.userinfoconnectobj.firstName =
                    data.connectorUserInfo[i].firstName
                  //console.log("e", this.userinfoconnectobj.firstName)
                  this.userinfoconnectobj.lastName =
                    data.connectorUserInfo[i].lastName
                  this.userinfoconnectobj.mobileNumber =
                    data.connectorUserInfo[i].mobileNumber
                  this.userinfoconnectobj.myMentorCode =
                    data.connectorUserInfo[i].myMentorCode
                  this.userinfoconnectobj.mentorCode =
                    data.connectorUserInfo[i].mentorCode
                  this.userinfoconnectobj.userId = data.connectorUserInfo[i]._id
                  this.connectorUserInfo.push(this.userinfoconnectobj)
                  if (i < 3) {
                    this.firstconnects.push(this.userinfoconnectobj)
                  }
                }
              }
              this.countofconnects = this.connectorUserInfo.length - 3
              if (this.countofconnects > 0) {
                this.connectCounters = 'view'
              } else {
                this.connect_text_class = 'hide'
                this.connectCounters = 'hide'
              }

              console.log('a', this.countofconnects)
            } else {
              resolve(false)
            }
            resolve(true)
          } else {
            resolve(false)
          }
        },
        (err) => {
          console.log('err', err)
          if (err.message == 500) {
            this.showBlock = 'hide'
          }
          resolve(false)
          this.connectCounters = 'hide'
          this.showBlock = 'view'
          this.url = Urls.baseUrl + Urls.port + Constants.getConnectors
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'getMentorsList'
          this.inserErrorApi()
        }
      )
    })
  }

  async openMyCommunity() {
    await this.navCtrl.navigateForward('CommunityPage')
  }

  async openBusinessStat() {
    await this.navCtrl.navigateForward('ReferralsGivenPage', { queryParams: { segmentSlider: 'referral' }})
  }

  /**
   * gets an image from camera/gallery
   */
  async addImage() {
    this.zoomImage = false
    this.viewSeet = true
    console.log('this.profilePhoto.ImageBase64', this.profilePhoto.ImageBase64)
    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [
        {
          text: 'Gallery',
          handler: () => {
            console.log('backend galery')
            this.imgService.getImagePromise('Gallery').subscribe((res: any) => {
              console.log('backend gal res', res)
              this.base64Image = res.base64
              this.profilePhoto.ImageBase64 = res.base64
              this.profilePhoto.FileName = res.fileName
              this.profilePhoto.ImageURL = ''
              this.removeImage = false
              this.updateImage()
              console.log(' this.base64Image', this.base64Image)
            })
          },
        },
        {
          text: 'Camera',
          handler: () => {
            this.imgService.getImagePromise('Camera').subscribe(
              (res: any) => {
                console.log('cam backend gal res', res)
                this.base64Image = res.base64
                this.profilePhoto.ImageBase64 = res.base64
                this.profilePhoto.FileName = res.fileName
                this.profilePhoto.ImageURL = ''
                this.removeImage = false
                this.updateImage()
                console.log('cam this.base64Image', this.base64Image)
              },
              (err) => {
                console.log('err', err)
              }
            )
          },
        }, (
          this.profilePhoto.ImageBase64 != null &&
          this.profilePhoto.ImageBase64 != undefined &&
          this.profilePhoto.ImageBase64 != '' && {
            text: 'Remove',
            handler: async () => {
              let profileModal = await this.modalCtrl.create({
                component: PopupConfirmationAlertComponent,
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
                  this.profilePhoto.ImageBase64 = ''
                  this.profilePhoto.FileName = ''
                  this.updateImage()
                }
            },
          }
        )
      ],
    })
    // console.log('this.profilePhoto.ImageBase64', this.profilePhoto.ImageBase64)
    // if (
    //   this.profilePhoto.ImageBase64 != null &&
    //   this.profilePhoto.ImageBase64 != undefined &&
    //   this.profilePhoto.ImageBase64 != ''
    // ) {
    //   this.actionSheetCtrl.addButton()
    // }
    this.actionSheetCtrl.present()
    /*     this.platform.backButton.subscribe(() => {
          console.log("partner")
          if (this.actionSheetCtrl)
            this.actionSheetCtrl.dismiss()
          else
            await this.navCtrl.navigateRoot('DashboardPage')
    }); */
  }

  showEditMaritalStatus() {
    //this.showOptions=true
    this.select1.open()
  }
  getuserInfo() {
    this.dashboardService.getUserInfoApi(this.userId).subscribe(
      (res: any) => {
        if (res != null) {
          if (res.status == 200) {
            let data = res.json.data

            this.userinfoobj.kycApprovalStatus = data.kycApprovalStatus
            console.log('d', this.userinfoobj.kycApprovalStatus)
            this.userinfoobj.isKycAdded = data.isKycAdded
          } else {
            // this.getStorageUserStat()
          }
        }
      },
      (err) => {
        // this.getStorageUserStat()
        console.log('err', err)
        this.url = Urls.baseUrl + Urls.port + Constants.getUserInfoApi
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getuserInfo'
        this.inserErrorApi()
      }
    )
  }

  async getProfile(id) {
    return new Promise(async (resolve) => {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.loading.present()
      this.provider.getProfile(id).subscribe((res: any) => {
        console.log('profile', res)
        if (this.loading) this.loading.dismiss()
        if (res.json.data.stateName) this.stateName = res.json.data.stateName
        this.countryName = res.json.data.countryName
        console.log('state', this.stateName)
        console.log('country', this.countryName)
        this.partnerDetails = new PartnerInfo()
        this.partnerDetails.emailId = res.json.data.userInfo.emailId
        this.partnerDetails.ujbId = res.json.data.userInfo.myMentorCode
        this.partnerDetails.firstName = res.json.data.userInfo.firstName
        this.partnerDetails.lastName = res.json.data.userInfo.lastName
        this.partnerDetails.passiveIncome = res.json.data.userInfo.passiveIncome
        this.partnerDetails.gender = res.json.data.userInfo.gender
        this.partnerDetails.isPartnerAgreementAccepted =
          res.json.data.userInfo.isPartnerAgreementAccepted
        //this.partnerDetails.isMembershipAgreementAccepted = res.json.data.userInfo.isMembershipAgreementAccepted
        if (this.partnerDetails.isPartnerAgreementAccepted == true) {
          this.restrictEdit = false
        } else {
          this.restrictEdit = true
        }
        this.partnerDetails.birthDate = res.json.data.userInfo.birthDate
        this.partnerDetails.countryCode = res.json.data.userInfo.countryCode
        this.partnerDetails.mobileNumber = res.json.data.userInfo.mobileNumber

        //this.profilePhoto.ImageBase64 = res.json.data.userInfo.base64Image
        if (res.json.data.userInfo.imageURL)
          this.profilePhoto.ImageBase64 = Utility.getImageUrl(
            res.json.data.userInfo.imageURL
          )
        this.profilePhoto.ImageURL = res.json.data.userInfo.imageURL
        this.profilePhoto.FileName = res.json.data.userInfo.fileName

        this.partnerDetails.knowledgeSource =
          res.json.data.userInfo.knowledgeSource
        //this.partnerDetails.organisationType = res.json.data.userInfo.organisationType
        this.partnerDetails.userType = res.json.data.userInfo.userType
        this.partnerDetails.countryId = res.json.data.userInfo.countryId
        this.partnerDetails.stateId = res.json.data.userInfo.stateId

        if (res.json.data.userOtherDetails) {
          this.userOtherDetails = new UserOtherDetails()
          this.userOtherDetails.aboutMe = res.json.data.userOtherDetails.aboutMe //
          this.userOtherDetails.hobbies = res.json.data.userOtherDetails.hobbies //
          this.userOtherDetails.areaOfInterest =
            res.json.data.userOtherDetails.areaOfInterest //
          this.userOtherDetails.canImpartTraining =
            res.json.data.userOtherDetails.canImpartTraining //
          this.userOtherDetails.maritalStatus =
            res.json.data.userOtherDetails.maritalStatus //
          this.partnerDetails.otherDetails = this.userOtherDetails
        }
        if (res.json.data.userInfo.address) {
          this.partnerDetails.location = new Location()
          this.locationDetail.flatWing = res.json.data.userInfo.address.flatWing
          this.locationDetail.locality = res.json.data.userInfo.address.locality
          this.locationDetail.location = res.json.data.userInfo.address.location
          this.partnerDetails.location = this.locationDetail
          this.adderes = ''
          if (this.locationDetail.flatWing) {
            this.adderes += this.locationDetail.flatWing + ', ' + ' '
          }
          if (this.locationDetail.locality) {
            this.adderes += this.locationDetail.locality + ', ' + ' '
          }
        }
        if (res.json.data.userInfo.preferredLocations) {
          this.partnerDetails.localities = new PreferredLocations()
          this.localitiesDetail.location1 =
            res.json.data.userInfo.preferredLocations.location1
          this.localitiesDetail.location2 =
            res.json.data.userInfo.preferredLocations.location2
          this.localitiesDetail.location3 =
            res.json.data.userInfo.preferredLocations.location3
          this.partnerDetails.localities = this.localitiesDetail
          this.localities = ' '
          if (
            this.localitiesDetail.location1 &&
            !this.localitiesDetail.location2 &&
            !this.localitiesDetail.location3
          ) {
            this.localities += ' ' + this.localitiesDetail.location1 + ' '
          } else {
            if (
              this.localitiesDetail.location1 &&
              (this.localitiesDetail.location2 ||
                this.localitiesDetail.location3)
            ) {
              this.localities += ' ' + this.localitiesDetail.location1
            }

            if (
              this.localitiesDetail.location2 &&
              (this.localitiesDetail.location1 ||
                this.localitiesDetail.location3)
            ) {
              this.localities +=
                ' ' + ',' + ' ' + this.localitiesDetail.location2
            }
            if (
              this.localitiesDetail.location3 &&
              (this.localitiesDetail.location1 ||
                this.localitiesDetail.location2)
            ) {
              this.localities +=
                ' ' + ',' + ' ' + this.localitiesDetail.location3
            }
          }
        }
        resolve(res)
      }),
        (err) => {
          if (this.loading) this.loading.dismiss()
          console.log('err', err)
          resolve(false)
          this.url = Urls.baseUrl + Urls.port + Constants.getUserProfile
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'getProfile'
          this.inserErrorApi()
        }
    })
  }
  openonApp() {
    this.mobileNumber = '+91' + this.partnerDetails.mobileNumber
    this.socialSharing
      .shareViaWhatsAppToReceiver(
        this.mobileNumber,
        this.message,
        this.image,
        this.url
      )
      .then(() => {})
      .catch(() => {})
  }

  gotoKeypad() {
    this.callNumber
      .callNumber(
        this.partnerDetails.countryCode + this.partnerDetails.mobileNumber,
        this.bypassAppChooser
      )
      .then((res: any) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err))
  }

  /*   viewImage(imageToView) {
      if (this.profilePhoto.ImageBase64 && this.zoomImage) {
        const imageViewer = this._imageViewerCtrl.create(imageToView);
        imageViewer.present();
      }
    } */

  async editData(data) {
    switch (data) {
      case 'Name':
        let nameInput = {
          title: 'Name ',
          firstName: this.partnerDetails.firstName,
          lastName: this.partnerDetails.lastName,
          validation: 'required',
          type: 'Name',
        }
        this.openNamePopup(nameInput)
        break
      case 'BirthDate':
        await this.navCtrl.navigateForward('Questionnaire2Page', { queryParams: {
          birthDate: this.partnerDetails.birthDate,
          referrer: 'PartnerPage',
        }})
        break

      case 'Gender':
        await this.navCtrl.navigateForward('Questionnaire1Page', { queryParams: {
          gender: this.partnerDetails.gender,
          referrer: 'PartnerPage',
        }})
        break

      case 'AreYou':
        let data
        if (this.partnerDetails.organisationType == 'Individual') {
          data = {
            type: 'Individual',
            value: '1',
          }
        } else if (this.partnerDetails.organisationType == 'Company') {
          data = {
            type: 'Company',
            value: '2',
          }
        } else if (this.partnerDetails.organisationType == 'Other') {
          data = {
            type: 'Other',
            value: '3',
          }
        } else {
          data = {
            type: '',
            value: '0',
          }
        }
        await this.navCtrl.navigateForward('Questionnaire6Page', { queryParams: {
          data: data,
          referrer: 'PartnerPage',
          userType: this.partnerDetails.userType,
        }})
        break

      case 'KnowledgeSource':
        await this.navCtrl.navigateForward('Questionnaire4Page', { queryParams: {
          data: this.partnerDetails.knowledgeSource,
          referrer: 'PartnerPage',
        }})
        break

      case 'PassiveIncome':
        await this.navCtrl.navigateForward('Questionnaire9Page', { queryParams: {
          data: this.partnerDetails.passiveIncome,
          referrer: 'PartnerPage',
        }})
        break

      case 'Location':
        await this.navCtrl.navigateForward('Questionnaire3Page', { queryParams: {
          flatWing: this.locationDetail.flatWing,
          locality: this.locationDetail.locality,
          location: this.locationDetail.location,
          countryName1: this.countryName,
          searchTerm: this.stateName,
          stateId: this.partnerDetails.stateId,
          countryCode: this.partnerDetails.countryId,
          referrer: 'PartnerPage',
          editLocation: 'editLocation',
        }})
        break

      case 'Localities':
        await this.navCtrl.navigateForward('Questionnaire8Page', { queryParams: {
          locality1: this.localitiesDetail.location1,
          locality2: this.localitiesDetail.location2,
          locality3: this.localitiesDetail.location3,
          referrer: 'PartnerPage',
        }})
        break

      case 'AboutMe':
        let values = {
          title: 'Edit Description',
          value: this.userOtherDetails.aboutMe,
          validation: 'required',
          type: 'AboutMe',
          message: ' Description',
        }
        this.openSingleInputPopup(values)
        break

      case 'Hobbies':
        let Hobbies = {
          title: ' Edit Hobbies',
          value: this.userOtherDetails.hobbies,
          validation: 'required',
          type: 'Hobbies',
          message: ' Hobbies',
        }
        this.openSingleInputPopup(Hobbies)
        break

      case 'AreaOfInterest':
        let AreaOfInterest = {
          title: 'Area of Interest',
          value: this.userOtherDetails.areaOfInterest,
          validation: 'required',
          type: 'AreaOfInterest',
          message: ' Area of Interest',
        }
        this.openSingleInputPopup(AreaOfInterest)
        break

      case 'CanImpartTraining':
        let CanImpartTraining = {
          title: 'Can Impart Training?',
          value: this.partnerDetails.otherDetails.canImpartTraining,
          validation: 'required',
          type: 'CanImpartTraining',
          message: '  Training info',
        }
        this.openBooleanPopup(CanImpartTraining)
        break

      case 'EmailId':
        let EmailId = {
          title: 'Email',
          value: this.partnerDetails.emailId,
          validation: 'required',
          type: 'Email',
        }
        this.openEmailPopup(EmailId)
        break

      case 'MobileNumber':
        let MobileNumber = {
          title: 'Mobile',
          value: this.partnerDetails.mobileNumber,
          countryCode: this.partnerDetails.countryCode,
          validation: 'required',
          type: 'Mobile',
        }
        this.openMobilePopup(MobileNumber)
        break

      default:
        break
    }
  }
  backToDashboard() {
    this.navCtrl.pop()
  }
  //Modal popup with Mobile input
  async openMobilePopup(obj) {
    let mobileInput = await this.modalCtrl.create({
      component: EditMobileNumberComponent,
      componentProps: { obj, isReffere: true, formPartner: true },
      cssClass: 'editSingleInput ujb_theme' 
    })
    mobileInput.present()
    if (this.platform.is('ios')) {
      this.scrollBlock = true
    }

    const {data} = await  mobileInput.onDidDismiss()
      if (this.platform.is('ios')) {
        this.scrollBlock = false
      }
      if (data == 'updated') {
        this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
        this.getProfile(this.userId)
      }
  }

  async goToReferralGiven() {
    await this.navCtrl.navigateForward('ComingSoonPage')
  }

  //Modal popup with Single Input
  async openSingleInputPopup(obj) {
    let editSingleInput = await this.modalCtrl.create({
      component:SingleInputPopupComponent,
      componentProps: { obj },
      cssClass: 'editSingleInput ujb_theme' 
    })
    editSingleInput.present()
    if (this.platform.is('ios')) {
      this.scrollBlock = true
    }
    const {data} = await editSingleInput.onDidDismiss()
      //
    if (this.platform.is('ios')) {
      this.scrollBlock = false
    }
    if (data == 'updated') {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.getProfile(this.userId)
    }
  }

  //Modal popup with Boolean input
  async openBooleanPopup(obj) {
    let booleanInput = await this.modalCtrl.create({
      component:PopupBooleanYesNoComponent,
      componentProps: { obj },
      cssClass: 'editBooleanPopup ujb_theme' 
    })
    booleanInput.present()
    if (this.platform.is('ios')) {
      this.scrollBlock = true
    }

    const {data}: any = await booleanInput.onDidDismiss()
    console.log(data)
    if (this.platform.is('ios')) {
      this.scrollBlock = false
    }
    if (data == 'updated') {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.getProfile(this.userId)
    }
  }

  //Modal popup with Name input
  async openNamePopup(obj) {
    let nameInput = await this.modalCtrl.create({
      component:EditGuestNameComponent,
      componentProps: { obj },
      cssClass: 'editGuestName ujb_theme' 
    })
    nameInput.present()
    if (this.platform.is('ios')) {
      this.scrollBlock = true
    }
    const {data} = await nameInput.onDidDismiss()
      if (this.platform.is('ios')) {
        this.scrollBlock = false
      }
      if (data == 'updated') {
        this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
        this.getProfile(this.userId)
      }
  }

  //Modal popup with Mobile input

  //Modal popup with Email input
  async openEmailPopup(obj) {
    let emailInput = await this.modalCtrl.create({
      component: EditEmailComponent,
      componentProps: { obj },
      cssClass: 'editSingleInput ujb_theme' 
    })
    emailInput.present()
    if (this.platform.is('ios')) {
      this.scrollBlock = true
    }
    const {data} = await emailInput.onDidDismiss()
      if (this.platform.is('ios')) {
        this.scrollBlock = false
      }
      if (data == 'updated') {
        this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
        this.getProfile(this.userId)
      }
  }

  //Update Image
  async updateImage() {
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.loading.present()
    console.log('profilePhoto', JSON.stringify(this.profilePhoto))
    this.provider.updateProfileImage(this.profilePhoto).subscribe(
      (res: any) => {
        if (this.loading) this.loading.dismiss()
        if (this.removeImage == true) {
          Utility.showToast(
            this.toastCtrl,
            'Profile image removed',
            false,
            '',
            false
          )
        } else {
          Utility.showToast(
            this.toastCtrl,
            'Profile image updated successfully',
            false,
            '',
            false
          )
        }
      },
      (err) => {
        if (this.loading) this.loading.dismiss()
        this.url = Urls.baseUrl + Urls.port + Constants.updateProfileImage
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'updateImage'
        this.inserErrorApi()
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }

  async updateMaritalStatus() {
    this.showList = false
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    let data = {
      userId: this.userId,
      type: 'MaritalStatus',
      value: this.partnerDetails.otherDetails.maritalStatus,
    }
    this.loading.present()

    this.provider.updatePartnerProfile(data).subscribe(
      (res: any) => {
        this.loading.dismiss()
        Utility.showToast(
          this.toastCtrl,
          'Marital status updated successfully',
          false,
          '',
          false
        )
        this.getProfile(this.userId)
      },
      (err) => {
        //// this.navCtrl.push(ErrorPage)
        this.url = Urls.baseUrl + Urls.port + Constants.updatePartnerProfile
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'updateMaritalStatus'
        this.inserErrorApi()
      }
    )
  }

  async onBackPressed() {
    if (this.actionSheetCtrl) {
      console.log('partner if')
      this.actionSheetCtrl.dismiss()
      this.actionSheetCtrl = undefined
    } else {
      console.log('partner else')
      if (this.router.url.split('?')[0] == '/PartnerPage') {
      // if (this.app.getActiveNav().getActive().instance instanceof PartnerPage) {
        if (this.viewOtherProfile) {
          this.navCtrl.pop()
        } else {
          await this.navCtrl.navigateRoot('DashboardPage')
          Utility.removeInstances(PartnerPage, this.navCtrl)
        }
      } else {
        this.navCtrl.pop()
      }
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
    this.logError.screen = 'PartnerPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
