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
 */

import { IonSelect, MenuController, ModalController, NavController, Platform, ToastController } from '@ionic/angular'
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core'
import {
  Location,
  PartnerInfo,
  PreferredLocations,
  UserOtherDetails,
} from '../../../app/models/PartnerInfo'
import { ProfilePhotoInfo, UserInfo } from '../../../app/models/userInfo'

import { ActionSheetController } from '@ionic/angular'
import { CallNumber } from '@ionic-native/call-number/ngx'
import { ClientPartnerPage } from '../../pages/profile/client-partner/client-partner'
import { ClientPartnerViewPage } from '../../pages/profile/client-partner-view/client-partner-view'
import { Constants } from '../../Utils/Constants'
import { DashboardPage } from '../../pages/dashboard/dashboard'
import { EditEmailComponent } from '../popups/edit-email/edit-email'
import { EditGuestNameComponent } from '../popups/edit-guest-name/edit-guest-name'
import { EditMobileNumberComponent } from '../popups/edit-mobile-number/edit-mobile-number'
import { File } from '@ionic-native/file/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
import { GuestPage } from '../../pages/profile/guest/guest'
// import { ImageViewerController } from 'ionic-img-viewer'
import { InsertErrorLog } from '../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { PartnerPage } from '../../pages/profile/partner/partner'
import { PopupBooleanYesNoComponent } from '../popups/popup-boolean-yes-no/popup-boolean-yes-no'
import { PopupConfirmationAlertComponent } from '../popups/popup-confirmation-alert/popup-confirmation-alert'

import { SingleInputPopupComponent } from '../popups/single-input-popup/single-input-popup'
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { Storage } from '@ionic/storage'

import { Urls } from '../../Utils/urls'
import { Utility } from '../../Utils/Utility'
import { ActivatedRoute, Router } from '@angular/router'
import { InserErrorLogService } from '../../services/inser-error-log.service'
import { CommonUtilsService } from '../../services/common-utils.service'
import { UserProfileService } from '../../services/user-profile.service'

/**
 * Generated class for the PartnerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'profile-cp-personal-tab',
  templateUrl: 'profile-cp-personal-tab.html',
  styleUrls: ['profile-cp-personal-tab.scss']
})
export class ProfileCpPersonalTabComponent {
  @ViewChild('select1', { static: false }) select1: IonSelect
  @Input() userProfile = new UserInfo()
  @Input() screenScroll
  @Output() _changeRefer = new EventEmitter<any>()
  @Output() _profileDetails = new EventEmitter<any>()
  userId: any
  userInfoObj = new UserInfo()
  ujb_link: any
  mentorUserInfo: UserInfo[]
  connectorUserInfo: UserInfo[]
  userinfoconnectobj = new UserInfo()
  userprofileobj: UserInfo
  userprofilelist: UserInfo[]
  connectCounters: any
  countofconnects: any
  dashBoardActive: any
  profileActive: any
  connect_text_class: any
  moreMenuActive
  removeImage
  activePage: string = 'Profile'
  firstconnects: UserInfo[]
  editHobbies: boolean = false
  editMaritalStatus: boolean = true
  base64Image: string = ''
  loading
  zoomImage: boolean = true
  // _imageViewerCtrl: ImageViewerController
  partnerDetails: PartnerInfo = new PartnerInfo()
  userOtherDetails: UserOtherDetails = new UserOtherDetails()
  locationDetail: Location = new Location()
  localitiesDetail: PreferredLocations = new PreferredLocations()
  localities: string = ''
  adderes: string = ''
  businessId
  viewOtherProfile
  hidePersonalTab
  hideEdit
  hideAddAns
  myMentorCode
  showAddButton
  viewProfile
  actionSheetCtrl
  stateName
  showBlock: any
  countryName
  flagContact: boolean = false
  showContact: boolean = false
  mobileNumber
  message: string = ''
  bypassAppChooser: boolean = false
  url: string = ''
  image: string = 'null'
  //scrollBlock: any
  maritalStaus: any = ['Single', 'Married', 'Divorced']
  borderBottom: string = 'border-bottom'
  restrictEdit: boolean = false
  profilePhoto: ProfilePhotoInfo = new ProfilePhotoInfo()
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  method
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public logErrorService: InserErrorLogService,
    private socialSharing: SocialSharing,
    private callNumber: CallNumber,
    public platform: Platform,
    public actionSheet: ActionSheetController,
    public camera: Camera,
    public imgService: CommonUtilsService,
    // private app: App,
    public filePath: FilePath,
    public file: File,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public provider: UserProfileService,
    // private imageViewerCtrl: ImageViewerController,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private menu: MenuController,
    private router: Router
  ) {
    route.queryParams.subscribe(async (params: any) => {
      
      this.profilePhoto = new ProfilePhotoInfo()
      this.showBlock = 'hide'
      //this.scrollBlock = false
      this.screenScroll = false
      this.firstconnects = new Array<UserInfo>()
      this.mentorUserInfo = new Array<UserInfo>()
      this.connectorUserInfo = new Array<UserInfo>()
      this.userprofilelist = new Array<UserInfo>()
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
  
      this.partnerDetails.location = this.locationDetail
  
      this.partnerDetails.otherDetails = this.userOtherDetails
      this.partnerDetails.localities = this.localitiesDetail
      // this._imageViewerCtrl = imageViewerCtrl
      this.viewOtherProfile = params.viewOtherProfile
      if (this.viewOtherProfile == true) {
        this.viewProfile = 'hide'
        this.userId = params.userId
        this.businessId = params.businessId
        this.borderBottom = ''
        //this.getMentorsList();
        //this.getProfile(this.userId)
        this.flagContact = params.flagContact
        if (this.flagContact == true) {
          this.showContact = true
        } else {
          this.showContact = false
        }
        this.myMentorCode = params.myMentorCode
        // if (this.partnerDetails.ujbId == this.myMentorCode) {
        //   this.viewProfile = 'view'
        // } else {
        //   this.viewProfile = 'hide'
        // }
        this.hideEdit = false
        this.hideAddAns = 'hide'
      } else {
        this.viewProfile = 'view'
        this.storage.get('userInfo').then((val) => {
          console.log('userid', val)
          this.userId = val.userId
          this.profilePhoto.userId = this.userId
          //this.getMentorsList();
          //this.getProfile(this.userId)
        })
        this.hideEdit = true
        this.hideAddAns = 'view'
      }
      this.platform.backButton.subscribe(async () => {
        console.log('cp personel tab')
        let getOpen: any = await this.menu.getOpen() 
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
              await this.navCtrl.navigateRoot('DashboardPage')
              Utility.removeInstances(ClientPartnerPage, this.navCtrl)
            } else {
              this.navCtrl.pop()
            }
          }
        }
      })
    })
  }
  /*   ionViewWillEnter() {
      console.log("ionViewWillEnter cp personel tab")
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
      this.storage.get('userInfo').then((val) => {
        this.userId = val.userId
        this.getProfile(this.userId)
      })
    } */

  /*  ionViewDidEnter() {
   } */
  async openProfile(userInfoObj) {
    this.flagContact = true
    this.viewOtherProfile = true
    if (userInfoObj.myMentorCode != Constants.UjbPartnerMentorCode) {
      if (userInfoObj.role == 'Partner') {
        // this.navCtrl.push(PartnerPage, {
        //   userId: userInfoObj.userId,
        //   viewOtherProfile: this.viewOtherProfile,
        //   flagContact: this.flagContact,
        // })
        await this.navCtrl.navigateForward('PartnerPage', { queryParams: { userId: userInfoObj.userId,
          viewOtherProfile: this.viewOtherProfile,
          flagContact: this.flagContact} } )
      } else if (userInfoObj.role == Constants.clientPartner) {
        // this.navCtrl.push(ClientPartnerPage, {
        //   userId: userInfoObj.userId,
        //   viewOtherProfile: this.viewOtherProfile,
        //   flagContact: this.flagContact,
        // })
        await this.navCtrl.navigateForward('ClientPartnerPage', { queryParams: {  userId: userInfoObj.userId,
          viewOtherProfile: this.viewOtherProfile,
          flagContact: this.flagContact,} } )
      }
    } else {
      // this.navCtrl.push(CommunityPage, {
      //   usermentorinfolist: this.mentorUserInfo,
      //   userconnectinfolist: this.connectorUserInfo,
      // })
      await this.navCtrl.navigateForward('CommunityPage', { queryParams: {   usermentorinfolist: this.mentorUserInfo,
        userconnectinfolist: this.connectorUserInfo,} } )
    }
  }
  async openProfileConnect(userInfoObj) {
    this.flagContact = true
    this.viewOtherProfile = true
    if (userInfoObj.role == 'Partner') {
      // this.navCtrl.push(PartnerPage, {
      //   userId: userInfoObj.userId,
      //   viewOtherProfile: this.viewOtherProfile,
      //   flagContact: this.flagContact,
      // })
      await this.navCtrl.navigateForward('PartnerPage', { queryParams: { userId: userInfoObj.userId,
        viewOtherProfile: this.viewOtherProfile,
        flagContact: this.flagContact,} } )

    } else if (userInfoObj.role == Constants.clientPartner) {
      // this.navCtrl.push(ClientPartnerPage, {
        // userId: userInfoObj.userId,
        // viewOtherProfile: this.viewOtherProfile,
        // flagContact: this.flagContact,
      // })
      await this.navCtrl.navigateForward('ClientPartnerPage', { queryParams: { userId: userInfoObj.userId,
        viewOtherProfile: this.viewOtherProfile,
        flagContact: this.flagContact,} } )
    }
  }

  async gotoConnectlist() {
    // this.navCtrl.push(CommunityPage, {
      // usermentorinfolist: this.mentorUserInfo,
      // userconnectinfolist: this.connectorUserInfo,
    // })
    await this.navCtrl.navigateForward('CommunityPage', { queryParams: { usermentorinfolist: this.mentorUserInfo,
      userconnectinfolist: this.connectorUserInfo,} } )
    //// this.navCtrl.push(ComingSoonPage)
  }

  getMentorsList(userId) {
    console.log('ionViewCanEnter12 ', new Date().toISOString())
    this.provider.getconnectors(userId).subscribe(
      (res: any) => {
        console.log('ionViewCanEnter13 ', new Date().toISOString())
        if (res != null) {
          if (res.status == 200) {
            console.log('ionViewCanEnter14 ', new Date().toISOString())
            this.showBlock = 'hide'
            let data = res.json.data
            //if (data.mentorUserInfo != null) {
            this.firstconnects = new Array<UserInfo>()
            this.mentorUserInfo = new Array<UserInfo>()
            this.connectorUserInfo = new Array<UserInfo>()
            for (let i = 0; i < data.mentorUserInfo.length; i++) {
              if (data.mentorUserInfo[0].imageURL)
                this.userInfoObj.base64Image = Utility.getImageUrl(
                  data.mentorUserInfo[0].imageURL
                )
              this.userInfoObj.role = data.mentorUserInfo[0].role
              this.userInfoObj.firstName = data.mentorUserInfo[0].firstName
              console.log('e', this.userInfoObj.firstName)
              this.userInfoObj.lastName = data.mentorUserInfo[0].lastName
              this.userInfoObj.mobileNumber =
                data.mentorUserInfo[0].mobileNumber
              this.userInfoObj.myMentorCode =
                data.mentorUserInfo[0].myMentorCode
              this.userInfoObj.mentorCode = data.mentorUserInfo[0].mentorCode
              this.userInfoObj.userId = data.mentorUserInfo[0]._id
              this.mentorUserInfo.push(this.userInfoObj)
              //// this.navCtrl.push(CommunityPage, { 'usermentorinfolist':this.mentorUserInfo})

              //}
            }
            console.log('ionViewCanEnter15 ', new Date().toISOString())
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
                console.log('econnects', this.userinfoconnectobj.firstName)
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
                //// this.navCtrl.push(CommunityPage, {"usermentorinfolist":this.mentorUserInfo, "userconnectinfolist":this.connectorUserInfo})
              }
            }
            console.log('ionViewCanEnter16 ', new Date().toISOString())

            this.countofconnects = this.connectorUserInfo.length - 3
            if (this.countofconnects > 0) {
              this.connectCounters = 'view'
            } else {
              this.connect_text_class = 'hide'
              this.connectCounters = 'hide'
            }
            console.log('ionViewCanEnter17 ', new Date().toISOString())
            console.log('a', this.countofconnects)
          }
        }
      },
      (err) => {
        console.log('ionViewCanEnter18 ', new Date().toISOString())
        console.log('error', err)
        if (err.message == 500) {
          this.showBlock = 'view'
          //this.connect_text_class = 'hide'
          this.connectCounters = 'hide'
        }
        this.url = Urls.baseUrl + Urls.port + Constants.getConnectors
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getMentorsList'
        this.inserErrorApi()
      }
    )
  }

  async openMyCommunity() {
    // this.navCtrl.push(CommunityPage)
    await this.navCtrl.navigateForward('CommunityPage')
  }

  /*   openBusinessStat() {
      // this.navCtrl.push(ReferralsGivenPage)
    } */

  async editPassiveIncome() {
    // this.navCtrl.push(Questionnaire9Page)
    await this.navCtrl.navigateForward('Questionnaire9Page')
  }

  /**
   * gets an image from camera/gallery
   */
  async addImage() {
    this.zoomImage = false
    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.imgService.getImagePromise('Camera').subscribe(
              (res: any) => {
                console.log('cam backend gal res', res)
                // this.base64Image = res.base64;
                this.removeImage = false
                this.profilePhoto.ImageBase64 = res.base64
                this.profilePhoto.FileName = res.fileName
                this.profilePhoto.ImageURL = ''
                this.updateImage()
                console.log('cam this.base64Image', this.base64Image)
              },
              (err) => {
                console.log('Gallery', err)
                //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
              }
            )
          },
        },
        {
          text: 'Gallery',
          handler: () => {
            console.log('backend galery')
            this.imgService.getImagePromise('Gallery').subscribe(
              (res: any) => {
                console.log('backend gal res', res)
                //this.base64Image = res.base64;
                this.removeImage = false
                this.profilePhoto.ImageBase64 = res.base64
                this.profilePhoto.FileName = res.fileName
                this.profilePhoto.ImageURL = ''
                this.updateImage()
                console.log(' this.base64Image', this.base64Image)
              },
              (err) => {
                console.log('Gallery', err)
                //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
              }
            )
          },
        },
        (this.profilePhoto.ImageBase64 && {
          text: 'Remove Photo',
          handler: async () => {
            let profileModal = await this.modalCtrl.create({
              component: PopupConfirmationAlertComponent,
              componentProps: { text: Constants.areYouSureToRemovePhoto },
              cssClass: 'popupConfirmationAlert singleLineHeight' 
            })
            profileModal.present()
            if (this.platform.is('ios')) {
              this.screenScroll = true
            }
            const {data} = await profileModal.onDidDismiss()
              if (this.platform.is('ios')) {
                this.screenScroll = false
              }
              if (data == 'ok') {
                this.removeImage = true
                this.profilePhoto.ImageBase64 = ''
                this.profilePhoto.FileName = ''
                this.updateImage()
              }
          },
        })
      ],
    })
    // if (this.profilePhoto.ImageBase64) {
    //   this.actionSheetCtrl.addButton({
    //     text: 'Remove Photo',
    //     handler: async () => {
    //       let profileModal = await this.modalCtrl.create({
    //         component: PopupConfirmationAlertComponent,
    //         componentProps: { text: Constants.areYouSureToRemovePhoto },
    //         cssClass: 'popupConfirmationAlert singleLineHeight' 
    //       })
    //       profileModal.present()
    //       if (this.platform.is('ios')) {
    //         this.screenScroll = true
    //       }
    //       const {data} = await profileModal.onDidDismiss()
    //         if (this.platform.is('ios')) {
    //           this.screenScroll = false
    //         }
    //         if (data == 'ok') {
    //           this.removeImage = true
    //           this.profilePhoto.ImageBase64 = ''
    //           this.profilePhoto.FileName = ''
    //           this.updateImage()
    //         }
    //     },
    //   })
    // }

    this.actionSheetCtrl.present()

    this.zoomImage = true
  }

  getProfile(id, viewOtherProfile) {
    console.log('ionViewCanEnter19 ', new Date().toISOString())
    this.viewOtherProfile = viewOtherProfile
    return new Promise(async (resolve) => {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.loading.present()
      console.log('time when req profile', new Date().toLocaleTimeString())
      console.log('ionViewCanEnter20 ', new Date().toISOString())
      this.provider.getProfile(id).subscribe(
        (res: any) => {
          console.log(
            'time when res recv profile',
            new Date().toLocaleTimeString()
          )

          console.log('ionViewCanEnter21 ', new Date().toISOString())
          console.log('cp personal info', res)
          if (this.loading) this.loading.dismiss()

          this.stateName = res.json.data.stateName
          this.countryName = res.json.data.countryName
          this.partnerDetails.emailId = res.json.data.userInfo.emailId
          //this.partnerDetails.ujbId = res.json.data.userInfo.mentorCode
          this.partnerDetails.userType = res.json.data.userInfo.userType
          this.partnerDetails.myMentorCode = res.json.data.userInfo.myMentorCode
          this.partnerDetails.firstName = res.json.data.userInfo.firstName
          this.partnerDetails.lastName = res.json.data.userInfo.lastName
          this.partnerDetails.passiveIncome =
            res.json.data.userInfo.passiveIncome
          this.partnerDetails.gender = res.json.data.userInfo.gender
          this.partnerDetails.birthDate = res.json.data.userInfo.birthDate
          this.partnerDetails.mobileNumber = res.json.data.userInfo.mobileNumber
          this.partnerDetails.countryCode = res.json.data.userInfo.countryCode
          this.partnerDetails.countryId = res.json.data.userInfo.countryId
          this.partnerDetails.stateId = res.json.data.userInfo.stateId
          this.partnerDetails.isPartnerAgreementAccepted =
            res.json.data.userInfo.isPartnerAgreementAccepted
          this.partnerDetails.isMembershipAgreementAccepted =
            res.json.data.userInfo.isMembershipAgreementAccepted
          this.partnerDetails.isRefer = res.json.data.isRefer

          console.log('ionViewCanEnter22 ', new Date().toISOString())
          if (this.partnerDetails.isPartnerAgreementAccepted == true) {
            this.restrictEdit = false
          } else {
            this.restrictEdit = true
          }

          if (viewOtherProfile == true) {
            this._changeRefer.emit(this.partnerDetails.isRefer)
            /* if (this.partnerDetails.isRefer == true) {
            ClientPartnerPage.showReferNow = true
            ClientPartnerPage.showReferChange()
          } else {
            ClientPartnerPage.showReferNow = false
          } */
          }
          //this.profilePhoto.ImageBase64 = res.json.data.userInfo.base64Image
          if (res.json.data.userInfo.imageURL)
            this.profilePhoto.ImageBase64 = Utility.getImageUrl(
              res.json.data.userInfo.imageURL
            )
          this.profilePhoto.ImageURL = res.json.data.userInfo.imageURL
          this.profilePhoto.FileName = res.json.data.userInfo.fileName
          console.log('ionViewCanEnter23 ', new Date().toISOString())
          this.partnerDetails.knowledgeSource =
            res.json.data.userInfo.knowledgeSource
          //this.partnerDetails.userType = res.json.data.userInfo.userType
          //this.partnerDetails.organisationType = res.json.data.userInfo.organisationType

          if (res.json.data.userOtherDetails) {
            this.userOtherDetails.aboutMe =
              res.json.data.userOtherDetails.aboutMe //
            this.userOtherDetails.hobbies =
              res.json.data.userOtherDetails.hobbies //

            this.userOtherDetails.areaOfInterest =
              res.json.data.userOtherDetails.areaOfInterest //
            this.userOtherDetails.canImpartTraining =
              res.json.data.userOtherDetails.canImpartTraining //
            this.userOtherDetails.maritalStatus =
              res.json.data.userOtherDetails.maritalStatus //
            this.partnerDetails.otherDetails = this.userOtherDetails
          }
          console.log('ionViewCanEnter24 ', new Date().toISOString())
          if (res.json.data.userInfo.address) {
            this.locationDetail.flatWing =
              res.json.data.userInfo.address.flatWing
            this.locationDetail.locality =
              res.json.data.userInfo.address.locality
            this.locationDetail.location =
              res.json.data.userInfo.address.location
            this.partnerDetails.location = this.locationDetail
            if (this.locationDetail.flatWing) {
              this.adderes += this.locationDetail.flatWing + ', ' + ' '
            }
            if (res.json.data.userInfo.address) {
              this.localitiesDetail = new PreferredLocations()
              this.adderes = ''
              this.locationDetail.flatWing =
                res.json.data.userInfo.address.flatWing
              this.locationDetail.locality =
                res.json.data.userInfo.address.locality
              this.locationDetail.location =
                res.json.data.userInfo.address.location
              this.partnerDetails.location = this.locationDetail
              if (this.locationDetail.flatWing) {
                this.adderes += this.locationDetail.flatWing + ', ' + ' '
              }
              if (this.locationDetail.locality) {
                this.adderes += this.locationDetail.locality + ', ' + ' '
              }
            }
          }
          console.log('ionViewCanEnter25 ', new Date().toISOString())
          if (res.json.data.userInfo.preferredLocations) {
            this.localitiesDetail = new PreferredLocations()
            this.localities = ' '
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
              this.localities += this.localitiesDetail.location1 + ' '
            } else {
              if (
                this.localitiesDetail.location1 &&
                (this.localitiesDetail.location2 ||
                  this.localitiesDetail.location3)
              ) {
                this.localities += ' ' + this.localitiesDetail.location1 + ' '
              }

              if (
                this.localitiesDetail.location2 &&
                (this.localitiesDetail.location1 ||
                  this.localitiesDetail.location3)
              ) {
                this.localities +=
                  ' ' + ',' + ' ' + this.localitiesDetail.location2 + ' '
              }
              if (
                this.localitiesDetail.location3 &&
                (this.localitiesDetail.location1 ||
                  this.localitiesDetail.location2)
              ) {
                this.localities +=
                  ' ' + ',' + ' ' + this.localitiesDetail.location3 + ' '
              }
            }
          }
          console.log('ionViewCanEnter26 ', new Date().toISOString())
          resolve(res)
          console.log('ionViewCanEnter27 ', new Date().toISOString())
          this._profileDetails.emit(this.partnerDetails)
          console.log('ionViewCanEnter28 ', new Date().toISOString())
          console.log(
            'time when res bind profile',
            new Date().toLocaleTimeString()
          )
        },
        (err) => {
          console.log('ionViewCanEnter29 ', new Date().toISOString())
          if (this.loading) this.loading.dismiss()
          resolve(false)
          this.url = Urls.baseUrl + Urls.port + Constants.getUserProfile
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'getProfile'
          this.inserErrorApi()
          //// this.navCtrl.push(ErrorPage)
        }
      )
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
  viewImage(imageToView) {
    if (this.profilePhoto.ImageBase64 && this.zoomImage) {
      // TODO
      // const imageViewer = this._imageViewerCtrl.create(imageToView)
      // imageViewer.present()
    }
  }

  async goToReferralGiven() {
    // this.navCtrl.push(ReferralsGivenPage, { segmentSlider: 'referral' })
    await this.navCtrl.navigateForward('ReferralsGivenPage', { queryParams: { segmentSlider: 'referral'} })
  }

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
        // this.navCtrl.push(Questionnaire2Page, {
          // birthDate: this.partnerDetails.birthDate,
          // referrer: 'ClientPartnerPage',
        // })
        await this.navCtrl.navigateForward('Questionnaire2Page', { queryParams: { birthDate: this.partnerDetails.birthDate,
          referrer: 'ClientPartnerPage', } } )
        break

      case 'Gender':
        // this.navCtrl.push(Questionnaire1Page, {
          // gender: this.partnerDetails.gender,
          // referrer: 'PartnerPage',
        // })
        await this.navCtrl.navigateForward('Questionnaire1Page', { queryParams: { gender: this.partnerDetails.gender,
          referrer: 'PartnerPage', } } )
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
        // this.navCtrl.push(Questionnaire6Page, {
          // data: data,
          // referrer: 'PartnerPage',
          // userType: this.partnerDetails.userType,
        // })
        await this.navCtrl.navigateForward('Questionnaire6Page', { queryParams: {  data: data,
          referrer: 'PartnerPage',
          userType: this.partnerDetails.userType, } } )
        break

      case 'KnowledgeSource':
        // this.navCtrl.push(Questionnaire4Page, {
          // data: this.partnerDetails.knowledgeSource,
          // referrer: 'PartnerPage',
          // userType: this.partnerDetails.userType,
        // })
        await this.navCtrl.navigateForward('Questionnaire4Page', { queryParams: {  data: this.partnerDetails.knowledgeSource,
          referrer: 'PartnerPage',
          userType: this.partnerDetails.userType, } } )
        break

      case 'PassiveIncome':
        // this.navCtrl.push(Questionnaire9Page, {
          // data: this.partnerDetails.passiveIncome,
          // referrer: 'PartnerPage',
        // })
        await this.navCtrl.navigateForward('Questionnaire9Page', { queryParams: { data: this.partnerDetails.passiveIncome,
          referrer: 'PartnerPage', } } )
        break

      case 'Location':
        // this.navCtrl.push(Questionnaire3Page, {
          // flatWing: this.locationDetail.flatWing,
          // locality: this.locationDetail.locality,
          // location: this.locationDetail.location,
          // countryName1: this.countryName,
          // searchTerm: this.stateName,
          // countryCode: this.partnerDetails.countryId,
          // stateId: this.partnerDetails.stateId,
          // referrer: 'PartnerPage',
          // editLocation: 'editLocation',
        // })
        await this.navCtrl.navigateForward('Questionnaire3Page', { queryParams: {  flatWing: this.locationDetail.flatWing,
          locality: this.locationDetail.locality,
          location: this.locationDetail.location,
          countryName1: this.countryName,
          searchTerm: this.stateName,
          countryCode: this.partnerDetails.countryId,
          stateId: this.partnerDetails.stateId,
          referrer: 'PartnerPage',
          editLocation: 'editLocation', } } )
        break

      case 'Localities':
        // this.navCtrl.push(Questionnaire8Page, {
          // locality1: this.localitiesDetail.location1,
          // locality2: this.localitiesDetail.location2,
          // locality3: this.localitiesDetail.location3,
          // referrer: 'PartnerPage',
        // })
        await this.navCtrl.navigateForward('Questionnaire8Page', { queryParams: {  locality1: this.localitiesDetail.location1,
          locality2: this.localitiesDetail.location2,
          locality3: this.localitiesDetail.location3,
          referrer: 'PartnerPage', } } )
        break

      case 'AboutMe':
        let values = {
          title: ' About ',
          value: this.userOtherDetails.aboutMe,
          validation: 'required',
          type: 'AboutMe',
          message: ' About Me',
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

  //Modal popup with Mobile input
  async openMobilePopup(obj) {
    let mobileInput = await this.modalCtrl.create({
      component: EditMobileNumberComponent,
      componentProps: { obj, isReffere: true, formClientPartner: 'true' },
      cssClass: 'editSingleInput ujb_theme' 
    })
    mobileInput.present()
    if (this.platform.is('ios')) {
      this.screenScroll = true
    }
    const {data} = await mobileInput.onDidDismiss()
    if (this.platform.is('ios')) {
      this.screenScroll = false
    }
    if (data == 'updated') {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.getProfile(this.userId, this.viewOtherProfile)
    }
  }

  async openSingleInputPopup(obj) {
    console.log(obj)
    let editSingleInput = await this.modalCtrl.create({
      component: SingleInputPopupComponent,
      componentProps: { obj },
      cssClass: 'editSingleInput ujb_theme' 
    })
    editSingleInput.present()
    if (this.platform.is('ios')) {
      this.screenScroll = true
    }
    const {data} = await editSingleInput.onDidDismiss()
    //
    if (this.platform.is('ios')) {
      this.screenScroll = false
    }
    if (data == 'updated') {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.getProfile(this.userId, this.viewOtherProfile)
    }
  }
  //Modal popup with Boolean input
  async openBooleanPopup(obj) {
    let booleanInput = await this.modalCtrl.create({
      component: PopupBooleanYesNoComponent,
      componentProps: { obj },
      cssClass: 'editBooleanPopup ujb_theme' 
    })
    booleanInput.present()
    if (this.platform.is('ios')) {
      this.screenScroll = true
    }
    const {data} = await booleanInput.onDidDismiss()
    if (this.platform.is('ios')) {
      this.screenScroll = false
    }
    if (data == 'updated') {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.getProfile(this.userId, this.viewOtherProfile)
    }
  }
  //Modal popup with Name input
  async openNamePopup(obj) {
    let nameInput = await this.modalCtrl.create({
      component: EditGuestNameComponent,
      componentProps: { obj },
      cssClass: 'editGuestName ujb_theme' 
    })
    nameInput.present()
    if (this.platform.is('ios')) {
      this.screenScroll = true
    }
    const {data} = await nameInput.onDidDismiss()
    if (this.platform.is('ios')) {
      this.screenScroll = false
    }
    if (data == 'updated') {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.getProfile(this.userId, this.viewOtherProfile)
    }
  }

  //Modal popup with Email input
  async openEmailPopup(obj) {
    let emailInput = await this.modalCtrl.create({
      component:EditEmailComponent,
      componentProps: { obj },
      cssClass: 'editSingleInput ujb_theme' 
    })
    emailInput.present()
    if (this.platform.is('ios')) {
      this.screenScroll = true
    }
    const {data} = await emailInput.onDidDismiss()
    if (this.platform.is('ios')) {
      this.screenScroll = false
    }
    if (data == 'updated') {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.getProfile(this.userId, this.viewOtherProfile)
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
      async (err) => {
        if (this.loading) this.loading.dismiss()
        this.url = Urls.baseUrl + Urls.port + Constants.updateProfileImage
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'updateImage'
        this.inserErrorApi()
        // this.navCtrl.push(ErrorPage)
        await this.navCtrl.navigateForward('ErrorPage')

      }
    )
  }

  async updateMaritalStatus() {
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    let data = {
      userId: this.userId,
      type: 'MaritalStatus',
      value: this.partnerDetails.otherDetails.maritalStatus,
    }
    this.loading.present()
    this.provider.updatePartnerProfile(data).subscribe(
      (res: any) => {
        if (this.loading) this.loading.dismiss()
        Utility.showToast(
          this.toastCtrl,
          'Marital status updated successfully',
          false,
          '',
          false
        )
        this.editMaritalStatus = false
        this.getProfile(this.userId, this.viewOtherProfile)
      },
      async (err) => {
        if (this.loading) this.loading.dismiss()
        this.url = Urls.baseUrl + Urls.port + Constants.updatePartnerProfile
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'updateMaritalStatus'
        this.inserErrorApi()
        // this.navCtrl.push(ErrorPage)
        await this.navCtrl.navigateForward('ErrorPage')

      }
    )
  }

  showEditMaritalStatus() {
    this.editMaritalStatus = true
    this.select1.open()
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'ProfileCpPersonalTabComponent'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe(
      (res: any) => {
        console.log('res in 200 logs', res)
      },
      (err) => {
        console.log('res in 200 logs err', err)
      }
    )
  }
}
