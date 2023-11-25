import {  NavController } from '@ionic/angular'

import { CallNumber } from '@ionic-native/call-number/ngx'
import { ClientPartnerPage } from '../profile/client-partner/client-partner'
import { ClientPartnerViewPage } from '../profile/client-partner-view/client-partner-view'
import { ComingSoonPage } from '../common/coming-soon/coming-soon'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../Utils/Constants'
import { Device } from '@ionic-native/device/ngx'
import { GuestPage } from '../profile/guest/guest'
import { InsertErrorLog } from '../../../app/models/insertErrorLog'
import { PartnerPage } from '../profile/partner/partner'
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { Storage } from '@ionic/storage'
import { Urls } from '../../Utils/urls'
import { UserInfo } from '../../../app/models/userInfo'
import { InserErrorLogService } from '../../services/inser-error-log.service'
import { UserProfileService } from '../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the CommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
  styleUrls:['community.scss']
})
export class CommunityPage implements OnInit {
  pageTitle = 'My Community'
  userId: any
  userList: UserInfo[]
  userinfoobj = new UserInfo()
  mentorUserInfo: UserInfo[]
  connectorUserInfo: UserInfo[]
  userinfoconnectobj = new UserInfo()
  message: string = ''
  file: string = ''
  url: string = ''
  image: string = 'null'
  receiver: string = ''
  options: string = ''
  appName: string = ''
  subject: string = ''
  link: string = ''
  dashBoardActive: any
  viewOtherProfile: boolean
  profileActive: any
  moreMenuActive
  bypassAppChooser: boolean = false
  showNoConnectMessage: boolean = false
  noConnectMessage: string = ''
  mobileNumber
  margin
  flagContact: boolean = false

  stackTrace
  logError: InsertErrorLog = new InsertErrorLog()
  method
  constructor(
    private storage: Storage,
    public logErrorService: InserErrorLogService,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private device: Device,
    public getconnectorService: UserProfileService,
    private socialSharing: SocialSharing,
    private callNumber: CallNumber
  ) {
    route.queryParams.subscribe((params: any) => {
      this.noConnectMessage = Constants.invitePeopleMessage
      this.userList = new Array<UserInfo>()
      this.mentorUserInfo = new Array<UserInfo>()
      this.connectorUserInfo = new Array<UserInfo>()
      this.storage.get('userInfo').then((val) => {
        console.log('userid', val)
        this.userId = val.userId
  
        this.mentorUserInfo = params.usermentorinfolist
  
        this.connectorUserInfo = params.userconnectinfolist
        if (
          this.connectorUserInfo == null ||
          this.connectorUserInfo == undefined ||
          this.connectorUserInfo.length == 0
        ) {
          this.showNoConnectMessage = true
        }
        //this.getMentorsList()
        //this.getConnectorsList()
      })
      if (
        device.model == 'iPhone10,3' ||
        device.model == 'iPhone10,6' ||
        device.model == 'iPhone11,8' ||
        device.model == 'iPhone11,2' ||
        device.model == 'iPhone11,6' ||
        device.model == 'iPhone11,4'
      ) {
        this.margin = 'margin'
      } else {
        this.margin = ' '
      }
    })
  }

  openonApp(userinfoconnectobj) {
    this.mobileNumber = '+91' + userinfoconnectobj.mobileNumber
    this.socialSharing
      .shareViaWhatsAppToReceiver(
        this.mobileNumber,
        this.message,
        this.image,
        this.url
      )
      .then(() => {})
      .catch(() => {})
  }

  gotoKeypad(userinfoconnectobj: UserInfo) {
    this.callNumber
      .callNumber(
        userinfoconnectobj.countryCode + userinfoconnectobj.mobileNumber,
        this.bypassAppChooser
      )
      .then((res: any) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err))
  }

  gotoInvitePeople() {
    this.storage.get('userInfo').then((val) => {
      let firstName = val.firstName
      let mymentorcode = val.myMentorcode
      this.message =
        'Hi,' +
        ' ' +
        'I am delighted to invite you to join the UJustBe to Be Connect and Grow. Here you can Earn by just Passing the Referral and also Grow your Business by receiving the Referrals.\n\n' +
        'Click on the below link to explore UJustbe World as Guest\n\n' +
        'OR\n\n' +
        'start Earning as Partner of the UJustBe.\n\n' +
        'Select' +
        ' ' +
        firstName +
        'as your Mentor in App and give me an opportunity to help you Grow\n\n' +
        'Google Playstore: ' +
        Constants.playStoreLink +
        '\n\n' +
        ' Apple Appstore: ' +
        Constants.appStoreLink
      this.socialSharing
        .share(this.message, this.file, this.link)
        .then(() => {})
        .catch(() => {})
    })
  }

  ngOnInit() {
    console.log('ngOnInit CommunityPage')
  }

  async openProfile(userinfoobj) {
    this.viewOtherProfile = true
    if (userinfoobj.myMentorCode != Constants.UjbPartnerMentorCode) {
      if (userinfoobj.role == 'Partner') {
        // this.navCtrl.push(PartnerPage, {
          // userId: userinfoobj.userId,
          // viewOtherProfile: true,
          // flagContact: true,
        // })
        await this.navCtrl.navigateForward('PartnerPage', { queryParams: {  userId: userinfoobj.userId,
          viewOtherProfile: true,
          flagContact: true,} } )
      } else if (userinfoobj.role == Constants.clientPartner) {
        // this.navCtrl.push(ClientPartnerPage, {
          // userId: userinfoobj.userId,
          // viewOtherProfile: true,
          // flagContact: true,
        // })
        await this.navCtrl.navigateForward('ClientPartnerPage', { queryParams: {   userId: userinfoobj.userId,
          viewOtherProfile: true,
          flagContact: true,} } )
      }
    } else {
      //// this.navCtrl.push(CommunityPage, { "usermentorinfolist": this.mentorUserInfo, "userconnectinfolist": this.connectorUserInfo });
    }
  }

  getMentorsList() {
    this.getconnectorService.getconnectors(this.userId).subscribe(
      (res: any) => {
        if (res != null) {
          if (res.status == 200) {
            let data = res.json.data

            this.userinfoobj.base64Image = data.connectorUserInfo[0].base64Image
            this.userinfoobj.firstName = data.connectorUserInfo[0].firstName
            console.log('e', this.userinfoobj.firstName)
            this.userinfoobj.lastName = data.connectorUserInfo[0].lastName
            this.userinfoobj.mobileNumber =
              data.connectorUserInfo[0].mobileNumber
            this.userinfoobj.mentorCode = data.connectorUserInfo[0].mentorCode
          }
        }
      },
      (err) => {
        console.log('err', err)
        this.url = Urls.baseUrl + Urls.port + Constants.getConnectors
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getMentorsList'
        this.inserErrorApi()
      }
    )
  }

  /*   getConnectorsList() {
  
      this.getconnectorService.getconnectors(this.userId).subscribe((res: any) => {
        
        if (res != null) {
          if (res.status == 200) {
            let data = res.json.data
            for (let i = 0; i <= data.userInfo.length; i++) {
              
              this.userinfoconnectobj.base64Image = data.userInfo[i].base64Image;
              this.userinfoconnectobj.firstName = data.userInfo[i].firstName;
              console.log("e", this.userinfoconnectobj.firstName)
              this.userinfoconnectobj.lastName = data.userInfo[i].lastName;
              this.userinfoconnectobj.mobileNumber = data.userInfo[i].mobileNumber;
              console.log("obj", this.userinfoconnectobj)
              this.userList.push(this.userinfoconnectobj)
            }
            console.log("list", this.userList)
          }
        }
      })
  
    } */
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'CommunityPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
