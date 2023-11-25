import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'

/**
 * Generated class for the PrivacypolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-privacypolicy',
  templateUrl: 'privacypolicy.html',
  styleUrls:['privacypolicy.scss']
})
export class PrivacypolicyPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    console.log('ngOnInit PrivacypolicyPage')
  }
}
