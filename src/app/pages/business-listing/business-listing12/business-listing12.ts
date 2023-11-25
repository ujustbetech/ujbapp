import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {  NavController, ToastController } from '@ionic/angular'

import { BusinessListing10Page } from '../business-listing10/business-listing10'
import { BusinessListing2Page } from '../business-listing2/business-listing2'
import { CategoryInfo } from '../../../../app/models/CategoryInfo'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { BusinessDetailsService } from '../../../services/business-details.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the BusinessListing12Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-listing12',
  templateUrl: 'business-listing12.html',
  styleUrls:['business-listing12.scss']
})
export class BusinessListing12Page implements OnInit {
  businessList12Form: FormGroup
  businessData: CategoryInfo = new CategoryInfo()
  companyName
  editMode
  userTypeId
  userType
  hideNext: boolean = true
  hidePrevious: boolean = true
  isEdit: boolean = false
  userId
  businessId
  stackTrace
  message
  nameOfDesignatedPartner: any
  logError: InsertErrorLog = new InsertErrorLog()
  checkValidation: boolean = false
  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private storage: Storage,
    private provider: BusinessDetailsService,
    public logErrorService: InserErrorLogService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    route.queryParams.subscribe((params: any) => {
      this.businessList12Form = this.fb.group({
        nameOfDesignatedPartner: [null, Validators.required],
      })
      this.storage.get('userInfo').then((val) => {
        this.userId = val.userId
        this.businessId = val.businessId
        //this.businessId = "5d7bc75e272a811dd0d00287"
      })
      this.editMode = params.edit
  
      if (this.editMode == 'editNameOfPartner') {
        this.nameOfDesignatedPartner = params.nameOfPartner
        this.businessData.categories = params.catId
        this.businessData.tagline = params.companyTagline
        this.businessData.CompanyName = params.companyName
        this.userTypeId = params.userTypeId
        this.userType = params.userType
  
        this.hideNext = false
        this.hidePrevious = false
        this.isEdit = true
      }
      this.nameOfDesignatedPartner = params.nameOfPartner
      
    })
  }

  ngOnInit() {
    console.log('ngOnInit BusinessListing12Page')
  }
  goToPreviousBusiness() {
    this.navCtrl.pop()
  }
  async goToNextBusiness() {
    this.checkValidation = true
    if (this.editMode == 'editNameOfPartner') {
      if (this.businessList12Form.valid) {
        this.businessData.userId = this.userId
        this.businessData.businessId = this.businessId
        this.businessData.UserType = this.userTypeId
        this.businessData.nameOfPartner = this.nameOfDesignatedPartner
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
            if (this.editMode == 'editNameOfPartner') {
              this.stackTrace = err.stack
              this.message = err.message
              this.insertLoggingApi()
            }
          }
        )
      }
    } else {
      if (this.businessList12Form.valid) {
        BusinessListing10Page.businessListingObj.NameofPartner =
          this.nameOfDesignatedPartner
        console.log('name of Partner', BusinessListing10Page.businessListingObj)
        // this.navCtrl.push(BusinessListing2Page)
        await this.navCtrl.navigateForward('BusinessListing2Page')

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
      'Partner name before edit': this.nameOfDesignatedPartner,
      'Partner name After edit': this.nameOfDesignatedPartner,
    }
    this.logError.Url = Urls.baseUrl + Urls.port + Constants.updateBusiness
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error =
      'input by user' + JSON.stringify(Input) + ' ' + this.stackTrace
    this.logError.message = this.message
    this.logError.method = 'goToNextBusiness'
    this.logError.screen = 'BusinessListing12Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)
    this.logErrorService.insertLogError(this.logError)
  }
}
