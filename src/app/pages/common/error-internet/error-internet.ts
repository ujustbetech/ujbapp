import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'

/**
 * Generated class for the ErrorInternetPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-error-internet',
  templateUrl: 'error-internet.html',
  styleUrls: ['error-internet.scss']
})
export class ErrorInternetPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    console.log('ngOnInit ErrorInternetPage')
  }

  goBack() {
    this.navCtrl.pop()
  }
}
