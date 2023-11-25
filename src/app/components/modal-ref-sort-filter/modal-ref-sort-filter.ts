import {
  // App,
  Events,
  LoadingController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular'
import { Component, Input, OnInit, ViewChild } from '@angular/core'

import { CategoryInfo } from '../../../app/models/CategoryInfo'
import { ChangeStatusRequest } from '../../../app/models/ChangeStatusRequest'
import { FCM } from '@ionic-native/fcm/ngx'
import { InsertErrorLog } from '../../../app/models/insertErrorLog'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { ModalController } from '@ionic/angular'
import { PopupConfirmationAlertComponent } from '../popups/popup-confirmation-alert/popup-confirmation-alert'
import { ReferralInfo } from '../../../app/models/ReferralInfo'
import { ReferralRequestInfo } from '../../../app/models/ReferralRequestInfo'
import { Storage } from '@ionic/storage'

import { Urls } from '../../Utils/urls'
import { Utility } from '../../Utils/Utility'
import { Constants } from '../../Utils/Constants'
import { CategoriesService } from '../../services/categories.service'
import { ReferralService } from '../../services/referral.service'
import { InserErrorLogService } from '../../services/inser-error-log.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the ModalRefSortFilterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-ref-sort-filter',
  templateUrl: 'modal-ref-sort-filter.html',
  styleUrls: ['modal-ref-sort-filter.scss']
})
export class ModalRefSortFilterComponent implements OnInit {
  // @ViewChild('slider', { static: true }) slider: Slides
  segmentSlider = '0'

  modalHeader: string = 'Sort/Filter'
  modalDismiss: string = 'Done'
  txt_SortBy: string = 'Sort by'
  txt_Rating: string = 'Rating'
  txt_Distance: string = 'Distance'
  txt_NearToFar: string = 'Near to Far'
  txt_Categories: string = 'Categories'
  txt_dealStatus: string = 'Deal Status'
  categoryList: any[]
  selectedItem: any
  catData: any
  catList: CategoryInfo[]
  searchTerm: string = ''
  @Input('referralRequest') referralRequest: ReferralRequestInfo
  text: string
  getCategoryListRes: CategoryInfo
  dealStatuses: any[]
  isReferral: boolean = true
  @Input('isFilter') isFilter: boolean = true
  hideTabs: boolean = false
  @Input("deal") deal: ReferralInfo
  userId
  CurrentPage
  totalCount
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  constructor(
    public getCategoryList: CategoriesService,
    private localNotifications: LocalNotifications,
    private referralProvider: ReferralService,
    private modalCtrl: ModalController,
    public storage: Storage,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private fcm: FCM,
    private events: Events,
    private platform: Platform,
    private navCtrl: NavController,
    // private appCtrl: App,
    public logErrorService: InserErrorLogService,
    private route: ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    // route.queryParams.subscribe((params: any) => {
      this.categoryList = new Array<any>()
      this.catList = new Array<CategoryInfo>()
      this.getCategoryListRes = new CategoryInfo()
      this.referralRequest = new ReferralRequestInfo()
      // this.isFilter = params.isFilter
      this.CurrentPage = 1
      if (this.isFilter == true) {
        // this.referralRequest = params.referralRequest
        this.hideTabs = false
        this.dealStatuses = JSON.parse(JSON.stringify(Constants.dealStatuses))
        this.dealStatuses.pop()
  
        for (let i = 0; i < this.referralRequest.status.length; i++) {
          for (let j = 0; j < this.dealStatuses.length; j++) {
            if (this.dealStatuses[j].id == this.referralRequest.status[i]) {
              this.dealStatuses[j].selected = true
            }
          }
        }
        console.log('this.dealStatuses', this.dealStatuses)
      } else {
        this.modalHeader = 'Update Deal Status'
        this.hideTabs = true
        // this.deal = params.deal
        this.getStatuses()
      }
  
      this.segmentSlider = '0'
  
      this.platform.backButton.subscribe(() => {
        if (this.modalCtrl) {
          this.modalCtrl.dismiss()
          this.modalCtrl = undefined
        } else this.navCtrl.pop()
      })

    // }) 
  }

  async getCategories(CurrentPage) {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    //for(let j=1; j<=2;j++){
    //this.CurrentPage = j
    this.getCategoryList
      .getcategoriesApi(this.searchTerm, CurrentPage)
      .subscribe(
        (res: any) => {
          console.log('list', res)
          if (loading) loading.dismiss()
          if (res.json.message[0].type == 'SUCCESS') {
            let data = res.json.data.categories
            for (let i = 0; i <= data.length - 1; i++) {
              let categoryinfoobj = new CategoryInfo()
              categoryinfoobj.catId = data[i].catId
              categoryinfoobj.categoryName = data[i].categoryName
              categoryinfoobj.categoryImgBase64 = Utility.getImageUrl(
                data[i].categoryImgBase64
              )
              console.log('obj', categoryinfoobj)
              if (this.referralRequest.categoryIds.length > 0) {
                for (
                  let j = 0;
                  j < this.referralRequest.categoryIds.length;
                  j++
                ) {
                  if (
                    categoryinfoobj.catId == this.referralRequest.categoryIds[j]
                  ) {
                    categoryinfoobj.selected = true
                    break
                  }
                }
              }
              this.catList.push(categoryinfoobj)
              this.totalCount = res.json.data.totalCount
              this.getCategoryListRes.pager.currentPage =
                res.json.data.pager.currentPage
              this.getCategoryListRes.pager.pageSize =
                res.json.data.pager.pageSize
              this.getCategoryListRes.pager.totalPages =
                res.json.data.pager.totalPages
              this.getCategoryListRes.pager.totalRecords =
                res.json.data.pager.totalRecords
              console.log(
                'list in category get category res',
                this.getCategoryListRes
              )

              console.log('list', this.catList)
              if (
                this.CurrentPage != this.getCategoryListRes.pager.totalPages
              ) {
                this.CurrentPage++
                this.getCategories(this.CurrentPage)
              }
            }
            console.log('list', this.catList)
          }
        },
        (err) => {
          if (loading) loading.dismiss()
          console.log('err', err)
        }
      )
    //}
  }

  async getStatuses() {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.referralProvider.getStatuses(this.deal.dealStatus).subscribe(
      (res: any) => {
        console.log('res', res)
        if (loading) loading.dismiss()

        if (res.json.data) {
          if (res.json.data.statusList) {
            this.dealStatuses = new Array<any>()
            for (let i = 0; i < Constants.dealStatuses.length; i++) {
              for (let j = 0; j < res.json.data.statusList.length; j++) {
                if (
                  Constants.dealStatuses[i].id ==
                  res.json.data.statusList[j].statusId
                ) {
                  Constants.dealStatuses[i].id =
                    res.json.data.statusList[j].statusId
                  Constants.dealStatuses[i].text =
                    res.json.data.statusList[j].statusName
                  this.dealStatuses.push(Constants.dealStatuses[i])
                  break
                }
              }
            }
          }
        }
      },
      (err) => {
        if (loading) loading.dismiss()
        console.log('err', err)
        this.url = Urls.baseUrl + Urls.port + Constants.getReferralStatuses
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'getStatuses'
        this.inserErrorApi()
      }
    )
  }

  //SegmentSlider: Change Slide on Segment Button click
  selectedSegment(i) {
    // this.slider.slideTo(i);
    if (i == 0) {
      this.isReferral = true
    } else {
      this.isReferral = false
      this.getCategories(this.CurrentPage)
    }
  }
  //SegmentSlider: Change Segment Button on slide change
  selectedSlide($event) {
    this.segmentSlider = $event._snapIndex.toString()
  }

  closeModal() {
    let categoryIds: string[] = new Array<string>()
    for (let i = 0; i < this.catList.length; i++) {
      if (this.catList[i].selected == true) {
        categoryIds.push(this.catList[i].catId)
      }
    }
    this.referralRequest.categoryIds = categoryIds
    this.modalCtrl.dismiss({ data: this.referralRequest })
  }

  async setDealstatus(id) {
    if (this.isFilter == true) {
      for (let i = 0; i < this.dealStatuses.length; i++) {
        if (this.dealStatuses[i].id == id) {
          if (this.dealStatuses[i].selected == false) {
            this.dealStatuses[i].selected = true
            this.referralRequest.status.push(this.dealStatuses[i].id)
          } else if (this.dealStatuses[i].selected == true) {
            this.dealStatuses[i].selected = false
            for (let j = 0; j < this.referralRequest.status.length; j++) {
              if (this.referralRequest.status[j] == id) {
                this.referralRequest.status.splice(j, 1)
              }
            }
            //this.referralRequest.status.splice(i, 1)
          }
        } else {
          //this.dealStatuses[i].selected = false
        }
      }
      //this.modalCtrl.dismiss({ "data": this.referralRequest })
    } else {
      this.modalCtrl.dismiss()
      let profileModal = await this.modalCtrl.create({
        component: PopupConfirmationAlertComponent,
        componentProps: { text: Constants.areYouSureToChangeStatus },
        cssClass: 'popupConfirmationAlert singleLineHeight' 
      })
      profileModal.present()
      const {data} = await profileModal.onDidDismiss()
      if (data == 'ok') {
        this.storage.get('userInfo').then(async (val) => {
          this.userId = val.userId
          let request = new ChangeStatusRequest()
          request.leadId = this.deal.referralId
          request.statusId = id
          request.updatedBy = this.userId

          let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
          loading.present()
          console.log('request', JSON.stringify(request))
          this.referralProvider
            .updateDealStatus(JSON.stringify(request))
            .subscribe(
              (res: any) => {
                if (loading) loading.dismiss()
                if (res.status == 200) {
                  Utility.showToast(
                    this.toast,
                    Constants.dealUpdatedSuccessfully,
                    false,
                    '',
                    false
                  )
                  // this.fcm.onNotification().subscribe(data => {
                  //
                  //   this.localNotifications.getAll().then(res=>{
                  //     console.log("get notification id", res)
                  //   })
                  //   this.localNotifications.schedule(
                  //     {
                  //       id: 1,
                  //      title: data.title,
                  //      text: data.body,
                  //     foreground: true
                  // })
                  // })

                  this.events.publish('getReferrals')
                }
              },
              (err) => {
                if (loading) loading.dismiss()
                Utility.showToast(
                  this.toast,
                  Constants.someErrorOccurred,
                  false,
                  '',
                  false
                )
                this.url =
                  Urls.baseUrl + Urls.port + Constants.updateDealStatus
                this.stackTrace = err.stack
                this.message = err.message
                this.method = 'setDealstatus'
                this.inserErrorApi()
              }
            )
        })
      }
    }
  }

  selectDeselectCategory(i) {
    if (this.catList[i].selected == true) {
      this.catList[i].selected = false
    } else {
      this.catList[i].selected = true
    }
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'ModalRefSortFilterComponent'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
