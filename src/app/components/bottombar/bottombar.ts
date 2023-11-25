import {
  Events,
  MenuController,
  NavController,
  Platform,
} from '@ionic/angular'
import { Component, Input, NgZone, OnInit } from '@angular/core'

import { ClientPartnerPage } from '../../pages/profile/client-partner/client-partner'
import { Constants } from '../../Utils/Constants'
import { DashboardPage } from '../../pages/dashboard/dashboard'
import { GuestPage } from '../../pages/profile/guest/guest'
import { LoadingController } from '@ionic/angular'
import { PartnerPage } from '../../pages/profile/partner/partner'
import { Storage } from '@ionic/storage'
import { Utility } from '../../Utils/Utility'
import { Router } from '@angular/router'

// import { TypographyPage } from '../../pages/theme_ujb/typography/typography';
// import { ContentPanelPage } from '../../pages/theme_ujb/content-panel/content-panel';

/**
 * Generated class for the BottombarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bottombar',
  templateUrl: 'bottombar.html',
  styleUrls: ['bottombar.scss']
})
export class BottombarComponent implements OnInit {
  dashbordPage = DashboardPage

  @Input() activePage: string
  dashboardId: string
  profileId: string
  moremenuId: string
  dashBoardActive: any
  profileActive: any
  moreMenuActive
  userRole
  //page: Page
  homeSrc = 'assets/imgs/icons/home@2x.png'
  profileSrc = 'assets/imgs/icons/account@2x.png'
  moreMenuSrc = 'assets/imgs/icons/moreMenu@2x.png'
  constructor(
    public menuCtrl: MenuController,
    private zone: NgZone,
    private storage: Storage,
    private events: Events,
    private navCtrl: NavController,
    private router: Router,
    // public app: App,
    public loadingCtrl: LoadingController,
    public platform: Platform,
  ) {
    console.log('Hello BottombarComponent Component')

    /*     events.subscribe('menu:closed', (user, time) => {
          // user and time are the same arguments passed in `events.publish(user, time)`
          //console.log('Welcome', user, 'at', time);
          this.moreMenuActive = ""
        }); */
  }
  ngOnInit() {
    let i: number = 0
    this.setActive(1)
    this.events.subscribe('menu:closed', (user, time) => {
      console.log('Welcome menu:closed', i++)
      this.moreMenuActive = ''
      this.moreMenuSrc = 'assets/imgs/icons/moreMenu@2x.png'
      // if (this.router.url.split('?')[0] == DashboardPage)
      if (this.router.url.split('?')[0] == '/DashboardPage')
        this.activePage = 'DashboardPage'
      else if (
        this.router.url.split('?')[0] == '/ClientPartnerPage' ||
        this.router.url.split('?')[0] == '/PartnerPage' ||
        this.router.url.split('?')[0] == '/GuestPage'
      ) {
        this.activePage = 'Profile'
      }
      console.log('Welcome', user, 'at', time, this.activePage)
      this.setActive(2)
    })

    this.events.subscribe('updateScreen', () => {
      this.zone.run(() => {
        console.log('force update the screen')
      })
    })

    /* this.platform.backButton.subscribe(() => {
      console.log("dashboard", this.app.getActiveNav().getActive())
     

      if (this.menu) {
        console.log("menu open", this.menu.getOpen().isOpen)
        if (this.menu.getOpen().isOpen == true) {
          this.menu.close()
        }
      } else {
        if (this.app.getActiveNav().getActive().instance instanceof DashboardPage) {
          this.platform.exitApp()
        } else {
          this.navCtrl.pop()
        }
      }
    }); */
  }

  setActive(num) {
    console.log('num', num)

    if (this.activePage == 'DashboardPage') {
      this.dashBoardActive = 'active'
      this.moreMenuActive = ''
      this.profileActive = ''
      this.homeSrc = 'assets/imgs/icons/home@2x-active.png'
      this.profileSrc = 'assets/imgs/icons/account@2x.png'
      this.moreMenuSrc = 'assets/imgs/icons/moreMenu@2x.png'
    } else if (this.activePage == 'Profile') {
      this.profileActive = 'active'
      this.moreMenuActive = ''
      this.dashBoardActive = ''
      this.homeSrc = 'assets/imgs/icons/home@2x.png'
      this.profileSrc = 'assets/imgs/icons/userCopy@2x.png'
      this.moreMenuSrc = 'assets/imgs/icons/moreMenu@2x.png'
    }
    this.events.publish('updateScreen')
    /* else if (this.activePage == "MoreMenu") {
      this.moreMenuActive = "active"
      this.homeSrc = 'assets/imgs/icons/home@2x.png'
      this.profileSrc = 'assets/imgs/icons/account@2x.png'
      this.moreMenuSrc = 'assets/imgs/icons/moreMenu@2x-active.png'
    } */
  }

  async openProfile() {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.storage
      .get('userInfo')
      .then(async (res: any) => {
        loading.dismiss()
        this.userRole = res.userRole
        if (this.userRole == 'Guest') {
          if (this.router.url.split('?')[0] == '/GuestPage') {
            //if currently on GuestPage then do nothing
          } else {
            Utility.removeInstances(GuestPage, this.navCtrl)
            // this.navCtrl.push(GuestPage)
            await this.navCtrl.navigateForward('GuestPage')
            /* this.profileActive = "active"
            this.dashBoardActive = "" */
            this.moreMenuActive = ""
          }
        } else if (this.userRole == 'Partner') {
          if (this.router.url.split('?')[0] == '/PartnerPage') {
            //if currently on PartnerPage then do nothing
            if (this.profileActive == null || this.profileActive == undefined) {
              /* Utility.removeInstances(ClientPartnerPage, this.navCtrl)
            // this.navCtrl.push(ClientPartnerPage, { "viewOtherProfile": false }) */
              //this.navCtrl.pop()
              this.navCtrl.navigateRoot('PartnerPage', { queryParams: { viewOtherProfile: false }})
            }
          } else {
            Utility.removeInstances(PartnerPage, this.navCtrl)
            // this.navCtrl.push(PartnerPage, { viewOtherProfile: false })
            await this.navCtrl.navigateForward('PartnerPage', { queryParams: { viewOtherProfile: false } })
            /* this.profileActive = "active"
            this.dashBoardActive = "" */
            this.moreMenuActive = ""
          }
        } else if (this.userRole == Constants.clientPartner) {
          if (this.router.url.split('?')[0] == '/ClientPartnerPage') {
            if (this.profileActive == null || this.profileActive == undefined) {
              /* Utility.removeInstances(ClientPartnerPage, this.navCtrl)
            // this.navCtrl.push(ClientPartnerPage, { "viewOtherProfile": false }) */
              //this.navCtrl.pop()
              this.navCtrl.navigateRoot('ClientPartnerPage', { queryParams: {
                viewOtherProfile: false,
              }})
            }
            //// this.navCtrl.push(ClientPartnerPage)
            //if currently on ClientPartnerPage then do nothing
          } else {
            Utility.removeInstances(ClientPartnerPage, this.navCtrl)
            // this.navCtrl.push(ClientPartnerPage, { viewOtherProfile: false })
            await this.navCtrl.navigateForward('ClientPartnerPage', { queryParams: { viewOtherProfile: false } } )
            /* this.profileActive = "active"
          this.moreMenuActive = ""
          this.dashBoardActive = "" */
          }
          this.moreMenuActive = ""
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  async goToDashboard() {
    if (this.router.url.split('?')[0] == '/DashboardPage') {
      //if currently on dashboard page then do nothing
    } else {
      Utility.removeInstances(DashboardPage, this.navCtrl)
      this.profileActive = ''
      this.moreMenuActive = ''
      this.dashBoardActive = 'active'
      await this.navCtrl.navigateRoot('DashboardPage')
    }
  }

  openMenu() {
    this.menuCtrl.open();
    this.moreMenuActive = "active"
    this.dashBoardActive = ""
  }
  async openMoreMenu() {
    //
    console.log('this.moreMenuActive', this.moreMenuActive);
    
    if (this.moreMenuActive != 'active') {
      let test = await this.menuCtrl.open()
      console.log("====================", test)
      this.moreMenuActive = 'active'
      this.dashBoardActive = ''
      this.profileActive = ''
      this.homeSrc = 'assets/imgs/icons/home@2x.png'
      this.profileSrc = 'assets/imgs/icons/account@2x.png'
      this.moreMenuSrc = 'assets/imgs/icons/moreMenu@2x-active.png'
      console.log('this.activePage', this.activePage)
    }
  }

  getActiveView() {
    if (this.router.url.split('?')[0] == '/DashboardPage') {
      this.activePage = 'DashboardPage'
    }
    if (this.router.url.split('?')[0] == '/GuestPage') {
      this.activePage = 'Profile'
    }
    if (this.router.url.split('?')[0] == '/PartnerPage') {
      this.activePage = 'Profile'
    }
    if (this.router.url.split('?')[0] == '/ClientPartnerPage') {
      this.activePage = 'Profile'
    }
    return this.activePage
  }

  // Bottom bar menu list - Temporary assigned Theme pages
  // goToHome(){
  //   this.// this.navCtrl.push(ThemeTypographyPage);
  // }
  // goToProfile(){
  //   this.// this.navCtrl.push(ThemeFormElementsPage);
  // }
  // goToMenu(){
  //   // this.navCtrl.push(ThemeNavPage);
  // }
}
