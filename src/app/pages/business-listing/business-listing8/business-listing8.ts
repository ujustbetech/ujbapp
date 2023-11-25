import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {  NavController, ToastController } from '@ionic/angular'

import { BusinessListing7Page } from '../business-listing7/business-listing7'
import { BusinessListing9Page } from '../business-listing9/business-listing9'
import { ClientPartnerPage } from '../../profile/client-partner/client-partner'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { ErrorPage } from '../../common/error/error'
import { GetBusinessDetails } from '../../../../app/models/getBusinessDetails_info'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { BusinessListingService } from '../../../services/business-listing.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the BusinessListing8Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-listing8',
  templateUrl: 'business-listing8.html',
  styleUrls: ['business-listing8.scss']
})
export class BusinessListing8Page {
  businessId: any
  websiteUrl: any
  editMode
  hideSkipForLater: boolean = true
  hideNext: boolean = true
  hidePrevious: boolean = true
  isEdit: boolean = false
  businessList8Form
  stackTrace
  message
  userId
  logError: InsertErrorLog = new InsertErrorLog()
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public businessListService: BusinessListingService,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private toastCtrl: ToastController,
    public logErrorService: InserErrorLogService
  ) {
    route.queryParams.subscribe((params: any) => {
      this.storage.get('userInfo').then((val) => {
        this.businessId = val.businessId
        this.userId = val.userId
      })
  
      this.businessList8Form = this.fb.group({
        websiteUrl: [
          null,
          Validators.pattern(
            '(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'
          ),
        ],
      })
      this.editMode = params.edit
  
      if (this.editMode == 'editUrl') {
        this.websiteUrl = params.companyUrl
        this.hideSkipForLater = false
        this.hideNext = false
        this.hidePrevious = false
        this.isEdit = true
      }
    })
  }

  goToBusinessListing7() {
    this.navCtrl.pop()
  }
  async goToBusinessListing9() {
    if (
      this.websiteUrl == '' ||
      this.websiteUrl == null ||
      this.websiteUrl == undefined
    ) {
      if (this.editMode == 'editUrl') {
        let getBusinessDetails = new GetBusinessDetails()
        getBusinessDetails.businessId = this.businessId
        getBusinessDetails.type = 'URL'
        getBusinessDetails.value = this.websiteUrl
        let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
        loading.present()
        this.businessListService
          .getBusinessDetails(getBusinessDetails)
          .subscribe(
            (data) => {
              console.log('res in ts', data)
              loading.dismiss()
              if (data != null) {
                if (data.status == 200) {
                  this.navCtrl.pop()
                }
              }
            },
            async (err) => {
              loading.dismiss()
              this.stackTrace = err.stack
              this.message = err.message
              this.insertLoggingApi()
              // this.navCtrl.push(ErrorPage)
              await this.navCtrl.navigateForward('ErrorPage')
            }
          )
      } else {
        // this.navCtrl.push(BusinessListing9Page)
        await this.navCtrl.navigateForward('BusinessListing9Page')
      }
    } else {
      if (this.businessList8Form.valid) {
        let getBusinessDetails = new GetBusinessDetails()
        getBusinessDetails.businessId = this.businessId
        getBusinessDetails.type = 'URL'
        getBusinessDetails.value = this.websiteUrl
        let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
        loading.present()
        this.businessListService
          .getBusinessDetails(getBusinessDetails)
          .subscribe(
            async (data) => {
              console.log('res in ts', data)
              loading.dismiss()
              if (data != null) {
                if (data.status == 200) {
                  if (this.editMode == 'editUrl') {
                    Utility.showToast(
                      this.toastCtrl,
                      Constants.yourDataUpdatedSuccessfully,
                      false,
                      '',
                      false
                    )
                    this.navCtrl.pop()
                  } else {
                    // this.navCtrl.push(BusinessListing9Page)
                    await this.navCtrl.navigateForward('BusinessListing9Page')
                  }
                }
              }
            },
            async (err) => {
              loading.dismiss()
              if (this.editMode == 'editUrl') {
                this.stackTrace = err.stack
                this.message = err.message
                this.insertLoggingApi()
              }

              // this.navCtrl.push(ErrorPage)
              await this.navCtrl.navigateForward('ErrorPage')
            }
          )
      }
    }
  }
  insertLoggingApi() {
    let Input = {
      'URl befor edit': this.websiteUrl,
      'Url after edit': this.businessList8Form.value.websiteUrl,
    }
    this.logError.Url = Urls.baseUrl + Urls.port + Constants.getBusinessDetails
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error =
      'input by user' + JSON.stringify(Input) + ' ' + this.stackTrace
    this.logError.message = this.message
    this.logError.method = 'goToBusinessListing9'
    this.logError.screen = 'BusinessListing8Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)
    this.logErrorService.insertLogError(this.logError)
  }
}
