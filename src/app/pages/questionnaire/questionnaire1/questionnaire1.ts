/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/05/03        Dakshata Patil*/

import * as $ from 'jquery'

import { Component,  } from '@angular/core'
import {  NavController, ToastController } from '@ionic/angular'

import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { QuestionsInfo } from '../../../../app/models/QuestionsInfo'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from './../../../Utils/Utility'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the Questionnaire1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-questionnaire1',
  templateUrl: 'questionnaire1.html',
  styleUrls: ['questionnaire1.scss']
})
export class Questionnaire1Page {
  //Page Title

  pageTitle = 'Enroll as Partner'
  selectGender: boolean = false
  checkValidation: boolean = false
  male_img = Constants.male_img
  female_img = Constants.female_img
  userFirstName: any
  referrer: any
  showSave: boolean = false
  userId: any
  loading
  disableSave = ''
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  params
  public static questionnaireObj: QuestionsInfo
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public logErrorService: InserErrorLogService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private storage: Storage,
    private profileProvider: UserProfileService
  ) {
    Questionnaire1Page.questionnaireObj = new QuestionsInfo()
    // this.loading = await this.loadingCtrl.create({ cssClass: 'transparent', });

    //let gender = this.params.gender')
    route.queryParams.subscribe((params: any) => {
      this.params = params
    })
  }

  ionViewWillEnter() {
    this.disableSave = ''
    console.log('view will enter q1')
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
      console.log('get userid', this.userId)
    })
    let data = this.params.gender
    console.log('data', data)
    if (data) {
      if (data == 'Male') {
        this.selectMe(1)
      } else {
        this.selectMe(2)
      }
    }
    this.referrer = this.params.referrer
    console.log('referrer', this.referrer)
    if (this.referrer == 'PartnerPage') {
      this.showSave = true
    }
    $('page-otp-success').remove()
  }

  async goToQ2() {
    this.checkValidation = true
    if (this.selectGender == true) {
      this.disableSave = 'disabled'
      await this.navCtrl.navigateForward('Questionnaire2Page')
    }
  }
  selectMe(val: any) {
    console.log('val', val)

    this.selectGender = true
    if (val == 1) {
      ////
      this.male_img = Constants.maleSelected
      Questionnaire1Page.questionnaireObj.gender = 'Male'
      this.female_img = Constants.female_img
      console.log('gender', Questionnaire1Page.questionnaireObj.gender)
    } else {
      ////
      this.female_img = Constants.femaleSelected
      Questionnaire1Page.questionnaireObj.gender = 'Female'
      this.male_img = Constants.male_img
      console.log('gender1', Questionnaire1Page.questionnaireObj.gender)
    }
  }
  // ngOnInit() {
  //   console.log('ngOnInit Questionnaire1Page');
  // }

  saveGender() {
    console.log('saveGender')
    this.disableSave = 'disabled'

    let updateBirthData = {
      userId: this.userId,
      type: 'Gender',
      value: Questionnaire1Page.questionnaireObj.gender,
    }

    this.profileProvider.updatePartnerProfile(updateBirthData).subscribe(
      (res: any) => {
        Utility.showToast(
          this.toastCtrl,
          'Gender updated successfully',
          false,
          '',
          false
        )
        setTimeout(() => {
          //  if (this.loading)
          //    this.loading.dismiss();
          this.navCtrl.pop()
        }, Constants.toastTimeOut)
        this.disableSave = ''
      },
      (err) => {
        this.disableSave = ''
        console.log('savegender err', err)

        this.url = Urls.baseUrl + Urls.port + Constants.updatePartnerProfile
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'saveGender'
        this.inserErrorApi()
        //  if (this.loading)
        //   this.loading.dismiss();
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'Questionnaire1Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
