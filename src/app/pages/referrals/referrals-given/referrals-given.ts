import * as moment from 'moment'

import { Component, ViewChild } from '@angular/core'
import {
  Events,
  
  LoadingController,
  NavController,
  NavParams,
  IonSlides,
  ToastController,
} from '@ionic/angular'
import { ReferralInfo, StatusHistory } from '../../../../app/models/ReferralInfo'

import { AcceptStatusRequest } from '../../../../app/models/ChangeStatusRequest'
import { CallNumber } from '@ionic-native/call-number/ngx'
import { ClientPartnerPage } from '../../profile/client-partner/client-partner'
import { ClientPartnerViewPage } from '../../profile/client-partner-view/client-partner-view'
import { Constants } from '../../../Utils/Constants'
import { DashboardPage } from '../../dashboard/dashboard'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { ListedPartnerStatsInfo } from '../../../../app/models/ListedPartnerStatsInfo'
import { ModalController } from '@ionic/angular'
import { ModalRefSortFilterComponent } from '../../../../app/components/modal-ref-sort-filter/modal-ref-sort-filter'
import { Platform } from '@ionic/angular'
import { PopupConfirmationAlertComponent } from '../../../../app/components/popups/popup-confirmation-alert/popup-confirmation-alert'
import { ReferralRequestInfo } from '../../../../app/models/ReferralRequestInfo'
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { Storage } from '@ionic/storage'

import { UJBStatsInfo } from '../../../../app/models/UJBStatsInfo'
import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { ReferralService } from '../../../services/referral.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { DashboardService } from '../../../services/dashboard.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the ReferralsGivenPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-referrals-given',
  templateUrl: 'referrals-given.html',
  styleUrls: ['referrals-given.scss']
})
export class ReferralsGivenPage {
  @ViewChild('slider', { static: true }) slider: IonSlides
  ujbStat: UJBStatsInfo
  partnerStatInfo: ListedPartnerStatsInfo
  searchreferralobj = new ReferralInfo()
  searchReferralList: ReferralInfo[]
  referralList: ReferralInfo[]
  dealList: ReferralInfo[]
  userId: any
  segmentSlider = '0'
  referralRejectFlag: boolean = false
  isClientPartner
  referralRequest: ReferralRequestInfo
  userRole
  currentPage: number = 0
  totalPages: number = 0
  totalRecords: number = 0
  canLoadMore: boolean = false
  businessStat
  scrollBlock: any
  noReferralFound: boolean = false
  pushNow: boolean = false
  message: string = ''
  file: string = ''
  url: string = ''
  method
  stackTrace
  image: string = 'null'
  mobileNumber
  bypassAppChooser: boolean = false
  totalBusinessClosed
  segment
  logError: InsertErrorLog = new InsertErrorLog()
  constructor(
    private storage: Storage,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public getSearchReferralservice: ReferralService,
    public loadingCtrl: LoadingController,
    private callNumber: CallNumber,
    public logErrorService: InserErrorLogService,
    public dashboardService: DashboardService,
    private modalCtrl: ModalController,
    public platform: Platform,
    private toast: ToastController,
    private events: Events,
    private socialSharing: SocialSharing
  ) {
    route.queryParams.subscribe((params: any) => {
      this.scrollBlock = false
      this.ujbStat = new UJBStatsInfo()
      this.partnerStatInfo = new ListedPartnerStatsInfo()
      this.referralRequest = new ReferralRequestInfo()
      this.searchReferralList = new Array<ReferralInfo>()
      this.businessStat = params.businessStat
      this.dealList = new Array<ReferralInfo>()
      this.referralList = new Array<ReferralInfo>()
  
      this.storage.get('userInfo').then((val) => {
        this.userId = val.userId
        this.userRole = val.userRole
  
        console.log('userid', val)
        console.log('ab', this.ujbStat)
        console.log('ab role', this.userRole)
  
        if (this.userRole == 'Partner') {
          this.isClientPartner = false
          // this.slider.lockSwipes(true);
        } else if (this.userRole == Constants.clientPartner) {
          this.isClientPartner = true
        }
        if (!this.ujbStat) {
          this.ujbStat = new UJBStatsInfo()
        }
  
        this.partnerStatInfo = params.activeincome
        if (!this.partnerStatInfo) {
          this.partnerStatInfo = new ListedPartnerStatsInfo()
        }
        this.getUserStats()
        // Segment Active
        if (params.segmentSlider) {
          this.segmentSlider = params.segmentSlider
          this.selectedSegment(params.segmentSlider)
        } else {
          this.segmentSlider = 'referral'
          this.selectedSegment('referral')
        }
        this.events.subscribe('getReferrals', () => {
          this.searchReferralList = new Array<ReferralInfo>()
          this.dealList = new Array<ReferralInfo>()
          this.referralList = new Array<ReferralInfo>()
          this.referralRequest.userId = this.userId
          this.referralRequest.currentPage = 0
          console.log('_getReferrals 1')
          this._getReferrals({
            referralRequest: this.referralRequest,
            event: null,
          })
          this.getUserStats()
        })
      })
    })
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribe(async () => {
      /* 
      if (this.navCtrl.getViews().length > 1) { */
      this.navCtrl.pop()
      /* } else {
        await this.navCtrl.navigateRoot('DashboardPage')
      } */
      /* this.navCtrl.pop().then(res=>{

      }).catch(err=>{
        await this.navCtrl.navigateRoot('DashboardPage')
      }) */
    })

  }

  ionViewDidEnter() {
    // if (this.businessStat == false) {
    //   this.selectedSegment('business')
    //   this.segmentSlider = "business"
    // }
  }

  //SegmentSlider: Change Slide on Segment Button click
  selectedSegment(i) {
    //this.slider.slideTo(i);
    this.searchReferralList = new Array<ReferralInfo>()
    this.referralList = new Array<ReferralInfo>()
    this.dealList = new Array<ReferralInfo>()

    this.referralRequest.userId = this.userId

    if (i == 'referral') {
      this.segment = 'referral'
      this.referralRequest.referred = 'byMe'
      this.referralRequest.currentPage = 0
      console.log('_getReferrals *')
      this._getReferrals({ referralRequest: this.referralRequest, event: null })
    }
    if (i == 'business') {
      this.segment = 'business'
      this.referralRequest.referred = 'toMe'
      this.referralRequest.currentPage = 0
      console.log('_getReferrals 2')
      this._getReferrals({ referralRequest: this.referralRequest, event: null })
    }
  }

  //SegmentSlider: Change Segment Button on slide change
  selectedSlide($event) {
    this.segmentSlider = $event._snapIndex.toString()
  }

  async updateStatus(deal: ReferralInfo) {
    console.log(deal)
    let popup = await this.modalCtrl.create({
      component: ModalRefSortFilterComponent,
      componentProps: { isFilter: false, deal: deal },
      cssClass: 'ujb_modal_ref_sortFilter ujb_theme' 
    })
    popup.present()
  }

  async referralAccept(val: any, deal: ReferralInfo) {
    let request = new AcceptStatusRequest()
    if (val == 'accept') {
      request.dealId = deal.referralId
      request.userId = this.userId
      deal.referralRejectFlag = false
      deal.acceptSelected = 'selected'
      deal.rejectSelected = ''
      let profileModal = await this.modalCtrl.create({
        component: PopupConfirmationAlertComponent,
        componentProps: { text: Constants.areYouSureToAcceptDeal },
        cssClass: 'popupConfirmationAlert dualLineHeight' 
      })
      profileModal.present()
      if (this.platform.is('ios')) {
        this.scrollBlock = true
      }
      const {data} = await profileModal.onDidDismiss()
        if (this.platform.is('ios')) {
          this.scrollBlock = false
        }
        if (data == 'ok') {
          request.referralStatus = 1
          this.acceptRequest(request)
        } else {
          deal.acceptSelected = ''
          deal.rejectSelected = ''
        }
    } else {
      deal.referralRejectFlag = true
      deal.acceptSelected = ''
      deal.rejectSelected = 'selected'
      /* if (deal.rejectedReason != null && deal.rejectedReason != undefined && deal.rejectedReason != "") {
        deal.rejectReasonFlag = false
        let profileModal = await this.modalCtrl.create(PopupConfirmationAlertComponent, { "text": Constants.areYouSureToChangeStatus }, { cssClass: 'popupConfirmationAlert dualLineHeight' });
        profileModal.present();
        profileModal.onDidDismiss(res => {
          if (res == "ok") {
            request.isAccepted = false
            request.rejectionReason = deal.rejectedReason
            this.acceptRequest(request)
          }
        })
      } else {
        deal.rejectReasonFlag = true
      } */
    }
  }

  acceptRequest(request) {
    console.log('request', JSON.stringify(request))
    this.getSearchReferralservice.acceptDeal(request).subscribe(
      (res: any) => {
        if (res.status == 200) {
          Utility.showToast(this.toast, '', false, '', false)
          this.searchReferralList = new Array<ReferralInfo>()
          this.dealList = new Array<ReferralInfo>()
          this.referralList = new Array<ReferralInfo>()
          this.referralRequest.userId = this.userId
          this.referralRequest.currentPage = 0
          console.log('_getReferrals 3')
          this._getReferrals({
            referralRequest: this.referralRequest,
            event: null,
          })
        }
      },
      (err) => {
        Utility.showToast(
          this.toast,
          Constants.someErrorOccurred,
          false,
          '',
          false
        )
        this.url = Urls.baseUrl + Urls.port + Constants.acceptReferral
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'acceptRequest'
        this.inserErrorApi()
      }
    )
  }

  async rejectRequest(deal) {
    deal.rejectReasonFlag = false
    if (
      deal.rejectedReason != null &&
      deal.rejectedReason != undefined &&
      deal.rejectedReason != ''
    ) {
      let request = new AcceptStatusRequest()
      request.dealId = deal.referralId
      request.userId = this.userId
      request.referralStatus = 2
      request.rejectionReason = deal.rejectedReason
      this.referralRejectFlag = false
      console.log('request', JSON.stringify(request))
      let profileModal = await this.modalCtrl.create({
        component: PopupConfirmationAlertComponent,
        componentProps: { text: Constants.areYouSureToRejectDeal },
        cssClass: 'popupConfirmationAlert dualLineHeight' 
      })
      profileModal.present()
      if (this.platform.is('ios')) {
        this.scrollBlock = true
      }
      const {data} = await profileModal.onDidDismiss()
        if (this.platform.is('ios')) {
          this.scrollBlock = false
        }
        if (data == 'ok') {
          let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
          loading.present()
          this.getSearchReferralservice.acceptDeal(request).subscribe(
            (res: any) => {
              if (loading) loading.dismiss()
              if (res.status == 200) {
                Utility.showToast(this.toast, '', false, '', false)
                this.searchReferralList = new Array<ReferralInfo>()
                this.dealList = new Array<ReferralInfo>()
                this.referralList = new Array<ReferralInfo>()
                this.referralRequest.userId = this.userId
                this.referralRequest.currentPage = 0
                console.log('_getReferrals 4')
                this._getReferrals({
                  referralRequest: this.referralRequest,
                  event: null,
                })
              }
            },
            (err) => {
              if (loading) loading.dismiss()
              this.url = Urls.baseUrl + Urls.port + Constants.acceptReferral
              this.stackTrace = err.stack
              this.message = err.message
              this.method = 'rejectRequest'
              this.inserErrorApi()
              Utility.showToast(
                this.toast,
                Constants.someErrorOccurred,
                false,
                '',
                false
              )
            }
          )
        } else {
          deal.referralRejectFlag = false
          deal.acceptSelected = ''
          deal.rejectSelected = ''
          deal.rejectedReason = ''
        }
    } else {
      deal.rejectReasonFlag = true
    }
  }

  async _getReferrals(data: { referralRequest: ReferralRequestInfo; event: any }) {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    data.referralRequest.userId = this.userId
    let referralRequest = data.referralRequest
    this.noReferralFound = false
    let event = data.event
    if (event == 'new') {
      this.searchReferralList = new Array<ReferralInfo>()
      //this.searchReferralList = new Array<ReferralInfo>()
      this.getUserStats()
      //event == null
    }

    console.log('time when req', new Date().toLocaleTimeString())
    console.log('referralRequest', JSON.stringify(referralRequest))
    this.getSearchReferralservice
      .getSearchRefferalApi(referralRequest)
      .subscribe(
        (res: any) => {
          if (event == 'new') {
            this.searchReferralList = new Array<ReferralInfo>()
            //this.getUserStats()
            event == null
          }
          console.log('time when res receive', new Date().toLocaleTimeString())

          if (res != null) {
            if (res.status == 200) {
              let data = res.json.data
              console.log('data in get referral ', data)

              this.referralRequest.currentPage = res.json.paging.currentPage
              this.totalPages = res.json.paging.totalPages
              this.totalRecords = res.json.paging.totalRecords
              for (let i = 0; i < data.length; i++) {
                let searchReferralObj = new ReferralInfo()
                if (data[i].clientPartnerDetails != null) {
                  searchReferralObj.clientPartnerDetails.name =
                    data[i].clientPartnerDetails.name
                  searchReferralObj.clientPartnerDetails.mobileNumber =
                    data[i].clientPartnerDetails.mobileNumber
                  searchReferralObj.clientPartnerDetails.countryCode =
                    data[i].clientPartnerDetails.countryCode
                  searchReferralObj.clientPartnerDetails.userId =
                    data[i].clientPartnerDetails.userId
                }
                searchReferralObj.referralId = data[i].referralId
                searchReferralObj.referralCode = data[i].referralCode
                searchReferralObj.referralDescription =
                  data[i].referralDescription
                searchReferralObj.productName = data[i].productName
                searchReferralObj.categories = data[i].categories
                //searchReferralObj.dateCreated = data[i].dateCreated;
                if (
                  data[i].dateCreated == null ||
                  data[i].dateCreated == undefined ||
                  data[i].dateCreated == ''
                )
                  data[i].dateCreated = moment().toString()
                searchReferralObj.dateCreated = Utility.getUiDate(
                  data[i].dateCreated
                )
                searchReferralObj.refStatus = data[i].refStatus
                searchReferralObj.dealStatus = data[i].dealStatus
                searchReferralObj.referralStatusValue =
                  data[i].referralStatusValue
                searchReferralObj.productId = data[i].productId
                searchReferralObj.referralDescription =
                  data[i].referralDescription
                searchReferralObj.isForSelf = data[i].isForSelf
                searchReferralObj.businessId = data[i].businessId
                searchReferralObj.rejectedReason = data[i].rejectedReason
                if (this.segment == 'business') {
                  searchReferralObj.referredToDetails.name =
                    data[i].referredToDetails.name
                  searchReferralObj.referredToDetails.countryCode =
                    data[i].referredToDetails.countryCode
                  searchReferralObj.referredToDetails.mobileNumber =
                    data[i].referredToDetails.mobileNumber
                }

                if (
                  searchReferralObj.refStatus == 0 ||
                  searchReferralObj.refStatus == 2
                ) {
                  searchReferralObj.statusHistories = new StatusHistory()
                  if (
                    data[i].dealStatusUpdatedOn == null ||
                    data[i].dealStatusUpdatedOn == undefined ||
                    data[i].dealStatusUpdatedOn == ''
                  )
                    data[i].dealStatusUpdatedOn = moment().toString()
                  searchReferralObj.statusHistories.date = Utility.getUiDate(
                    data[i].dealStatusUpdatedOn
                  )
                  searchReferralObj.statusHistories.statusCode =
                    searchReferralObj.refStatus
                  searchReferralObj.statusHistories.status =
                    data[i].referralStatusValue
                  searchReferralObj.statusHistories.icon =
                    Constants.dealStatuses[0].src
                } else {
                  searchReferralObj.statusHistories = new StatusHistory()
                  if (
                    data[i].dealStatusUpdatedOn == null ||
                    data[i].dealStatusUpdatedOn == undefined ||
                    data[i].dealStatusUpdatedOn == ''
                  )
                    data[i].dealStatusUpdatedOn = moment().toString()
                  searchReferralObj.statusHistories.date = Utility.getUiDate(
                    data[i].dealStatusUpdatedOn
                  )
                  searchReferralObj.statusHistories.statusCode =
                    data[i].dealStatus
                  searchReferralObj.statusHistories.status =
                    data[i].dealStatusValue
                  for (let i = 0; i < Constants.dealStatuses.length; i++) {
                    if (
                      searchReferralObj.statusHistories.statusCode ==
                      Constants.dealStatuses[i].id
                    ) {
                      searchReferralObj.statusHistories.icon =
                        Constants.dealStatuses[i].src
                    }
                  }
                  /*               if (data[i].statusHistories.length > 0) {
                              //using last objects data as it is latest
                              searchReferralObj.statusHistories = new StatusHistory()
                              if (data[i].statusHistories[data[i].statusHistories.length - 1].date == null ||
                                data[i].statusHistories[data[i].statusHistories.length - 1].date == undefined ||
                                data[i].statusHistories[data[i].statusHistories.length - 1].date == "")
                                data[i].statusHistories[data[i].statusHistories.length - 1].date = moment().toString()
                              searchReferralObj.statusHistories.date = Utility.getUiDate(data[i].statusHistories[data[i].statusHistories.length - 1].date)
                              searchReferralObj.statusHistories.statusCode = data[i].statusHistories[data[i].statusHistories.length - 1].statusCode;
                              searchReferralObj.statusHistories.status = data[i].statusHistories[data[i].statusHistories.length - 1].status;
                              for (let i = 0; i < Constants.dealStatuses.length; i++) {
                                
                                if (searchReferralObj.statusHistories.statusCode == Constants.dealStatuses[i].id) {
                                  searchReferralObj.statusHistories.icon = Constants.dealStatuses[i].src
                                }
                              }
                            } else {
                              searchReferralObj.statusHistories = new StatusHistory()
                              searchReferralObj.statusHistories.statusCode = searchReferralObj.dealStatus
                              searchReferralObj.statusHistories.status = data[i].dealStatusValue
                              if (data[i].dealStatusUpdatedOn == null || data[i].dealStatusUpdatedOn == undefined || data[i].dealStatusUpdatedOn == "")
                                data[i].dealStatusUpdatedOn = moment().toString()
                              searchReferralObj.statusHistories.date = Utility.getUiDate(data[i].dealStatusUpdatedOn)
                              searchReferralObj.statusHistories.date = data[i].dealStatusUpdatedOn
                              for (let i = 0; i < Constants.dealStatuses.length; i++) {
                                
                                if (searchReferralObj.dealStatus == Constants.dealStatuses[i].id) {
                                  searchReferralObj.statusHistories.icon = Constants.dealStatuses[i].src
                                }
                              }
                            } */
                }
                if (this.segment == 'business') {
                  searchReferralObj.referredByDetails.referredByName =
                    data[i].referredByDetails.referredByName

                  searchReferralObj.referredByDetails.referredByMobileNo =
                    data[i].referredByDetails.referredByMobileNo
                  searchReferralObj.referredByDetails.referredByCountryCode =
                    data[i].referredByDetails.referredByCountryCode
                  searchReferralObj.referredByDetails.referredByUserId =
                    data[i].referredByDetails.referredByUserId
                  //searchReferralObj.referredByDetails.referredByRole = data[i].referredByDetails.referredByRole
                }

                //
                if (searchReferralObj.refStatus == 0) {
                  this.referralList.push(searchReferralObj)
                } else if (searchReferralObj.refStatus != 0) {
                  this.dealList.push(searchReferralObj)
                }
                this.searchReferralList.push(searchReferralObj)
              }

              if (
                this.searchReferralList == null ||
                this.searchReferralList == undefined ||
                this.searchReferralList.length == 0
              ) {
                this.noReferralFound = true
              } else {
                this.noReferralFound = false
              }
              if (this.searchReferralList.length < this.totalRecords) {
                this.canLoadMore = true
              }
              console.log('this.searchReferralList', this.searchReferralList)
              console.log('this.referralList', this.referralList)
              console.log('time when res set', new Date().toLocaleTimeString())
            }
          }
          // if (event != null && event != undefined && event != 'new')
            // event.complete()
          if (loading) loading.dismiss()
        },
        (err) => {
          if (loading) loading.dismiss()
          console.log('error', err)
          this.url = Urls.baseUrl + Urls.port + Constants.getSearchRefferal
          this.stackTrace = err.stack
          this.message = err.message
          this.method = '_getReferrals'
          this.inserErrorApi()
          if (err == 404) {
            this.noReferralFound = true
            this.searchReferralList = new Array<ReferralInfo>()
          } else
            Utility.showToast(
              this.toast,
              Constants.someErrorOccurred,
              false,
              '',
              false
            )
          // if (event != null && event != undefined && event != 'new')
            // event.complete()
        }
      )
  }
  openonApp(index, val) {
    console.log('data in watsapp i', index)
    console.log('data in watsapp i val', val)
    if (index == 1) {
      console.log('data in watsapp', val.referredByDetails)
      this.mobileNumber =
        val.referredByDetails.referredByCountryCode +
        val.referredByDetails.referredByMobileNo
      console.log('no in watsapp', this.mobileNumber)
      this.socialSharing
        .shareViaWhatsAppToReceiver(
          this.mobileNumber,
          this.message,
          this.image,
          this.url
        )
        .then(() => {})
        .catch(() => {})
    } else {
      console.log('data in watsapp', val.referredToDetails)

      this.mobileNumber =
        val.referredToDetails.countryCode + val.referredToDetails.mobileNumber
      console.log('no in watsapp', this.mobileNumber)
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
  }
  gotoKeypad(index, val) {
    console.log('data in call', val)
    if (index == 1) {
      console.log('data in watsapp', val.referredByDetails)
      this.mobileNumber =
        val.referredByDetails.referredByCountryCode +
        val.referredByDetails.referredByMobileNo
      this.callNumber
        .callNumber(this.mobileNumber, this.bypassAppChooser)
        .then((res: any) => console.log('Launched dialer!', res))
        .catch((err) => console.log('Error launching dialer', err))
    } else {
      console.log('data in watsapp', val.referredToDetails)

      this.mobileNumber =
        val.referredToDetails.countryCode + val.referredToDetails.mobileNumber
      this.callNumber
        .callNumber(this.mobileNumber, this.bypassAppChooser)
        .then((res: any) => console.log('Launched dialer!', res))
        .catch((err) => console.log('Error launching dialer', err))
    }
  }
  async getUserStats() {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.dashboardService.getUserStatsApi(this.userId, this.userRole).subscribe(
      (data) => {
        loading.dismiss()
        console.log('userstat in ts file dashboard', data)
        if (data != null) {
          if (data.status == 200) {
            let res = data.json
            console.log('res in 200', res)
            if (res.data.dealsClosed == null) res.data.dealsClosed = 0
            this.partnerStatInfo.referralStats.dealsClosed =
              res.data.dealsClosed

            this.partnerStatInfo.referralStats.refsEarned = res.data.refsEarned
            if (res.data.refsGiven == null) res.data.refsGiven = 0
            this.partnerStatInfo.referralStats.refsGiven = res.data.refsGiven
            if (res.data.businessStats.totalBusinessClosed && res.data.businessStats.totalBusinessClosed.length > 8) {
              this.totalBusinessClosed = 'counts'
            } else {
              this.totalBusinessClosed = 'counts-partnerStats'
            }
            if (res.data.businessStats.totalBusinessClosed == null)
              res.data.businessStats.totalBusinessClosed = 0
            this.partnerStatInfo.businessStats.totalBusinessClosed =
              res.data.businessStats.totalBusinessClosed
            if (res.data.businessStats.totalDealsClosed == null)
              res.data.businessStats.totalDealsClosed = 0
            this.partnerStatInfo.businessStats.totalDealsClosed =
              res.data.businessStats.totalDealsClosed
            console.log('stat info user', this.partnerStatInfo)
          } else {
            if (loading) loading.dismiss()
          }
        }
      },
      (err) => {
        if (loading) loading.dismiss()
        this.url = Urls.baseUrl + Urls.port + Constants.getUserStats
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getUserStats'
        this.inserErrorApi()
      }
    )
  }

  onScroll(event) {
    console.log('xyz', event)
    this.referralRequest.userId = this.userId
    if (this.searchReferralList.length < this.totalRecords) {
      if (this.referralRequest.currentPage < this.totalPages - 1) {
        this.referralRequest.currentPage = this.referralRequest.currentPage + 1
        console.log('_getReferrals 5')
        this._getReferrals({
          referralRequest: this.referralRequest,
          event: event,
        })
        console.log('this.referralRequest', this.referralRequest)
      }
    } else {
      //console.log("else", this.doctorListInfo)
      this.canLoadMore = false
    }
  }

  async openClientProfile(deal: ReferralInfo) {
    if (deal.referredByDetails.referredByRole == Constants.clientPartner) {
      // this.storage.get("mentorIdList").then(data => {
      //   let mentorIdList = data
      //   let isMentorConnect: boolean = false
      //   for (let j = 0; j < mentorIdList.length; j++) {
      //     if (mentorIdList[j] == deal.referredByDetails.referredByUserId) {
      //       isMentorConnect = true
      //       break
      //     }
      //   }
      //   if (isMentorConnect == true) {
      //     // this.navCtrl.push(ClientPartnerPage, {
      //       "viewOtherProfile": true,
      //       "userId": deal.referredByDetails.referredByUserId,
      //       "businessId": ""
      //     })
      //   } else {
      await this.navCtrl.navigateForward('ClientPartnerViewPage', { queryParams: {
        viewOtherProfile: true,
        userId: deal.referredByDetails.referredByUserId,
        businessId: '',
      }})
      // }
      // })
    }
  }

  // Push On Focus
  scrollTo(ht: string) {
    this.pushNow = true
  }

  removeSroll() {
    this.pushNow = false
  }

  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'ReferralsGivenPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
