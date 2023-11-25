import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Network } from '@ionic-native/network/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { Events, MenuController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';

// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/storage';
import { Constants } from './Utils/Constants';
import { Utility } from './Utils/Utility';
import { PopupConfirmationAlertComponent } from './components/popups/popup-confirmation-alert/popup-confirmation-alert';
import { LoginStatus } from './models/Enums';
import { DashboardPage } from './pages/dashboard/dashboard';
import { BusinessDetailsService } from './services/business-details.service';
import { NotificationService } from './services/notification.service';
import { NetworkService } from './services/network.service';
import { Badge } from '@ionic-native/badge/ngx'
import { Market } from '@ionic-native/market/ngx'
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {

  rootPage: any
  shouldShow: boolean = false
  message: string = ''
  file: string = ''
  url: string = ''
  image: string = ''
  receiver: string = ''
  options: string = ''
  appName: string = ''
  subject: string = ''
  link: string = ''
  token: string
  userId: string
  storageToken
  firstName: string
  mymentorcode: string
  scrollBlock: any
  selectedLang: any
  value: any
  showIntroScreen
  id
  notificationList: any[]
  notificationArray: any[]
  notificationData: any
  uri
  //notification

  // @ViewChild(Nav, { static: true }) nav: Nav
  constructor(
    // // public appCtrl: App,
    private nav: NavController,
    private platform: Platform,
    private storage: Storage,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private keyboard: Keyboard,
    public toastCtrl: ToastController,
    private badge: Badge,
    public network: Network,
    private MobileAccessibility: MobileAccessibility,
    private market: Market,
    public notificationService: NotificationService,
    private commonProvider: BusinessDetailsService,
    private socialSharing: SocialSharing,
    public menuCtrl: MenuController,
    public events: Events,
    private localNotifications: LocalNotifications,
    private modalCtrl: ModalController,
    private fcm: FCM,
    private youtube: YoutubeVideoPlayer,
    private appVersion: AppVersion,
    private networkProvider: NetworkService,
    private router: Router
  ) {
    platform.ready().then(() => {
      setTimeout(() => {
        this.notificationList = new Array<any>()
        this.notificationArray = new Array<any>()
        this.localNotifications.clearAll()
        this.scrollBlock = false
        //this.badge.clear()
        //alert(Date.now())
        // this.fireBaseCloudMessaging()
        // this.fireBaseTokenRefresh()
        this.getUpdatedVersion()
        this.setRootPage()
        this.statusBar.styleDefault()
        //splashScreen.hide();
        this.keyboard.hideFormAccessoryBar(false)
        this.networkProvider.initializeNetworkEvents()
        this.networkHandling()
        this.splashScreen.hide()
        if (this.MobileAccessibility) {
          this.MobileAccessibility.usePreferredTextZoom(false)
        }
      }, 0)


      /*       platform.backButton.subscribe(() => {
              console.log("dashboard",this.appCtrl.getActiveNav().getActive().id)
             
              //platform.exitApp()
            });  */

      // platform.resume.subscribe(res => {
      //   this.getUpdatedVersion()
      // })
    })
  }

  async ngOnInit() {
  }

  fireBaseCloudMessaging() {
    this.fcm
      .getToken()
      .then((val) => {
        this.token = val
        console.log('registrationtoken', this.token)
        this.tokenUpdate()
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  fireBaseTokenRefresh() {
    this.fcm.onTokenRefresh().subscribe(
      (token) => {
        console.log('in token referesh')
        this.token = token
        console.log('in token referesh rcv', this.token)
        this.tokenUpdate()
      },
      (err) => {
        console.log('err', err)
      }
    )
  }

  tokenUpdate() {
    console.log('in token upadate')
    //this.storage.set('deviceToken', this.token)
    this.storage.get('loginStatus').then(
      (val) => {
        console.log('in token upadate login status', val)
        console.log('in token upadate status check')
        if (val == LoginStatus.loggedIn) {
          console.log('in token upadate login')
          this.storage.get('userInfo').then(
            (val) => {
              console.log('print userInfo', val)
              this.userId = val.userId
              //this.fcm.onTokenRefresh().subscribe(token => {

              //console.log("in token upadate login ontoken refresh",token)
              this.notificationService
                .fcmTokenUpdateApi(this.userId, this.token)
                .subscribe(
                  (data) => {
                    console.log('data in refresh token res update api', data)

                    this.platform.ready().then((res: any) => {
                      this.fcm.onNotification().subscribe((data) => {
                        this.notificationData = data
                        console.log('this.badge.isSupported()')
                        this.badge
                          .isSupported()
                          .then((res: any) => {
                            console.log('this.badge.isSupported() res', res)
                          })
                          .catch((err) => {
                            console.log('this.badge.isSupported() err', err)
                          })
                        this.badge.set(1)
                        if (data.wasTapped == true) {
                          console.log('Received in background', data)
                          //alert(JSON.stringify(data))
                          this.setNavigation()
                          //this.localNotifications.clearAll()
                        } else {
                          console.log('Received in foreground')
                          this.notificationList = []
                          this.localNotifications.schedule({
                            id: Date.now(),
                            title: data.title,
                            text: data.body,
                            foreground: true,
                            icon: 'res://icon',
                            smallIcon: 'res://fcm_push_icon',
                            color: '#00326C',
                            //badge: 1
                          })
                          //this.badge.increase(1)
                        }

                        /* this.notificationList = []
                this.localNotifications.schedule(
                  {
                    id: 1,
                    title: data.title,
                    text: data.body,
                    foreground: true,
                    icon: "res://icon",
                    smallIcon: "res://fcm_push_icon",
                    color: "#00326C",
                    badge: 1
                  }) */

                        //this.badge.clear()

                        //   };
                      })
                    })
                  },
                  (err) => {
                    console.log('err', err)
                    //})
                  }
                )
            },
            (err) => {
              console.log('err', err)
            }
          )
        }
      },
      (err) => {
        console.log('err', err)
      }
    )
  }

  async openPage(value: any) {
    //
    this.shouldShow = false
    console.log('log', value)
    await this.menuCtrl.close()
    if (value == 'logout') {
      this.shouldShow = false
      let profileModal = await this.modalCtrl.create({
        component: PopupConfirmationAlertComponent,
        componentProps: { text: Constants.areYouSureToLogout },
        cssClass: 'popupConfirmationAlert singleLineHeight' 
      })
      profileModal.present()
      if (this.platform.is('ios')) {
        console.log('in ios platform')
        console.log('popup opened')
        this.scrollBlock = true
      }

      const { data } = await profileModal.onDidDismiss()
      this.scrollBlock = false
      if (data == 'ok') {
        this.storage.get('showIntroScreen').then((value) => {
          if (value) {
            this.showIntroScreen = value
          }

          this.storage.get('selectedLanguage').then((value) => {
            if (value) {
              this.selectedLang = value.Language
              this.value = value.Value
              console.log('value lang', value)
            }
            this.storage
              .clear()
              .then((res: any) => {
                this.storage
                  .set('showIntroScreen', this.showIntroScreen)
                  .then((val) => {
                    this.storage
                      .set('selectedLanguage', {
                        Language: this.selectedLang,
                        Value: this.value,
                      })
                      .then((val) => {
                        console.log('lang set', val)
                        // this.appCtrl
                        //   .getActiveNav()
                        //   .setRoot(LoginPage, { logOut: 'logOut' })
                        this.nav.navigateRoot('LoginPage', {queryParams: { logOut: 'logOut' }})
                      })
                  })
              })
              .catch((err) => {
                this.toastCtrl.create({
                    message: err,
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: 'OK',
                    cssClass: 'ujb_toast',
                  })
                  .then((ctrl) => ctrl.present())
              })
          })
        })
      }
    }
  }

  gotoInvitePeople() {
    this.storage.get('userInfo').then((val) => {
      this.firstName = val.firstName
      this.mymentorcode = val.myMentorcode
      this.message =
        'Hi,' +
        ' ' +
        'I am delighted to invite you to join the UJustBe to Be Connect and Grow. Here you can Earn by just Passing the Referral and also Grow your Business by receiving the Referrals.\n\n' +
        'Click on the below link to explore UJustbe World as Guest\n\n' +
        'OR\n\n' +
        'start Earning as Partner of the UJustBe.\n\n' +
        'Select' +
        ' ' +
        this.firstName +
        'as your Mentor in App and give me an opportunity to help you Grow\n\n' +
        'Google Playstore: ' +
        Constants.playStoreLink +
        '\n\n' +
        ' Apple Appstore: ' +
        Constants.appStoreLink

        console.log(this.message);
        
      this.socialSharing
        .share(this.message, this.file, this.link)
        .then((res: any) => {
          console.log('socialSharing.share', res)
        })
        .catch((err) => {
          console.log('socialSharing.share', err)
        })
    })
  }

  async invitePeople() {
    await this.menuCtrl.close()
    await this.nav.navigateForward('ComingSoonPage')

  }

  async goTochangeLanguage(val: any) {
    await this.menuCtrl.close()

    await this.nav.navigateForward('LanguageSelectionPage', { queryParams: { value: val } })
  }

  async goTochangePassword() {
    await this.menuCtrl.close()
    await this.nav.navigateForward('ChangePasswordPage')
  }

  async goToContactUs() {
    await this.menuCtrl.close()
    await this.nav.navigateForward('ContactUsPage')
  }

  async goToAboutUs() {
    await this.menuCtrl.close()
    await this.nav.navigateForward('AboutPage')
  }

  async playVideo() {
    await this.menuCtrl.close()
    // await this.nav.navigateForward('ComingSoonPage')
    if (this.platform.is('ios')) {
      // this.appCtrl.getActiveNav().push(YoutubePage)
      await this.nav.navigateForward('YoutubePage')
    } else  {
      await this.nav.navigateForward('YoutubePage')
      // this.youtube.openVideo(Constants.UjbVideoUrl)
    }
  }

  showHide() {
    if (this.shouldShow == false) {
      this.shouldShow = true
    } else {
      this.shouldShow = false
    }
  }

  async goToPrivacyPolicy() {
    this.shouldShow = false
    await this.menuCtrl.close()
    await this.nav.navigateForward('PrivacypolicyPage')
  }

  menuClosed() {
    //code to execute when menu has closed
    this.events.publish('menu:closed', '')
  }

  async openMenu() {
    let test = await this.menuCtrl.enable(true)
    let west = await this.menuCtrl.open('first')
    console.log(test, west)
  }

  networkHandling() {
    // watch network for a disconnection
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(')
      setTimeout(async () => {
        this.storage.set(Constants.connection, Constants.disconnected)
        if (this.router.url.split('?')[0] == '/ErrorInternetPage') {
          //currently on internet page only so don't show page
        } else {
          if (
            this.router.url.split('?')[0] == '/DashboardPage'
            // this.appCtrl.getActiveNav().getActive().instance instanceof
            // DashboardPage
          ) {
          } else {
            await this.nav.navigateForward('ErrorInternetPage')
          }
        }
      }, 3000)
    })

    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!')
      // We just got a connection but we need to wait briefly
      // before we determine the connection type. Might need to wait.
      // prior to doing any api requests as well.
      setTimeout(() => {
        this.storage.set(Constants.connection, Constants.connected)
        console.log('connection', this.nav)
        if (this.router.url.split('?')[0] == '/ErrorInternetPage') {
          console.log('ErrorInternetPage')
          this.nav.pop()
          Utility.showToast(
            this.toastCtrl,
            'Internet connection online.',
            false,
            '',
            false
          )
        }
        console.log('we got a ' + this.network.type + ' connection, woohoo!')
        //console.log('speed ' + this.network.downlinkMax);
        //console.log('connection ' + JSON.stringify(this.network.Connection));
      }, 3000)
    })
  }

  async setRootPage() {
    this.storage.get('showIntroScreen').then((value) => {
      this.showIntroScreen = value
      
      this.storage.get('loginStatus').then(async (val) => {
        console.log('status', val)
        if (val == LoginStatus.loggedIn) {
          await this.nav.navigateRoot('DashboardPage')
          this.rootPage = DashboardPage // DashboardPage; //QuestionnaireNewUiQuestionnairePage
        } else {
          if (this.showIntroScreen == true) {
            this.storage.get('selectedLanguage').then(async (value) => {
              if (value != null || value != undefined) {
                await this.nav.navigateRoot('RegistrationOptionPage')
                // this.rootPage = RegistrationOptionPage //RegistrationOptionPage; //QuestionnaireNewUiQuestionnairePage
              } else {
                await this.nav.navigateRoot('LanguageSelectionPage')
                // this.rootPage = LanguageSelectionPage
              }
            })
          } else {
            await this.nav.navigateRoot('IntroScreenComponent')
            // this.rootPage = IntroScreenPage //QuestionnaireNewUiQuestionnairePage
          }

          //this.rootPage = RegistrationPage;
        }
      })
    })
    // await this.nav.navigateForward('AboutPage')
  }

  async setNavigation() {
    if (this.notificationData) {
      let flag = false
      switch (this.notificationData.Flag) {
        case 'Bussiness':
          flag = false
          // TODO
          // for (let i = 0; i < this.nav.getViews().length; i++) {
          //   if (this.nav.getViews()[i].instance instanceof ReferralsGivenPage) {
              
          //     flag = true
          //     break
          //   } else {
          //     flag = false
          //   }
          // }
          if (flag == false) {
            await this.nav.navigateRoot('DashboardPage')
            this.nav
              .navigateForward('ReferralsGivenPage', { queryParams: { segmentSlider: 'business' }})
              .then((res: any) => {
                console.log('setNavigation page res', res)
              })
              .catch((err) => {
                console.log('setNavigation page err', err)
              })
          }

          break

        case 'Referral':
          flag = false
          // TODO
          // for (let i = 0; i < this.nav.getViews().length; i++) {
          //   if (this.nav.getViews()[i].instance instanceof ReferralsGivenPage) {
          //     flag = true
          //     break
          //   } else {
          //     flag = false
          //   }
          // }
          if (flag == false) {
            await this.nav.navigateRoot('DashboardPage')
            this.nav
              .navigateForward('ReferralsGivenPage', { queryParams: { segmentSlider: 'referral' }})
              .then((res: any) => {
                console.log('setNavigation page res', res)
              })
              .catch((err) => {
                console.log('setNavigation page err', err)
              })
          }
          break

        case 'IncompleteProfile':
          this.storage
            .get('userInfo')
            .then(async (res: any) => {
              let userRole = res.userRole
              if (userRole == 'Guest') {
                flag = false
                // TODO
                // for (let i = 0; i < this.nav.getViews().length; i++) {
                  // if (this.nav.getViews()[i].instance instanceof GuestPage) {
                  //   flag = true
                  //   break
                  // } else {
                  //   flag = false
                  // }
                // }
                if (flag == false) {
                  await this.nav.navigateRoot('DashboardPage')
                  await this.nav.navigateForward('GuestPage')
                }
              } else if (userRole == 'Partner') {
                flag = false
                // TODO
                // for (let i = 0; i < this.nav.getViews().length; i++) {
                  // if (this.nav.getViews()[i].instance instanceof PartnerPage) {
                    // flag = true
                    // break
                  // } else {
                    // flag = false
                  // }
                // }
                if (flag == false) {
                  await this.nav.navigateRoot('DashboardPage')
                  await this.nav.navigateForward('PartnerPage', {
                    queryParams: { viewOtherProfile: false },
                  })
                }
              } else if (userRole == Constants.clientPartner) {
                flag = false
                // TODO
                // for (let i = 0; i < this.nav.getViews().length; i++) {
                //   if (
                //     this.nav.getViews()[i].instance instanceof ClientPartnerPage
                //   ) {
                //     flag = true
                //     break
                //   } else {
                //     flag = false
                //   }
                // }
                if (flag == false) {
                  await this.nav.navigateRoot('DashboardPage')
                  await this.nav.navigateForward('ClientPartnerPage', {
                    queryParams: { viewOtherProfile: false },
                  })
                }
              }
            })
            .catch((err) => {
              console.log(err)
            })
          break

        default:
          if (
            this.router.url.split('?')[0] == '/DashboardPage'
            // this.appCtrl.getActiveNav().getActive().instance instanceof
            // DashboardPage
          ) {
          } else {
            await this.nav.navigateRoot('DashboardPage')
          }
          break
      }
    } else {
      this.setRootPage()
    }
  }

  /*
  //App Update Popup
     openAppUpdatePopup() {
      let appUpdatePopup = await this.modalCtrl.create(AppUpdateComponent, {}, { cssClass: 'appUpdatePopup ujb_theme' });
      appUpdatePopup.present();
    } */

  getUpdatedVersion() {
    let curPlatform = 'Android'
    if (this.platform.is('ios')) {
      curPlatform = 'Ios'
    }
    this.commonProvider.checkVersionDetails(curPlatform).subscribe(
      (res: any) => {
        if (res.status == 200) {
          this.appVersion
            .getVersionNumber()
            .then((ver) => {
              console.log('getVersionNumber', ver)
              if (this.platform.is('ios')) {
                //console.log("+res.json.data.ios.iosVersion > +ver", parseFloat(res.json.data.ios.iosVersion), parseFloat(ver))
                if (res.json.data.ios.iosVersion != ver) {
                  //showDialog
                  this.showUpdateDialog(res.json.data.ios.isIOSForce)
                } else {
                  this.setRootPage()
                }
              } else {
                //console.log("+res.json.data.ios.androidVersion > +ver", parseFloat(res.json.data.android.androidVersion), parseFloat(ver))
                if (res.json.data.android.androidVersion != ver) {
                  //showDialog
                  this.showUpdateDialog(res.json.data.android.isAndroidForce)
                } else {
                  this.setRootPage()
                }
              }
            })
            .catch((err) => {
              console.log('getVersionNumber err', err)
              this.setRootPage()
            })
        }
        console.log('getUpdatedVersion res', res)
      },
      (err) => {
        this.setRootPage()
        console.log('getUpdatedVersion err', err)
        Utility.showToast(
          this.toastCtrl,
          'Some Error Occured',
          false,
          '',
          false
        )
      }
    )
  }

  async showUpdateDialog(isForced: boolean) {
    let cancelText = 'Later'
    if (isForced == true) {
      cancelText = 'Exit App'
    }

    let profileModal = await this.modalCtrl.create({
      component: PopupConfirmationAlertComponent,
      componentProps: {
        title: Constants.update,
        text: Constants.updateAvailable,
        cancelText: cancelText,
      },
      cssClass: 'popupConfirmationAlert singleLineHeight'
    })
    profileModal.present()
    if (this.platform.is('ios')) {
      console.log('in ios platform')
      console.log('popup opened')
      this.scrollBlock = true
    }
    const {data} = await profileModal.onDidDismiss()
    console.log('print res', data)
    this.scrollBlock = false
    if (data == 'ok') {
      this.appVersion.getPackageName().then((res: any) => {
        this.market.open(res)
      })
      this.setNavigation()
    }
    if (data == 'cancel' || data == null) {
      //if forced then exit or setroot page
      if (isForced == true) {
        // TODO
        // this.platform.exitApp()
      } else {
        this.setNavigation()
      }
    }
  }
}