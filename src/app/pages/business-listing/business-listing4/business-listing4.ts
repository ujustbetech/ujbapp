/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

import {
  // 
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular'

import { ActionSheetController } from '@ionic/angular'
import { BusinessListing5Page } from '../business-listing5/business-listing5'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { File } from '@ionic-native/file/ngx'
// import { ImageViewerController } from 'ionic-img-viewer'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { UploadCompanyLogoInfo } from '../../../../app/models/companyLogo_info'
import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { BusinessDetailsService } from '../../../services/business-details.service'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'

/*
 * Revision History:
 *     Api integration:        2019/07/10       Yogesh Chavan
 *     Image view:             2019/07/10       Yogesh Chavan
 */

/**
 * Generated class for the BusinessListing4Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// // @IonicPage()
@Component({
  selector: 'page-business-listing4',
  templateUrl: 'business-listing4.html',
  styleUrls: ['business-listing4.scss']
})
export class BusinessListing4Page {
  businessId: any
  companyLogoDetails: UploadCompanyLogoInfo
  loading
  // _imageViewerCtrl: ImageViewerController
  imageToShow
  actionSheetCtrl
  userId
  stackTrace
  message
  logError: InsertErrorLog = new InsertErrorLog()
  constructor(
    private platform: Platform,
    public actionSheet: ActionSheetController,
    public logErrorService: InserErrorLogService,
    public navCtrl: NavController,
    public imgService: CommonUtilsService,
    public file: File,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public provider: BusinessDetailsService,
    public toastCtrl: ToastController,
    // private imageViewerCtrl: ImageViewerController
  ) {
    this.companyLogoDetails = new UploadCompanyLogoInfo()
    this.storage.get('userInfo').then((val) => {
      this.businessId = val.businessId
      this.userId = val.userId
    })
    // this._imageViewerCtrl = imageViewerCtrl
    this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
    this.platform.backButton.subscribe(() => {
      console.log('cp personel tab')
      if (this.actionSheetCtrl) {
        this.actionSheetCtrl.dismiss()
        this.actionSheetCtrl = undefined
      } else {
        this.navCtrl.pop()
      }
    })
  }

  ionViewWillEnter() {
    if (
      Utility.companyLogoDetails == null ||
      Utility.companyLogoDetails == undefined
    ) {
      Utility.companyLogoDetails = new UploadCompanyLogoInfo()
    }
    this.companyLogoDetails = Utility.companyLogoDetails
  }

  goBack() {
    this.navCtrl.pop()
  }

  async uploadLogoDetail() {
    if (
      this.companyLogoDetails.logoBase64 != undefined &&
      this.businessId != null &&
      this.companyLogoDetails.logoBase64 != ''
    ) {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.loading.present()
      console.log('json company logo', JSON.stringify(this.companyLogoDetails))
      this.provider.updateLogo(this.companyLogoDetails).subscribe(
        async (res: any) => {
          if (this.loading) this.loading.dismiss()
          console.log('uploadLogoDetail', res)
          Utility.showToast(
            this.toastCtrl,
            Constants.logoUpload,
            false,
            '',
            false
          )
          // this.navCtrl.push(BusinessListing5Page)
          await this.navCtrl.navigateForward('BusinessListing5Page')
          
        },
        (err) => {
          if (this.loading) this.loading.dismiss()
          console.log('uploadLogoDetail', err)
          this.stackTrace = err.stack
          this.message = err.message
          this.insertLoggingApi() //// this.navCtrl.push(ErrorPage)
        }
      )
    } else {
      // this.navCtrl.push(BusinessListing5Page)
      await this.navCtrl.navigateForward('BusinessListing5Page')

    }
  }
  insertLoggingApi() {
    let Input = {
      businessId: this.companyLogoDetails.businessId,
      logoBase64: this.companyLogoDetails.logoBase64,
      logoImageURL: this.companyLogoDetails.logoImageURL,
      logoImgName: this.companyLogoDetails.logoImgName,
      logoImgType: this.companyLogoDetails.logoImgType,
    }
    this.logError.Url = Urls.baseUrl + Urls.port + Constants.uploadLogo
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error =
      'input by user' + JSON.stringify(Input) + ' ' + this.stackTrace
    this.logError.message = this.message
    this.logError.method = 'uploadLogoDetail'
    this.logError.screen = 'BusinessListing4Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)
    this.logErrorService.insertLogError(this.logError)
  }
  //
  async openActionSheet() {
    ////
    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.loading.present()
          this.imgService.getImagePromise('Camera').subscribe(
            (res: any) => {
              console.log('res', res)
              this.loading.dismiss()
              // this.imageURI = normalizeURL(res.imageUrl)
              this.companyLogoDetails.businessId = this.businessId
              this.companyLogoDetails.logoBase64 = res.base64
              this.companyLogoDetails.logoImgName = res.fileName
              this.companyLogoDetails.logoImgType = res.fileType
              console.log('company logo', this.companyLogoDetails)
            },
            (err) => {
              if (this.loading) this.loading.dismiss()
              //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
            }
          )
        },
      },{
        text: 'Gallery',
        handler: () => {
          this.loading.present()
          this.imgService.getImagePromise('Gallery').subscribe(
            (res: any) => {
              console.log('res', res)
              if (this.loading) this.loading.dismiss()
              this.companyLogoDetails.businessId = this.businessId
              this.companyLogoDetails.logoBase64 = res.base64
              this.companyLogoDetails.logoImgName = res.fileName
              this.companyLogoDetails.logoImgType = res.fileType
              console.log('company logo', this.companyLogoDetails)
            },
            (err) => {
              if (this.loading) this.loading.dismiss()
              //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
            }
          )
        },
      }, (
        this.companyLogoDetails.logoBase64 != null &&
        this.companyLogoDetails.logoBase64 != undefined &&
        this.companyLogoDetails.logoBase64 != '' &&
       {
          text: 'Remove Image',
          handler: () => {
            this.companyLogoDetails.logoBase64 = ''
            this.companyLogoDetails.logoImgName = ''
          }
      })]
    })

    /*     if (this.companyLogoDetails.logoBase64) {
          this.actionSheetCtrl.addButton({
            text: 'View Image', handler: () => {
              const imageViewer = this._imageViewerCtrl.create(this.imageToShow);
              imageViewer.present();
            }
          })
        } */
    this.actionSheetCtrl.present()
  }

  presentImage(myImage) {
    this.imageToShow = myImage
  }
}
