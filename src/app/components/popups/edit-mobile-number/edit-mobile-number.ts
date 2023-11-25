import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { NavController, ToastController } from '@ionic/angular'

import { Component, Input, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { GetCountriesRes } from '../../../../app/models/getCountriesRes'
import { GuestInfo } from '../../../../app/models/GuestInfo'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { ModalController } from '@ionic/angular'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { QuestionnaireService } from '../../../services/questionnaire.service'
import { RegistrationService } from '../../../services/registration.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**

/**
 * Generated class for the EditMobileNumberComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'edit-mobile-number',
  templateUrl: 'edit-mobile-number.html',
  styleUrls: ['edit-mobile-number.scss']
})
export class EditMobileNumberComponent implements OnInit {
  loading
  userId: string = ''
  title: string = ''
  value: any
  validation: any
  type: any = ''
  formGroup: FormGroup
  checkValidation: boolean = false
  valid: boolean = true
  text: string
  geustInfo: GuestInfo
  countryCode
  userMobileExist: boolean = false
  removeView: boolean = false
  @Input('isReffere') isReffere: boolean = false
  checkError: boolean = false
  @Input('formPartner') formPartner: boolean = false
  @Input('fromGuest') fromGuest: boolean = false
  countries: GetCountriesRes[]
  @Input('formClientPartner') formClientPartner: boolean = false
  @Input('obj') obj
  mobileNo
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  validMobileNum: boolean = false
  constructor(
    private modalCtrl: ModalController,
    private route: ActivatedRoute,
    public logErrorService: InserErrorLogService,
    private storage: Storage,
    public registrationService: RegistrationService,
    private loadingCtrl: LoadingController,
    public questionnnaireService: QuestionnaireService,
    public provider: UserProfileService,
    public toastCtrl: ToastController,
    private fb: FormBuilder,
    public navCtrl: NavController,
    // public appCtrl: App
  ) {
    // route.queryParams.subscribe((params: any) => {
      // this.countries = new Array<GetCountriesRes>()
      // this.validMobileNum = false
      // this.countryCode = '+91'
      // this.geustInfo = this.obj
  
      // this.formGroup = this.fb.group({
      //   CountryCode: ['', Validators.compose([Validators.required])],
      //   MobileNumber: [
      //     '',
      //     Validators.compose([
      //       Validators.required,
      //       Validators.min(1000000000),
      //       Validators.max(9999999999999),
      //     ]),
      //   ],
      // })
      // this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
      // // this.isReffere = params.isReffere
      // this.storage.get('userInfo').then((val) => {
      //   //  this.getProfile(val)
      //   this.userId = val.userId
      // })
  
      // let data = this.obj
      // this.title = data.title
      // this.value = data.value
      // this.validation = data.validation
      // this.type = data.type
      // this.countryCode = data.countryCode
      // // this.formPartner = params.formPartner
      // // this.fromGuest = params.formGuest
      // this.getCountries()
      // this.formClientPartner = params.formClientPartner
    // })
  }

  async ngOnInit(): Promise<any> {
    let data = this.obj
    this.countries = new Array<GetCountriesRes>()
      this.validMobileNum = false
      this.geustInfo = this.obj
  
      this.formGroup = this.fb.group({
        CountryCode: [data.countryCode || '+91', Validators.compose([Validators.required])],
        MobileNumber: [
          '',
          Validators.compose([
            Validators.required,
            Validators.min(1000000000),
            Validators.max(9999999999999),
          ]),
        ],
      })
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      // this.isReffere = params.isReffere
      this.storage.get('userInfo').then((val) => {
        //  this.getProfile(val)
        this.userId = val.userId
      })
  
      this.title = data.title
      this.value = data.value
      this.validation = data.validation
      this.type = data.type
      setTimeout(() => {
        this.countryCode = data.countryCode || '+91'
        
      }, 1000);
      // this.formPartner = params.formPartner
      // this.fromGuest = params.formGuest
      this.getCountries()
  }

  ionViewWillEnter() {
    if (this.removeView) {
      this.modalCtrl.dismiss('updated')
    }
  }

  cancel() {
    this.modalCtrl.dismiss()
  }

  ok() {
    this.modalCtrl.dismiss({ data: this.geustInfo })
  }

  close() {
    this.modalCtrl.dismiss('data')
  }
  async saveData() {
    // {
    //   "key": "UserId",
    //   "value": "5cefc68ec299d1993ee5133b"
    // },
    // {
    //   "key": "MobileNo",
    //   "value": "9820275456"
    // },
    // {
    //   "key": "CountryCode",
    //   "value": "+91"
    // }
    await this.checkMobile()
    this.formGroup.value.countryCode = this.countryCode
    let data = {
      userId: this.userId,
      type: this.type,
      MobileNumber: this.formGroup.value.MobileNumber,
      CountryCode: this.formGroup.value.CountryCode,
    }

    this.checkValidation = true
    if (
      this.formGroup.valid &&
      this.userMobileExist == false &&
      this.validMobileNum == false
    ) {
      this.loading.present()
      this.provider.updateMobileNumber(data).subscribe(
        (res: any) => {
          if (this.loading) this.loading.dismiss()
          this.removeView = true
          this.modalCtrl.dismiss('update')

          if (this.formPartner) {
            this.navCtrl.navigateForward('OtpPage', {queryParams:{
              mobileNumber: this.formGroup.value.MobileNumber,
              countryCode: this.formGroup.value.CountryCode,
              isUserPartner: true,
              otp: res.json.data,
              referer: 'PartnerProfile',
            }})
          } else if (this.fromGuest) {
            this.navCtrl.navigateForward('OtpPage', {queryParams:{
              mobileNumber: this.formGroup.value.MobileNumber,
              countryCode: this.formGroup.value.CountryCode,
              isUserPartner: true,
              otp: res.json.data,
              referer: 'guest',
            }})
          } else if (this.formClientPartner) {
            this.navCtrl.navigateForward('OtpPage', {queryParams:{
              mobileNumber: this.formGroup.value.MobileNumber,
              countryCode: this.formGroup.value.CountryCode,
              isUserPartner: true,
              otp: res.json.data,
              referer: 'ClientPartnerProfile',
            }})
          }
        },
        (err) => {
          if (this.loading) this.loading.dismiss()
          this.url =
            Urls.baseUrl + Urls.port + Constants.updateMobileNumberMobile
          this.stackTrace = err.stack + ' ' + this.value
          this.message = err.message
          this.method = 'saveData'
          this.inserErrorApi()
          //// this.navCtrl.push(ErrorPage)
        }
      )
    } else {
    }
    //
  }
  getCountries() {
    this.questionnnaireService.getCountryApi().subscribe(
      (data) => {
        console.log('data in question 3 ts', data)
        if (data != null) {
          if (data.status == 200) {
            ////
            let res = data.json.data.countries
            console.log('data in 200 question 3 ts', res)
            for (let i = 0; i <= res.length - 1; i++) {
              let countryDetail = new GetCountriesRes()
              countryDetail._id = res[i]._id
              countryDetail.code = res[i].code
              countryDetail.countryId = res[i].countryId
              countryDetail.countryName = res[i].countryName
              console.log('obj in question 3 ts', countryDetail)
              this.countries.push(countryDetail)
              console.log('list in question 3 ts', this.countries)
            }
          }
          this.countryCode= this.obj.countryCode || this.countries[0].countryId
          // console.log("codeind",this.countryCode)
        }
      },
      (err) => {
        console.log('err', err)
      }
    )
  }
  checkMobile() {
    if (
      this.formGroup.value.MobileNumber &&
      this.formGroup.value.MobileNumber.length == 10 &&
      this.validMobileNum == false
    ) {
      this.checkError = true
      this.registrationService
        .checkMobileApi(this.formGroup.value.MobileNumber)
        .subscribe(
          (data) => {
            console.log('res in ts', data)
            if (data != null) {
              if (data.status == 200) {
                return (this.userMobileExist = true)
              } else {
                return (this.userMobileExist = false)
              }
            }
          },
          (err) => {
            if (err.message == 404) {
              return (this.userMobileExist = false)
            }
            console.log(err)
            this.url = Urls.baseUrl + Urls.port + Constants.checkMobileApi
            this.stackTrace = err.stack + ' ' + this.value
            this.message = err.message
            this.method = 'checkMobile'
            this.inserErrorApi()
          }
        )
    } else {
      //this.valid = false
    }
  }

  changeErrorMessages() {
    this.userMobileExist = false
    this.checkValidation = false
    if (this.value) {
      if (this.countryCode == '+91') {
        console.log('char at 0', this.value.charAt(0))
        if (
          this.value.charAt(0) == '6' ||
          this.value.charAt(0) == '7' ||
          this.value.charAt(0) == '8' ||
          this.value.charAt(0) == '9'
        ) {
          this.validMobileNum = false
        } else {
          this.validMobileNum = true
        }
      } else {
        this.validMobileNum = false
      }
    }

    if (this.formGroup.value.MobileNumber.length == 10) {
      // this.userMobileExist = false;
      this.checkMobile()
    }
  }
  mobileValidation() {
    this.mobileNo = this.formGroup.value.MobileNumber
    if (this.mobileNo) {
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
      this.validMobileNum = false
    }
  }
  changeErrorMessagesFirst() {
    this.checkValidation = false
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'EditMobileNumberComponent'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
