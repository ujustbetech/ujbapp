import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'
import { BusinessListing4Page } from '../business-listing4/business-listing4'
import { BusinessListing6Page } from '../business-listing6/business-listing6'
import { Validators, FormBuilder, FormGroup } from '@angular/forms'
import { CustomValidation } from '../../../Utils/CustomValidator'
import { GetBusinessDetails } from '../../../../app/models/getBusinessDetails_info'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'
import { ErrorPage } from '../../common/error/error'
import { BusinessListingService } from '../../../services/business-listing.service'
/**
 * Generated class for the BusinessListing5Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-listing5',
  templateUrl: 'business-listing5.html',
  styleUrls: ['business-listing5.scss']
})
export class BusinessListing5Page {
  businessListForm5: FormGroup
  checkValidation: boolean = false

  businessId: any
  constructor(
    public navCtrl: NavController,
    private fb: FormBuilder,
    public loadingCtrl: LoadingController,
    public businessListService: BusinessListingService,
    private storage: Storage
  ) {
    this.businessListForm5 = this.fb.group(
      {
        email: [null, Validators.required],
      },
      {
        validator: Validators.compose([CustomValidation.isEmailValid]),
      }
    )
    this.storage.get('userInfo').then((val) => {
      this.businessId = val.businessId
    })
  }

  goToBusinessListing4() {
    this.navCtrl.pop()
  }
  async goToBusinessListing6() {
    ////
    this.checkValidation = true
    if (this.businessListForm5.valid) {
      let getBusinessDetails = new GetBusinessDetails()
      getBusinessDetails.businessId = this.businessId
      getBusinessDetails.type = 'Email'
      getBusinessDetails.value = this.businessListForm5.value.email
      let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      loading.present()
      this.businessListService.getBusinessDetails(getBusinessDetails).subscribe(
        async (data) => {
          console.log('res in ts', data)
          if (loading) loading.dismiss()
          if (data != null) {
            if (data.status == 200) {
              // this.navCtrl.push(BusinessListing6Page)
              await this.navCtrl.navigateForward('BusinessListing6Page')
            }
          }
        },
        async (err) => {
          if (loading) loading.dismiss()
          // this.navCtrl.push(ErrorPage)
          await this.navCtrl.navigateForward('ErrorPage')
        }
      )
    }
  }

  async skip() {
    // this.navCtrl.push(BusinessListing6Page)
    await this.navCtrl.navigateForward('BusinessListing6Page')

  }
}
