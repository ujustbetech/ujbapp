/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */
/*
 * Revision History:
 *    New  Profile API Integration:        2019/07/09        Yogesh Chavan
 *    image view :                         2019/07/09        Yogesh Chavan
 *    update  name, email, image,mobileno  2019/08/13        Yogesh Chavan
 */

import * as $ from 'jquery'

import { Camera, CameraOptions } from '@ionic-native/camera/ngx'
import {
  // IonicPage,
  MenuController,
  ModalController,
  NavController,
  Platform,
  ToastController,
  AlertController
} from '@ionic/angular'

import { ActionSheetController } from '@ionic/angular'
// import { App } from '@ionic/angular/components/app/app'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { EditEmailComponent } from '../../../components/popups/edit-email/edit-email'
import { EditGuestNameComponent } from '../../../components/popups/edit-guest-name/edit-guest-name'
import { EditMobileNumberComponent } from '../../../components/popups/edit-mobile-number/edit-mobile-number'
import { File } from '@ionic-native/file/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
import { GuestInfo } from '../../../../app/models/GuestInfo'
// import { ImageViewerController } from 'ionic-img-viewer'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { ProfilePhotoInfo } from '../../../../app/models/userInfo'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { ActivatedRoute, Router } from '@angular/router'
import { UserProfileService } from '../../../services/user-profile.service'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { PopupConfirmationAlertComponent } from '../../../components/popups/popup-confirmation-alert/popup-confirmation-alert'

/**
 * Generated class for the GuestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// // @IonicPage()
@Component({
  selector: 'page-guest',
  templateUrl: 'guest.html',
  styleUrls: ['guest.scss'],
})
export class GuestPage implements OnInit {
  activePage: string
  guestInfo: GuestInfo = new GuestInfo()
  loading
  // _imageViewerCtrl: ImageViewerController
  imageToShow
  showEdit: boolean = false
  hideEdit: boolean
  userId
  isConnectors: boolean = false
  removeImage: boolean = false
  actionSheetCtrl
  guestInfoDetails
  scrollBlock: any
  editMobileNumber
  editName
  editEmail
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  params
  profImage
  
  profilePhoto: ProfilePhotoInfo = new ProfilePhotoInfo()
  constructor(
    private platform: Platform,
    public loadingCtrl: LoadingController,
    private provider: UserProfileService,
    private camera: Camera,
    public file: File,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private storage: Storage,
    public imgService: CommonUtilsService,
    public actionSheet: ActionSheetController,
    private filePath: FilePath,
    // private imageViewerCtrl: ImageViewerController,
    public logErrorService: InserErrorLogService,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    // private app: App,
    public modalCtrl: ModalController,
    private menu: MenuController,
    private router: Router
  ) {
    route.queryParams.subscribe((params: any) => {
      this.params = params
    })
    this.profilePhoto = new ProfilePhotoInfo()
    this.scrollBlock = false
    console.log('steps toexecute')
    console.log('constructor starts')

    this.showEdit = false
    this.hideEdit = true
    this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)

    console.log('constructor starts before back')
    this.platform.backButton.subscribe(async () => {
      const getOpen: any = await this.menu.getOpen()

      if (this.editMobileNumber) {
        this.editMobileNumber.dismiss()
        this.editMobileNumber = undefined
      } else if (this.actionSheetCtrl) {
        this.actionSheetCtrl.dismiss()
        this.actionSheetCtrl = undefined
      } else if (this.editName) {
        this.editName.dismiss()
        this.editName = undefined
      } else if (this.editEmail) {
        this.editEmail.dismiss()
        this.editEmail = undefined
      } else if (getOpen) {
        //console.log("menu open", getOpen.isOpen)
        if (getOpen.isOpen == true) {
          this.menu.close()
          //this.registerBackButton()
        }
      } else {
        this.goToDashboard()
      }
    })
    console.log('constructor ends')

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
  }

  ngOnInit(): void {
    this.ionViewCanEnterNew()
  }

  ionViewCanEnterNew(): any {
    console.log("=============================================")
    // return new Promise((resolve) => {
      console.log('enter view can enter')
      this.storage
        .get('userInfo')
        .then((val) => {
          console.log('enter view can enter in userid')
          console.log('userid', val)
          this.userId = val.userId
          this.profilePhoto.userId = this.userId
          // this.getProfile(val);
          let conneectorData = this.params.data
          if (conneectorData) {
            this.getProfile(conneectorData)
            this.isConnectors = true
          } else {
            //this.getProfile(this.userId)
            this.loading.present()
            this.provider.getProfile(this.userId).subscribe(
              (res: any) => {
                if (this.loading) this.loading.dismiss()
                // resolve(res)
                this.activePage = 'Profile'
                console.log('res for guest', res)
                this.guestInfoDetails = res
                this.guestInfo.firstName =
                  this.guestInfoDetails.json.data.userInfo.firstName
                console.log('firstname', this.guestInfo.firstName)
                this.guestInfo.lastName =
                  this.guestInfoDetails.json.data.userInfo.lastName
                //this.guestInfo.base64Image = this.guestInfoDetails.json.data.userInfo.base64Image;
                if (this.guestInfoDetails.json.data.userInfo.imageURL)
                  this.profilePhoto.ImageBase64 = Utility.getImageUrl(
                    this.guestInfoDetails.json.data.userInfo.imageURL
                  )
                this.profilePhoto.ImageURL =
                  this.guestInfoDetails.json.data.userInfo.imageURL
                this.profilePhoto.FileName =
                  this.guestInfoDetails.json.data.userInfo.fileName

                this.guestInfo.countryCode =
                  this.guestInfoDetails.json.data.userInfo.countryCode
                this.guestInfo.mobileNumber =
                  this.guestInfoDetails.json.data.userInfo.mobileNumber
                this.guestInfo.emailId =
                  this.guestInfoDetails.json.data.userInfo.emailId
                console.log('email', this.guestInfo.emailId)
                this.guestInfo.userId =
                  this.guestInfoDetails.json.data.userInfo._id
                this.storage.set('guestInfo', this.guestInfo)
              },
              async (err) => {
                console.log(err)
                if (this.loading) this.loading.dismiss()
                // resolve(false)
                await this.navCtrl.navigateForward('ErrorPage')
              }
            )
          }
          // TODO
          // for (let i = 0; i < this.navCtrl.getViews().length; i++) {
          //   if (this.navCtrl.getViews()[i].instance instanceof OtpSuccessPage) {
          //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
          //   }
          // }
          //resolve(true);
        })
        .catch(() => {
          // resolve(false)
        })

      console.log('enter view can enter ends')
    // })
  }

  ionViewWillLeave() {
    //this.goToDashboard()
  }

  //Edit Mobile Number
  async editMobileNo() {
    let MobileNumber = {
      title: 'Mobile',
      value: this.guestInfo.mobileNumber,
      countryCode: this.guestInfo.countryCode,
      validation: 'required',
      type: 'Mobile',
    }
    this.editMobileNumber = await this.modalCtrl.create({
      component: EditMobileNumberComponent,
      componentProps: { obj: MobileNumber, isReffere: true, formGuest: true },
      cssClass: 'editSingleInput ujb_theme' 
    })
    this.editMobileNumber.present()
    if (this.platform.is('ios')) {
      console.log('in ios platform')
      console.log('popup opened')
      this.scrollBlock = true
    }
    const {data} = await this.editMobileNumber.onDidDismiss()
      if (this.platform.is('ios')) {
        console.log('in ios platform')
        console.log('popup opened')
        this.scrollBlock = false
      }
      if (data) {
        // this.guestInfo = data.data
        if (data == 'updated') {
          this.getProfile(this.userId)
        }
      }
  }

  //Edit Guest Name
  async editGuestName() {
    let nameInput = {
      title: 'Name ',
      firstName: JSON.parse(JSON.stringify(this.guestInfo.firstName)),
      lastName: JSON.parse(JSON.stringify(this.guestInfo.lastName)),
      // countryCode: this.partnerDetails.countryCode,
      validation: 'required',
      type: 'Name',
    }
    this.editName = await this.modalCtrl.create({
      component: EditGuestNameComponent,
      componentProps: { obj: nameInput },
      cssClass: 'editGuestName ujb_theme' 
    })
    this.editName.present()
    if (this.platform.is('ios')) {
      console.log('in ios platform')
      console.log('popup opened')
      this.scrollBlock = true
    }
    const {data} = await this.editName.onDidDismiss()
      if (this.platform.is('ios')) {
        console.log('in ios platform')
        console.log('popup opened')
        this.scrollBlock = false
      }
      console.log('name', data)
      if (data) {
        if (data == 'updated') {
          this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
          this.getProfile(this.userId)
        }
      }
  }

  //Edit Email ID
  async editEmailId() {
    let EmailId = {
      title: 'Email',
      value: this.guestInfo.emailId,
      validation: 'required',
      type: 'Email',
    }

    this.editEmail = await this.modalCtrl.create({
      component: EditEmailComponent,
      componentProps: { obj: EmailId },
      cssClass: 'editSingleInput ujb_theme' 
    })
    this.editEmail.present()
    if (this.platform.is('ios')) {
      console.log('in ios platform')
      console.log('popup opened')
      this.scrollBlock = true
    }
    const {data} = await this.editEmail.onDidDismiss()
      if (this.platform.is('ios')) {
        this.scrollBlock = false
      }
      if (data == 'updated') {
        this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
        this.getProfile(this.userId)
      }
  }

  async getProfile(Id) {
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.loading.present()
    this.provider.getProfile(Id).subscribe(
      (res: any) => {
        if (this.loading) this.loading.dismiss()
        console.log('res for guest', res)
        this.guestInfo.firstName = res.json.data.userInfo.firstName
        console.log('firstname', this.guestInfo.firstName)
        this.guestInfo.lastName = res.json.data.userInfo.lastName
        this.guestInfo.base64Image = res.json.data.userInfo.base64Image

        this.guestInfo.countryCode = res.json.data.userInfo.countryCode
        this.guestInfo.mobileNumber = res.json.data.userInfo.mobileNumber
        this.guestInfo.emailId = res.json.data.userInfo.emailId
        console.log('email', this.guestInfo.emailId)
        this.guestInfo.userId = res.json.data.userInfo._id
        this.storage.set('guestInfo', this.guestInfo)
      },
      (err) => {
        console.log(err)
        if (this.loading) this.loading.dismiss()
        this.url = Urls.baseUrl + Urls.port + Constants.getUserProfile
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getProfile'
        this.inserErrorApi()
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }

  editGuest() {
    this.showEdit = true
    this.hideEdit = false
  }

  async openActionSheet(image) {
    this.imageToShow = image
    //open following code when edit profile option to give

    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.loading.present()
          this.imgService.getImagePromise('Camera').subscribe(
            (res: any) => {
              console.log('res in camera ', res)
              this.loading.dismiss()
  
              this.removeImage = false
              this.profilePhoto.ImageBase64 = res.base64
              this.profilePhoto.FileName = res.fileName
              this.profilePhoto.ImageURL = ''
              this.updateImage()
            },
            (err) => {
              if (this.loading) this.loading.dismiss()
            }
          )
        },
      }, {
        text: 'Gallery',
        handler: () => {
          this.loading.present()
          this.imgService.getImagePromise('Gallery').subscribe(
            (res: any) => {
              console.log('res', res)
              if (this.loading) this.loading.dismiss()
              this.removeImage = false
              this.profilePhoto.ImageBase64 = res.base64
              this.profilePhoto.FileName = res.fileName
              this.profilePhoto.ImageURL = ''
              this.updateImage()
            },
            (err) => {
              if (this.loading) this.loading.dismiss()
              //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
            }
          )
        },
      }, 
      // (this.guestInfo.base64Image && {
      //   text: 'View Image', handler: () => {
      //     const imageViewer = this._imageViewerCtrl.create(this.imageToShow);
      //     imageViewer.present();
      //   }
      // }), 
      (this.profilePhoto.ImageBase64 && {
        text: 'Remove',
        handler: async () => {
          let profileModal = await this.modalCtrl.create({
            component: PopupConfirmationAlertComponent,
            componentProps: { text: Constants.areYouSureToRemovePhoto },
            cssClass: 'popupConfirmationAlert singleLineHeight' 
          })
          profileModal.present()
          if (this.platform.is('ios')) {
            console.log('in ios platform')
            console.log('popup opened')
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
      })]
    })

    // this.actionSheetCtrl.addButton()
    // this.actionSheetCtrl.addButton()
    // if (this.guestInfo.base64Image) {
    //   actionSheetCtrl.addButton()
    // }
    // if (this.profilePhoto.ImageBase64) {
    //   this.actionSheetCtrl.addButton()
    // }
    this.actionSheetCtrl.present()
  }

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
        Utility.showToast(
          this.toastCtrl,
          Constants.someErrorOccurred,
          false,
          '',
          false
        )

        this.url = Urls.baseUrl + Urls.port + Constants.updateProfileImage
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'updateImage'
        this.inserErrorApi()
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }

  async goToDashboard() {
    console.log('guest')
    if (this.actionSheetCtrl) {
      this.actionSheetCtrl.dismiss()
      this.actionSheetCtrl = undefined
    } else {
      if (this.router.url.split('?')[0] == '/GuestPage' ) {
      // if (this.app.getActiveNav().getActive().instance instanceof GuestPage) {
        await this.navCtrl.navigateRoot('DashboardPage')
        Utility.removeInstances(GuestPage, this.navCtrl)
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
    this.logError.screen = 'guestPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
