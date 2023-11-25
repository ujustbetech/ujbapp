import { Component, Input, OnInit } from '@angular/core'
import { NavController, ToastController } from '@ionic/angular'
import { ModalController } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { LoadingController } from '@ionic/angular'
import { UserData } from '../../../../app/models/userData'
import { Constants } from '../../../Utils/Constants'
import { Urls } from '../../../Utils/urls'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { RegistrationService } from '../../../services/registration.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the PartnerPopupComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'partner-popup',
  templateUrl: 'partner-popup.html',
  styleUrls: ['partner-popup.scss']
})
export class PartnerPopupComponent implements OnInit {
  userLastName
  userFirstName
  UserRole: any
  mobileNumber: string
  isPartner: boolean = false
  isClientPartner: boolean = false
  @Input('value') value: any
  otp
  @Input('isUserPartner') isUserPartner: boolean
  countryCode
  @Input('type') type
  @Input('registerUser') registerUser
  loading
  logError: InsertErrorLog = new InsertErrorLog()
  constructor(
    private storage: Storage,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public registrationService: RegistrationService,
    public loadingCtrl: LoadingController,
    public logErrorService: InserErrorLogService,
    private navCtrl: NavController,
    private route: ActivatedRoute
    // // public appCtrl: App
  ) {

  }

  ngOnInit(): void {
    // route.queryParams.subscribe((params: any) => {
      console.log('Hello PartnerPopupComponent Component')
  
      // this.isUserPartner = params.isUserPartner
      console.log('is [artner', this.isUserPartner)
  
      // this.type = params.type
      if (this.type == 'Registeration') {
        // this.registerUser = params.registerUser
        console.log('registeruser', this.registerUser)
        this.mobileNumber = this.registerUser.mobileNumber
        this.countryCode = this.registerUser.countryCode
      }
  
      // this.value = params.value
      if (this.value == 'Partner') {
        this.isPartner = true
      } else {
        this.isClientPartner = true
      }
    // })
  }

  // TODO
  async closeModal() {
    this.modalCtrl.dismiss()
  }

  async gotoPartnerAgreement() {
    // this.navCtrl.push(PartneragreementPage)
    await this.navCtrl.navigateForward('PartneragreementPage')
  }

  async continueTobe() {
    if (this.value == 'Partner') {
      if (this.isUserPartner) {
        this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
        this.loading.present()
        let Input = {
          countryCode: this.countryCode,
          email: this.registerUser.email,
          firstName: this.registerUser.firstName,
          lastName: this.registerUser.lastName,
          mobileNumber: this.registerUser.mobileNo,
          password: this.registerUser.password,
          Role: 'Partner',
        }
        this.registrationService.registrationApi(this.registerUser).subscribe(
          (data) => {
            if (this.loading) this.loading.dismiss()
            this.modalCtrl.dismiss()
            console.log('res in ts', data)

            if (data != null) {
              if (data.status == 200) {
                ////
                let res = data.json
                let userData = new UserData()
                userData.userId = res.data.userId
                userData.userRole = res.data.userRole
                userData.otp = res.data.otp
                this.logError.Url =
                  Urls.baseUrl + Urls.port + Constants.registrationApi
                this.logError.UserId = res.data.userId
                this.logError.createdBy = res.data.userId
                this.logError.date = new Date().toLocaleString()
                this.logError.error = 'User Input:-' + JSON.stringify(Input)
                this.logError.message = data.json.message[0].message
                this.logError.method = 'continueTobe'
                this.logError.screen = 'PartnerPopupComponent'
                this.logError.source = 'mobile'
                console.log('responce log', this.logError)

                this.logErrorService
                  .insertLogError(this.logError)
                  .subscribe((res: any) => {
                    console.log('res in 200', res)
                  })
                this.storage.set('userInfo', userData).then((val) => {
                  this.navCtrl.navigateForward('OtpPage', { queryParams: {
                    type: this.type,
                    countryCode: this.registerUser.countryCode,
                    mobileNumber: this.registerUser.mobileNumber,
                    otp: userData.otp,
                    isUserPartner: this.isUserPartner,
                  }})
                })
              }
            }
          },
          (err) => {
            console.log(err)
            if (this.loading) this.loading.dismiss()
            this.logError.Url =
              Urls.baseUrl +
              Urls.port +
              Constants.registrationApi +
              '' +
              'User Input:-' +
              JSON.stringify(Input)
            this.logError.UserId = ' '
            this.logError.createdBy = ' '
            this.logError.date = new Date().toLocaleString()
            this.logError.error =
              'User Input:-' + JSON.stringify(Input) + '' + err.stack
            this.logError.message = err.message
            this.logError.method = 'continueTobe'
            this.logError.screen = 'PartnerPopupComponent'
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
      } else {
        this.modalCtrl.dismiss()
        await this.navCtrl.navigateForward('Questionnaire1Page')
      }
    } else {
      await this.navCtrl.navigateForward('BusinessListing10Page')
      this.modalCtrl.dismiss()
    }
  }
}
