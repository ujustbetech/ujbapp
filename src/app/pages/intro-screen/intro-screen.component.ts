import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage'
import { LoginStatus } from '../../models/Enums';

@Component({
  selector: 'app-intro-screen',
  templateUrl: './intro-screen.component.html',
  styleUrls: ['./intro-screen.component.scss'],
})
export class IntroScreenComponent implements OnInit {

  selectedLang: any
  value
  showIntroScreen
  constructor(
    public navCtrl: NavController,
    // private route: ActivatedRoute,
    private storage: Storage,
    public menuCtrl: MenuController
  ) {
    this.storage.get('selectedLanguage').then((val) => {
      if (val) {
        this.selectedLang = val.Language
        this.value = val.Value
        console.log('value lang', val)
      }
    })
  }

  ngOnInit(): void {
    this.storage.get('loginStatus').then(async (val) => {
      if (val == LoginStatus.loggedIn) {
        await this.navCtrl.navigateRoot('DashboardPage')
      } else {
        await this.navCtrl.navigateForward('IntroScreenComponent')
      }
    })
  }

  getStarted() {
    //this.menuCtrl.open();
    this.showIntroScreen = true
    this.storage.set('showIntroScreen', this.showIntroScreen).then((value) => {
      if (this.selectedLang) {
        this.navCtrl.navigateForward('RegistrationOptionPage')
      } else {
        this.navCtrl.navigateForward('LanguageSelectionPage')
      }
    })
  }

}
