/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/08/09        Dakshata Patil
 */

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {  NavController, ToastController } from '@ionic/angular'

import { BusinessListing10Page } from '../business-listing10/business-listing10'
import { BusinessListing1Page } from '../business-listing1/business-listing1'
import { BusinessListing3Page } from '../business-listing3/business-listing3'
import { BusinessListing4Page } from '../business-listing4/business-listing4'
import { CategoryInfo } from '../../../../app/models/CategoryInfo'
import { ClientPartnerPage } from '../../profile/client-partner/client-partner'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { GetBusinessDetails } from '../../../../app/models/getBusinessDetails_info'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { BusinessDetailsService } from '../../../services/business-details.service'
import { BusinessListingService } from '../../../services/business-listing.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the BusinessListing2Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-listing2',
  templateUrl: 'business-listing2.html',
  styleUrls: ['business-listing2.scss']
})
export class BusinessListing2Page {
  userFirstName
  businessId: any
  companyName: any
  editMode
  businessData: CategoryInfo = new CategoryInfo()
  businessList2Form: FormGroup
  hideSkipForLater: boolean = true
  hideNext: boolean = true
  hidePrevious: boolean = true
  isEdit: boolean = false
  userTypeId
  userType
  hideOptional
  inputVal
  userId
  nameOfPartner
  message
  stackTrace
  method
  logError: InsertErrorLog = new InsertErrorLog()
  checkValidation: boolean = false
  constructor(
    private storage: Storage,
    public navCtrl: NavController,
    private provider: BusinessDetailsService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public loadingCtrl: LoadingController,
    public logErrorService: InserErrorLogService,
    public businessListService: BusinessListingService,
    public toastCtrl: ToastController
  ) {
    route.queryParams.subscribe((params: any) => {
      this.businessList2Form = this.fb.group({
        companyName: [null, Validators.required],
      })
      this.storage.get('userInfo').then((val) => {
        this.userId = val.userId
        this.businessId = val.businessId
        //this.businessId = "5d7bc75e272a811dd0d00287"
      })
      this.editMode = params.edit
  
      if (this.editMode == 'editName') {
        this.businessData.nameOfPartner = params.nameOfPartner
        this.companyName = params.companyName
        this.businessData.categories = params.catId
        this.businessData.tagline = params.companyTagline
        this.businessData.CompanyName = params.CompanyName
        this.userTypeId = params.userTypeId
        this.userType = params.userType
        this.hideSkipForLater = false
        this.hideNext = false
        this.hidePrevious = false
        this.isEdit = true
        if (this.userTypeId == 1) {
          this.hideOptional = 'view'
        } else {
          this.hideOptional = 'hide'
        }
      }
  
      if (this.editMode == 'editName') {
        this.businessData.nameOfPartner = params.nameOfPartner
        this.companyName = params.companyName
        this.businessData.categories = params.catId
        this.businessData.tagline = params.companyTagline
        this.businessData.CompanyName = params.CompanyName
        this.userTypeId = params.userTypeId
        this.userType = params.userType
        this.hideSkipForLater = false
        this.hideNext = false
        this.hidePrevious = false
        this.isEdit = true
        if (this.userTypeId == 1) {
          this.hideOptional = 'view'
        } else {
          this.hideOptional = 'hide'
        }
      }
  
      this.inputVal = params.inputVal
      if (this.inputVal == 'Freelancer') {
        this.hideSkipForLater = true
        this.hideOptional = 'view'
      } else {
        this.hideSkipForLater = false
        this.hideOptional = 'hide'
      }
      
    })
  }

  goToBusinessListing1() {
    this.navCtrl.pop()
  }

  async goToBusinessListing3() {
    this.checkValidation = true

    if (this.editMode == 'editName') {
      if (this.userType == 'Individual/Proprietor') {
        this.businessList2Form.removeControl('companyName')
        if (this.businessList2Form.valid) {
          this.businessData.userId = this.userId
          this.businessData.businessId = this.businessId
          this.businessData.UserType = this.userTypeId
          this.businessData.CompanyName = this.companyName
          this.provider.submitCategories(this.businessData).subscribe(
            (res: any) => {
              Utility.showToast(
                this.toastCtrl,
                Constants.yourDataUpdatedSuccessfully,
                false,
                '',
                false
              )

              this.navCtrl.pop()
            },
            (err) => {
              this.stackTrace = err.stack
              this.message = err.message
              this.insertLoggingApi()
            }
          )
        }
      } else {
        if (this.businessList2Form.valid) {
          this.businessData.userId = this.userId
          this.businessData.businessId = this.businessId
          this.businessData.UserType = this.userTypeId
          this.businessData.CompanyName = this.companyName
          this.provider.submitCategories(this.businessData).subscribe(
            (res: any) => {
              Utility.showToast(
                this.toastCtrl,
                Constants.yourDataUpdatedSuccessfully,
                false,
                '',
                false
              )
              this.navCtrl.pop()
            },
            (err) => {
              this.stackTrace = err.stack
              this.message = err.message
              this.insertLoggingApi()
            }
          )
        }
      }
    } else {
      if (this.inputVal == 'Freelancer') {
        this.businessList2Form.removeControl('companyName')
        if (this.businessList2Form.valid) {
          if (
            this.companyName == '' ||
            this.companyName == undefined ||
            this.companyName == null
          ) {
            BusinessListing10Page.businessListingObj.CompanyName = ''
          } else {
            BusinessListing10Page.businessListingObj.CompanyName =
              this.companyName
          }

          console.log(
            'companyName',
            BusinessListing10Page.businessListingObj.CompanyName
          )
          // this.navCtrl.push(BusinessListing3Page)
          await this.navCtrl.navigateForward('BusinessListing3Page')

        }
      } else {
        if (this.businessList2Form.valid) {
          BusinessListing10Page.businessListingObj.CompanyName =
            this.companyName
          console.log(
            'companyName',
            BusinessListing10Page.businessListingObj.CompanyName
          )
          // this.navCtrl.push(BusinessListing3Page)
          await this.navCtrl.navigateForward('BusinessListing3Page')
        }
      }
    }
  }
  insertLoggingApi() {
    let Input = {
      userId: this.userId,
      businessId: BusinessListing10Page.businessListingObj.businessId,
      CompanyName: BusinessListing10Page.businessListingObj.CompanyName,
      categories: BusinessListing10Page.businessListingObj.categories,
      tagline: BusinessListing10Page.businessListingObj.tagline,
      UserType: BusinessListing10Page.businessListingObj.UserType,
      NameofPartner: BusinessListing10Page.businessListingObj.NameofPartner,
      'company name before edit': this.businessData.CompanyName,
      'company name After edit': this.companyName,
    }
    this.logError.Url = Urls.baseUrl + Urls.port + Constants.updateBusiness
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error =
      'input by user' + JSON.stringify(Input) + ' ' + this.stackTrace
    this.logError.message = this.message
    this.logError.method = 'goToBusinessListing3'
    this.logError.screen = 'BusinessListing2Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)
    this.logErrorService.insertLogError(this.logError)
  }
}
