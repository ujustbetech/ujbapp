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
import { PanInfo } from '../../../../app/models/PanInfo'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { KycService } from '../../../services/kyc.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the KycPanCardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-kyc-pan-card',
  templateUrl: 'kyc-pan-card.html',
  styleUrls: ['kyc-pan-card.scss']
})
export class KycPanCardPage implements OnInit {
  panKyc: PanInfo = new PanInfo()
  vewAadharKyc: AadharInfo = new AadharInfo()
  viewKycCheque: BankDetailsInfo = new BankDetailsInfo()
  KYCPanForm: FormGroup
  checkValidation: boolean = false
  imageURI: any
  imageFileName: any
  imagePath: any
  fileName: any
  myClass: any
  uploadPhoto
  uploadClick: any
  isFileAbsent: boolean = true
  path1
  isEditOption
  panNumber
  loading
  viewPan: boolean = false
  panCardInvalid: boolean = false
  viewBase64
  allowApi: boolean = true
  viewPanNumber: string = ''
  actionSheetCtrl
  panNumberString
  showSpace: any
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  isFirstTime
  constructor(
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public logErrorService: InserErrorLogService,
    public imgService: CommonUtilsService,
    public actionSheet: ActionSheetController,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private platform: Platform,
    public fileProvider: File,
    private apiProvider: KycService,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private kycDetailProvider: UserProfileService
  ) {
    route.queryParams.subscribe((params: any) => {
      this.isFirstTime = params.isFirstTime
      if (this.platform.is('ios')) {
        this.showSpace = 'view'
      }
  
      this.panKyc = new PanInfo()
      this.KYCPanForm = this.fb.group({
        panNumber: [null, Validators.pattern('[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}')],
      })
      this.myClass = 'hide'
      this.uploadClick = 'view'
  
      this.storage.get('userInfo').then((val) => {
        this.panKyc.userId = val.userId
        this.panKyc.panType = 'Individual'
      })
  
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
    })
  }

  ionViewDidEnter() {
    this.storage.get('userInfo').then((val) => {
      this.panKyc.userId = val.userId
      this.panKyc.panType = 'Individual'

      if (this.isFirstTime == false)
        this.getKycDetails(this.panKyc.userId)
    })
  }

  ngOnInit() {
    console.log('ngOnInit KycPanCardPage')
  }

  async submitPanDetail() {
    this.checkValidation = true
    if (this.viewPan) {
      if (
        this.viewPanNumber == this.KYCPanForm.value.panNumber &&
        this.panKyc.panImgBase64 == this.viewBase64
      ) {
        this.allowApi = false
      } else {
        this.allowApi = true
      }
    }
    if (
      this.KYCPanForm.value.panNumber != null &&
      this.KYCPanForm.value.panNumber != undefined &&
      this.KYCPanForm.value.panNumber != ''
    ) {
      var str = this.KYCPanForm.value.panNumber
      this.panKyc.panNumber = str.toUpperCase()
    }

    if (this.KYCPanForm.valid) {
      if (
        (this.panKyc.panImgBase64 != undefined ||
          this.KYCPanForm.value.panNumber != undefined) &&
        this.allowApi
      ) {
        if (
          this.KYCPanForm.value.panNumber != '' ||
          this.panKyc.panImgBase64 != ''
        ) {
          if (str != undefined) this.panKyc.panNumber = str.toUpperCase()
          if (
            this.panKyc.panNumber.length == 10 ||
            this.panKyc.panNumber.length == 0
          ) {
            this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
            this.loading.present()
            console.log('this.panKyc json', JSON.stringify(this.panKyc))
            console.log('this.panKyc', this.panKyc)
            this.apiProvider.submitPan(this.panKyc).subscribe(
              async (res: any) => {
                console.log('pan upload', res)
                this.toastCtrl
                  .create({
                    message: Constants.panUpload,
                    showCloseButton: true,
                    duration: 2000,
                    closeButtonText: 'OK',
                    position: 'bottom',
                    cssClass: 'ujb_toast',
                  }).then(ctrl => ctrl.present())
                if (this.loading) this.loading.dismiss()
                await this.navCtrl.navigateForward('KycAdharCardPage', { queryParams: {
                  aadharData: this.vewAadharKyc,
                  bankData: this.viewKycCheque,
                }})
              },
              (err) => {
                if (this.loading) this.loading.dismiss()
                Utility.showToast(this.toastCtrl, err, false, '', false)
                setTimeout(() => {}, Constants.toastTimeOut)
                this.url = Urls.baseUrl + Urls.port + Constants.kycPAN
                this.stackTrace = err.stack
                this.message = err.message
                this.method = 'submitPan'
                this.inserErrorApi()
              }
            )
          }
        } else {
          await this.navCtrl.navigateForward('KycAdharCardPage', { queryParams: {
            aadharData: this.vewAadharKyc,
            bankData: this.viewKycCheque,
          }})
        }
      } else {
        await this.navCtrl.navigateForward('KycAdharCardPage', { queryParams: {
          aadharData: this.vewAadharKyc,
          bankData: this.viewKycCheque,
        }})
      }
    }
  }

  async editPhoto(index) {
    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.imgService.getImagePromise('Camera')
            .subscribe((res: any) => {
              this.fileName = res.fileName
              this.imageURI = res.base64
              this.panKyc.panImgBase64 = res.base64
              this.panKyc.FileName = res.fileName
              this.panKyc.ImageURL = ''
              console.log('Camera', this.panKyc.panImgBase64)
              this.myClass = 'view'
              this.uploadClick = 'hide'
              if (this.platform.is('ios')) {
                this.showSpace = 'hide'
              }
            }, (err) => {
              console.log('Camera', err)
            })
        },
      }, {
        text: 'Gallery',
        handler: () => {
          this.imgService.getImagePromise('Gallery').subscribe((res: any) => {
              console.log('Gallery', res)
              this.fileName = res.fileName
              this.imageURI = res.base64
              this.panKyc.panImgBase64 = res.base64
              this.panKyc.FileName = res.fileName
              this.panKyc.ImageURL = ''
              this.myClass = 'view'
              this.uploadClick = 'hide'
              if (this.platform.is('ios')) {
                this.showSpace = 'hide'
              }
            }, (err) => {
              console.log('Gallery', err)
            })
        },
      }, (index == 1 && {
        text: 'Remove',
        handler: () => {
          console.log('this.panKyc remove', this.panKyc)
          this.panKyc.panImgBase64 = ''
          this.panKyc.FileName = ''
          this.myClass = 'hide'
          this.uploadClick = 'view'
          if (this.platform.is('ios')) {
            this.showSpace = 'view'
          }
        },
      })]
    })

    // this.actionSheetCtrl.addButton()
    // this.actionSheetCtrl.addButton()

    // if (index == 1) {
    //   this.actionSheetCtrl.addButton()
    // }
    this.actionSheetCtrl.present()
  }

  async goToDashboard() {
    await this.navCtrl.navigateRoot('DashboardPage')
  }

  async getKycDetails(id) {
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.loading.present()
    this.apiProvider.getPartnerKYC(id).subscribe(
      (res: any) => {
        console.log('getKycDetails res', res)

        if (this.loading) this.loading.dismiss()
        if (res.json.data.userKycInfo) {
          this.panNumber = res.json.data.userKycInfo.panCard.panNumber
          this.viewPanNumber = res.json.data.userKycInfo.panCard.panNumber
          if (
            res.json.data.userKycInfo.panCard.imageURL != undefined &&
            res.json.data.userKycInfo.panCard.imageURL != null &&
            res.json.data.userKycInfo.panCard.imageURL != ''
          ) {
            this.panKyc.ImageURL = res.json.data.userKycInfo.panCard.imageURL
            this.panKyc.panImgBase64 = Utility.getImageUrl(
              res.json.data.userKycInfo.panCard.imageURL
            )
            this.panKyc.FileName = res.json.data.userKycInfo.panCard.fileName
            console.log('this.panKyc.panImgBase64', this.panKyc.panImgBase64)
            this.viewBase64 = Utility.getImageUrl(
              res.json.data.userKycInfo.panCard.imageURL
            )
            this.myClass = 'view'
            this.uploadClick = 'hide'
          } else {
            this.myClass = 'hide'
            this.uploadClick = 'view'
          }
          //this.panKyc.ImageURL = res.json.data.userKycInfo.panCard.panImgType;
          if (
            (res.json.data.userKycInfo.panCard.panNumber != null &&
              res.json.data.userKycInfo.panCard.panNumber != undefined) ||
            (res.json.data.userKycInfo.panCard.panBase64Img != null &&
              res.json.data.userKycInfo.panCard.panBase64Img != undefined) ||
            (res.json.data.userKycInfo.panCard.panImgType != null &&
              res.json.data.userKycInfo.panCard.panImgType != undefined)
          ) {
            this.viewPan = true
          }
          if (res.json.data.userKycInfo.adharCard) {
            if (
              res.json.data.userKycInfo.adharCard.frontImageURL != undefined &&
              res.json.data.userKycInfo.adharCard.frontImageURL != null &&
              res.json.data.userKycInfo.adharCard.frontImageURL != ''
            ) {
              this.vewAadharKyc.aadharFrontBase64 = Utility.getImageUrl(
                res.json.data.userKycInfo.adharCard.frontImageURL
              )
              this.vewAadharKyc.FrontImageURL =
                res.json.data.userKycInfo.adharCard.frontImageURL
              this.vewAadharKyc.FrontFileName =
                res.json.data.userKycInfo.adharCard.frontFileName
            }

            if (
              res.json.data.userKycInfo.adharCard.backImageURL != undefined &&
              res.json.data.userKycInfo.adharCard.backImageURL != null &&
              res.json.data.userKycInfo.adharCard.backImageURL != ''
            ) {
              this.vewAadharKyc.aadharBackBase64 = Utility.getImageUrl(
                res.json.data.userKycInfo.adharCard.backImageURL
              )
              this.vewAadharKyc.BackImageURL =
                res.json.data.userKycInfo.adharCard.backImageURL
              this.vewAadharKyc.BackFileName =
                res.json.data.userKycInfo.adharCard.backFileName
            }

            this.vewAadharKyc.aadharNumber =
              res.json.data.userKycInfo.adharCard.adharNumber
          }
          if (res.json.data.userKycInfo.bankDetails) {
            this.viewKycCheque.BankDetails.accountHolderName =
              res.json.data.userKycInfo.bankDetails.accountHolderName
            this.viewKycCheque.BankDetails.accountNumber =
              res.json.data.userKycInfo.bankDetails.accountNumber
            this.viewKycCheque.BankDetails.bankName =
              res.json.data.userKycInfo.bankDetails.bankName
            this.viewKycCheque.BankDetails.IFSCCode =
              res.json.data.userKycInfo.bankDetails.ifscCode
            if (
              res.json.data.userKycInfo.bankDetails.imageURL != undefined &&
              res.json.data.userKycInfo.bankDetails.imageURL != null &&
              res.json.data.userKycInfo.bankDetails.imageURL != ''
            ) {
              this.viewKycCheque.BankDetails.cancelChequebase64Img =
                Utility.getImageUrl(
                  res.json.data.userKycInfo.bankDetails.imageURL
                )
              this.viewKycCheque.BankDetails.ImageURL =
                res.json.data.userKycInfo.bankDetails.imageURL
              this.viewKycCheque.BankDetails.FileName =
                res.json.data.userKycInfo.bankDetails.fileName
            }
          }
          console.log('this.viewPanNumber', this.viewPanNumber)
          console.log('this.vewAadharKyc', this.vewAadharKyc)
          console.log('this.viewKycCheque', this.viewKycCheque)
        }
      },
      (err) => {
        if (this.loading) this.loading.dismiss()
        console.log('getKycDetails err', err)
        this.url = Urls.baseUrl + Urls.port + Constants.getPartnerKYC
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getKycDetails'
        this.inserErrorApi()
      }
    )
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
    this.logError.error = this.stackTrace + 'entered pan details' + Input
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'KycPanCardPage'
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
