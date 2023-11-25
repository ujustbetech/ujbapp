import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { LoginStatus } from '../../../models/Enums'

/**
 * Generated class for the SplashPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
  styleUrls: ['splash.scss']
})
export class SplashPage implements OnInit {
  constructor(
    public navCtrl: NavController,
    public storage: Storage
  ) {
    this.timebasenavigation()
  }

  ngOnInit() {
    console.log('ngOnInit SplashPage')
  }

  timebasenavigation() {
    setTimeout(async () => {
      this.storage.get('loginStatus').then(async (val) => {
        if (val == LoginStatus.loggedIn) {
          await this.navCtrl.navigateRoot('DashboardPage')
        } else {
          await this.navCtrl.navigateForward('IntroScreenComponent')
        }
      })
    }, 0)
  }
}
