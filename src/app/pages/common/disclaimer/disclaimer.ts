import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'

/**
 * Generated class for the DisclaimerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-disclaimer',
  templateUrl: 'disclaimer.html',
  styleUrls: ['disclaimer.scss']
})
export class DisclaimerPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    console.log('ngOnInit DisclaimerPage')
  }
}
