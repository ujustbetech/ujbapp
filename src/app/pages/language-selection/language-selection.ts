import { Component, OnInit } from '@angular/core'
import {  NavController, Platform, ToastController } from '@ionic/angular'
// import { LoginPage } from '../login/login'
// import { RegistrationPage } from '../../registration/registration/registration'
// import { RegistrationOptionPage } from '../../registration/registration-option/registration-option'

import * as $ from 'jquery'
// import { ComingSoonPage } from '../../common/coming-soon/coming-soon'
// import { DashboardPage } from '../../dashboard/dashboard'
import { Storage } from '@ionic/storage'
// import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player'
// import { Constants } from '../../../Utils/Constants'
// import { YoutubePage } from '../../youtube/youtube'
import { ActivatedRoute, Router } from '@angular/router'
/**
 * Generated class for the LanguageSelectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-language-selection',
  templateUrl: './language-selection.html',
  styleUrls: ['language-selection.scss']
})
export class LanguageSelectionPage implements OnInit {
  language: string = ''
  value: any
  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    // public appCtrl: App,
    private storage: Storage,
    // private route: ActivatedRoute,
    // private youtube: YoutubeVideoPlayer,
    private platform: Platform,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((res: any) => {
      console.log(res);
      
      this.value = res.value
    })
  }

  ngOnInit() {
    console.log('ngOnInit LanguageSelectionPage')
  }

  ionViewWillEnter() {
    this.storage.get('selectedLanguage').then((value) => {
      if (value != null || value != undefined) {
        this.changeLang(value.Language, value.Value, false)
      }
    })
  }

  async changeLang(data: any, val, showToast: boolean) {
    this.language = data
    this.storage.set('selectedLanguage', {
      Language: this.language,
      Value: val,
    })
    console.log('valu set lang', val)
    if (this.value == 'changeLang') {
      if (showToast == true) await this.navCtrl.navigateRoot('DashboardPage')
    } else {
      if (showToast == true) this.navCtrl.navigateRoot('RegistrationOptionPage')
    }
    switch (val) {
      case '1': {
        $('#eng').css('background-color', '#003366')
        $('#eng').css('color', '#ffffff')
        $('#hindi').css('background-color', '#ffffff')
        $('#hindi').css('color', '#003366')
        $('#mar').css('background-color', '#ffffff')
        $('#mar').css('color', '#003366')
        $('#guj').css('background-color', '#ffffff')
        $('#guj').css('color', '#003366')

        break
      }
      case '2': {
        $('#eng').css('background-color', '#ffffff')
        $('#eng').css('color', '#003366')
        $('#hindi').css('background-color', '#003366')
        $('#hindi').css('color', '#ffffff')
        $('#mar').css('background-color', '#ffffff')
        $('#mar').css('color', '#003366')
        $('#guj').css('background-color', '#ffffff')
        $('#guj').css('color', '#003366')

        break
      }
      case '3': {
        $('#eng').css('background-color', '#ffffff')
        $('#eng').css('color', '#003366')
        $('#hindi').css('background-color', '#ffffff')
        $('#hindi').css('color', '#003366')
        $('#mar').css('background-color', '#003366')
        $('#mar').css('color', '#ffffff')
        $('#guj').css('background-color', '#ffffff')
        $('#guj').css('color', '#003366')

        break
      }
      case '4': {
        $('#eng').css('background-color', '#ffffff')
        $('#eng').css('color', '#003366')
        $('#hindi').css('background-color', '#ffffff')
        $('#hindi').css('color', '#003366')
        $('#mar').css('background-color', '#ffffff')
        $('#mar').css('color', '#003366')
        $('#guj').css('background-color', '#003366')
        $('#guj').css('color', '#ffffff')

        break
      }
    }

    // let closedByTimeout = false;

    // if (showToast) {
    //   let timeoutHandle = setTimeout(() => {
    //     closedByTimeout = true;
    //     toast.dismiss();
    //   }, 3000);

    //   let toast = this.toastCtrl.create({
    //     message: 'You have selected ' + this.language + '.',
    //     showCloseButton: true,
    //     closeButtonText: 'Undo',
    //     position: 'bottom',
    //     dismissOnPageChange: true,
    //     cssClass: 'ujb_toast'
    //   });

    //   toast.onDidDismiss(() => {
    //     if (closedByTimeout) {
    //       if (this.value == 'changeLang') {
    //         await this.navCtrl.navigateRoot('DashboardPage')
    //       }
    //       else {
    //         this.navCtrl.setRoot(RegistrationOptionPage)
    //       }
    //     }
    //     else {

    //       $('#eng').css('background-color', '#ffffff');
    //       $('#eng').css('color', '#003366');
    //       $('#hindi').css('background-color', '#ffffff');
    //       $('#hindi').css('color', '#003366');
    //       $('#mar').css('background-color', '#ffffff');
    //       $('#mar').css('color', '#003366');
    //       $('#guj').css('background-color', '#ffffff');
    //       $('#guj').css('color', '#003366');
    //     }

    // });

    // toast.present();
    // }
  }

  toastPresenter() {}

  async gotoComingSoon() {
    await this.navCtrl.navigateForward('ComingSoonPage')
  }

  goBack() {
    this.navCtrl.pop()
  }

  playVideo() {
    if (this.platform.is('ios')) {
      this.navCtrl.navigateForward('YoutubePage')
    } 
      // this.youtube.openVideo(Constants.UjbVideoUrl)  //TODO
  }
}
