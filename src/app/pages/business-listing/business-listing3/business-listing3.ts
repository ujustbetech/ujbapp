/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Api integration:        2019/07/01        Yogesh Chavan
 */

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {  NavController, ToastController } from '@ionic/angular'

import { BusinessListing10Page } from '../business-listing10/business-listing10'
import { BusinessListing1Page } from '../business-listing1/business-listing1'
import { BusinessListing2Page } from '../business-listing2/business-listing2'
import { BusinessListing4Page } from '../business-listing4/business-listing4'
import { CategoryInfo } from '../../../../app/models/CategoryInfo'
import { ClientPartnerInfo } from '../../../../app/models/ClientPartnerInfo'
import { ClientPartnerPage } from '../../profile/client-partner/client-partner'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { ErrorPage } from './../../common/error/error'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { UserData } from '../../../../app/models/userData'
import { Utility } from './../../../Utils/Utility'
import { BusinessDetailsService } from '../../../services/business-details.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { ActivatedRoute } from '@angular/router'

// import { Storage } from '@ionic/storage';

/**
 * Generated class for the BusinessListing3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-listing3',
  templateUrl: 'business-listing3.html',
  styleUrls: ['business-listing3.scss']
})
export class BusinessListing3Page {
  loading
  businessList: FormGroup
  checkValidation: boolean = false

  categoryData: CategoryInfo = new CategoryInfo()
  businessData: CategoryInfo = new CategoryInfo()
  editMode
  isEdit: boolean = false
  hideNext: boolean = true
  companyTagline
  hidePrevious: boolean = true
  businessId
  catInfo
  userRole
  userData: UserData
  userTypeId
  userType
  stackTrace
  message
  companyTagline1
  hideSkipForLater: boolean = true
  logError: InsertErrorLog = new InsertErrorLog()
  constructor(
    private storage: Storage,
    public navCtrl: NavController,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private provider: BusinessDetailsService,
    public logErrorService: InserErrorLogService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    route.queryParams.subscribe((params: any) => {
      this.userData = new UserData()
      this.businessList = this.fb.group({
        tagline: [null, ''],
      })
  
      this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
      this.categoryData = params.data
  
      console.log('catdata', this.categoryData)
  
      this.storage.get('userInfo').then((val) => {
        this.userData = val
        this.businessData.userId = this.userData.userId
        this.businessId = this.userData.businessId
      })
  
      this.editMode = params.edit
  
      if (this.editMode == 'editTagline') {
        this.businessData.nameOfPartner = params.nameOfPartner
        this.businessData.categories = params.catId
        this.companyTagline = params.companyTagline
        this.companyTagline1 = params.companyTagline
        this.userTypeId = params.userTypeId
        this.userType = params.userType
        this.businessData.CompanyName = params.companyName
        this.hideNext = false
        this.hidePrevious = false
        this.isEdit = true
        this.hideSkipForLater = false
      }
      
    })
  }

  goToBack() {
    this.navCtrl.pop()
  }
  // submitTitle() {
  //
  //   /*********** Old Code*/
  //   this.checkValidation = true;
  //   if (this.editMode == "editTagline") {
  //
  //     this.businessData.tagline = this.businessList.value.tagline
  //     this.businessData.businessId = this.businessId;
  //     this.businessData.userId = this.businessData.userId;
  //     this.businessData.categories = this.catInfo

  //     if (this.businessList.valid) {
  //       this.provider.submitCategories(this.businessData).subscribe(res => {

  //         this.userData.userRole=Constants.clientPartner
  //         this.userData.businessId=res.json.data

  //          this.storage.set('userInfo',this.userData).then((val)=>{
  //           Utility.showToast(this.toastCtrl, Constants.yourDataUpdatedSuccessfully,false, "",false)
  //           this.navCtrl.pop();
  //          })

  //       }, err => {
  //         console.log("err", err)
  //       })
  //     }
  //   }
  //   else {

  //     /********* */
  //     this.businessData.tagline = this.businessList.value.tagline
  //     this.businessData.categories = this.categoryData.categories;
  //     this.businessData.userId = this.categoryData.userId;
  //     this.businessData.businessId = this.categoryData.businessId;

  //     if (this.businessList.valid) {
  //       this.loading.present();
  //       this.provider.submitCategories(this.businessData).subscribe(res => {

  //        if (this.loading)
  //        this.loading.dismiss()

  //        this.userData.userRole=Constants.clientPartner
  //        this.userData.businessId=res.json.data

  //         this.storage.set('userInfo',this.userData).then((val)=>{
  //           // this.navCtrl.push(BusinessListing2Page);
  //         })

  //         //Utility.showToast(this.toastCtrl, Constants.businessCategoriesUpdated, false, '')

  //       }, err => {
  //         if (this.loading)
  //           this.loading.dismiss()
  //         Utility.showToast(this.toastCtrl, err, false, '',false)
  //         //// this.navCtrl.push(ErrorPage);
  //       })
  //       // // this.navCtrl.push(BusinessListing2Page)
  //     }
  //   }
  // }

  // skip(){
  //   // this.navCtrl.push(BusinessListing4Page);
  // }
  async submitTitle() {
    /*********** Old Code*/
    this.checkValidation = true
    if (this.editMode == 'editTagline') {
      this.businessData.tagline = this.businessList.value.tagline
      this.businessData.businessId = this.businessId
      this.businessData.userId = this.businessData.userId
      //this.businessData.categories = this.catInfo
      this.businessData.UserType = this.userTypeId
      if (this.businessList.valid) {
        this.provider.submitCategories(this.businessData).subscribe(
          (res: any) => {
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
      if (this.businessList.valid) {
        BusinessListing10Page.businessListingObj.tagline = this.companyTagline
        // this.navCtrl.push(BusinessListing1Page)
        await this.navCtrl.navigateForward('BusinessListing1Page')
      }
    }
  }
  insertLoggingApi() {
    let Input = {
      userId: this.userData.userId,
      businessId: BusinessListing10Page.businessListingObj.businessId,
      CompanyName: BusinessListing10Page.businessListingObj.CompanyName,
      categories: BusinessListing10Page.businessListingObj.categories,
      tagline: BusinessListing10Page.businessListingObj.tagline,
      UserType: BusinessListing10Page.businessListingObj.UserType,
      NameofPartner: BusinessListing10Page.businessListingObj.NameofPartner,
      'TagLine before edit': this.companyTagline1,
      'TagLine After edit': this.companyTagline,
    }
    this.logError.Url = Urls.baseUrl + Urls.port + Constants.updateBusiness
    this.logError.UserId = this.userData.userId
    this.logError.createdBy = this.userData.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error =
      'input by user' + JSON.stringify(Input) + ' ' + this.stackTrace
    this.logError.message = this.message
    this.logError.method = 'submitTitle'
    this.logError.screen = 'BusinessListing3Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)
    this.logErrorService.insertLogError(this.logError)
  }
}
