import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'
import { DisclaimerPage } from '../disclaimer/disclaimer'
import { AppVersion } from '@ionic-native/app-version/ngx'

/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  styleUrls: ['about.scss']
})
export class AboutPage implements OnInit {
  version
  build

  constructor(
    public navCtrl: NavController,
    // private route: ActivatedRoute,
    private appVersion: AppVersion
  ) {
    this.appVersion.getVersionNumber().then((ver) => {
      console.log('getVersionNumber', ver)
      this.version = ver
    })
    this.appVersion.getVersionCode().then((ver) => {
      console.log('getVersionCode', ver)
      this.build = ver
    })
  }

  ngOnInit() {
    console.log('ngOnInit AboutPage')
  }

  async goToDisclaimer() {
    // this.navCtrl.push(DisclaimerPage)
    await this.navCtrl.navigateForward('DisclaimerPage')
  }
}
