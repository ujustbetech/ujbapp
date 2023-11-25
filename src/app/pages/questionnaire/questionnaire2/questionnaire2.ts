import * as moment from 'moment'

import { Component, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import {  NavController, ToastController } from '@ionic/angular'

import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Platform } from '@ionic/angular'
import { Questionnaire1Page } from '../../questionnaire/questionnaire1/questionnaire1'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from './../../../Utils/Utility'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the Questionnaire2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-questionnaire2',
  templateUrl: 'questionnaire2.html',
  styleUrls: ['questionnaire2.scss']
})
export class Questionnaire2Page {
  // @ViewChild('dateTime', { static: true }) dateTime: DateTime
  questionnaire2Form: FormGroup
  //Page Title
  userFirstName: any
  pageTitle = 'Enroll as Partner'
  date: FormControl
  checkvalidation: boolean = false
  maxDate: string = new Date().toISOString()

  birthDate: any
  referrer: any
  showSave: boolean = false
  disableSave: any
  userId: string
  loading
  age
  data
  today
  isInputGiven: boolean = true
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  params

  constructor(
    private fb: FormBuilder,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public logErrorService: InserErrorLogService,
    private profileProvider: UserProfileService,
    private storage: Storage,
    private platform: Platform,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    route.queryParams.subscribe((params: any) => {
      this.params = params
    })
    let current = moment()
    console.log(
      '18 years',
      moment(moment().subtract(18, 'year'), 'DD-MM-YYYY').toString()
    )
    this.maxDate = moment().subtract(18, 'year').format('YYYY-MM-DD')
    console.log('year1', this.maxDate)
    this.isInputGiven == true
    this.date = new FormControl('', Validators.required)
    this.questionnaire2Form = this.fb.group({
      date: this.date,
    })
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
    })

    this.birthDate = this.birthDate

    this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
  }
  registerBackButton() {
    this.platform.backButton.subscribe(() => {
      // if (this.dateTime)
        // if (this.dateTime._picker) this.dateTime._picker.dismiss()
      this.navCtrl.pop()
    })
  }
  ionViewWillEnter() {
    this.disableSave = ''
    let data = this.params.birthDate
    if (data) {
      this.birthDate = data
    }
    this.referrer = this.params.referrer
    if (this.referrer == 'PartnerPage') {
      this.showSave = true
    } else if (this.referrer == 'ClientPartnerPage') {
      this.showSave = true
    }
  }
  goToQ1() {
    this.navCtrl.pop()
  }
  async goToQ3() {
    ////
    this.checkvalidation = true
    //Questionnaire1Page.ques1.birthDate="",this.birthDate
    if (this.questionnaire2Form.valid) {
      this.disableSave = 'disabled'
      Questionnaire1Page.questionnaireObj.birthDate = this.birthDate
      console.log('dob', Questionnaire1Page.questionnaireObj.birthDate)
      await this.navCtrl.navigateForward('Questionnaire3Page')
    }
  }

  // ngOnInit() {
  //   console.log('ngOnInit Questionnaire2Page');
  // }

  saveBirthDate() {
    this.disableSave = 'disabled'
    this.loading.present()
    this.questionnaire2Form.value.date = new Date(
      this.questionnaire2Form.value.date
    ).toISOString()
    let updateBirthData = {
      userId: this.userId,
      type: 'BirthDate',
      value: this.questionnaire2Form.value.date,
    }

    this.profileProvider.updatePartnerProfile(updateBirthData).subscribe(
      (res: any) => {
        if (this.loading) this.loading.dismiss()
        Utility.showToast(
          this.toastCtrl,
          'Birth date updated successfully',
          false,
          '',
          false
        )
        setTimeout(() => {
          this.disableSave = ''
          this.navCtrl.pop()
        }, Constants.toastTimeOut)
      },
      (err) => {
        this.disableSave = ''
        if (this.loading) this.loading.dismiss()
        Utility.showToast(
          this.toastCtrl,
          Constants.someErrorOccurred,
          false,
          '',
          false
        )
        this.url = Urls.baseUrl + Urls.port + Constants.updatePartnerProfile
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'saveBirthDate'
        this.inserErrorApi()
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }
  getAge() {
    console.log(this.birthDate)
    this.today = new Date()
    this.birthDate = new Date(this.birthDate)
    const y = this.today.getFullYear() - this.birthDate.getFullYear()
    const m = this.today.getMonth() - this.birthDate.getMonth()
    const d = this.today.getDate() - this.birthDate.getDate()
    if (y < 18) {
      this.isInputGiven = false
    } else if (y <= 18) {
      if (m >= 0) {
        this.isInputGiven = false
      } else {
        this.isInputGiven = true
      }
    } else {
      this.isInputGiven = true
    }
    // this.age = this.today.getFullYear() - this.birthDate.getFullYear();

    // // var timeDiff = Math.abs(Date.now() - this.birthDate);

    // // console.log(timeDiff);

    // this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);

    // console.log(this.age);
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'Questionnaire2Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
