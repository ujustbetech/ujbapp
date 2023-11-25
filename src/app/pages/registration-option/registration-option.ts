import { Component, OnInit } from '@angular/core'
import {  NavController, ToastController, AlertController } from '@ionic/angular'
import { GooglePlus } from '@ionic-native/google-plus/ngx'
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx'
//import { LinkedIn, LinkedInLoginScopes } from '@ionic-native/linkedin';
import { InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx'
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'
import { Platform } from '@ionic/angular'

import { LoadingController } from '@ionic/angular'
import { Constants } from '../../Utils/Constants'
import { Utility } from '../../Utils/Utility'
import { HttpClient } from '@angular/common/http'
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx'
import { LinkedInAuthService } from '../../services/linked-in-auth.service'

/**
 * Generated class for the RegistrationOptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-registration-option',
  templateUrl: 'registration-option.html',
  styleUrls: ['registration-option.scss']
})
export class RegistrationOptionPage implements OnInit {
  google_img: string = 'assets/imgs/icons/google@2x.png'
  facebook_img: string = 'assets/imgs/icons/facebook@2x.png'
  linkedin_img: string = 'assets/imgs/icons/linkedin@2x.png'
  displayName: any
  email: any
  familyName: any
  givenName: any
  userId: any
  imageUrl: any
  isLoggedIn: boolean = false
  userData: any
  accesstoken: any
  logoCenter: any
  addMargin: any
  hideSocialLogin: any
  constructor(
    public loadingCtrl: LoadingController,
    public toast: ToastController,
    public authservice: LinkedInAuthService,
    public platform: Platform,
    // private iab: InAppBrowser,
    public navCtrl: NavController,
    public alertController: AlertController,
    private googlePlus: GooglePlus,
    private fb: Facebook,
    public http: HttpClient,
    private youtube: YoutubeVideoPlayer
  ) {
    if (this.platform.is('ios')) {
      this.logoCenter = 'logoIos'
      this.addMargin = 'topMargin'
      this.hideSocialLogin = 'hide'
    } else {
      this.logoCenter = 'logo'
      this.addMargin = 'block'
      this.hideSocialLogin = 'view'
    }
  }
  ionViewDidLeave() {
    this.googlePlus.logout().then((res: any) => {
      console.log('googlePlus.logout() res', res)
    })
    //})
    this.fb
      .logout()
      .then((res: any) => {
        console.log('fb.logout()', res)
        //alert("fb.logout()" + JSON.stringify(res))
      })
      .catch((err) => {
        console.log('fb.logout()', err)
        //alert("fb.logout()" + JSON.stringify(err))
      })
  }
  /**goes to registration page */
  async gotToRegistrationMain() {
    await this.navCtrl.navigateForward('RegistrationPage')
  }
  /**goes to signin page */
  async gotToSignin() {
    await this.navCtrl.navigateForward('LoginPage')
  }

  ngOnInit() {
    console.log('ngOnInit RegistrationOptionPage')
  }
  /**code for user's google plus authentication */
  async googleAuth() {
    ////
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.googlePlus
      .login({})
      .then(async (res: any) => {
        ////
        loading.dismiss()
        this.displayName = res.displayName
        this.email = res.email
        this.familyName = res.familyName
        this.givenName = res.givenName
        this.userId = res.userId
        this.imageUrl = res.imageUrl

        this.isLoggedIn = true

        console.log('success', res)
        await this.navCtrl.navigateForward('RegistrationPage', { queryParams: {
          email: this.email,
          userFirstName: this.givenName,
          lastName: this.familyName,
        }})
      })
      .catch((err) => {
        loading.dismiss()
        /* this.toast.create({
          message: 'Login failed',
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'ok',
          cssClass: 'ujb_toast'
        }).present() */
        Utility.showToast(this.toast, 'Login failed', false, '', true)
        console.error('error', err)
      })
  }
  /**code for user's facebook authentication */
  async facebookAuth() {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()

    this.fb
      .login(['user_friends', 'email'])
      .then((res: FacebookLoginResponse) => {
        loading.dismiss()

        this.fb
          .api('me?fields=id,name,email,first_name', [])
          .then(async (profile) => {
            ////
            this.userData = {
              email: profile['email'],
              first_name: profile['first_name'],
              username: profile['name'],
              last_name: profile['last_name'],
            }
            console.log('Logged into Facebook details!', this.userData)
            this.email = this.userData.email
            this.familyName = this.userData.last_name
            this.givenName = this.userData.first_name
            await this.navCtrl.navigateForward('RegistrationPage', { queryParams: {
              email: this.email,
              userFirstName: this.givenName,
              lastName: this.familyName,
            }})
          })
          .catch((err) => {
            console.log('Error logging into Facebook 1', err)
          })

        console.log('Logged into Facebook!', res)
      })
      .catch((e) => {
        loading.dismiss()
        /*  this.toast.create({
          message: 'Login failed',
          position: 'bottom',
          showCloseButton: true,
          closeButtonText: 'ok',
          cssClass: 'ujb_toast'
        }).present() */
        Utility.showToast(this.toast, 'Login failed', false, '', true)
        console.log('Error logging into Facebook', e)
      })
  }
  /**code for user's linkedin authentication */
  async linkedinAuth() {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    const options: InAppBrowserOptions = {
      hidenavigationbuttons: 'no',
    }
    // TODO
    // const browser = this.iab.create(
    //   Constants.linkedInUrl +
    //     Constants.response_type +
    //     '=' +
    //     Constants.code +
    //     '&' +
    //     Constants.client_id +
    //     '=81f0f6jx274got&redirect_uri=http://localhost/callback&state=aRandomStringX-men&scope=r_liteprofile%20r_emailaddress',
    //   '',
    //   options
    // )
    // browser.on('loadstop').subscribe(
    //   (event) => {
    //     loading.dismiss()

    //     console.log('event', event)
    //     console.log('event', event.url)
    //     if (event.url.indexOf('http://localhost/callback') === 0) {
    //       // browser.close();
    //       console.log('event.url 2 -> ' + event.url)
    //       var parsedResponse = {}

    //       var code = event.url.split('=')[1].split('&')[0]
    //       var state = event.url.split('=')[2]

    //       if (code != undefined && state != null) {
    //         console.log('code : ' + code + '  state : ' + state)
    //         this.authservice.linkLogin(code).then((res: any) => {
    //           loading.dismiss()
    //           console.log('res', res)
    //           this.accesstoken = res.access_token
    //           console.log('accestokenrcv', this.accesstoken)
    //           this.authservice
    //             .getLinkedInUserDetails(this.accesstoken)
    //             .then((res: any) => {
    //               loading.dismiss()

    //               console.log('http response : ' + JSON.stringify(res))
    //             })
    //             .catch((e) => {
    //               loading.dismiss()
    //               Utility.showToast(this.toast, 'Login failed', false, '', true)
    //               /* this.toast.create({
    //             message: 'Login failed',
    //             position: 'bottom',
    //             showCloseButton: true,
    //             closeButtonText: 'ok',
    //             cssClass: 'ujb_toast',
    //             dismissOnPageChange: true
    //           }).present() */
    //             })
    //         })
    //       } else {
    //         loading.dismiss()

    //         console.log('LinkedIn Code issue', code)
    //         console.log('LinkedIn state issue', state)
    //         Utility.showToast(
    //           this.toast,
    //           'Some error occurred.',
    //           true,
    //           'Ok',
    //           false
    //         )
    //       }
    //     }
    //   },
    //   (err) => {
    //     loading.dismiss()

    //     console.log('LinkedIn Error', err)
    //     Utility.showToast(this.toast, 'Some error occurred.', true, 'Ok', false)
    //   }
    // )
    // browser.close()

    /*  return this.http.get("https://www.linkedin.com/oauth/v2/accessToken?grant_type=client_credentials&client_id=81f0f6jx274got&client_secret=QUkhSeeBU2ZGOWbj", {}).toPromise()
     .then(res => {
       ////
       let result1=res
     console.log("res1",result1)
     console.log("res12",JSON.stringify(result1))
     return result1
   }, err => {console.log("error",err)}); */
  }
  async gotoComingSoon() {
    await this.navCtrl.navigateForward('ComingSoonPage')
  }

  async gotoTermsAndConditions() {
    await this.navCtrl.navigateForward('TermsPage')
  }

  async playVideo() {
    if (this.platform.is('ios')) {
      await this.navCtrl.navigateForward('YoutubePage')
    } else this.youtube.openVideo(Constants.UjbVideoUrl)
  }
}
