/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     BugFix:        2019/07/08        Yogesh Chavan
 */

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  
  LoadingController,
  NavController,
  ToastController,
} from '@ionic/angular'

import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoginPage } from '../../onboarding/login/login'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { LoginService } from '../../../services/login.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'

//import { Utility } from '../../../Utils/Utility';
/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
  styleUrls: ['forgot-password.scss'],
})
// TODO - CSS
export class ForgotPasswordPage implements OnInit {
  flagMobile: boolean = false
  flagEmail: boolean = false
  ForgotPassForm: FormGroup
  loading
  url
  message
  stackTrace
  method
  userId
  logError: InsertErrorLog = new InsertErrorLog()
  checkvalidation: boolean = false
  constructor(
    public navCtrl: NavController,
    private fb: FormBuilder,
    public forgotPasswordService: LoginService,
    public logErrorService: InserErrorLogService,
    private storage: Storage,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController
  ) {

  }

  async ngOnInit(): Promise<any> {
    this.ForgotPassForm = this.fb.group({
      Username: [null, Validators.required],
    })
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.storage.get('userInfo').then((val) => {
      ////
      this.userId = val.userId
    })
  }

  getPassword() {
    // //
    this.checkvalidation = true
    if (this.ForgotPassForm.valid) {
      this.loading.present()
      ////
      console.log('req in ts', JSON.stringify(this.ForgotPassForm.value))
      this.forgotPasswordService
        .forgotPasswordApi(this.ForgotPassForm.value)
        .subscribe(
          (res: any) => {
            if (this.loading) this.loading.dismiss()
            console.log('Response in ts', res)
            if (res.json.message[0].type == 'INFO') {
              Utility.showToast(
                this.toastCtrl,
                Constants.checkEmail,
                false,
                '',
                false
              )
              setTimeout(() => {
                this.navCtrl.pop()
              }, Constants.toastTimeOut)
            }
            // if (res.json.message.length == 2) {
            //
            //   if (res.json.message[0].type == "SUCCESS") {
            //     this.flagEmail = true
            //   } else {
            //     this.flagEmail = false;
            //   }
            //   if (res.json.message[1].type == "SUCCESS") {
            //     this.flagMobile = true
            //   }
            //   else {
            //     this.flagMobile = false
            //   }
            //   if (this.flagEmail == true && this.flagMobile == true) {
            //     this.showToast('Code is sent via email and Sms')
            //     this.navCtrl.pop()
            //   }
            //   if (this.flagEmail == false && this.flagMobile == false) {
            //     Utility.showToast(this.toastCtrl, 'Some error occured', true, "Close",false)
            //   }
            //   if (this.flagEmail == false && this.flagMobile == true) {
            //     this.showToast(JSON.stringify(res.json.message[1].message))

            //   }
            //   if (this.flagEmail == true && this.flagMobile == false) {
            //     this.showToast(JSON.stringify(res.json.message[0].message))

            //   }
            // }
          },
          (err) => {
            console.log('errr', err)
            if (this.loading) this.loading.dismiss()
            Utility.showToast(
              this.toastCtrl,
              Utility.getErrorMessage(err.message),
              false,
              '',
              false
            )
            this.url = Urls.baseUrl + Urls.port + Constants.forgotApi
            this.stackTrace = err.stack
            this.message = err.message
            this.method = 'getPassword'
            this.inserErrorApi()
          }
        )
    }
  }

  async showToast(message) {
    //
    let toast = await this.toastCtrl.create({
      message: message,
      position: 'bottom',
      // dismissOnPageChange: true,
      cssClass: 'ujb_toast',
    })

    let timeoutHandle = setTimeout(async () => {
      await toast.dismiss()
    }, Constants.toastTimeOut)

    await toast.onDidDismiss()
    this.navCtrl.navigateRoot('LoginPage')
  
    toast.present()
  }

  backtoLogin() {
    this.navCtrl.pop()
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'ForgotPasswordPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
