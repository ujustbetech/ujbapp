import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {  NavController, ToastController } from '@ionic/angular'

import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { changePassword } from '../../../../app/models/ChangePasswordInfo'
import { LoginService } from '../../../services/login.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
  styleUrls: ['change-password.scss'],
})
export class ChangePasswordPage implements OnInit {
  changePassForm: FormGroup
  checkValidation: boolean = false
  checkValidation1: boolean = false
  passwordType: string = 'password'
  passwordReType: string = 'password'
  passwordIcon: string = 'eye-off'
  reTypePasswordIcon: string = 'eye-off'
  passwordNew
  retypePass
  passwordInvalid: boolean
  User_Id: any
  loading
  isMatchingPassword: boolean
  public pushNow = false
  message
  stackTrace
  method
  url
  logError: InsertErrorLog = new InsertErrorLog()
  constructor(
    public changePasswordService: LoginService,
    public toast: ToastController,
    public navCtrl: NavController,
    private fb: FormBuilder,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public logErrorService: InserErrorLogService,
    public ChangePasswordService: LoginService,
  ) {
    ////
    this.storage.get('userInfo').then((val) => {
      ////
      this.User_Id = val.userId
    })

    //this.changepasswordobj= new changePassword()

    this.changePassForm = this.fb.group(
      {
        passwordNew: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(30),
          ]),
        ],
        retypePass: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(30),
          ]),
        ],
      },
      {
        // Validators:[this.isMatching]
      }
    )
    console.log('new pass', this.passwordNew)
    console.log('retype pass', this.retypePass)
  }

  ngOnInit() {
    console.log('ngOnInit ChangePasswordPage')
  }

  backToDashboard() {
    this.navCtrl.pop()
  }

  isMatching() {
    console.log('password check')

    var firstPassword = this.changePassForm.controls['passwordNew'].value
    var secondPassword = this.changePassForm.controls['retypePass'].value
    if (firstPassword && secondPassword && firstPassword != secondPassword) {
      console.log('mismatch')
      this.isMatchingPassword = true
      //return { isMatching : true };
    } else {
      //return null;
      this.isMatchingPassword = false
    }
  }

  /**
   * closes the current page
   */
  goBack() {
    this.navCtrl.pop()
  }

  /**
   * calls the change password api
   */
  async callChangePasswordAPI() {
    this.checkValidation = true
    //this.checkValidation1=true
    if (
      this.changePassForm.valid &&
      this.isMatchingPassword == false &&
      this.passwordNew.indexOf(' ') == -1
    ) {
      this.passwordInvalid = false
      let changePasswordobj = new changePassword()
      changePasswordobj.User_Id = this.User_Id
      changePasswordobj.New_Password = this.passwordNew
      console.log('changepassword', changePasswordobj)

      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.loading.present()

      this.changePasswordService.changePasswordApi(changePasswordobj).subscribe(
        async (data) => {
          this.loading.dismiss()

          if (data != null) {
            if (data.status == 200) {
              // Utility.showToast(this.toastCtrl, "Your password has been changed successfully", false, "")
              // this.navCtrl.pop()
              Utility.showToast(
                this.toast,
                Constants.changedPassword,
                false,
                '',
                false
              )

              setTimeout(async () => {
                await this.navCtrl.pop()
              }, Constants.toastTimeOut)
            }
          }
        },
        (err) => {
          this.loading.dismiss()
          this.url = Urls.baseUrl + Urls.port + Constants.changePasswordApi
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'callChangePasswordAPI'
          this.inserErrorApi()
          JSON.stringify(err)
          console.log('err', err)
          if (err.message == 400) {
            Utility.showToast(
              this.toast,
              'New and old password cannot be same',
              false,
              '',
              false
            )
            //this.changePassForm.reset()
          } else {
            Utility.showToast(
              this.toast,
              Utility.getErrorMessage(err.message),
              false,
              '',
              false
            )
          }
        }
      )
    } else if (this.passwordNew) {
      if (this.passwordNew.indexOf(' ') != -1) {
        this.passwordInvalid = true
      } else {
        this.passwordInvalid = false
      }
    }
  }

  /**
   * makes password visible invisible
   */
  hideShowPassword() {
    ////
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text'
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off'
  }
  hideShowReTypePassword() {
    this.passwordReType = this.passwordReType === 'text' ? 'password' : 'text'
    this.reTypePasswordIcon =
      this.reTypePasswordIcon === 'eye-off' ? 'eye' : 'eye-off'
  }

  // Push On Focus
  scrollTo(ht: any) {
    this.pushNow = true
  }

  removeSroll() {
    this.pushNow = false
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.User_Id
    this.logError.createdBy = this.User_Id
    this.logError.date = new Date().toLocaleString()
    this.logError.error =
      this.stackTrace + ' ' + 'Entered password' + this.passwordNew
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'ChangePasswordPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
