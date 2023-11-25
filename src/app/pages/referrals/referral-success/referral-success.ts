import { Component } from '@angular/core'
import {  NavController } from '@ionic/angular'
import { DashboardPage } from '../../dashboard/dashboard'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the ReferralSuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-referral-success',
  templateUrl: 'referral-success.html',
  styleUrls: ['referral-success.scss']
})
export class ReferralSuccessPage {
  businessList
  referral: any
  constructor(public navCtrl: NavController, public route: ActivatedRoute) {
    this.route.queryParams.subscribe((params: any) => {
      this.businessList = params.businessList
      for (let j = 0; j < this.businessList.categories.length; j++) {
        if (
          this.businessList.categories[j].categoryName == 'Legal' ||
          this.businessList.categories[j].categoryName == 'Doctor' ||
          this.businessList.categories[j].categoryName == 'Chartered Accountant'
        ) {
          this.referral = 'connect'
        } else {
          this.referral = 'referral'
        }
      }
      this.timebaseNav()
    })
  }

  timebaseNav() {
    setTimeout(async () => {
      await this.navCtrl.navigateRoot('DashboardPage')
    }, 3000)
  }
}
