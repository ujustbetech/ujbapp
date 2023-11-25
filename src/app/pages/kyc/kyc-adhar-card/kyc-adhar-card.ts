import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {  AlertController, NavController, Platform, ToastController } from '@ionic/angular'

import { AadharInfo } from '../../../../app/models/AadharInfo'
import { ActionSheetController } from '@ionic/angular'
import { BankDetailsInfo } from '../../../../app/models/BankDetailsInfo'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { File } from '@ionic-native/file/ngx'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { KycService } from '../../../services/kyc.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the KycAdharCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-kyc-adhar-card',
  templateUrl: 'kyc-adhar-card.html',
  styleUrls:['kyc-adhar-card.scss']
})
export class KycAdharCardPage {
  aadharKyc: AadharInfo = new AadharInfo()
  viewKycCheque: BankDetailsInfo = new BankDetailsInfo()
  userFirstName: any
  inputValue: any
  KYCAdharForm: FormGroup
  checkValidation: boolean = false
  imageURI1: any
  imageURI: any
  fileName: any
  fileName1: any
  myClass: any = 'hide'
  myClass1: any = 'hide'
  uploadClick: any
  uploadClick1: any
  path: any
  path1: any
  loading
  viewAadhar: boolean = false
  allowApi: boolean = true
  viewAadharData: AadharInfo = new AadharInfo()
  receivedAadhar: AadharInfo = new AadharInfo()
  isNan: boolean = false
  actionSheetCtrl
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url

  constructor(
    public loadingCtrl: LoadingController,
    public logErrorService: InserErrorLogService,
    private storage: Storage,
    public file: File,
    public imgService: CommonUtilsService,
    private platform: Platform,
    public toastCtrl: ToastController,
    public actionSheet: ActionSheetController,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private provider: KycService,
    private alertCtrl: AlertController
  ) {
    route.queryParams.subscribe((params: any) => {
      this.KYCAdharForm = this.fb.group({
        aadharNumber: [null, Validators.minLength(12)],
      })
      // this.myClass = 'hide'
      // this.myClass1 = 'hide'
      // this.uploadClick = 'view'
      // this.uploadClick1 = 'view'
      this.storage.get('userInfo').then((val) => {
        this.aadharKyc.userId = val.userId
      })
      console.log('aaadhar card p[age loaded')
      this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
      this.viewKycCheque = params.bankData
      this.receivedAadhar = params.aadharData
      console.log('this.receivedAadhar', this.receivedAadhar)
      if (this.receivedAadhar) {
        this.aadharKyc.aadharBackBase64 = this.receivedAadhar.aadharBackBase64
        this.aadharKyc.aadharFrontBase64 = this.receivedAadhar.aadharFrontBase64
        this.inputValue = this.receivedAadhar.aadharNumber
  
        this.aadharKyc.BackFileName = this.receivedAadhar.BackFileName
        this.aadharKyc.FrontFileName = this.receivedAadhar.FrontFileName
        this.aadharKyc.BackImageURL = this.receivedAadhar.BackImageURL
        this.aadharKyc.FrontImageURL = this.receivedAadhar.FrontImageURL
  
        this.viewAadharData.aadharNumber = this.receivedAadhar.aadharNumber
        this.viewAadharData.aadharFrontBase64 =
          this.receivedAadhar.aadharFrontBase64
        this.viewAadharData.aadharBackBase64 =
          this.receivedAadhar.aadharBackBase64
  
        this.viewAadharData.BackFileName = this.receivedAadhar.BackFileName
        this.viewAadharData.FrontFileName = this.receivedAadhar.FrontFileName
        this.viewAadharData.BackImageURL = this.receivedAadhar.BackImageURL
        this.viewAadharData.FrontImageURL = this.receivedAadhar.FrontImageURL
  
        if (
          this.inputValue != null &&
          this.inputValue != undefined &&
          this.inputValue != ''
        ) {
          this.validateIsNan(this.inputValue)
        }
  
        if (this.receivedAadhar.aadharFrontBase64) {
          this.myClass = 'view'
          this.uploadClick = 'hide'
        }
        if (this.receivedAadhar.aadharBackBase64) {
          this.myClass1 = 'view'
          this.uploadClick1 = 'hide'
        }
        if (
          this.receivedAadhar.aadharNumber != '' ||
          this.receivedAadhar.aadharFrontBase64 ||
          this.receivedAadhar.aadharBackBase64
        ) {
          this.viewAadhar = true
        }
      }
      this.platform.backButton.subscribe(() => {
        console.log('cp personel tab')
        if (this.actionSheetCtrl) {
          this.actionSheetCtrl.dismiss()
          this.actionSheetCtrl = undefined
        } else {
          this.navCtrl.pop()
        }
      })
      
    })
  }

  async submitAadharDetails() {
    this.checkValidation = true
    this.aadharKyc.aadharNumber = this.KYCAdharForm.value.aadharNumber
    if (this.viewAadhar) {
      if (
        this.viewAadharData.aadharNumber == this.aadharKyc.aadharNumber &&
        this.viewAadharData.aadharFrontBase64 ==
          this.aadharKyc.aadharFrontBase64 &&
        this.viewAadharData.aadharBackBase64 == this.aadharKyc.aadharBackBase64
      ) {
        this.allowApi = false
        this.checkValidation = false
      }
    }
    if (this.KYCAdharForm.valid) {
      if (
        (this.KYCAdharForm.value.aadharNumber != undefined ||
          this.aadharKyc.aadharBackBase64 != undefined ||
          this.aadharKyc.aadharFrontBase64 != undefined) &&
        this.allowApi
      ) {
        if (
          this.aadharKyc.aadharBackBase64 != '' ||
          this.aadharKyc.aadharFrontBase64 != '' ||
          this.KYCAdharForm.value.aadharNumber != ''
        ) {
          if (this.isNan == false) {
            this.loading.present()
            console.log('this.aadharKyc json', JSON.stringify(this.aadharKyc))
            this.provider.submitAadhar(this.aadharKyc).subscribe(
              async (res: any) => {
                console.log('submitAadhar res', res)
                if (this.loading) this.loading.dismiss()
                this.toastCtrl
                  .create({
                    message: Constants.aadharUpload,
                    showCloseButton: true,
                    duration: 2000,
                    closeButtonText: 'OK',
                    cssClass: 'ujb_toast',
                    position: 'bottom',
                  }).then(ctrl => ctrl.present())
                this.url = Urls.baseUrl + Urls.port + Constants.kycAadhar
                this.stackTrace = ''
                this.message = ''
                this.method = 'submitAadharDetails'
                this.inserErrorApi()
                await this.navCtrl.navigateForward('KycCancledChecquePage', { queryParams: {
                  bankData: this.viewKycCheque,
                }})
              },
              (err) => {
                if (this.loading) this.loading.dismiss()
                console.log('submitAadhar err', err)
                Utility.showToast(this.toastCtrl, err, false, '', false)
                setTimeout(() => {}, Constants.toastTimeOut)
                this.url = Urls.baseUrl + Urls.port + Constants.kycBank
                this.stackTrace = err.stack
                this.message = err.message
                this.method = 'submitChecqueDetail'
                this.inserErrorApi()
              }
            )
          }
        } else {
          await this.navCtrl.navigateForward('KycCancledChecquePage', { queryParams: {
            bankData: this.viewKycCheque,
          }})
        }
      } else {
        await this.navCtrl.navigateForward('KycCancledChecquePage', { queryParams: {
          bankData: this.viewKycCheque,
        }})
      }
    }
  }

  AdharNumberSpace(val) {
    /**code to give a space after 4 digits */
    console.log('value', val._value)
    let char = val._value.split(' ').join('')
    if (char.length > 0) {
      char = char.match(new RegExp('.{1,4}', 'g')).join(' ')
    }
    console.log(char)
    this.inputValue = char
  }

  async frontSideImg(index: any) {
    ////
    console.log('sdbhasjdb123')
    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [{
        text: 'Camera',
        handler: () => {
          ////
          console.log('camera front')
          this.imgService.getImagePromise('Camera').subscribe(
            (res: any) => {
              ////
              console.log('camera front', res)
              // console.log("res", res)
              // this.imageURI =res.base64;
              this.aadharKyc.aadharFrontBase64 = res.base64
              this.aadharKyc.aadharFrontType = res.fileType
              this.aadharKyc.FrontFileName = res.fileName
              this.aadharKyc.FrontImageURL = ''
              this.myClass = 'view'
              this.uploadClick = 'hide'
              // console.log("imageUri", this.imageURI)
            },
            (err) => {
              console.log('err', err)
            }
          )
        },
      }, {
        text: 'Gallery',
        handler: () => {
          console.log('GFalery front')
          this.imgService.getImagePromise('Gallery').subscribe(
            (res: any) => {
              console.log(' galary front res res', res)
              this.imageURI = res.base64
              this.aadharKyc.aadharFrontBase64 = res.base64
              this.aadharKyc.aadharFrontType = res.fileType
              this.aadharKyc.FrontFileName = res.fileName
              this.aadharKyc.FrontImageURL = ''
              this.myClass = 'view'
              this.uploadClick = 'hide'
              console.log('imageUri', this.imageURI)
            },
            (err) => {
              console.log('err', err)
            }
          )
        },
      }, ( index == 1 && {
        text: 'Remove',
        handler: () => {
          this.aadharKyc.aadharFrontBase64 = ''
          this.aadharKyc.aadharFrontType = ''
          this.aadharKyc.FrontFileName = ''
          this.myClass = 'hide'
          this.uploadClick = 'view'
        },
      })]
    })
    // this.actionSheetCtrl.addButton()
    // this.actionSheetCtrl.addButton()

    // if (index == 1) {
    //   ////
    //   this.actionSheetCtrl.addButton()
    // }
    this.actionSheetCtrl.present()
  }

  async backSideImg(index: any) {
    ////
    console.log('backend')
    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [{
        text: 'Camera',
        handler: () => {
          console.log('backend camera')
          this.imgService.getImagePromise('Camera').subscribe(
            (res: any) => {
              console.log('backend res cam', res)
  
              this.aadharKyc.aadharBackBase64 = res.base64
              this.aadharKyc.aadharBackType = res.fileType
              this.aadharKyc.BackFileName = res.fileName
              this.aadharKyc.BackImageURL = ''
              this.myClass1 = 'view'
              this.uploadClick1 = 'hide'
              console.log('imageUri', this.imageURI)
            },
            (err) => {
              console.log('Camera', err)
              //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
            }
          )
        },
      },{
        text: 'Gallery',
        handler: () => {
          ////
          console.log('backend galery')
          this.imgService.getImagePromise('Gallery').subscribe(
            (res: any) => {
              ////
              console.log('backend gal res', res)
              // this.imageURI1 =res.base64;
              this.aadharKyc.aadharBackBase64 = res.base64
              this.aadharKyc.aadharBackType = res.fileType
              this.aadharKyc.BackFileName = res.fileName
              this.aadharKyc.BackImageURL = ''
              this.myClass1 = 'view'
              this.uploadClick1 = 'hide'
              console.log('imageUri', this.imageURI)
            },
            (err) => {
              console.log('Gallery', err)
              //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
            }
          )
        },
      }, ( index == 1 && {
        text: 'Remove',
        handler: () => {
          this.aadharKyc.aadharBackBase64 = ''
          this.aadharKyc.aadharBackType = ''
          this.aadharKyc.BackFileName = ''
          this.myClass1 = 'hide'
          this.uploadClick1 = 'view'
        },
      })]
    })

    // this.actionSheetCtrl.addButton()
    // this.actionSheetCtrl.addButton()
    // if (index == 1) {
    //   ////
    //   this.actionSheetCtrl.addButton()
    // }
    this.actionSheetCtrl.present()
  }
  goBack() {
    this.navCtrl.pop()
  }
  async gotoDashboard() {
    await this.navCtrl.navigateRoot('DashboardPage')
  }

  onKey(event) {
    this.validateIsNan(event.srcElement.value)
  }

  validateIsNan(value: string) {
    if (value.startsWith(' ')) {
      this.isNan = true
    } else if (value.endsWith(' ')) {
      this.isNan = true
    } else {
      let temp = value.split(' ').join('')
      console.log(Number(temp))
      if (isNaN(Number(temp))) {
        this.isNan = true
      } else {
        if (temp.indexOf('.') > -1) {
          this.isNan = true
        } else {
          this.isNan = false
        }
      }
    }
  }
  inserErrorApi() {
    let Input = {
      userId: this.aadharKyc.userId,
      aadharNumber: this.aadharKyc.aadharNumber,
      FrontImageURL: this.aadharKyc.FrontImageURL,
      aadharFrontBase64: this.aadharKyc.aadharFrontBase64,
      aadharFrontType: this.aadharKyc.aadharFrontType,
      FrontFileName: this.aadharKyc.FrontFileName,
      BackImageURL: this.aadharKyc.BackImageURL,
      aadharBackBase64: this.aadharKyc.aadharBackBase64,
      aadharBackType: this.aadharKyc.aadharBackType,
      BackFileName: this.aadharKyc.BackFileName,
    }
    this.logError.Url = this.url
    this.logError.UserId = this.aadharKyc.userId
    this.logError.createdBy = this.aadharKyc.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace + 'entered adhar details' + Input
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'KycAdharCardPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe(
      (res: any) => {
        console.log('res in 200 logs', res)
      },
      (err) => {
        console.log('err in logs', err)
      }
    )
  }
}
