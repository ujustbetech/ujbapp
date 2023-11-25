import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'

/**
 * Generated class for the ErrorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-error',
  templateUrl: 'error.html',
  styleUrls: ['error.scss']
})
export class ErrorPage implements OnInit {
  constructor(public navCtrl: NavController ) {}

  ngOnInit() {
    console.log('ngOnInit ErrorPage')
  }
  goBack() {
    this.navCtrl.pop()
  }
}
