import { Component, OnInit } from '@angular/core'
import { NavController, Platform } from '@ionic/angular'
import { ModalController } from '@ionic/angular'
import { Router } from '@angular/router'

/**
 * Generated class for the PopupBecomePartnerComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popup-become-partner',
  templateUrl: 'popup-become-partner.html',
  styleUrls: ['popup-become-partner.scss'],
})
export class PopupBecomePartnerComponent {
  text: string

  constructor(
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    // public appCtrl: App,
    private platform: Platform,
    private router: Router
  ) {
    console.log('Hello PopupBecomePartnerComponent Component')
    this.text = 'Hello World'
    this.platform.backButton.subscribe(() => {
      if (modalCtrl) {
        modalCtrl.dismiss()
        // modalCtrl = undefined
      } else {
        if (
          this.router.url.split('?')[0] == '/DashboardPage'
          // appCtrl.getActiveNav().getActive().instance instanceof DashboardPage
        ) {
          // TODO
          // this.platform.exitApp()
        } else {
          // appCtrl.getActiveNav().pop()
          this.navCtrl.pop()
        }
      }
    })
  }

  closeModal() {
    this.modalCtrl.dismiss()
  }

  becomePartner() {
    this.modalCtrl.dismiss()
    this.navCtrl.navigateForward(
        'Questionnaire1Page', { queryParams: { value: 'Partner' }}
      )
    // popup.present();
  }

  async benefits() {
    this.modalCtrl.dismiss()
    // this.appCtrl.getRootNav().push(ComingSoonPage)
    await this.navCtrl.navigateForward('ComingSoonPage')
  }
}
