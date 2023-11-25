import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'

/**
 * Generated class for the QuestionnaireNewUiQuestionnairePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-questionnaire-new-ui-questionnaire',
  templateUrl: 'questionnaire-new-ui-questionnaire.html',
})
export class QuestionnaireNewUiQuestionnairePage implements OnInit {
  showSave
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    console.log('ngOnInit QuestionnaireNewUiQuestionnairePage')
  }
}
