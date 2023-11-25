/*
 * Revision History:
 *
 *
 *    update Organization type & User Type from profile for partner       2019/08/13       Yogesh Chavan
 */
import { Component, OnInit } from '@angular/core'
import {  NavController, ToastController } from '@ionic/angular'
import { Questionnaire6Page } from '../../questionnaire/questionnaire6/questionnaire6'
import { Questionnaire8Page } from '../../questionnaire/questionnaire8/questionnaire8'
import * as $ from 'jquery'
import { Questionnaire1Page } from '../questionnaire1/questionnaire1'
import { LoadingController } from '@ionic/angular'

import { Utility } from './../../../Utils/Utility'
import { Storage } from '@ionic/storage'
import { Constants } from '../../../Utils/Constants'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'
/**
 * Generated class for the Questionnaire7Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-questionnaire7',
  templateUrl: 'questionnaire7.html',
  styleUrls: ['questionnaire7.scss']
})
export class Questionnaire7Page {
  //Page Title
  pageTitle = 'Enroll as Partner'
  isInputGiven: boolean = false
  checkvalidation: boolean = false
  selectedVal
  organisationType
  myClass1
  myClass2
  userFirstName: any
  showSave: boolean = false
  userId
  userType: string
  loading
  disableSave: any
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
    })
    this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
  }

  async ionViewWillEnter() {
    this.disableSave = ''
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
    })

    let fromPartnerPage = this.params.fromPartnerPage
    if (fromPartnerPage) {
      this.showSave = true
    }
    if (this.showSave == true) {
      this.userType = this.params.userType
      if (this.userType != 'null') {
        if (this.userType) {
          this.selectValue(this.userType, 0)
        } else {
          this.isInputGiven = false
        }
      }
    }

    this.selectedVal = this.params.selectedVal
    this.organisationType = this.selectedVal
    console.log('selectvalue', this.selectedVal)
    if (this.selectedVal == 'Individual') {
      console.log('myclass1')
      this.myClass1 = 'view'
      this.myClass2 = 'hide'
      console.log('myclass1Val', this.myClass1)
      console.log('myclass2Val', this.myClass2)
    } else if (this.selectedVal == 'Company') {
      console.log('myclass2')
      this.myClass1 = 'hide'
      this.myClass2 = 'view'
      console.log('myclass2Val', this.myClass2)
      console.log('myclass1Val', this.myClass1)
    }
  }

  goToQ6() {
    this.navCtrl.pop()
  }
  async goToQ8() {
    this.checkvalidation = true
    if (this.isInputGiven == true) {
      this.disableSave = 'disabled'
      await this.navCtrl.navigateForward('Questionnaire8Page')
    }
  }

  selectValue(val, data) {
    this.userType = val
    this.selectedVal = val
    this.isInputGiven = true
    Questionnaire1Page.questionnaireObj.userType = this.selectedVal
    console.log('val', Questionnaire1Page.questionnaireObj.userType)
    switch (val) {
      case 1: {
        $('#homemaker').css('background-color', '#003366')
        $('#homemaker').css('color', '#ffffff')
        $('#employee').css('background-color', '#ffffff')
        $('#employee').css('color', '#003366')
        $('#student').css('background-color', '#ffffff')
        $('#student').css('color', '#003366')
        $('#retired').css('background-color', '#ffffff')
        $('#retired').css('color', '#003366')
        $('#otherindividual').css('background-color', '#ffffff')
        $('#otherindividual').css('color', '#003366')
        $('#freelancer').css('background-color', '#ffffff')
        $('#freelancer').css('color', '#003366')
        $('#consultant').css('background-color', '#ffffff')
        $('#consultant').css('color', '#003366')
        $('#owner').css('background-color', '#ffffff')
        $('#owner').css('color', '#003366')
        $('#option').css('background-color', '#ffffff')
        $('#option').css('color', '#003366')

        break
      }
      case 2: {
        $('#homemaker').css('background-color', '#ffffff')
        $('#homemaker').css('color', '#003366')
        $('#employee').css('background-color', '#003366')
        $('#employee').css('color', '#ffffff')
        $('#student').css('background-color', '#ffffff')
        $('#student').css('color', '#003366')
        $('#retired').css('background-color', '#ffffff')
        $('#retired').css('color', '#003366')
        $('#otherindividual').css('background-color', '#ffffff')
        $('#otherindividual').css('color', '#003366')
        $('#freelancer').css('background-color', '#ffffff')
        $('#freelancer').css('color', '#003366')
        $('#consultant').css('background-color', '#ffffff')
        $('#consultant').css('color', '#003366')
        $('#owner').css('background-color', '#ffffff')
        $('#owner').css('color', '#003366')
        $('#option').css('background-color', '#ffffff')
        $('#option').css('color', '#003366')

        break
      }
      case 3: {
        $('#homemaker').css('background-color', '#ffffff')
        $('#homemaker').css('color', '#003366')
        $('#employee').css('background-color', '#ffffff')
        $('#employee').css('color', '#003366')
        $('#student').css('background-color', '#003366')
        $('#student').css('color', '#ffffff')
        $('#retired').css('background-color', '#ffffff')
        $('#retired').css('color', '#003366')
        $('#otherindividual').css('background-color', '#ffffff')
        $('#otherindividual').css('color', '#003366')
        $('#freelancer').css('background-color', '#ffffff')
        $('#freelancer').css('color', '#003366')
        $('#consultant').css('background-color', '#ffffff')
        $('#consultant').css('color', '#003366')
        $('#owner').css('background-color', '#ffffff')
        $('#owner').css('color', '#003366')
        $('#option').css('background-color', '#ffffff')
        $('#option').css('color', '#003366')

        break
      }
      case 4: {
        $('#homemaker').css('background-color', '#ffffff')
        $('#homemaker').css('color', '#003366')
        $('#employee').css('background-color', '#ffffff')
        $('#employee').css('color', '#003366')
        $('#student').css('background-color', '#ffffff')
        $('#student').css('color', '#003366')
        $('#retired').css('background-color', '#003366')
        $('#retired').css('color', '#ffffff')
        $('#otherindividual').css('background-color', '#ffffff')
        $('#otherindividual').css('color', '#003366')
        $('#freelancer').css('background-color', '#ffffff')
        $('#freelancer').css('color', '#003366')
        $('#consultant').css('background-color', '#ffffff')
        $('#consultant').css('color', '#003366')
        $('#owner').css('background-color', '#ffffff')
        $('#owner').css('color', '#003366')
        $('#option').css('background-color', '#ffffff')
        $('#option').css('color', '#003366')

        break
      }
      case 5: {
        $('#homemaker').css('background-color', '#ffffff')
        $('#homemaker').css('color', '#003366')
        $('#employee').css('background-color', '#ffffff')
        $('#employee').css('color', '#003366')
        $('#student').css('background-color', '#ffffff')
        $('#student').css('color', '#003366')
        $('#retired').css('background-color', '#ffffff')
        $('#retired').css('color', '#003366')
        $('#otherindividual').css('background-color', '#003366')
        $('#otherindividual').css('color', '#ffffff')
        $('#freelancer').css('background-color', '#ffffff')
        $('#freelancer').css('color', '#003366')
        $('#consultant').css('background-color', '#ffffff')
        $('#consultant').css('color', '#003366')
        $('#owner').css('background-color', '#ffffff')
        $('#owner').css('color', '#003366')
        $('#option').css('background-color', '#ffffff')
        $('#option').css('color', '#003366')

        break
      }
      case 6: {
        $('#homemaker').css('background-color', '#ffffff')
        $('#homemaker').css('color', '#003366')
        $('#employee').css('background-color', '#ffffff')
        $('#employee').css('color', '#003366')
        $('#student').css('background-color', '#ffffff')
        $('#student').css('color', '#003366')
        $('#retired').css('background-color', '#ffffff')
        $('#retired').css('color', '#003366')
        $('#otherindividual').css('background-color', '#ffffff')
        $('#otherindividual').css('color', '#003366')
        $('#freelancer').css('background-color', '#003366')
        $('#freelancer').css('color', '#ffffff')
        $('#consultant').css('background-color', '#ffffff')
        $('#consultant').css('color', '#003366')
        $('#owner').css('background-color', '#ffffff')
        $('#owner').css('color', '#003366')
        $('#option').css('background-color', '#ffffff')
        $('#option').css('color', '#003366')

        break
      }
      case 7: {
        $('#homemaker').css('background-color', '#ffffff')
        $('#homemaker').css('color', '#003366')
        $('#employee').css('background-color', '#ffffff')
        $('#employee').css('color', '#003366')
        $('#student').css('background-color', '#ffffff')
        $('#student').css('color', '#003366')
        $('#retired').css('background-color', '#ffffff')
        $('#retired').css('color', '#003366')
        $('#otherindividual').css('background-color', '#ffffff')
        $('#otherindividual').css('color', '#003366')
        $('#freelancer').css('background-color', '#ffffff')
        $('#freelancer').css('color', '#003366')
        $('#consultant').css('background-color', '#003366')
        $('#consultant').css('color', '#ffffff')
        $('#owner').css('background-color', '#ffffff')
        $('#owner').css('color', '#003366')
        $('#option').css('background-color', '#ffffff')
        $('#option').css('color', '#003366')

        break
      }
      case 8: {
        $('#homemaker').css('background-color', '#ffffff')
        $('#homemaker').css('color', '#003366')
        $('#employee').css('background-color', '#ffffff')
        $('#employee').css('color', '#003366')
        $('#student').css('background-color', '#ffffff')
        $('#student').css('color', '#003366')
        $('#retired').css('background-color', '#ffffff')
        $('#retired').css('color', '#003366')
        $('#otherindividual').css('background-color', '#ffffff')
        $('#otherindividual').css('color', '#003366')
        $('#freelancer').css('background-color', '#ffffff')
        $('#freelancer').css('color', '#003366')
        $('#consultant').css('background-color', '#ffffff')
        $('#consultant').css('color', '#003366')
        $('#owner').css('background-color', '#003366')
        $('#owner').css('color', '#ffffff')
        $('#option').css('background-color', '#ffffff')
        $('#option').css('color', '#003366')

        break
      }
      case 9: {
        $('#homemaker').css('background-color', '#ffffff')
        $('#homemaker').css('color', '#003366')
        $('#employee').css('background-color', '#ffffff')
        $('#employee').css('color', '#003366')
        $('#student').css('background-color', '#ffffff')
        $('#student').css('color', '#003366')
        $('#retired').css('background-color', '#ffffff')
        $('#retired').css('color', '#003366')
        $('#otherindividual').css('background-color', '#ffffff')
        $('#otherindividual').css('color', '#003366')
        $('#freelancer').css('background-color', '#ffffff')
        $('#freelancer').css('color', '#003366')
        $('#consultant').css('background-color', '#ffffff')
        $('#consultant').css('color', '#003366')
        $('#owner').css('background-color', '#ffffff')
        $('#owner').css('color', '#003366')
        $('#option').css('background-color', '#003366')
        $('#option').css('color', '#ffffff')

        break
      }
    }
  }

  saveOrginazationType() {
    this.disableSave = 'disabled'
    console.log('succes in organisation,')
    let data = {
      userId: this.userId,
      type: 'OrganisationType',
      value: this.organisationType,
    }
    this.loading.present()

    this.profileProvider.updatePartnerProfile(data).subscribe(
      (res: any) => {
        console.log('succes', res)
        this.updateUserType()
      },
      (err) => {
        if (this.loading) this.loading.dismiss()
        this.disableSave = ''
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }
  updateUserType() {
    if (this.isInputGiven == true) {
      let userType = {
        userId: this.userId,
        type: 'UserType',
        value: this.userType,
      }

      this.profileProvider.updatePartnerProfile(userType).subscribe(
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
            // TODO
            // for (let i = 0; i < this.navCtrl.getViews().length; i++) {
            //   if (
            //     this.navCtrl.getViews()[i].instance instanceof
            //     Questionnaire7Page
            //   ) {
            //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
            //   }
            //   if (
            //     this.navCtrl.getViews()[i].instance instanceof
            //     Questionnaire6Page
            //   ) {
            //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
            //   }
            // }
          }, Constants.toastTimeOut)
          this.disableSave = ''
        },
        (err) => {
          this.disableSave = ''
          if (this.loading) this.loading.dismiss()
          //// this.navCtrl.push(ErrorPage)
        }
      )
    } else {
      if (this.loading) this.loading.dismiss()
      this.checkvalidation = true
      this.isInputGiven = false
      this.disableSave = ''
    }
  }
}
