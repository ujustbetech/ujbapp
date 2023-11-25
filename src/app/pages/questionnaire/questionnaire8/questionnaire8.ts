/*
 * Revision History:
 *
 *
 *    update Localities from profile for partner       2019/08/13       Yogesh Chavan
 */
import { Component, OnInit } from '@angular/core'
import {
  
  NavController,
  LoadingController,
  ToastController,
} from '@ionic/angular'
import { Questionnaire7Page } from '../../questionnaire/questionnaire7/questionnaire7'
import { Questionnaire9Page } from '../../questionnaire/questionnaire9/questionnaire9'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { Questionnaire6Page } from '../questionnaire6/questionnaire6'
import { QuestionsInfo } from '../../../../app/models/QuestionsInfo'
import { Questionnaire1Page } from '../questionnaire1/questionnaire1'
import { ThemeMainModalComponent } from '../../../../app/components/theme-main-modal/theme-main-modal'
import { ErrorPage } from '../../common/error/error'

import { Utility } from './../../../Utils/Utility'
import { Storage } from '@ionic/storage'
import { Constants } from '../../../Utils/Constants'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the Questionnaire8Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-questionnaire8',
  templateUrl: 'questionnaire8.html',
  styleUrls: ['questionnaire8.scss']
})
export class Questionnaire8Page {
  disableSave
  questionnaire8Form: FormGroup
  userFirstName: any
  isInputGiven: boolean = false
  checkValidation: boolean = false
  pageTitle = 'Enroll as Partner'
  selectedVal: any
  loc3
  loc2
  loc1
  locality2
  locality1
  locality3
  flagvalue
  showSave: boolean = false
  userId: string
  loading
  isNan: boolean = true
  isNan2: boolean = true
  isNan3: boolean = true
  editLocality1
  editLocality2
  editLocality3
  public pushNow = false
  params
  
  constructor(
    public navCtrl: NavController,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public commonUtilsProvider: CommonUtilsService,
    public toastCtrl: ToastController,
    private storage: Storage,
    private profileProvider: UserProfileService
  ) {
    route.queryParams.subscribe((params: any) => {
      this.params = params
    })
    this.questionnaire8Form = this.fb.group({
      loc1: [null, Validators.required],
      loc2: [null, ''],
      loc3: [null, ''],
    })
    this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
  }

  async ionViewWillEnter() {
    this.disableSave = ''
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
    })
    let referedPage = this.params.referrer
    if (referedPage == 'PartnerPage') {
      this.showSave = true
    }
    if (this.showSave) {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      Questionnaire1Page.questionnaireObj = new QuestionsInfo()
      this.editLocality1 = this.params.locality1
      this.editLocality2 = this.params.locality2
      this.editLocality3 = this.params.locality3
      this.locality1 = this.params.locality1
      this.locality2 = this.params.locality2
      this.locality3 = this.params.locality3
    }
  }

  goToQ7() {
    this.navCtrl.pop()
  }
  async goToQ9() {
    if (this.showSave == true) {
      this.saveLocalites()
    } else {
      if (
        this.questionnaire8Form.valid &&
        this.flagvalue == false &&
        this.isNan == true &&
        this.isNan2 == true &&
        this.isNan3 == true
      ) {
        this.disableSave = 'disabled'
        Questionnaire1Page.questionnaireObj.Localities.push(this.locality1)
        console.log('loc1', Questionnaire1Page.questionnaireObj.Localities)
        if (
          this.locality2 != null &&
          this.locality2 != undefined &&
          this.locality2 != ''
        ) {
          Questionnaire1Page.questionnaireObj.Localities.push(this.locality2)
          console.log('loc2', Questionnaire1Page.questionnaireObj.Localities)
        }
        if (
          this.locality3 != null &&
          this.locality3 != undefined &&
          this.locality3 != ''
        ) {
          Questionnaire1Page.questionnaireObj.Localities.push(this.locality3)
          console.log('loc3', Questionnaire1Page.questionnaireObj.Localities)
        }
        await this.navCtrl.navigateForward('Questionnaire9Page')
      }
    }
  }

  async checkLocalities() {
    this.checkValidation = true
    Questionnaire1Page.questionnaireObj.Localities = new Array<any>()
    if (
      this.questionnaire8Form.value.loc1 ==
        this.questionnaire8Form.value.loc2 ||
      this.questionnaire8Form.value.loc2 ==
        this.questionnaire8Form.value.loc3 ||
      this.questionnaire8Form.value.loc1 == this.questionnaire8Form.value.loc3
    ) {
      if (this.questionnaire8Form.valid) {
        if (
          this.questionnaire8Form.value.loc2 == undefined ||
          (this.questionnaire8Form.value.loc2 == '' &&
            this.questionnaire8Form.value.loc3 == undefined) ||
          this.questionnaire8Form.value.loc3 == ''
        ) {
          this.flagvalue = false
          Questionnaire1Page.questionnaireObj.Localities.push(this.locality1)
          await this.navCtrl.navigateForward('Questionnaire9Page')
        } else {
          this.flagvalue = true
        }
      } else {
        //this.isNan = true
        // this.isNan2 = true
        // this.isNan3 = true
        this.flagvalue = false
      }
    } else {
      this.flagvalue = false
      this.goToQ9()
    }
  }

  saveLocalites() {
    this.checkValidation = true
    if (
      this.editLocality1 == this.questionnaire8Form.value.loc1 &&
      this.editLocality2 == this.questionnaire8Form.value.loc2 &&
      this.editLocality3 == this.questionnaire8Form.value.loc3
    ) {
      this.flagvalue = false
      this.isNan == true
      this.isNan2 == true
      this.isNan3 == true
      this.callUpdateApi()
    } else if (
      this.questionnaire8Form.value.loc1 ==
        this.questionnaire8Form.value.loc2 ||
      this.questionnaire8Form.value.loc2 ==
        this.questionnaire8Form.value.loc3 ||
      this.questionnaire8Form.value.loc1 == this.questionnaire8Form.value.loc3
    ) {
      this.flagvalue = true
      if (this.questionnaire8Form.valid) {
        if (
          this.questionnaire8Form.value.loc2 == '' &&
          this.questionnaire8Form.value.loc3 == ''
        ) {
          this.flagvalue = false
          this.callUpdateApi()
        } else {
          this.flagvalue = true
        }
      } else {
        this.callUpdateApi()
      }
    } else {
      this.flagvalue = false
      this.callUpdateApi()
    }
  }
  callUpdateApi() {
    let data = {
      UserId: this.userId,
      locations: {
        location1: this.locality1,
        location2: this.locality2,
        location3: this.locality3,
      },
    }
    if (
      this.questionnaire8Form.valid &&
      this.flagvalue == false &&
      this.isNan == true &&
      this.isNan2 == true &&
      this.isNan3 == true
    ) {
      this.disableSave = 'disabled'
      this.loading.present()
      this.profileProvider.updateLocalities(data).subscribe(
        (res: any) => {
          if (this.loading) this.loading.dismiss()
          Utility.showToast(
            this.toastCtrl,
            'User localities updated successfully',
            false,
            '',
            false
          )
          setTimeout(() => {
            this.navCtrl.pop()
            this.disableSave = ''
          }, Constants.toastTimeOut)
        },
        async (err) => {
          if (this.loading) this.loading.dismiss()
          await this.navCtrl.navigateForward('ErrorPage')
          this.disableSave = ''
        }
      )
    } else {
      this.flagvalue = false
    }
  }

  onKey1() {
    console.log('isnan1', isNaN(Number(this.questionnaire8Form.value.loc1)))

    if (
      this.questionnaire8Form.value.loc1 == undefined ||
      this.questionnaire8Form.value.loc1 == ''
    ) {
      this.isNan = true
    } else {
      //console.log(Number(this.questionnaire8Form.value.loc1))
      if (isNaN(Number(this.questionnaire8Form.value.loc1))) {
        this.isNan = true
        console.log('loc1nan if', this.isNan)
      } else {
        this.isNan = false
        console.log('loc1nan else', this.isNan)
      }
    }
  }
  onKey2() {
    if (this.questionnaire8Form.value.loc2 == '') {
      this.isNan2 = true
      this.flagvalue = false
    } else {
      console.log(Number(this.questionnaire8Form.value.loc2))
      if (isNaN(Number(this.questionnaire8Form.value.loc2))) {
        this.isNan2 = true
        console.log('loc1nan if', this.isNan)
      } else {
        this.isNan2 = false
        console.log('loc1nan else', this.isNan)
      }
    }
  }
  onKey3() {
    if (this.questionnaire8Form.value.loc3 == '') {
      this.isNan3 = true
      this.flagvalue = false
    } else {
      console.log(Number(this.questionnaire8Form.value.loc3))
      if (isNaN(Number(this.questionnaire8Form.value.loc3))) {
        this.isNan3 = true
        console.log('loc1nan if', this.isNan)
      } else {
        this.isNan3 = false
        console.log('loc1nan else', this.isNan)
      }
    }
  }
  navigateToPage() {
    if (this.showSave) {
      this.saveLocalites()
    } else {
      this.checkLocalities()
    }
  }
  // Push On Focus
  scrollTo(ht: any) {
    this.pushNow = true
  }

  removeSroll() {
    this.pushNow = false
  }
}
