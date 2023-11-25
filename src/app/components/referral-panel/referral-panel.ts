import { ModalController, NavController } from '@ionic/angular'

import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Storage } from '@ionic/storage'

import { ModalRefSortFilterComponent } from '../modal-ref-sort-filter/modal-ref-sort-filter'
import { CategoryInfo } from '../../models/CategoryInfo'
import { ListedPartnerStatsInfo } from '../../models/ListedPartnerStatsInfo'
import { ReferralInfo } from '../../models/ReferralInfo'
import { ReferralRequestInfo } from '../../models/ReferralRequestInfo'
import { UJBStatsInfo } from '../../models/UJBStatsInfo'
import { ModalSortFilterComponent } from '../modals/modal-sort-filter/modal-sort-filter'
import { SocialSharing } from '@ionic-native/social-sharing/ngx'
import { CallNumber } from '@ionic-native/call-number/ngx'
import { ReferralService } from '../../services/referral.service'

/**
 * Generated class for the ReferralPanelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'referral-panel',
  templateUrl: 'referral-panel.html',
  styleUrls: ['referral-panel.scss']
})
export class ReferralPanelComponent {
  // @ViewChild('slider') slider: Slides;
  @Input() ujbStats: UJBStatsInfo
  @Input() partnerStatInfos: ListedPartnerStatsInfo
  @Input() noRefFound: boolean
  searchReferralObj = new ReferralInfo()
  @Input() searchReferralsList: ReferralInfo[]
  @Output() _getReferrals = new EventEmitter<any>()
  sortResult: CategoryInfo
  //noRefFound: boolean
  selectedCategory: any
  query: string = ''
  items = []
  categoryList: CategoryInfo[]
  userId: any
  searchbarclass: any
  categoryInfo = new CategoryInfo()
  text: string
  referralRequest: ReferralRequestInfo
  myClass1 = ''
  mobileNumber
  message = ''
  image
  bypassAppChooser: boolean = false
  url
  activeIncome
  passiveIncome
  hideSearch
  constructor(
    private storage: Storage,
    private modalCtrl: ModalController,
    private socialSharing: SocialSharing,
    public getSearchReferralservice: ReferralService,
    public navCtrl: NavController,
    private callNumber: CallNumber,
    // public app: App
  ) {
    this.ujbStats = new UJBStatsInfo()
    this.partnerStatInfos = new ListedPartnerStatsInfo()
    this.searchReferralsList = new Array<ReferralInfo>()
    this.referralRequest = new ReferralRequestInfo()
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
      this.referralRequest.userId = val.userId
      this.referralRequest.referred = 'byMe'
      this.referralRequest.currentPage = 0
      //console.log("_getReferrals 6")
      //this._getReferrals.emit({ "referralRequest": this.referralRequest, "event": "new" });
      console.log('userid', val)
      console.log('abf', this.ujbStats)
      console.log('abcd', this.partnerStatInfos)
      console.log('this.searchReferralsList1', this.searchReferralsList)
      //console.log("this.searchReferralsList123 mobile", this.searchReferralsList[1].referredByDetails.referredByMobileNo)
    })
    // if (this.partnerStatInfos.referralStats.refsEarned.activeIncome.length > 8) {
    //   this.activeIncome = "counts"
    // } else {
    //   this.activeIncome = "counts-partnerStats"
    // }
    // if (this.partnerStatInfos.referralStats.refsEarned.passiveIncome.length > 8) {
    //   this.passiveIncome = "counts"
    // } else {
    //   this.passiveIncome = "counts-partnerStats"
    // }
  }

  async openModal() {
    let popup = await this.modalCtrl.create({
      component:ModalSortFilterComponent,
      componentProps: {},
      cssClass: 'ujb_modal_ref_sortFilter ujb_theme' 
    })
    popup.present()
  }

  async getCatId() {
    let popup = await this.modalCtrl.create({
      component:ModalRefSortFilterComponent,
      componentProps: { isFilter: true, referralRequest: this.referralRequest },
      cssClass: 'ujb_modal_ref_sortFilter ujb_theme' 
    })
    popup.present()
    const {data} = await popup.onDidDismiss()
    console.log('data search', data)
    if (data) {
      //this.searchReferralsList = new Array<ReferralInfo>()
      this.referralRequest = data.data
      this.myClass1 = ''
      if (
        this.referralRequest.categoryIds != null &&
        this.referralRequest.categoryIds != undefined &&
        this.referralRequest.categoryIds.length != 0
      ) {
        this.myClass1 = 'filterApplied'
      }
      if (
        this.referralRequest.status != null &&
        this.referralRequest.status != undefined &&
        this.referralRequest.status.length != 0
      ) {
        this.myClass1 = 'filterApplied'
      }
      console.log('_getReferrals 7')
      this._getReferrals.emit({
        referralRequest: this.referralRequest,
        event: 'new',
      })
    }
  }

  setFilteredItems() {
    if (this.query.length >= 3) {
      this.referralRequest.query = this.query
      console.log('_getReferrals 8')
      this._getReferrals.emit({
        referralRequest: this.referralRequest,
        event: 'new',
      })
    } else if (this.query.length == 0) {
      this.referralRequest.query = ''
      console.log('_getReferrals 9')
      this._getReferrals.emit({
        referralRequest: this.referralRequest,
        event: 'new',
      })
    }
  }

  openProfile(searchreferralobj: ReferralInfo) {
    // this.storage.get("mentorIdList").then(data => {
    //   let mentorIdList = data
    //   if (mentorIdList) {
    //     let isMentorConnect: boolean = false
    //     for (let j = 0; j < mentorIdList.length; j++) {
    //       if (mentorIdList[j] == searchreferralobj.clientPartnerDetails.userId) {
    //         isMentorConnect = true
    //         break
    //       }
    //     }
    //     if (isMentorConnect == true) {
    //       this.app.getActiveNav().push(ClientPartnerPage, {
    //         "viewOtherProfile": true,
    //         "userId": searchreferralobj.clientPartnerDetails.userId,
    //         "businessId": ""
    //       })
    //     } else {
    //       this.app.getActiveNav().push(ClientPartnerViewPage, {
    //         "viewOtherProfile": true,
    //         "userId": searchreferralobj.clientPartnerDetails.userId,
    //         "businessId": ""
    //       })
    //     }
    //   } else {
    this.navCtrl.navigateForward('ClientPartnerViewPage', { queryParams: {
      viewOtherProfile: true,
      userId: searchreferralobj.clientPartnerDetails.userId,
      businessId: '',
    }})
    // }
    //})
  }
  openonApp(searchreferralobj: ReferralInfo) {
    console.log('open app ', searchreferralobj)
    this.mobileNumber =
      searchreferralobj.clientPartnerDetails.countryCode +
      searchreferralobj.clientPartnerDetails.mobileNumber
    console.log('open app mobiole no', this.mobileNumber)
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
  gotoKeypad(searchreferralobj: ReferralInfo) {
    console.log('open keypad ', searchreferralobj)
    this.mobileNumber =
      searchreferralobj.clientPartnerDetails.countryCode +
      searchreferralobj.clientPartnerDetails.mobileNumber
    console.log('open keypad mobile no ', this.mobileNumber)
    this.callNumber
      .callNumber(this.mobileNumber, this.bypassAppChooser)
      .then((res: any) => console.log('Launched dialer!', res))
      .catch((err) => console.log('Error launching dialer', err))
  }

  searchData(query) {}
}
