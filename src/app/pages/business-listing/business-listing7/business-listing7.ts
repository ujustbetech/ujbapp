import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {  NavController, ToastController } from '@ionic/angular'

import { BusinessListing6Page } from '../business-listing6/business-listing6'
import { BusinessListing8Page } from '../business-listing8/business-listing8'
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
 * Generated class for the BusinessListing7Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-listing7',
  templateUrl: 'business-listing7.html',
  styleUrls: ['business-listing7.scss']
})
export class BusinessListing7Page {
  businessListForm7: FormGroup
  checkValidation: boolean = false
  editMode
  businessId: any
  description
  hideSkipForLater: boolean = true
  hideNext: boolean = true
  hidePrevious: boolean = true
  isEdit: boolean = false
  userId
  stackTrace
  message
  logError: InsertErrorLog = new InsertErrorLog()
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public businessListService: BusinessListingService,
    private toastCtrl: ToastController,
    public logErrorService: InserErrorLogService,
    private storage: Storage,
    public loadingCtrl: LoadingController
  ) {
    route.queryParams.subscribe((params: any) => {
      this.editMode = params.edit
  
      if (this.editMode == 'editDescription') {
        this.description = params.companyDescription
        this.hideSkipForLater = false
        this.hideNext = false
        this.hidePrevious = false
        this.isEdit = true
      }
      this.businessListForm7 = this.fb.group({
        description: [null, Validators.required],
      })
      this.storage.get('userInfo').then((val) => {
        this.businessId = val.businessId
        this.userId = val.userId
      })

    })
  }

  goToBusinessListing6() {
    this.navCtrl.pop()
  }
  async goToBusinessListing8() {
    ////
    this.checkValidation = true
    if (this.businessListForm7.valid) {
      let getBusinessDetails = new GetBusinessDetails()
      getBusinessDetails.businessId = this.businessId
      getBusinessDetails.type = 'Description'
      getBusinessDetails.value = this.businessListForm7.value.description
      let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      loading.present()
      this.businessListService.getBusinessDetails(getBusinessDetails).subscribe(
        async (data) => {
          console.log('res in ts', data)
          if (loading) loading.dismiss()
          if (data != null) {
            if (data.status == 200) {
              if (this.editMode == 'editDescription') {
                Utility.showToast(
                  this.toastCtrl,
                  Constants.yourDataUpdatedSuccessfully,
                  false,
                  '',
                  false
                )
                this.navCtrl.pop()
              } else {
                // this.navCtrl.push(BusinessListing8Page)
                await this.navCtrl.navigateForward('BusinessListing8Page')
              }
            }
          }
        },
        async (err) => {
          if (loading) loading.dismiss()
          if (this.editMode == 'editDescription') {
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
  async skip() {
    // this.navCtrl.push(BusinessListing8Page)
    await this.navCtrl.navigateForward('BusinessListing8Page')
    
  }
  insertLoggingApi() {
    let Input = {
      'description befor edit': this.description,
      'description after edit': this.businessListForm7.value.description,
    }
    this.logError.Url = Urls.baseUrl + Urls.port + Constants.getBusinessDetails
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error =
      'input by user' + JSON.stringify(Input) + ' ' + this.stackTrace
    this.logError.message = this.message
    this.logError.method = 'goToBusinessListing7'
    this.logError.screen = 'BusinessListing7Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)
    this.logErrorService.insertLogError(this.logError)
  }
}
