/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/07/12        Dakshata Patil
 */

import { FormBuilder, FormGroup } from '@angular/forms'
import {  NavController, ToastController } from '@ionic/angular'

import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { DashboardPage } from '../../dashboard/dashboard'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { KYCGst } from '../../../../app/models/KYCDocs'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { UploadCompanyLogoInfo } from '../../../../app/models/companyLogo_info'
import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { KycService } from '../../../services/kyc.service'

/**
 * Generated class for the BusinessKycGstPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-kyc-gst',
  templateUrl: 'business-kyc-gst.html',
  styleUrls: ['business-kyc-gst.scss']
})
export class BusinessKycGstPage {
  businessKYCgst: FormGroup
  gstData: KYCGst = new KYCGst()
  checkValidation: boolean = false
  loading
  isLengthValid: boolean = false
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  userId
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public logErrorService: InserErrorLogService,
    private fb: FormBuilder,
    private provider: KycService,
    public toastCtrl: ToastController,
    private storage: Storage
  ) {
    this.businessKYCgst = this.fb.group({
      gstNo: [null, ''],
    })

    this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
    this.storage.get('userInfo').then((val) => {
      this.gstData.businessId = val.businessId
      this.userId = val.userId
    })
  }

  /**
   * closes current page
   */
  goBack() {
    this.navCtrl.pop()
  }

  /**
   * save GST Data
   */
  async submitGST() {
    this.checkValidation = true
    this.gstData.value = this.businessKYCgst.value.gstNo
    //this.gstData.businessId = "5d84ee999a7d6616fc9b4bee"
    this.gstData.type = 'GST'

    if (
      (this.gstData.value != '' ||
        this.gstData.value != null ||
        this.gstData.value != undefined) &&
      this.isLengthValid
    ) {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.loading.present()
      this.provider.submitGst(this.gstData).subscribe(
        async (res: any) => {
          if (this.loading) this.loading.dismiss()
          Utility.showToast(
            this.toastCtrl,
            Constants.gstUpload,
            false,
            '',
            false
          )
          Utility.companyLogoDetails = new UploadCompanyLogoInfo()
          await this.navCtrl.navigateRoot('DashboardPage')
        },
        (err) => {
          if (this.loading) this.loading.dismiss()
          Utility.showToast(this.toastCtrl, err, false, '', false)
          this.url = Urls.baseUrl + Urls.port + Constants.kycGST
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'submitGST'
          this.inserErrorApi()
        }
      )
    } else {
      Utility.companyLogoDetails = new UploadCompanyLogoInfo()
      await this.navCtrl.navigateRoot('DashboardPage')
    }
  }

  /**
   * takes user to Dashboard
   */
  async goToDashboard() {
    Utility.companyLogoDetails = new UploadCompanyLogoInfo()
    await this.navCtrl.navigateRoot('DashboardPage')
  }

  /**
   * validates GST length
   * @param event event to get value
   */
  validate(event) {
    if (event.target.value != null || event.target.value != undefined) {
      if (event.target.value.length == 15) {
        this.isLengthValid = true
      } else if (event.target.value.length == 0) {
        this.isLengthValid = true
      } else {
        this.isLengthValid = false
      }
    } else {
      this.isLengthValid = false
    }
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error =
      this.stackTrace + ' ' + ' entered Gst' + this.gstData.value
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'BusinessKycGstPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
