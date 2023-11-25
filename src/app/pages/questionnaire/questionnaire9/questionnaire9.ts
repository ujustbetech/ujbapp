import { Component, OnInit } from '@angular/core'
import {  NavController, ToastController } from '@ionic/angular'
import { KycPanCardPage } from '../../kyc/kyc-pan-card/kyc-pan-card'
import { DashboardPage } from '../../dashboard/dashboard'
import * as $ from 'jquery'
import { Storage } from '@ionic/storage'
import { Questionnaire1Page } from '../questionnaire1/questionnaire1'
import { LoadingController } from '@ionic/angular'

import { QuestionsInfo } from '../../../../app/models/QuestionsInfo'
import { Utility } from '../../../Utils/Utility'
import { Constants } from '../../../Utils/Constants'
import { UserData } from '../../../../app/models/userData'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { Urls } from '../../../Utils/urls'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { QuestionnaireService } from '../../../services/questionnaire.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the Questionnaire9Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-questionnaire9',
  templateUrl: 'questionnaire9.html',
  styleUrls: ['questionnaire9.scss']
})
export class Questionnaire9Page {
  userFirstName: any
  isInputGiven: boolean = false
  checkvalidation: boolean = false
  selectedValue
  //Page Title
  pageTitle = 'Enroll as Partner'
  userId: string
  showSave: boolean = false
  loading
  disableSave
  message
  method
  stackTrace
  userData: UserData
  url
  logError: InsertErrorLog = new InsertErrorLog()
  params
  constructor(
    public navCtrl: NavController,
    private storage: Storage,
    private route: ActivatedRoute,
    public questionnnaireService: QuestionnaireService,
    public loadingCtrl: LoadingController,
    public logErrorService: InserErrorLogService,
    public toastCtrl: ToastController,
    private profileProvider: UserProfileService
  ) {
    route.queryParams.subscribe((params: any) => {
      this.params = params
    })
    //Questionnaire1Page.questionnaireObj = new QuestionsInfo()
    this.userData = new UserData()

    this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
  }

  ionViewWillEnter() {
    this.disableSave = ''
    this.storage.get('userInfo').then((val) => {
      console.log('userid', val)
      this.userData = val
      this.userId = this.userData.userId
      Questionnaire1Page.questionnaireObj.userId = this.userData.userId
      console.log('id', Questionnaire1Page.questionnaireObj.userId)
    })
    let data = this.params.data

    let isPartnerPageRefered = this.params.referrer
    if (isPartnerPageRefered == 'PartnerPage') {
      Questionnaire1Page.questionnaireObj = new QuestionsInfo()
      this.showSave = true
    }

    //this.selectValue(data,)

    switch (data) {
      case '1000-5000':
        this.selectValue('1000-5000')
        break
      case '5001-15000':
        this.selectValue('5001-15000')
        break
      case '15001-30000':
        this.selectValue('15001-30000')
        break
      case '30001 and above':
        this.selectValue('30001 and above')
        break
      default:
        break
    }
  }
  goToQ8() {
    this.navCtrl.pop()
  }

  async verifyKyc() {
    this.checkvalidation = true
    if (this.isInputGiven == true) {
      this.disableSave = 'disabled'
      let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      loading.present()

      console.log(
        'obj enroll partner',
        JSON.stringify(Questionnaire1Page.questionnaireObj)
      )
      this.questionnnaireService
        .enrollPartnerApi(Questionnaire1Page.questionnaireObj)
        .subscribe(
          (data) => {
            if (loading) loading.dismiss()
            console.log('res in ts', data)
            this.url = Urls.baseUrl + Urls.port + Constants.enrollPartner
            this.message = data.json.message[1].message
            this.method = 'verifyKyc'
            this.stackTrace = ''
            this.inserErrorApi()
            if (data != null) {
              if (data.status == 200) {
                //

                this.userData.userRole = 'Partner'
                this.storage.set('userInfo', this.userData).then(async (val) => {
                  await this.navCtrl.navigateForward('KycPanCardPage')
                })
              } else {
                if (loading) loading.dismiss()
              }
              this.disableSave = ''
            }
          },
          (err) => {
            loading.dismiss()
            console.log('err in enrole partner', err)
            this.url = Urls.baseUrl + Urls.port + Constants.enrollPartner
            this.stackTrace = err.stack
            this.message = err.message
            this.method = 'verifyKyc'
            this.inserErrorApi()
            this.toastCtrl.create({
              message: err,
              showCloseButton: true,
              closeButtonText: 'ok',
              // dismissOnPageChange: true,
              position: 'bottom',
              cssClass: 'ujb_toast',
            }).then(ctrl => ctrl.present())
            this.disableSave = ''
            //// this.navCtrl.push(KycPanCardPage)
            // toast.present()
          }
        )
    }
  }

  async gotoDashboard() {
    this.checkvalidation = true
    if (this.isInputGiven == true) {
      this.disableSave = 'disabled'
      let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      loading.present()

      console.log(
        'obj enroll partner1234',
        JSON.stringify(Questionnaire1Page.questionnaireObj)
      )
      this.questionnnaireService
        .enrollPartnerApi(Questionnaire1Page.questionnaireObj)
        .subscribe(
          async (data) => {
            if (loading) loading.dismiss()
            console.log('res in ts', data)
            this.url = Urls.baseUrl + Urls.port + Constants.enrollPartner
            this.stackTrace = ''
            this.message = data.json.message[1].message
            this.method = 'gotoDashboard'
            this.inserErrorApi()

            if (data != null) {
              if (data.status == 200) {
                ////
                this.userData.userRole = 'Partner'

                this.storage.set('userInfo', this.userData).then(async (val) => {
                  await this.navCtrl.navigateRoot('DashboardPage')
                })
              } else {
                if (loading) loading.dismiss()
              }
              this.disableSave = ''
            }
          },
          (err) => {
            console.log('err in enrole partner', err)
            loading.dismiss()

            this.toastCtrl.create({
              message: err,
              showCloseButton: true,
              closeButtonText: 'ok',
              // dismissOnPageChange: true,
              position: 'bottom',
              cssClass: 'ujb_toast',
            }).then(ctrl => ctrl.present())
            this.disableSave = ''
            /*         this.storage.set("userRole", "Partner")
                await this.navCtrl.navigateRoot('DashboardPage') */
            //toast.present()
            this.url = Urls.baseUrl + Urls.port + Constants.enrollPartner
            this.stackTrace = err.stack
            this.message = err.message
            this.method = 'gotoDashboard'
            this.inserErrorApi()
          }
        )
    } else {
      let a = document.getElementById('errorSource')
      a.scrollIntoView({ behavior: 'smooth' })
      this.disableSave = ''
    }
  }
  /**
   * above code added by dakshata
   */
  selectValue(data: any) {
    ////
    this.selectedValue = data
    this.isInputGiven = true
    Questionnaire1Page.questionnaireObj.passiveIncome = this.selectedValue
    switch (data) {
      case '1000-5000': {
        $('#slot1').css('background-color', '#003366')
        $('#slot1').css('color', '#ffffff')
        $('#slot2').css('background-color', '#ffffff')
        $('#slot2').css('color', '#003366')
        $('#slot3').css('background-color', '#ffffff')
        $('#slot3').css('color', '#003366')
        $('#slot4').css('background-color', '#ffffff')
        $('#slot4').css('color', '#003366')

        break
      }
      case '5001-15000': {
        $('#slot1').css('background-color', '#ffffff')
        $('#slot1').css('color', '#003366')
        $('#slot2').css('background-color', '#003366')
        $('#slot2').css('color', '#ffffff')
        $('#slot3').css('background-color', '#ffffff')
        $('#slot3').css('color', '#003366')
        $('#slot4').css('background-color', '#ffffff')
        $('#slot4').css('color', '#003366')
        break
      }
      case '15001-30000': {
        $('#slot1').css('background-color', '#ffffff')
        $('#slot1').css('color', '#003366')
        $('#slot2').css('background-color', '#ffffff')
        $('#slot2').css('color', '#003366')
        $('#slot3').css('background-color', '#003366')
        $('#slot3').css('color', '#ffffff')
        $('#slot4').css('background-color', '#ffffff')
        $('#slot4').css('color', '#003366')

        break
      }
      case '30001 and above': {
        $('#slot1').css('background-color', '#ffffff')
        $('#slot1').css('color', '#003366')
        $('#slot2').css('background-color', '#ffffff')
        $('#slot2').css('color', '#003366')
        $('#slot3').css('background-color', '#ffffff')
        $('#slot3').css('color', '#003366')
        $('#slot4').css('background-color', '#003366')
        $('#slot4').css('color', '#ffffff')

        break
      }
    }
  }
  // ngOnInit() {
  //   console.log('ngOnInit Questionnaire9Page');
  // }

  async savePassiveIncome() {
    this.disableSave = 'disabled'
    let data = {
      userId: this.userId,
      type: 'PassiveIncome',
      value: this.selectedValue,
    }
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.profileProvider.updatePartnerProfile(data).subscribe(
      (res: any) => {
        if (loading) loading.dismiss()
        Utility.showToast(
          this.toastCtrl,
          'Passive income updated successfully',
          false,
          '',
          false
        )
        setTimeout(() => {
          this.navCtrl.pop()
          this.disableSave = ''
        }, Constants.toastTimeOut)
      },
      (err) => {
        this.disableSave = ''
        if (this.loading) this.loading.dismiss()
        this.url = Urls.baseUrl + Urls.port + Constants.updatePartnerProfile
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'savePassiveIncome'
        this.inserErrorApi()
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }

  inserErrorApi() {
    let Input = {
      userId: this.userId,
      gender: Questionnaire1Page.questionnaireObj.gender,
      birthDate: Questionnaire1Page.questionnaireObj.birthDate,
      passiveIncome: Questionnaire1Page.questionnaireObj.passiveIncome,
      knowledgeSource: Questionnaire1Page.questionnaireObj.knowledgeSource,
      Localities: Questionnaire1Page.questionnaireObj.Localities,
      addressInfo: Questionnaire1Page.questionnaireObj.addressInfo,
      organisationType: Questionnaire1Page.questionnaireObj.organisationType,
      userType: Questionnaire1Page.questionnaireObj.userType,
      countryId: Questionnaire1Page.questionnaireObj.countryId,
      stateId: Questionnaire1Page.questionnaireObj.stateId,
    }
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error =
      this.stackTrace + 'input by user' + JSON.stringify(Input)
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'Questionnaire9Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
