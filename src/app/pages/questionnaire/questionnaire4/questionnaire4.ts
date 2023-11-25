/*
 * Revision History:
 *
 *
 *    update user type from profile for partner       2019/08/13       Yogesh Chavan
 */

import * as $ from 'jquery'

import {  NavController, ToastController } from '@ionic/angular'

import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Questionnaire1Page } from '../questionnaire1/questionnaire1'
import { QuestionsInfo } from '../../../../app/models/QuestionsInfo'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from './../../../Utils/Utility'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the Questionnaire4Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-questionnaire4',
  templateUrl: 'questionnaire4.html',
  styleUrls: ['questionnaire4.scss']
})
export class Questionnaire4Page {
  //Page Title
  pageTitle = 'Enroll as Partner'
  isInputGiven: boolean = false
  checkvalidation: boolean = false
  inputVal: string
  userFirstName: any
  userId: any
  showSave: boolean = false
  userType: string
  loading
  disableSave: any
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  params
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public logErrorService: InserErrorLogService,
    private storage: Storage,
    private profileProvider: UserProfileService
  ) {
    route.queryParams.subscribe((params: any) => {
      this.params = params
    })
    this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
  }

  ionViewWillEnter() {
    this.disableSave = ''
    //Questionnaire1Page.questionnaireObj = new QuestionsInfo()
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
    })

    let fromPartnerPage = this.params.referrer
    if (fromPartnerPage == 'PartnerPage') {
      this.showSave = true
      Questionnaire1Page.questionnaireObj = new QuestionsInfo()
    }

    let data = this.params.data
    if (data) {
      switch (data) {
        case 'UJustBe Partner':
          this.selectValue('partner', '1')
          break
        case 'UJustBe Video':
          this.selectValue('video', '2')
          break
        case 'Facebook':
          this.selectValue('facebook', '3')
          break
        case 'Linkedin':
          this.selectValue('linkedin', '4')
          break
        case 'Instagram':
          this.selectValue('instagram', '5')
          break
        case 'Other':
          this.selectValue('other', '6')
          break
        default:
          break
      }
      //case:
    }
  }

  goToQ3() {
    this.navCtrl.pop()
  }
  async goToQ5() {
    this.checkvalidation = true
    if (this.isInputGiven == true && this.inputVal == 'UJustBe Partner') {
      this.disableSave = 'disabled'
      await this.navCtrl.navigateForward('Questionnaire5Page', { queryParams: { inputVal: this.inputVal }})
    } else if (this.isInputGiven == true) {
      this.disableSave = 'disabled'
      await this.navCtrl.navigateForward('Questionnaire8Page')
    } else {
      let a = document.getElementById('errorSource')
      a.scrollIntoView({ behavior: 'smooth' })
    }
  }
  selectValue(data: any, val) {
    this.inputVal = data
    this.isInputGiven = true
    Questionnaire1Page.questionnaireObj.knowledgeSource = this.inputVal
    console.log('input', Questionnaire1Page.questionnaireObj.knowledgeSource)
    console.log('id', val)

    // this.x=id
    switch (val) {
      case '1': {
        $('#1').css('background-color', '#003366')
        $('#1').css('color', '#ffffff')
        $('#2').css('background-color', '#ffffff')
        $('#2').css('color', '#003366')
        $('#3').css('background-color', '#ffffff')
        $('#3').css('color', '#003366')
        $('#4').css('background-color', '#ffffff')
        $('#4').css('color', '#003366')
        $('#5').css('background-color', '#ffffff')
        $('#5').css('color', '#003366')
        $('#6').css('background-color', '#ffffff')
        $('#6').css('color', '#003366')

        console.log('partner')
        break
      }
      case '2': {
        $('#1').css('background-color', '#ffffff')
        $('#1').css('color', '#003366')
        $('#2').css('background-color', '#003366')
        $('#2').css('color', '#ffffff')
        $('#3').css('background-color', '#ffffff')
        $('#3').css('color', '#003366')
        $('#4').css('background-color', '#ffffff')
        $('#4').css('color', '#003366')
        $('#5').css('background-color', '#ffffff')
        $('#5').css('color', '#003366')
        $('#6').css('background-color', '#ffffff')
        $('#6').css('color', '#003366')
        console.log('video')
        break
      }
      case '3': {
        $('#1').css('background-color', '#ffffff')
        $('#1').css('color', '#003366')
        $('#2').css('background-color', '#ffffff')
        $('#2').css('color', '#003366')
        $('#3').css('background-color', '#003366')
        $('#3').css('color', '#ffffff')
        $('#4').css('background-color', '#ffffff')
        $('#4').css('color', '#003366')
        $('#5').css('background-color', '#ffffff')
        $('#5').css('color', '#003366')
        $('#6').css('background-color', '#ffffff')
        $('#6').css('color', '#003366')
        console.log('facebook')
        break
      }
      case '4': {
        $('#1').css('background-color', '#ffffff')
        $('#1').css('color', '#003366')
        $('#2').css('background-color', '#ffffff')
        $('#2').css('color', '#003366')
        $('#3').css('background-color', '#ffffff')
        $('#3').css('color', '#003366')
        $('#4').css('background-color', '#003366')
        $('#4').css('color', '#ffffff')
        $('#5').css('background-color', '#ffffff')
        $('#5').css('color', '#003366')
        $('#6').css('background-color', '#ffffff')
        $('#6').css('color', '#003366')
        console.log('linkedin')
        break
      }
      case '5': {
        $('#1').css('background-color', '#ffffff')
        $('#1').css('color', '#003366')
        $('#2').css('background-color', '#ffffff')
        $('#2').css('color', '#03366')
        $('#3').css('background-color', '#ffffff')
        $('#3').css('color', '#003366')
        $('#4').css('background-color', '#ffffff')
        $('#4').css('color', '#003366')
        $('#5').css('background-color', '#003366')
        $('#5').css('color', '#ffffff')
        $('#6').css('background-color', '#ffffff')
        $('#6').css('color', '#003366')
        console.log('instagram')
        break
      }
      case '6': {
        $('#1').css('background-color', '#ffffff')
        $('#1').css('color', '#003366')
        $('#2').css('background-color', '#ffffff')
        $('#2').css('color', '#003366')
        $('#3').css('background-color', '#ffffff')
        $('#3').css('color', '#003366')
        $('#4').css('background-color', '#ffffff')
        $('#4').css('color', '#003366')
        $('#5').css('background-color', '#ffffff')
        $('#5').css('color', '#003366')
        $('#6').css('background-color', '#003366')
        $('#6').css('color', '#ffffff')
        console.log('other')
        break
      }
    }
  }

  saveOther() {
    this.disableSave = 'disabled'
    let data = {
      userId: this.userId,
      type: 'KnowledgeSource',
      value: this.inputVal,
    }
    this.loading.present()
    this.profileProvider.updatePartnerProfile(data).subscribe(
      (res: any) => {
        Utility.showToast(
          this.toastCtrl,
          'Knowledge source updated successfully',
          false,
          '',
          false
        )

        setTimeout(() => {
          if (this.loading) this.loading.dismiss()
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
        this.method = 'saveOther'
        this.inserErrorApi()

        //// this.navCtrl.push(ErrorPage)
      }
    )
  }

  async nextPage() {
    this.disableSave = 'disabled'
    await this.navCtrl.navigateForward('Questionnaire5Page', { queryParams: {
      data: this.inputVal,
      referer: 'PartnerPage',
    }})
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'Questionnaire4Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
