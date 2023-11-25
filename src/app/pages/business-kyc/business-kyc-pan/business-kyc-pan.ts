import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {  NavController, Platform, ToastController } from '@ionic/angular'

import { ActionSheetController } from '@ionic/angular'
import { BusinessKycGstPage } from '../business-kyc-gst/business-kyc-gst'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { DashboardPage } from '../../dashboard/dashboard'
import { File } from '@ionic-native/file/ngx'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { PanInfo } from '../../../../app/models/PanInfo'
import { Storage } from '@ionic/storage'

import { UploadCompanyLogoInfo } from '../../../../app/models/companyLogo_info'
import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { KycService } from '../../../services/kyc.service'

/**
 * Generated class for the BusinessKycPanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-kyc-pan',
  templateUrl: 'business-kyc-pan.html',
  styleUrls: ['business-kyc-pan.scss']
})
export class BusinessKycPanPage {
  panKyc: PanInfo = new PanInfo()
  businessKYCPan: FormGroup
  checkValidation: boolean = false
  imageURI: any
  imageFileName: any
  fileName: any
  myClass: any
  isFileAbsent: boolean = true
  uploadClick: any
  path: any
  userFirstName
  panNumber: any
  panCardInvalid: boolean = false
  loading
  actionSheetCtrl
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  constructor(
    public loadingCtrl: LoadingController,
    private apiProvider: KycService,
    public logErrorService: InserErrorLogService,
    private storage: Storage,
    private platform: Platform,
    public actionSheet: ActionSheetController,
    public navCtrl: NavController,
    private fb: FormBuilder,
    public toastCtrl: ToastController,
    public imgService: CommonUtilsService,
    public file: File
  ) {
    this.businessKYCPan = this.fb.group({
      panNo: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}'),
        ]),
      ],
    })

    this.storage.get('userInfo').then((val) => {
      this.panKyc.userId = val.userId
      this.panKyc.panType = 'Business'
    })
    this.myClass = 'hide'

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

  /**
   * closes current page
   */
  goBack() {
    this.navCtrl.pop()
  }

  /**
   * submits pan card details
   */
  submitPan() {
    this.checkValidation = true
    this.panKyc.panNumber = this.businessKYCPan.value.panNo
    if (this.panKyc.panNumber != undefined)
      this.panKyc.panNumber = this.panKyc.panNumber.toUpperCase()
    if (this.businessKYCPan.valid && this.isFileAbsent == false) {
      this.loading.present()
      this.apiProvider.submitPan(this.panKyc).subscribe(
        async (res: any) => {
          Utility.showToast(
            this.toastCtrl,
            Constants.panUpload,
            false,
            '',
            false
          )
          if (this.loading) this.loading.dismiss()
          this.url = Urls.baseUrl + Urls.port + Constants.kycPAN
          this.stackTrace = ''
          this.message = 'Pan successfully added'
          this.method = 'submitPan'
          this.inserErrorApi()
          // this.navCtrl.push(BusinessKycGstPage)
          await this.navCtrl.navigateForward('BusinessKycGstPage')

        },
        (err) => {
          if (this.loading) this.loading.dismiss()
          Utility.showToast(this.toastCtrl, err, false, '', false)
          this.url = Urls.baseUrl + Urls.port + Constants.kycPAN
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'submitPan'
          this.inserErrorApi()
        }
      )
    } else {
    }
  }

  /**
   * gets image from gallery or camera
   * @param index to add remove button
   */
  async editphoto(index: any) {
    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.imgService.getImagePromise('Camera').subscribe(
            (res: any) => {
              this.panKyc.panImgBase64 = res.base64
              this.panKyc.FileName = res.fileName
              this.panKyc.ImageURL = ''
              this.myClass = 'view'
              this.uploadClick = 'hide'
              this.isFileAbsent = false
            },
            (err) => {
              console.log('Gallery', err)
            }
          )
        },
      }, {
        text: 'Gallery',
        handler: () => {
          this.imgService.getImagePromise('Gallery').subscribe(
            (res: any) => {
              this.panKyc.panImgBase64 = res.base64
              this.panKyc.FileName = res.fileName
              this.panKyc.ImageURL = ''
              this.myClass = 'view'
              this.uploadClick = 'hide'
              this.isFileAbsent = false
            },
            (err) => {
              console.log('Gallery', err)
            }
          )
        },
      }, (index == 1 && {
        text: 'Remove',
        handler: () => {
          this.panKyc.panImgBase64 = ''
          this.panKyc.FileName = ''
          this.myClass = 'hide'
          this.uploadClick = 'view'
          this.isFileAbsent = true
        },
      })]
    })
    // this.actionSheetCtrl.addButton()
    // this.actionSheetCtrl.addButton()

    // if (index == 1) {
    //   this.actionSheetCtrl.addButton({
    //     text: 'Remove',
    //     handler: () => {
    //       this.panKyc.panImgBase64 = ''
    //       this.panKyc.FileName = ''
    //       this.myClass = 'hide'
    //       this.uploadClick = 'view'
    //       this.isFileAbsent = true
    //     },
    //   })
    // }
    this.actionSheetCtrl.present()
  }

  /**
   * gets user to Dashboard
   */
  async goToDashboad() {
    Utility.companyLogoDetails = new UploadCompanyLogoInfo()
    await this.navCtrl.navigateRoot('DashboardPage')
  }
  inserErrorApi() {
    let Input = {
      userId: this.panKyc.userId,
      panNumber: this.panKyc.panNumber,
      ImageURL: this.panKyc.ImageURL,
      panImgBase64: this.panKyc.panImgBase64,
      FileName: this.panKyc.FileName,
      panType: this.panKyc.panType,
    }
    this.logError.Url = this.url
    this.logError.UserId = this.panKyc.userId
    this.logError.createdBy = this.panKyc.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace + ' ' + 'input' + Input
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'BusinessKycPanPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
