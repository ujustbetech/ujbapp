import { BanckDetail, BankDetailsInfo } from '../../../../app/models/BankDetailsInfo'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {  NavController, Platform, ToastController } from '@ionic/angular'

import { ActionSheetController } from '@ionic/angular'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { DashboardPage } from '../../dashboard/dashboard'
import { File } from '@ionic-native/file/ngx'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { KycService } from '../../../services/kyc.service'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the KycCancledChecquePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-kyc-cancled-checque',
  templateUrl: 'kyc-cancled-checque.html',
  styleUrls: ['kyc-cancled-checque.scss']
})
export class KycCancledChecquePage implements OnInit {
  kycCheque: BankDetailsInfo = new BankDetailsInfo()
  bankDetails: BanckDetail = new BanckDetail()
  viewKyc: boolean = false
  viewBankKycData: BankDetailsInfo = new BankDetailsInfo()
  userFirstName: any
  cancelChequeForm: FormGroup
  imageURI: any
  fileName: any
  myClass: any
  uploadClick: any
  checkValidation: boolean = false
  path: any
  loading
  isNan: boolean = false
  allowApi: boolean = true
  receivedKycData: BankDetailsInfo = new BankDetailsInfo()
  actionSheetCtrl
  public pushNow = false
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private provider: KycService,
    private storage: Storage,
    public file: File,
    public imgService: CommonUtilsService,
    private platform: Platform,
    public logErrorService: InserErrorLogService,
    public actionSheet: ActionSheetController,
    public navCtrl: NavController,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    route.queryParams.subscribe((params: any) => {
      this.cancelChequeForm = this.fb.group({
        accountNum: [
          null,
          Validators.compose([
            Validators.minLength(6),
            Validators.pattern('[0-9]*'),
          ]),
        ],
        //code: [null, Validators.maxLength(11)],
        code: [null, Validators.pattern('[A-Za-z]{4}[0]{1}[A-Za-z0-9]{6}')],
        bankName: [null, Validators.pattern('^[a-zA-Z ]*$')],
        accountHolderName: [null, Validators.pattern('^[a-zA-Z ]*$')],
      })
      this.uploadClick = 'view'
      this.myClass = 'hide'
      this.storage.get('userInfo').then((val) => {
        this.kycCheque.userId = val.userId
      })
      this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
      this.receivedKycData = params.bankData
  
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
    if (this.receivedKycData) {
      this.viewKyc = true
      this.viewBankKycData = new BankDetailsInfo()
      this.viewBankKycData.BankDetails.accountHolderName =
        this.receivedKycData.BankDetails.accountHolderName
      this.viewBankKycData.BankDetails.accountNumber =
        this.receivedKycData.BankDetails.accountNumber
      this.viewBankKycData.BankDetails.bankName =
        this.receivedKycData.BankDetails.bankName
      this.viewBankKycData.BankDetails.IFSCCode =
        this.receivedKycData.BankDetails.IFSCCode
      this.viewBankKycData.BankDetails.cancelChequebase64Img =
        this.receivedKycData.BankDetails.cancelChequebase64Img
      this.viewBankKycData.BankDetails.FileName =
        this.receivedKycData.BankDetails.FileName
      this.viewBankKycData.BankDetails.ImageURL =
        this.receivedKycData.BankDetails.ImageURL

      this.kycCheque.BankDetails.accountHolderName =
        this.receivedKycData.BankDetails.accountHolderName
      this.kycCheque.BankDetails.accountNumber =
        this.receivedKycData.BankDetails.accountNumber
      this.kycCheque.BankDetails.bankName =
        this.receivedKycData.BankDetails.bankName
      this.kycCheque.BankDetails.IFSCCode =
        this.receivedKycData.BankDetails.IFSCCode
      this.kycCheque.BankDetails.cancelChequebase64Img =
        this.receivedKycData.BankDetails.cancelChequebase64Img
      this.kycCheque.BankDetails.FileName =
        this.receivedKycData.BankDetails.FileName
      this.kycCheque.BankDetails.ImageURL =
        this.receivedKycData.BankDetails.ImageURL
      if (this.viewBankKycData.BankDetails.cancelChequebase64Img) {
        this.uploadClick = 'hide'
        this.myClass = 'view'
      }
    }
  }

  ngOnInit() {
    console.log('ngOnInit KycCancledChecquePage')
  }

  async submitChecqueDetail() {
    if (this.viewKyc) {
      if (
        this.cancelChequeForm.value.accountHolderName ==
          this.kycCheque.BankDetails.accountHolderName &&
        this.cancelChequeForm.value.accountNum ==
          this.kycCheque.BankDetails.accountNumber &&
        this.cancelChequeForm.value.bankName ==
          this.kycCheque.BankDetails.bankName &&
        this.cancelChequeForm.value.code ==
          this.kycCheque.BankDetails.IFSCCode &&
        this.viewBankKycData.BankDetails.cancelChequebase64Img ==
          this.kycCheque.BankDetails.cancelChequebase64Img
      ) {
        this.allowApi = false
      }
    }
    if (this.cancelChequeForm.value.accountHolderName) {
      var str1 = this.cancelChequeForm.value.accountHolderName
        .toLowerCase()
        .split(' ')
      for (var i = 0; i < str1.length; i++) {
        if (str1.length == 1) {
          str1[i] = str1[i].split('')
          str1[i][0] = str1[i][0].toUpperCase()
          str1[i] = str1[i].join('')
        }
      }
      this.kycCheque.BankDetails.accountHolderName = str1.join(' ')
      console.log(
        'acnt holder name',
        this.kycCheque.BankDetails.accountHolderName
      )
    }
    if (this.cancelChequeForm.value.bankName) {
      var str1 = this.cancelChequeForm.value.bankName.toLowerCase().split(' ')
      for (var i = 0; i < str1.length; i++) {
        if (str1.length == 1) {
          str1[i] = str1[i].split('')
          str1[i][0] = str1[i][0].toUpperCase()
          str1[i] = str1[i].join('')
        }
      }
      this.kycCheque.BankDetails.bankName = str1.join(' ')
      console.log('acnt holder name', this.kycCheque.BankDetails.bankName)
    }
    if (this.cancelChequeForm.value.code) {
      var str = this.cancelChequeForm.value.code
      this.kycCheque.BankDetails.IFSCCode = str.toUpperCase()
    }
    this.kycCheque.BankDetails.accountNumber =
      this.cancelChequeForm.value.accountNum

    //this.kycCheque.BankDetails.IFSCCode = this.cancelChequeForm.value.code;
    // //
    console.log('submitChecque', JSON.stringify(this.kycCheque))
    if (this.cancelChequeForm.valid) {
      if (this.allowApi) {
        // let loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
        //
        this.loading.present()
        console.log('submitChecque', JSON.stringify(this.kycCheque))
        this.provider.submitChecque(this.kycCheque).subscribe(
          async (res: any) => {
            if (this.loading) this.loading.dismiss()
            // Utility.showToast(this.toastCtrl, Constants.bankUpload, false, '')
            this.url = Urls.baseUrl + Urls.port + Constants.kycBank
            this.stackTrace = ''
            this.message = ''
            this.method = 'submitChecqueDetail'
            this.inserErrorApi()
            this.toastCtrl
              .create({
                message: Constants.bankUpload,
                showCloseButton: true,
                duration: 2000,
                closeButtonText: 'OK',
                position: 'bottom',
                cssClass: 'ujb_toast',
              }).then(ctrl => ctrl.present())

            setTimeout(async () => {
            await this.navCtrl.navigateForward('DashboardPage')
            }, Constants.toastTimeOut);
            //// this.navCtrl.push(DashboardPage)
          },
          (err) => {
            if (this.loading) this.loading.dismiss()
            Utility.showToast(this.toastCtrl, err, false, '', false)
            setTimeout(() => {
              //// this.navCtrl.push(ErrorPage)
            }, Constants.toastTimeOut)
            //// this.navCtrl.push(ErrorPage)

            this.url = Urls.baseUrl + Urls.port + Constants.kycBank
            this.stackTrace = err.stack
            this.message = err.message
            this.method = 'submitChecqueDetail'
            this.inserErrorApi()
          }
        )
      } else {
        await this.navCtrl.navigateRoot('DashboardPage')
      }
    }
  }

  async editPhoto(index) {
    this.actionSheetCtrl = await this.actionSheet.create({
      header: 'Upload from Phone',
      buttons: [{
        text: 'Camera',
        handler: () => {
          this.imgService.getImagePromise('Camera').subscribe(
            (res: any) => {
              this.imageURI = res.base64
              this.kycCheque.BankDetails.cancelChequebase64Img = res.base64
              this.kycCheque.BankDetails.cancelChequeImgType = res.fileType
              this.kycCheque.BankDetails.FileName = res.fileName
              this.kycCheque.BankDetails.ImageURL = ''
              this.myClass = 'view'
              this.uploadClick = 'hide'
            },
            (err) => {
              console.log('Camera', err)
              //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
            }
          )
        },
      }, {
        text: 'Gallery',
        handler: () => {
          this.imgService.getImagePromise('Gallery').subscribe(
            (res: any) => {
              this.imageURI = res.base64
              this.kycCheque.BankDetails.cancelChequebase64Img = res.base64
              this.kycCheque.BankDetails.cancelChequeImgType = res.fileType
              this.kycCheque.BankDetails.FileName = res.fileName
              this.kycCheque.BankDetails.ImageURL = ''
              this.myClass = 'view'
              this.uploadClick = 'hide'
            },
            (err) => {
              console.log('Gallery', err)
              //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
            }
          )
        },
      }, (index == 1 && {
        text: 'Remove',
        handler: () => {
          this.kycCheque.BankDetails.cancelChequebase64Img = ''
          this.kycCheque.BankDetails.cancelChequeImgType = ''
          this.kycCheque.BankDetails.FileName = ''
          this.myClass = 'hide'
          this.uploadClick = 'view'
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

  goBack() {
    this.navCtrl.pop()
  }

  async gotoDashboard() {
    await this.navCtrl.navigateRoot('DashboardPage')
  }

  onKey(event) {
    console.log(Number(event.srcElement.value))
    if (isNaN(Number(event.srcElement.value))) {
      ////
      this.isNan = true
    } else {
      this.isNan = false
    }
  }

  // Push On Focus
  scrollTo(ht: any) {
    this.pushNow = true
  }

  removeSroll() {
    this.pushNow = false
  }
  inserErrorApi() {
    let Input = {
      userId: this.kycCheque.userId,
      accountHolderName: this.kycCheque.BankDetails.accountHolderName,
      bankName: this.kycCheque.BankDetails.bankName,
      IFSCCode: this.kycCheque.BankDetails.IFSCCode,
      cancelChequebase64Img: this.kycCheque.BankDetails.cancelChequebase64Img,
      cancelChequeImgType: this.kycCheque.BankDetails.cancelChequeImgType,
      accountNumber: this.kycCheque.BankDetails.accountNumber,
    }
    this.logError.Url = this.url
    this.logError.UserId = this.kycCheque.userId
    this.logError.createdBy = this.kycCheque.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace + 'entered bank details' + Input
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'KycCancledChecquePage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
