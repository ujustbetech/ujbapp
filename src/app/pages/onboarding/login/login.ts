/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/06/14        Dakshata Patil;
 *     Scope :         2019/07/10       Yogesh Chavan          added business id to storage
 */

import { Component, ViewChild, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { IonContent, NavController, ToastController } from '@ionic/angular'

import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { LoginResponseInfo } from '../../../../app/models/login_resInfo'
import { LoginStatus } from '../../../../app/models/Enums'
import { PartnerInfo } from '../../../../app/models/PartnerInfo'
import { Platform } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { UserData } from '../../../../app/models/userData'
import { Utility } from '../../../Utils/Utility'
import { ActivatedRoute } from '@angular/router'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { LoginService } from '../../../services/login.service'

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// // @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['login.scss']
})
// TODO - CSS
export class LoginPage implements OnInit {
  loginForm: FormGroup
  checkValidation: boolean = false
  passwordType: string = 'password'
  passwordIcon: string = 'eye-off'
  userName: any
  password: any
  passWordEncrypt: any
  userInfo
  partnerUser
  userFirstName
  hideBackArrow: boolean
  showBackArrow
  public pushNow = false
  type
  logError: InsertErrorLog = new InsertErrorLog()
  @ViewChild('Content', { static: true }) content: IonContent
  constructor(
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public logErrorService: InserErrorLogService,
    public loginService: LoginService,
    private storage: Storage,
    public navCtrl: NavController,
    private fb: FormBuilder,
    // private route: ActivatedRoute,
    private route: ActivatedRoute,
    private platform: Platform
  ) {
    ////
    this.partnerUser = new PartnerInfo()
    this.loginForm = this.fb.group({
      Username: [null, Validators.required],
      Password: [null, Validators.required],
    })
    route.queryParams.subscribe(params => {
      this.showBackArrow = params.logOut
      if (this.showBackArrow == 'logOut') {
        this.hideBackArrow = false
      } else {
        this.hideBackArrow = true
      }
    })
    // this.storage.get('userInfo').then((val) => {
    //   console.log("username", val)
    //   this.userFirstName = val.firstName
    // })

    platform.backButton.subscribeWithPriority(1, () => {
      // if (this.navCtrl.canGoBack()) {
      if (true) {
        navCtrl.pop()
      } else {
        // TODO
        // platform.exitApp()
      }
    })
  }

  ngOnInit() {
    console.log('ngOnInit LoginPage')
  }
  /**user login method */
  async logIn() {
    ////

    this.checkValidation = true
    console.log('Password', this.password)
    //this.loginForm.value.Password= Md5.init(this.Password)

    console.log('passWordEncrypt', this.password)
    console.log('Component:', this.loginForm.value)
    if (this.loginForm.valid) {
      ////
      let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      loading.present()
      let Input = {
        email: this.loginForm.value.Username,
        password: this.loginForm.value.Password,
      }
      this.loginService.LogIn(this.loginForm.value).subscribe(
        (data) => {
          ////
          if (loading) loading.dismiss()
          console.log('responce in ts file', data)
          console.log('date', new Date().toISOString())
          console.log('date1', new Date().toDateString())
          console.log('date2', new Date().toString())

          this.logError.Url = Urls.baseUrl + Urls.port + Constants.loginApi
          this.logError.UserId = data.json.data._id
          this.logError.createdBy = data.json.data._id
          this.logError.date = new Date().toLocaleString()
          this.logError.error = 'input bye User' + ' ' + JSON.stringify(Input)
          this.logError.message = data.json.message[0].message
          this.logError.method = 'logIn'
          this.logError.screen = 'LoginPage'
          this.logError.source = 'mobile'
          console.log('responce log', this.logError)

          this.logErrorService
            .insertLogError(this.logError)
            .subscribe((res: any) => {
              console.log('res in login logs', res)
            })
          console.log('responce message data', data.json.message[0].message)
          if (data != null) {
            if (true || data.status == 200) {
              let res = data.json
              console.log('responce in ts file status', res)

              let userData = new UserData()

              userData.userId = res.data._id
              userData.languagePreference = res.data.language
              userData.userRole = res.data.role
              userData.is_Otp_Verified = res.data.is_Otp_Verified
              userData.businessId = res.data.businessId
              userData.mobileNumber = res.data.mobile_number
              userData.countryCode = res.data.country_code
              console.log('responce message', res.message[0].message)
              console.log('responce role', userData)
              this.storage.set('userInfo', userData).then(async (val) => {
                console.log('userdata in login', val)
                if (userData.is_Otp_Verified == true) {
                  this.storage.set('loginStatus', LoginStatus.loggedIn)
                  await this.navCtrl.navigateRoot('DashboardPage', {queryParams: {
                    animate: true,
                    direction: 'forward',
                  }})
                } else if (userData.is_Otp_Verified == false) {
                  this.type = 'Registeration'
                  let callResendOtp = true
                  await this.navCtrl.navigateForward('OtpPage', { queryParams: {
                    type: this.type,
                    countryCode: userData.countryCode,
                    mobileNumber: userData.mobileNumber,
                    callResendOtp: callResendOtp,
                  }})
                }
                this.storage.get('userInfo').then((res: any) => {
                  console.log('get userdata in login', res)
                })
              })

              console.log('status', LoginStatus.loggedIn)
              let list = res.message
              if (list) {
                for (let i = 0; i < list.length; i++) {
                  let messageReceive = new LoginResponseInfo()
                  messageReceive.message = list[i].message
                  console.log('message', messageReceive.message)
                }
              }
            } else {
              loading.dismiss()
            }
          }
        },
        (err) => {
          if (loading) loading.dismiss()
          console.log('message err msg', err.message)
          console.log(' err ', err)
          console.log('err in login', err)
          console.log('err in login json', JSON.stringify(err))
          console.log('responce message data error msg', err.message[0])
          Utility.showToast(
            this.toastCtrl,
            Utility.getErrorMessage(err.message),
            false,
            '',
            false
          )
          this.logError.Url = Urls.baseUrl + Urls.port + Constants.loginApi
          this.logError.UserId = ' '
          this.logError.createdBy = ' '
          this.logError.date = new Date().toLocaleString()
          this.logError.error = err.stack
          this.logError.message =
            'input bye User' + JSON.stringify(Input) + ' ' + err.message
          this.logError.method = 'logIn'
          this.logError.screen = 'LoginPage'
          this.logError.source = 'mobile'
          console.log('responce log', this.logError)
          this.logErrorService.insertLogError(this.logError).subscribe(
            (res: any) => {
              console.log('res in login logs ', res)
            },
            (err) => {
              console.log('res in login logs err ', err)
            }
          )
        }
      )
    }
  }

  /**to show or hide password */
  hideShowPassword() {
    ////
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text'
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off'
  }
  /**when user forgets password,it takes user to forgot password page */
  async forgotPassword() {
    await this.navCtrl.navigateForward('ForgotPasswordPage')
  }
  /**to go to previous page */
  backtoregistrationopt() {
    this.navCtrl.pop()
  }

  // Push On Focus
  // scrollTo(ht: any) {
  //   this.pushNow= true;
  // }

  // removeSroll(){
  //   this.pushNow= false;
  // }
  scrollTo(ht: any) {
    // TODO
    // this.content.scrollTo(0, parseInt(ht), 950)
    scrollTo({ behavior: 'smooth' })
    if (this.platform.is('ios')) {
      if (this.toastCtrl) {
        Utility.closeToast(this.toastCtrl)
      }
    }
  }
}
