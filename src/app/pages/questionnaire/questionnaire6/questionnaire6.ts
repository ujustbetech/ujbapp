/*
 * Revision History:
 *
 *
 *    update Organization type from profile for partner       2019/08/13       Yogesh Chavan
 */
import { Component, OnInit } from '@angular/core'
import {  NavController, ToastController } from '@ionic/angular'
import { Questionnaire5Page } from '../../questionnaire/questionnaire5/questionnaire5'
import { Questionnaire7Page } from '../../questionnaire/questionnaire7/questionnaire7'
import { Questionnaire8Page } from '../questionnaire8/questionnaire8'
import { Questionnaire4Page } from '../questionnaire4/questionnaire4'
import * as $ from 'jquery'
import { QuestionsInfo } from '../../../../app/models/QuestionsInfo'
import { Questionnaire1Page } from '../questionnaire1/questionnaire1'
import { LoadingController } from '@ionic/angular'
import { ErrorPage } from '../../common/error/error'

import { Utility } from './../../../Utils/Utility'
import { Storage } from '@ionic/storage'
import { Constants } from '../../../Utils/Constants'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the Questionnaire6Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-questionnaire6',
  templateUrl: 'questionnaire6.html',
  styleUrls: ['questionnaire6.scss']
})
export class Questionnaire6Page {
  //Page Title
  userFirstName: any
  pageTitle = 'Enroll as Partner'
  isInputGiven: boolean = false
  checkvalidation: boolean = false
  Individual
  Company
  selectedVal: string
  inputVal: any
  referrer: any
  showSave: boolean = false
  userId: any
  loading
  userType
  isPartnerRefer: boolean = false
  disableSave: any
  editType
  params
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private storage: Storage,
    private profileProvider: UserProfileService
  ) {
    route.queryParams.subscribe((params: any) => {
      this.params = params
      this.inputVal = params.inputVal
      this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
      console.log('inputVal', this.inputVal)
    })
    // Questionnaire1Page.questionnaireObj = new QuestionsInfo()
  }

  async ionViewWillEnter() {
    this.disableSave = ''
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
    })

    this.userType = this.params.userType
    let referer = this.params.referrer
    if (referer == 'PartnerPage') {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.isPartnerRefer = true
      this.showSave = true
      Questionnaire1Page.questionnaireObj = new QuestionsInfo()
    }
    let data = this.params.data
    this.editType = data.type
    this.inputVal = this.params.data
    if (data) {
      this.selectValue(data.type, data.value)
    }
  }
  goToQ5() {
    ////

    this.navCtrl.pop()
  }
  async goToQ7() {
    this.checkvalidation = true
    if (this.isInputGiven == true && this.selectedVal == 'Other') {
      this.disableSave = 'disabled'
      await this.navCtrl.navigateForward('Questionnaire8Page')
    } else if (this.isInputGiven == true) {
      this.disableSave = 'disabled'
      await this.navCtrl.navigateForward('Questionnaire7Page', { queryParams: { selectedVal: this.selectedVal }})
    }
  }

  selectValue(data: any, val) {
    ////

    this.selectedVal = data
    this.isInputGiven = true
    if (this.isPartnerRefer) {
    } else {
      Questionnaire1Page.questionnaireObj.organisationType = this.selectedVal
    }
    console.log(
      'select val',
      Questionnaire1Page.questionnaireObj.organisationType
    )
    switch (val) {
      case '1': {
        $('#individual').css('background-color', '#003366')
        $('#individual').css('color', '#ffffff')
        $('#company').css('background-color', '#ffffff')
        $('#company').css('color', '#003366')
        $('#other').css('background-color', '#ffffff')
        $('#other').css('color', '#003366')
        break
      }
      case '2': {
        $('#individual').css('background-color', '#ffffff')
        $('#individual').css('color', '#003366')
        $('#company').css('background-color', '#003366')
        $('#company').css('color', '#ffffff')
        $('#other').css('background-color', '#ffffff')
        $('#other').css('color', '#003366')

        break
      }
      case '3': {
        $('#individual').css('background-color', '#ffffff')
        $('#individual').css('color', '#003366')
        $('#company').css('background-color', '#ffffff')
        $('#company').css('color', '#003366')
        $('#other').css('background-color', '#003366')
        $('#other').css('color', '#ffffff')

        break
      }
    }
  }
  // ngOnInit() {
  //   console.log('ngOnInit Questionnaire6Page');
  // }

  async nextPage() {
    this.disableSave = 'disabled'
    if (this.selectedVal == this.editType) {
      await this.navCtrl.navigateForward('Questionnaire7Page', { queryParams: {
        selectedVal: this.selectedVal,
        fromPartnerPage: 'true',
        userType: this.userType,
      }})
    } else {
      await this.navCtrl.navigateForward('Questionnaire7Page', { queryParams: {
        selectedVal: this.selectedVal,
        fromPartnerPage: 'true',
        userType: 'null',
      }})
    }
  }

  saveOther() {
    this.disableSave = 'disabled'
    this.loading.present()
    let data = {
      userId: this.userId,
      type: 'OrganisationType',
      value: this.selectedVal,
    }
    this.profileProvider.updatePartnerProfile(data).subscribe(
      (res: any) => {
        if (this.loading) this.loading.dismiss()
        Utility.showToast(
          this.toastCtrl,
          'Data updated successfully',
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
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }
}
