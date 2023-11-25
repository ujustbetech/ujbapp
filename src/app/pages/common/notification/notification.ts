import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import {
  notificationListRes,
  notifications,
} from '../../../../app/models/notificationList_res'
import { PartnerPage } from '../../profile/partner/partner'
import { ClientPartnerPage } from '../../profile/client-partner/client-partner'
import { Platform } from '@ionic/angular'
import * as moment from 'moment'
import { Utility } from '../../../Utils/Utility'
import { Constants } from '../../../Utils/Constants'
import { NotificationService } from '../../../services/notification.service'
/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
  styleUrls:['notification.scss']
})
export class NotificationPage {
  userId: any
  skipTotal: any
  notificationListObj: notificationListRes
  notifications: notifications[]
  notificationDate
  userRole
  noNotification: boolean = false
  showBusinessStat: boolean = false
  addProductNotification: boolean = false
  userNotification: string = 'assets/imgs/icons/userCopy@2x.png'
  systemNotification: string = 'assets/imgs/icon.png'
  //notificationIcon
  blueLink
  notificationIds: string[]
  canLoadMore: boolean = false
  listCount: number = 0
  notificationType
  segmentSlider
  constructor(
    public navCtrl: NavController,
    public notificationService: NotificationService,
    private storage: Storage,
    public platform: Platform
  ) {
    this.notificationListObj = new notificationListRes()
    this.notifications = new Array<notifications>()
    this.skipTotal = 0

    this.storage
      .get('userInfo')
      .then((val) => {
        console.log('userid1', val)
        this.userId = val.userId
        this.userRole = val.userRole
        this.getNotificationList(event)
      })
      .catch((err) => {
        console.log('userid2', err)
      })
    platform.backButton.subscribe(() => {
      navCtrl.pop()
    })
  }
  onScroll(event) {
    console.log('xyz', event)
    if (this.notifications.length < this.listCount) {
      this.canLoadMore = false
    } else {
      //console.log("else", this.doctorListInfo)

      this.skipTotal = this.notifications.length

      // if (this.skipTotal > this.listCount) {
      //
      //   this.skipTotal = this.listCount
      // }
      // this.noNotification = false
      if (this.notificationListObj.totalCount == this.skipTotal) {
        this.canLoadMore = false
      } else {
        this.getNotificationList(event)
      }
    }
    // if (event != null || event != undefined)
    // event.complete();
  }
  gotoNotification() {
    this.notificationIds = new Array<string>()
    for (let i = 0; i <= this.notifications.length - 1; i++) {
      this.notificationIds.push(this.notifications[i].id)
    }
    console.log('data in notificationUpdate ts ids', this.notificationIds)
    this.notificationService
      .notificationUpdateApi(this.notificationIds)
      .subscribe(
        (data) => {
          console.log('data in notificationUpdate ts', data)
        },
        (err) => {
          console.log('err', err)
        }
      )
  }
  getNotificationList(event) {
    this.notificationService
      .notificationListApi(this.userId, this.skipTotal)
      .subscribe(
        (data) => {
          console.log('data in notification ts', data)
          if (data != null) {
            if (data.status == 200) {
              let res = data.json.data
              console.log('data in notification 200', res)
              this.notificationListObj.totalCount = res.totalCount
              this.notificationListObj.totalUnreadCount = res.totalUnreadCount
              for (let i = 0; i <= res.notifications.length - 1; i++) {
                let notificationObj = new notifications()
                // notificationObj.date = moment(res.notifications[i].date).format("MMMM DD, YYYY").toString();
                //this.timeToShow =

                console.log('moment', moment().utc())
                console.log('moment api', moment(res.notifications[i].date))

                console.log(
                  'utc time',
                  new Date(res.notifications[i].date).toUTCString()
                )
                console.log(
                  'utc localtime',
                  new Date(res.notifications[i].date)
                )
                console.log(
                  'moment in time',
                  moment(res.notifications[i].date).toISOString()
                )
                let gotDate = moment(
                  res.notifications[i].date,
                  'YYYY-MM-DDTHH:mm:ssZZ'
                )
                console.log('data in notification date time', gotDate)
                let hours = -gotDate.diff(moment(), 'hours')
                console.log('data in notification date hour time', hours)
                let minutes = -gotDate.diff(moment(), 'minutes')
                console.log('data in notification date min time', minutes)

                if (hours >= 24 && hours <= 48) {
                  notificationObj.timeToShow = 'Yesterday'
                } else if (hours >= 48) {
                  notificationObj.timeToShow = moment(res.notifications[i].date)
                    .format('MMMM DD, YYYY')
                    .toString()
                } else if (hours > 1) {
                  notificationObj.timeToShow = hours + ' hours ago'
                } else if (
                  minutes == -0 ||
                  minutes == -1 ||
                  minutes == -2 ||
                  minutes == -3
                ) {
                  notificationObj.timeToShow = 'Just now'
                } else if (minutes == 1) {
                  notificationObj.timeToShow = minutes + ' minute ago'
                } else if (minutes < 60) {
                  notificationObj.timeToShow = minutes + ' minutes ago'
                } else if (hours == 1) {
                  notificationObj.timeToShow = 'hour ago'
                } else {
                  notificationObj.timeToShow = moment(res.notifications[i].date)
                    .format('MMMM DD, YYYY')
                    .toString()
                }

                notificationObj.id = res.notifications[i].id
                notificationObj.isRead = res.notifications[i].isRead
                notificationObj.type = res.notifications[i].type
                notificationObj.isSystemGenerated =
                  res.notifications[i].isSystemGenerated
                if (notificationObj.isSystemGenerated == true) {
                  notificationObj.notificationIcon = this.systemNotification
                  notificationObj.blueLink = ''
                } else if (notificationObj.isSystemGenerated == false) {
                  notificationObj.notificationIcon = this.userNotification
                  notificationObj.blueLink = 'blueLink'
                } else if (notificationObj.type == 'Lead Auto Rejection') {
                  notificationObj.notificationIcon = this.systemNotification
                  notificationObj.blueLink = 'blueLink'
                }
                notificationObj.message = res.notifications[i].message

                console.log('data in notification array', notificationObj)
                notificationObj.isReferredByMe =
                  res.notifications[i].isReferredByMe
                this.notifications.push(notificationObj)
                // this.notificationIds.push(this.notifications[i].id)
                this.gotoNotification()

                console.log(' notification array list', this.notifications)
              }
              if (this.notifications.length > 0) {
                if (this.notifications.length < this.listCount) {
                  this.canLoadMore = false
                } else {
                  this.canLoadMore = true
                  this.listCount = this.skipTotal
                }
              }

              //else if (this.notifications.length == 0) {
              //        // this.noNotification = true
              //         this.canLoadMore = false
              //       }
              //       else {
              //        // this.noNotification = true
              //         this.canLoadMore = false

              //     }
              if (event != null || event != undefined) event.complete()
            }
          }
        },
        (err) => {
          console.log('data in err', err)
          if (err.message == 404) {
            this.noNotification = true
          }
        }
      )
  }
  async clickNotification(notificationType) {
    console.log('get details notification', notificationType)
    this.notificationType = notificationType.type
    if (this.notificationType == 'Skip KYC') {
      // this.navCtrl.push(KycPanCardPage)
      await this.navCtrl.navigateForward('KycPanCardPage')
    } else if (
      this.notificationType == 'Approve Partner' ||
      this.notificationType == 'Reject Partner' ||
      this.notificationType == 'KYC Approval Under Process'
    ) {
      this.navCtrl.pop()
    } else if (
      this.notificationType == 'Lead Acceptance' ||
      this.notificationType == 'Auto Rejection Reminder' ||
      this.notificationType == 'Lead Rejection' ||
      this.notificationType == 'Lead Status Changed' ||
      this.notificationType == 'Lead Created' ||
      this.notificationType == 'Lead Auto Rejection'
    ) {
      if (this.userRole == 'Partner') {
        this.showBusinessStat = notificationType.isReferredByMe
        // this.navCtrl.push(ReferralsGivenPage, {
        //   businessStat: this.showBusinessStat,
        // })
        await this.navCtrl.navigateForward('ReferralsGivenPage', { queryParams: {  businessStat: this.showBusinessStat } } )
      } else if (this.userRole == Constants.clientPartner) {
        this.showBusinessStat = notificationType.isReferredByMe
        if (this.showBusinessStat == false) {
          this.segmentSlider = 'business'
        } else {
          this.segmentSlider = 'referral'
        }
        // this.navCtrl.push(ReferralsGivenPage, {
        //   businessStat: this.showBusinessStat,
        //   segmentSlider: this.segmentSlider,
        // })
        await this.navCtrl.navigateForward('ReferralsGivenPage', { queryParams: {  businessStat: this.showBusinessStat , segmentSlider: this.segmentSlider,} } )

      }
    } else if (this.notificationType == 'Incomplete Profile') {
      if (this.userRole == 'Partner') {
        // this.navCtrl.push(PartnerPage)
        await this.navCtrl.navigateForward('PartnerPage')
      } else if (this.userRole == Constants.clientPartner) {
        // this.navCtrl.push(ClientPartnerPage)
        await this.navCtrl.navigateForward('ClientPartnerPage')

      }
    } else if (this.notificationType == 'No Client Partner Products') {
      this.addProductNotification == true
      // this.navCtrl.push(ClientPartnerPage, {
      //   addProductNotification: this.addProductNotification,
      // })
      await this.navCtrl.navigateForward('ClientPartnerPage', { queryParams: {  addProductNotification: this.addProductNotification} } )
    }
  }
}
