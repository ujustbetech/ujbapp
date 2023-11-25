import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'

/**
 * Generated class for the ThemePopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-theme-popup',
  templateUrl: 'theme-popup.html',
  styleUrls: ['theme-popup.scss'],
})
export class ThemePopupPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
  }
}
