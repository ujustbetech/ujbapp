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
 *
 *  update mobile from profile for partner and guest        2019/08/13       Yogesh Chavan
 */

import { Component, ViewChild } from '@angular/core'
import {  NavController, ToastController } from '@ionic/angular'

import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { LoginStatus } from '../../../../app/models/Enums'
import { Platform } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { RegistrationService } from '../../../services/registration.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the OtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-otp',
  templateUrl: 'otp.html',
  styleUrls: ['otp.scss']
})
export class OtpPage {
  mobileNumber: any
  morphedNumber
  char1 = ''
  char2 = ''
  char3 = ''
  char4 = ''
  myClass1: any
  hideResend: boolean = true
  userId
  otpValidationFlag: boolean
  otp
  otpByUser: string
  isUserPartner
  countryCode
  callResendOtp
  loading
  role
  fromPartnerProfile: boolean = false
  guestProfile: boolean = false
  referer
  public pushNow = false
  type: string = 'Registeration'
  @ViewChild('num1', { static: true }) num1
  @ViewChild('num2', { static: true }) num2
  @ViewChild('num3', { static: true }) num3
  @ViewChild('num4', { static: true }) num4
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  timer
  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public logErrorService: InserErrorLogService,
    private storage: Storage,
    public registrationService: RegistrationService,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public route: ActivatedRoute
  ) {
    // this.loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
    this.route.queryParams.subscribe((params: any) => {
      this.callResendOtp = params.callResendOtp
      this.countryCode = params.countryCode
      this.isUserPartner = params.isUserPartner
      this.mobileNumber = params.mobileNumber
      this.otp = params.otp
      this.referer = params.referer
      let val = params.formPartner
      if (val) {
        this.fromPartnerProfile = true
      }
      this.morphedNumber =
      this.mobileNumber.charAt(0) +
      'xxxxxxx' +
      this.mobileNumber.charAt(8) +
      this.mobileNumber.charAt(9)
      this.storage
        .get('userInfo')
        .then((val) => {
          console.log('userid1', val)
          this.userId = val.userId
          if (this.callResendOtp == true) {
            console.log('before resend opt resent otp true')
            this.resendOTP(false)
          } else {
            console.log('before readotp')
            //this.startTimer()
            //this.readOtp()
          }
        })
        .catch((err) => {
          console.log('userid2', err)
        })
      console.log('otp', this.otp)
    })




    //CHANGE THIS OTP WHEN PROD
    // this.otp = '1234'

  }

  ionViewWillEnter() {
    if (
      this.referer == 'PartnerProfile' ||
      this.referer == 'guest' ||
      this.referer == 'ClientPartnerProfile'
    ) {
      this.type = 'Update'
    }
    if (this.type == 'Update') {
      //  this.loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
      //   if (this.loading)
      //      this.loading.dismiss()
    }
  }

  onPaste(e: any) {
    let Content = e.clipboardData.getData('text/plain')
    console.log('event paste 2', Content)
    //console.log("event paste 1", event.clipboardData)
    if (Content == this.otp) {
      this.char1 = Content.charAt(0)
      this.char2 = Content.charAt(1)
      this.char3 = Content.charAt(2)
      this.char4 = Content.charAt(3)
    } else {
      this.char1 = ''
      this.char2 = ''
      this.char3 = ''
      this.char4 = ''
    }

    // this.num4.setFocus();
    //this.checkOTP()
  }

  onKey1(event: any) {
    console.log('event', event.key)
    if (event.srcElement.value.length > 0)
      if (
        event.key == '0' ||
        event.key == '1' ||
        event.key == '2' ||
        event.key == '3' ||
        event.key == '4' ||
        event.key == '5' ||
        event.key == '6' ||
        event.key == '7' ||
        event.key == '8' ||
        event.key == '9'
      ) {
        this.num2.setFocus()
        this.checkOTP()
      }
  }

  onKey2(event: any) {
    if (event.srcElement.value.length > 0)
      if (
        event.key == '0' ||
        event.key == '1' ||
        event.key == '2' ||
        event.key == '3' ||
        event.key == '4' ||
        event.key == '5' ||
        event.key == '6' ||
        event.key == '7' ||
        event.key == '8' ||
        event.key == '9'
      ) {
        this.num3.setFocus()
        this.checkOTP()
      }

    if (event.srcElement.value.length == 0 && event.key == 'Backspace')
      this.num1.setFocus()
  }

  onKey3(event: any) {
    if (event.srcElement.value.length > 0)
      if (
        event.key == '0' ||
        event.key == '1' ||
        event.key == '2' ||
        event.key == '3' ||
        event.key == '4' ||
        event.key == '5' ||
        event.key == '6' ||
        event.key == '7' ||
        event.key == '8' ||
        event.key == '9'
      ) {
        this.num4.setFocus()
        this.checkOTP()
      }

    if (event.srcElement.value.length == 0 && event.key == 'Backspace')
      this.num2.setFocus()
  }

  onKey4(event: any) {
    //////
    if (event.srcElement.value.length == 0 && event.key == 'Backspace') {
      this.num3.setFocus()
    } else {
      this.checkOTP()
    }
  }

  resendOTP(flag: boolean) {
    //
    this.char1 = ''
    this.char2 = ''
    this.char3 = ''
    this.char4 = ''
    this.myClass1 = ''
    this.num1.setFocus()
    let timer = 30
    if (flag == true) {
      this.hideResend = false
    }
    let interval = setInterval(
      function () {
        console.log('timer in setInterval', this.timer)
        if (timer > 0) {
          timer--
        }
        if (timer == 0 || timer == 0o0) {
          console.log('timer in setInterval in 1st if', timer)
          this.hideResend = true
          clearInterval(interval)
        }
      }.bind(this),
      1000
    )
    this.hideResend = false
    //  let loading = await this.loadingCtrl.create({ cssClass: 'transparent', });
    // this.loading.present();
    this.registrationService
      .resendOtp(this.userId, this.countryCode, this.mobileNumber)
      .subscribe(
        (data) => {
          //  if (this.loading)
          //    this.loading.dismiss()
          console.log('res in ts', data)
          this.url = Urls.baseUrl + Urls.port + Constants.resendOtp
          this.stackTrace = ' '
          this.message = ' '
          this.method = 'resendOTP'
          this.inserErrorApi()
          if (data != null) {
            if (data.status == 200) {
              let res = data.json
              console.log('resnd', res)
              this.otp = res.data
              //temp change
              // this.otp = '1234'
              console.log('resnd otp', this.otp)
            } else {
              //    if (this.loading)
              //       this.loading.dismiss()
              this.toastCtrl
                .create({
                  message: 'Some error occured',
                  showCloseButton: true,
                  closeButtonText: 'OK',
                  position: 'bottom',
                  cssClass: 'ujb_toast',
                }).then(ctrl => ctrl.present())
            }
          }
        },
        (err) => {
          console.log('resendOtp err', err)
          this.url = Urls.baseUrl + Urls.port + Constants.resendOtp
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'resendOTP'
          this.inserErrorApi()

          //  if (this.loading)
          //    this.loading.dismiss()
        }
      )
  }

  // Push On Focus
  scrollTo(ht: any) {
    this.pushNow = true
  }

  removeSroll() {
    this.pushNow = false
  }

  checkOTP() {
    this.otpByUser = this.char1 + this.char2 + this.char3 + this.char4
    console.log('userenter', this.otpByUser)
    if (this.otpByUser.length > 3) {
      if (this.otp === this.otpByUser) {
        this.otpValidationFlag = true
        this.myClass1 = 'otp_success'
        console.log('myclass1', this.myClass1)
        //let loading = await this.loadingCtrl.create({ cssClass: 'transparent', });

        // this.loading.present();
        this.registrationService
          .validateOtp(
            this.userId,
            this.otpValidationFlag,
            this.countryCode,
            this.mobileNumber,
            this.type
          )
          .subscribe(
            async (data) => {
              // if (this.loading)
              //    this.loading.dismiss()

              console.log('res in ts', data)
              if (data != null) {
                if (data.status == 200) {
                  this.url = Urls.baseUrl + Urls.port + Constants.validateOtp
                  this.stackTrace = ' '
                  this.message = ' '
                  this.method = 'checkOTP'
                  this.inserErrorApi()
                  this.storage.set('loginStatus', LoginStatus.loggedIn)
                  if (this.referer == 'PartnerProfile') {
                    console.log('OTP 2')
                    await this.navCtrl.navigateForward('OtpSuccessPage', { queryParams: {
                      isUserPartner: this.isUserPartner,
                      referer: 'PartnerProfile',
                    }})
                    //
                  } else if (this.referer == 'guest') {
                    console.log('OTP 3')
                    await this.navCtrl.navigateForward('OtpSuccessPage', { queryParams: {
                      isUserPartner: this.isUserPartner,
                      referer: 'guest',
                    }})
                  } else if (this.referer == 'ClientPartnerProfile') {
                    console.log('OTP 4')
                    await this.navCtrl.navigateForward('OtpSuccessPage', { queryParams: {
                      isUserPartner: this.isUserPartner,
                      referer: 'ClientPartner',
                    }})
                  } else {
                    console.log('OTP 5')
                    await this.navCtrl.navigateForward('OtpSuccessPage', { queryParams: {
                      isUserPartner: this.isUserPartner,
                      referer: '',
                    }})
                  }
                } else {
                  // if (this.loading)
                  //   this.loading.dismiss()
                  this.toastCtrl
                    .create({
                      message: 'Some error occured',
                      showCloseButton: true,
                      closeButtonText: 'OK',
                      position: 'bottom',
                      cssClass: 'ujb_toast',
                    }).then(ctrl => ctrl.present())
                }
              }
            },
            (err) => {
              console.log('OTP err', err)
              this.url = Urls.baseUrl + Urls.port + Constants.validateOtp
              this.stackTrace = err.stack
              this.message = err.message
              this.method = 'checkOTP'
              this.inserErrorApi()
              //   if (this.loading)
              //    this.loading.dismiss()
              //// this.navCtrl.push(ErrorPage)
            }
          )
      } else {
        this.myClass1 = 'otp_wrong'
      }
    }
  }

  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace + 'otp by user' + this.otpByUser
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'OtpPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
