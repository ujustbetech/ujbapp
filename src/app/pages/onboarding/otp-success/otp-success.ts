/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *
 *
 *    update mobile from profile for partner and guest        2019/08/13       Yogesh Chavan
 */

import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NavController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

/**
 * Generated class for the OtpSuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// // @IonicPage()
@Component({
  selector: 'page-otp-success',
  templateUrl: 'otp-success.html',
  styleUrls: ['otp-success.scss'],
})
export class OtpSuccessPage implements OnInit {
  userFirstName: any
  value
  isUserPartner
  role
  guest
  referer
  clientPartnerProfile: boolean = false
  fromPartnerProfile: boolean = false
  update: boolean = false
  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute
    // private app: App
  ) {
    this.route.queryParams.subscribe((params: any) => {
      this.isUserPartner = params.isUserPartner
      this.referer = params.referer
      if (this.referer == 'PartnerProfile') {
        this.fromPartnerProfile = true
        this.update = true
      } else if (this.referer == 'guest') {
        this.guest = true
        this.update = true
      } else if (this.referer == 'ClientPartner') {
        this.update = true
        this.clientPartnerProfile = true
      }
      this.run()

    })
    


    // this.storage.getItem('userRole').then((val) => {
    ////
    //   if(val==userRoles.Guest)
    //  {
    //   setTimeout(() =>
    //   {
    //     this.navCtrl.setRoot(DashboardPage,{"userFirstName":this.userFirstName})
    //     console.log("userName",this.userFirstName)
    //   },3000);
    //    console.log("guest")
    //   }
    //  else if(val==userRoles.Partner){
    //   console.log("Partner")
    //   setTimeout(() =>
    //   {

    //     this.navCtrl.setRoot(Questionnaire1Page,{"userFirstName":this.userFirstName})
    //     console.log("userName",this.userFirstName)
    //   },3000);
    //  }
    // })
  }

  ngOnInit() {
    this.run()
  }

  run() {
    if (this.isUserPartner == true) {
      if (this.update) {
        if (this.fromPartnerProfile == true) {
          // TODO
          // for (let i = 0; i < this.navCtrl.getViews().length; i++) {
          //   if (this.navCtrl.getViews()[i].instance instanceof OtpPage) {
          //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
          //   }
          //   if (this.navCtrl.getViews()[i].instance instanceof PartnerPage) {
          //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
          //   }
          // }
          setTimeout(async () => {
            await this.navCtrl.navigateForward('PartnerPage')
          }, 3000)
        } else if (this.guest == true) {
          // TODO
          // for (let i = 0; i < this.navCtrl.getViews().length; i++) {
          //   if (this.navCtrl.getViews()[i].instance instanceof OtpPage) {
          //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
          //   }
          //   if (this.navCtrl.getViews()[i].instance instanceof GuestPage) {
          //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
          //   }
          // }
          setTimeout(async () => {
            await this.navCtrl.navigateForward('GuestPage')
          }, 3000)
        } else if (this.clientPartnerProfile == true) {
          // for (let i = 0; i < this.navCtrl.getViews().length; i++) {
          //   if (this.navCtrl.getViews()[i].instance instanceof OtpPage) {
          //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
          //   }
          //   if (
          //     this.navCtrl.getViews()[i].instance instanceof ClientPartnerPage
          //   ) {
          //     this.navCtrl.removeView(this.navCtrl.getViews()[i])
          //   }
          // }
          setTimeout(async () => {
            await this.navCtrl.navigateForward('ClientPartnerPage')
          }, 3000)
        } //
      } else {
        setTimeout(() => {
          console.log('setRoot Q1')
          // this.navCtrl.setRoot(Questionnaire1Page)
          // TODO
          // this.app
          //   .getRootNav()
          //   .setRoot(Questionnaire1Page)
          //   .then(() => {
          //     //alert("setRoot")
          //     this.navCtrl.popToRoot()
          //   })
          //   .catch((err) => {
          //     //alert(err.toString());
          //   })
        }, 3000)
      }
    } else {
      setTimeout(async () => {
        await this.navCtrl.navigateRoot('DashboardPage')
      }, 3000)
    }
  }

}
