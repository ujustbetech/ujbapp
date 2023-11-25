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
 *     BugFix:        2019/07/24       Yogesh Chavan
 */

import { Component, ViewChild, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { NavController, ToastController, IonContent } from '@ionic/angular'

import { Constants } from '../../../Utils/Constants'
import { CustomValidation } from '../../../Utils/CustomValidator'
import { GetCountriesRes } from '../../../../app/models/getCountriesRes'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { Keyboard } from '@ionic-native/keyboard/ngx'
import { LoadingController } from '@ionic/angular'
import { ModalController } from '@ionic/angular'
import { Platform } from '@ionic/angular'
import { RegistrationInfo } from '../../../../app/models/registration_info'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { UserData } from '../../../../app/models/userData'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { RegistrationService } from '../../../services/registration.service'
import { PartnerPopupComponent } from '../../../components/popups/partner-popup/partner-popup'
import { QuestionnaireService } from '../../../services/questionnaire.service'
import { ActivatedRoute } from '@angular/router'

//import * as CryptoJS from 'crypto-js';
/**
 * Generated class for the RegistrationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
// TODO - CSS
@Component({
  selector: 'page-registration',
  templateUrl: 'registration.html',
  styleUrls: ['./registration.scss']
})
export class RegistrationPage implements OnInit {
  pageTitle = 'Sign Up'
  keys
  registrationForm: FormGroup
  checkValidation: boolean = false
  passwordType: string = 'password'
  passwordIcon: string = 'eye-off'
  //email: any
  userLastName: any
  userFirstName: any
  userData: any
  mobileNumber: any
  userRole: any
  emailId: any
  mobileNo
  registerUser: RegistrationInfo = new RegistrationInfo()
  userEmailIdExist: boolean = false
  userMobileExist: boolean = false
  password: any
  passwordInvalid: boolean = false
  isUserPartner: boolean = false
  // Email;
  loading
  userStatus
  type
  countries: GetCountriesRes[]
  countryCode
  socialMediaAuth
  email: string = ''
  public pushNow = false
  validMobileNum: boolean = false
  isNan
  captchaInput: string = ''
  logError: InsertErrorLog = new InsertErrorLog()
  @ViewChild('Content', { static: true }) content: IonContent
  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public registrationService: RegistrationService,
    private storage: Storage,
    public logErrorService: InserErrorLogService,
    private modalCtrl: ModalController,
    public navCtrl: NavController,
    private fb: FormBuilder,
    // private route: ActivatedRoute,
    public questionnnaireService: QuestionnaireService,
    public platform: Platform,
    private keyboard: Keyboard,
    private route: ActivatedRoute
    
  ) {
    this.userEmailIdExist = false
    this.validMobileNum = false
    this.countries = new Array<GetCountriesRes>()
    this.countryCode = '+91'
    this.registrationForm = this.fb.group(
      {
        firstName: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z]*$'),
          ]),
        ], //'^[a-zA-Z \-\']+'
        lastName: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern('^[a-zA-Z]*$'),
          ]),
        ],
        email: [null, Validators.required],
        mobileNo: [
          null,
          Validators.compose([
            Validators.required,
            Validators.min(1000000000),
            Validators.max(9999999999999),
          ]),
        ],
        password: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(30),
          ]),
        ],
        countryCode: [null, ''],
      },
      {
        validator: Validators.compose([CustomValidation.isEmailValid]),
      }
    )
    this.route.queryParams.subscribe((params: any) => {
      console.log(params);
      
      this.email = params.email
      this.userFirstName = params.userFirstName
      this.userLastName = params.lastName
    })

    // console.log("email from fb",this.Email)
    console.log('mobileno', this.mobileNumber)

    this.getCountries()
    console.log('code val', this.registrationForm.value.countryCode)

    platform.ready().then(() => {
      window.addEventListener('onKeyboardHide', () => {
        console.log('Keyboard will Hide')
      })
    })

    this.platform.backButton.subscribeWithPriority(1, () => {
      // this does work

      console.log('Keyboard will Hide')
    })
    // this.platform.backButton.subscribe(() => {
    //

    // })

    // keyboard.onKeyboardWillHide().subscribe(event =>{
    //   // DO YOUR STUFF
    //   console.log("Keyboard will Hide");
    // });
    keyboard.onKeyboardShow().subscribe((res: any) => {
      console.log('keyboard open', res)
    })

    keyboard.onKeyboardHide().subscribe((res: any) => {
      console.log('keyboard close', res)
    })
  }

  keyboardCheck() {
    //console.log('The keyboard is open:', this.keyboard.isOpen());
  }

  ionviewwillenter() {
    if (this.email != null && this.email != undefined && this.email != '') {
      this.checkEmail(this.email)
    }

    this.pushNow = false
  }

  ngOnInit() {
    console.log('ngOnInit RegistrationPage')
  }

  async signUpUser(value) {
    console.log('country code', this.registrationForm.value.countryCode)
    this.checkValidation = true
    if (
      this.registrationForm.valid &&
      this.userMobileExist == false &&
      this.userEmailIdExist == false &&
      this.passwordInvalid == false &&
      this.validMobileNum == false &&
      this.isNan == false
    ) {
      this.passwordInvalid = false
      this.registerUser.countryCode = this.countryCode
      this.registerUser.email = this.registrationForm.value.email
      this.registerUser.email = this.registerUser.email.trim()
      this.registerUser.firstName = this.registrationForm.value.firstName
      this.registerUser.lastName = this.registrationForm.value.lastName
      this.registerUser.mobileNumber = this.registrationForm.value.mobileNo
      this.registerUser.password = this.registrationForm.value.password
      this.registerUser.socialMediaId = ''
      this.registerUser.socialMediaType = ''

      this.type = 'Registeration'
      if (value == 'Guest') {
        this.isUserPartner = false
        this.userStatus = value
        this.registerUser.userRole = 'Guest'
        let Input = {
          countryCode: this.countryCode,
          email: this.registrationForm.value.email,
          firstName: this.registrationForm.value.firstName,
          lastName: this.registrationForm.value.lastName,
          mobileNumber: this.registrationForm.value.mobileNo,
          password: this.registrationForm.value.password,
          Role: 'Guest',
        }
        console.log('isuser', this.isUserPartner)
        this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
        this.loading.present()
        this.registrationService.registrationApi(this.registerUser).subscribe(
          (data) => {
            if (this.loading) this.loading.dismiss()
            console.log('res in ts', data)
            if (data != null) {
              if (data.status == 200) {
                let res = data.json
                let userData = new UserData()
                userData.userId = res.data.userId
                userData.userRole = res.data.userRole
                userData.otp = res.data.otp
                this.logError.Url =
                  Urls.baseUrl +
                  Urls.port +
                  Constants.registrationApi +
                  '' +
                  'User Input:-' +
                  JSON.stringify(Input)
                this.logError.UserId = res.data.userId
                this.logError.createdBy = res.data.userId
                this.logError.date = new Date().toLocaleString()
                this.logError.error = 'User Input:-' + JSON.stringify(Input)
                this.logError.message = data.json.message[0].message
                this.logError.method = 'signUpUser'
                this.logError.screen = 'RegistrationPage'
                this.logError.source = 'mobile'
                console.log('responce log', this.logError)

                this.logErrorService
                  .insertLogError(this.logError)
                  .subscribe((res: any) => {
                    console.log('res in 200', res)
                  })
                this.storage.set('userInfo', userData).then(async (val) => {
                  await this.navCtrl.navigateForward('OtpPage', { queryParams: {
                    type: this.type,
                    countryCode: this.registerUser.countryCode,
                    mobileNumber: this.mobileNumber,
                    otp: userData.otp,
                    isUserPartner: this.isUserPartner,
                  }})
                })
              }
            }
          },
          (err) => {
            console.log(err)
            this.logError.Url =
              Urls.baseUrl + Urls.port + Constants.registrationApi
            this.logError.UserId = ' '
            this.logError.createdBy = ' '
            this.logError.date = new Date().toLocaleString()
            this.logError.error =
              'User Input:-' + JSON.stringify(Input) + '' + err.stack
            this.logError.message = err.message
            this.logError.method = 'signUpUser'
            this.logError.screen = 'RegistrationPage'
            this.logError.source = 'mobile'
            console.log('responce log', this.logError)

            this.logErrorService.insertLogError(this.logError).subscribe(
              (data) => {
                console.log('responce logError', data)
              },
              (err) => {
                console.log('responce logError in error', err)
              }
            )
            // // this.navCtrl.push(ErrorPage)
            if (this.loading) {
              this.loading.dismiss()
            }
            if (err.message == 404) {
              this.toastCtrl
                .create({
                  message: Constants.alreadyRegister,
                  showCloseButton: true,
                  closeButtonText: 'OK',
                  position: 'bottom',
                  cssClass: 'ujb_toast',
                }).then(ctrl => ctrl.present())
                
            } else {
              this.toastCtrl
                .create({
                  message: err,
                  showCloseButton: true,
                  closeButtonText: 'OK',
                  position: 'bottom',
                  cssClass: 'ujb_toast',
                }).then(ctrl => ctrl.present())
            }
          }
        )
      } else if (value == 'Partner') {
        this.isUserPartner = true
        this.registerUser.userRole = 'Guest'
        this.userStatus = value
        console.log('isuser1', this.isUserPartner)
        if (this.userEmailIdExist == false) {
          let popup = await this.modalCtrl.create({
            component: PartnerPopupComponent,
            componentProps: {
              registerUser: this.registerUser,
              type: this.type,
              value: this.userStatus,
              isUserPartner: this.isUserPartner,
            },
            cssClass: 'ujb_popup_partner' 
          })
          popup.present()
        }

        console.log('isuser', this.isUserPartner)
      }
      console.log('userInfo', this.registerUser)

      console.log('registre user', this.registrationForm.value)
    }
  }

  getCountryDetails(data) {
    this.countryCode = data.code
    console.log('codecountry', this.countryCode)
  }

  checkEmail(email: string) {
    //email=""
    console.log('res email', email)
    console.log('res value', this.registrationForm.value.email)
    this.emailId = this.registrationForm.value.email
    console.log('res EmailId', this.emailId)
    this.registrationService.checkEmailApi(email).subscribe(
      (data) => {
        console.log('res in ts', data)
        this.logError.Url = Urls.baseUrl + Urls.port + Constants.checkEmailApi
        this.logError.UserId = ' '
        this.logError.createdBy = ' '
        this.logError.date = new Date().toLocaleString()
        this.logError.error = 'Input:-' + email
        this.logError.message = data.json.message[0].message
        this.logError.method = 'checkEmail'
        this.logError.screen = 'RegistrationPage'
        this.logError.source = 'mobile'
        console.log('responce log', this.logError)

        this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
          console.log('res in 200', res)
        })
        if (data != null) {
          if (data.status == 200) {
            let res = data.json
            console.log('res in 200', res)
            if (res) {
              for (let i = 0; i < res.message.length; i++) {
                if (res.message[i].type == 'ERROR') {
                  this.userEmailIdExist = false
                } else if (res.message[i].type == 'SUCCESS') {
                  this.userEmailIdExist = true
                }
              }
            }
          }
        }
      },
      (err) => {
        console.log(err)
        this.logError.Url = Urls.baseUrl + Urls.port + Constants.checkEmailApi
        this.logError.UserId = ' '
        this.logError.createdBy = ' '
        this.logError.date = new Date().toLocaleString()
        this.logError.error = 'Input:-' + email + '' + err.stack
        this.logError.message = err.message
        this.logError.method = 'checkEmail'
        this.logError.screen = 'RegistrationPage'
        this.logError.source = 'mobile'
        console.log('responce log', this.logError)

        this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
          console.log('res in 200', res)
        })
      }
    )
  }

  mobileValidation() {
    this.mobileNo = this.registrationForm.value.mobileNo
    if (this.mobileNo) {
      if (this.countryCode == '+91') {
        if (
          this.mobileNo.charAt(0) == '7' ||
          this.mobileNo.charAt(0) == '8' ||
          this.mobileNo.charAt(0) == '9'
        ) {
          this.validMobileNum = false
        } else {
          this.validMobileNum = true
        }
      } else {
        this.validMobileNum = false
      }
    } else {
      this.validMobileNum = false
    }
  }

  checkMobile(mobileNo: string) {
    // this.removeSroll()
    this.mobileNo = this.registrationForm.value.mobileNo
    // if(this.countryCode == '+91'){
    //   if(this.mobileNo.charAt(0) == '7' || this.mobileNo.charAt(0) == '8' || this.mobileNo.charAt(0) == '9'){
    //     this.validMobileNum = false
    //   }
    //   else{
    //     this.validMobileNum = true
    //   }
    // }else{
    //   this.validMobileNum = false
    // }
    if (
      this.registrationForm.controls.mobileNo.valid &&
      this.validMobileNum == false
    ) {
      this.registrationService.checkMobileApi(this.mobileNo).subscribe(
        (data) => {
          //
          console.log('res in ts', data)
          this.logError.Url =
            Urls.baseUrl + Urls.port + Constants.checkMobileApi
          this.logError.UserId = ' '
          this.logError.createdBy = ' '
          this.logError.date = new Date().toLocaleString()
          this.logError.error = 'Input Mobile:-' + this.mobileNo
          this.logError.message = data.json.message[0].message
          this.logError.method = 'checkMobile'
          this.logError.screen = 'RegistrationPage'
          this.logError.source = 'mobile'
          console.log('responce log', this.logError)

          this.logErrorService
            .insertLogError(this.logError)
            .subscribe((res: any) => {
              console.log('res in 200', res)
            })
          if (data != null) {
            if (data.status == 200) {
              this.userMobileExist = true
            } else {
              this.userMobileExist = false
            }
          }
        },
        (err) => {
          console.log(err)
          this.logError.Url =
            Urls.baseUrl + Urls.port + Constants.checkMobileApi
          this.logError.UserId = ' '
          this.logError.createdBy = ' '
          this.logError.date = new Date().toLocaleString()
          this.logError.error =
            'Input Mobile:-' + this.mobileNo + '' + err.stack
          this.logError.message = err.message
          this.logError.method = 'checkMobile'
          this.logError.screen = 'RegistrationPage'
          this.logError.source = 'mobile'
          console.log('responce log', this.logError)

          this.logErrorService
            .insertLogError(this.logError)
            .subscribe((res: any) => {
              console.log('res in 200', res)
            })
        }
      )
    }
  }

  changeErrorMessages(value: any, event) {
    if (value == 'email') {
      this.userEmailIdExist = false
      if (this.registrationForm.controls.email.valid) {
        this.checkEmail(this.registrationForm.value.email)
      }
    } else if (value == 'mobile') {
      this.userMobileExist = false
      this.mobileNo = this.registrationForm.value.mobileNo
      if (this.mobileNo) {
        if (isNaN(Number(event.srcElement.value))) {
          this.isNan = true
          console.log('loc1nan if', this.isNan)
        } else {
          this.isNan = false
          console.log('loc1nan else', this.isNan)
        }
        if (this.countryCode == '+91') {
          if (
            this.mobileNo.charAt(0) == '6' ||
            this.mobileNo.charAt(0) == '7' ||
            this.mobileNo.charAt(0) == '8' ||
            this.mobileNo.charAt(0) == '9'
          ) {
            this.validMobileNum = false
          } else {
            this.validMobileNum = true
          }
        } else {
          this.validMobileNum = false
        }
      } else {
        this.isNan = false
        this.validMobileNum = false
      }
      if (this.registrationForm.value.mobileNo.length == 10) {
        this.checkMobile(this.registrationForm.value.mobileNo)
      }
    }
  }

  checkPassword() {
    if (this.password.indexOf(' ') != -1) {
      this.passwordInvalid = true
    } else {
      this.passwordInvalid = false
    }
  }

  hideShowPassword() {
    //
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text'
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off'
  }

  getCountries() {
    this.questionnnaireService.getCountryApi().subscribe(
      (data) => {
        console.log('data in question 3 ts', data)
        if (data != null) {
          if (data.status == 200) {
            let res = data.json.data.countries
            console.log('data in 200 question 3 ts', res)
            for (let i = 0; i <= res.length - 1; i++) {
              let countryDetail = new GetCountriesRes()
              countryDetail._id = res[i]._id
              countryDetail.code = res[i].code
              countryDetail.countryId = res[i].countryId
              countryDetail.countryName = res[i].countryName
              this.countries.push(countryDetail)
            }
          }
        }
      },
      (err) => {
        console.log('err', err)
      }
    )
  }

  scrollTo(ht: any) {
    // TODO
    // this.content.scrollTo(0, parseInt(ht), 950)
    // scrollTo({ behavior: 'smooth' })
  }
  // Push On Focus
  // scrollTo(ht: any) {

  // this.pushNow = true;
  //this.keyboard.show()

  //}

  removeSroll() {
    //to be added in html in ionblur method if encryption is to be done
    //     this.keys ='123456$#@$^@1ERF'
    //     var key = CryptoJS.enc.Utf8.parse(this.keys);
    //     var iv = CryptoJS.enc.Utf8.parse(this.keys);
    //     var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(this.password.toString()), key,
    //     {
    //         keySize: 128 / 8,
    //         iv: iv,
    //         mode: CryptoJS.mode.CBC,
    //         padding: CryptoJS.pad.Pkcs7
    //     });
    //     console.log("encryted pass12", encrypted)
    // console.log("encryted pass", encrypted.toString())
    //     return encrypted.toString();
    //  }
  }
}
