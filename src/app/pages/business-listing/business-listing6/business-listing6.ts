import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular'
import {
  NativeGeocoder,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx'

import { BusinessAddressInfo } from '../../../../app/models/businessAddressInfo'
import { BusinessListing5Page } from '../business-listing5/business-listing5'
import { BusinessListing7Page } from '../business-listing7/business-listing7'
import { ClientPartnerPage } from '../../profile/client-partner/client-partner'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { ErrorPage } from '../../common/error/error'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { PopupConfirmationAlertComponent } from '../../../../app/components/popups/popup-confirmation-alert/popup-confirmation-alert'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { BusinessListingService } from '../../../services/business-listing.service'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the BusinessListing6Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-listing6',
  templateUrl: 'business-listing6.html',
  styleUrls: ['business-listing6.scss']
})
export class BusinessListing6Page {
  businessList6Form: FormGroup
  checkValidation: boolean = false
  userLocation: any
  userPostal: any
  userStateName: any
  userSubLoc: any
  userLocality: any
  businessId: any
  editMode: any
  companyAddress
  hideSkipForLater: boolean = true
  hideNext: boolean = true
  hidePrevious: boolean = true
  isEdit: boolean = false
  public pushNow = false
  userFlat_Wing
  scrollBlock
  userId
  disableSave = 'view'
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public logErrorService: InserErrorLogService,
    public businessListService: BusinessListingService,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    public commonUtilsProvider: CommonUtilsService,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private platform: Platform
  ) {
    route.queryParams.subscribe((params: any) => {
      this.businessList6Form = this.fb.group({
        location: [null, Validators.required],
        flat: [null, Validators.required],
        locality: [null, Validators.required],
      })
  
      this.editMode = params.edit
  
      console.log('add', this.companyAddress)
      if (this.editMode == 'editAddress') {
        this.companyAddress = params.companyAddress
        this.userLocation = this.companyAddress.location
        this.userFlat_Wing = this.companyAddress.Flat_Wing
        this.userLocality = this.companyAddress.Locality
        this.hideSkipForLater = false
        this.hideNext = false
        this.hidePrevious = false
        this.isEdit = true
      }
      this.storage.get('userInfo').then((val) => {
        this.businessId = val.businessId
        this.userId = val.userId
      })
    })
  }
  ionViewWillEnter() {
    ////
    if (this.editMode != 'editAddress') {
      if (
        this.userLocation == ' ' ||
        this.userLocation == undefined ||
        this.userLocation == null
      ) {
        this.getUserLocation()
      }
    }
  }

  goToBusinessListing5() {
    this.navCtrl.pop()
  }

  async goToBusinessListing7() {
    let businessAddress = new BusinessAddressInfo()
    businessAddress.businessId = this.businessId

    businessAddress.location = this.businessList6Form.value.location
    businessAddress.flatWing = this.businessList6Form.value.flat
    businessAddress.locality = this.businessList6Form.value.locality
    console.log('req in ts', businessAddress)
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.businessListService.getBusinessAddress(businessAddress).subscribe(
      async (data) => {
        if (loading) loading.dismiss()
        console.log('res in ts', data)
        if (data != null) {
          if (data.status == 200) {
            if (this.editMode == 'editAddress') {
              Utility.showToast(
                this.toastCtrl,
                Constants.yourDataUpdatedSuccessfully,
                false,
                '',
                false
              )
              this.navCtrl.pop()
            } else {
              // this.navCtrl.push(BusinessListing7Page)
              await this.navCtrl.navigateForward('BusinessListing7Page')
            }
          }
        }
      },
      async (err) => {
        if (loading) loading.dismiss()
        if (this.editMode == 'editAddress') {
          this.stackTrace = err.stack
          this.message = err.message
          this.insertLoggingApi()
        }

        // this.navCtrl.push(ErrorPage)
        await this.navCtrl.navigateForward('ErrorPage')
      }
    )
  }

  async getUserLocation() {
    ////
    let loading = await this.loadingCtrl.create({
      message: 'Getting your location...',
      duration: 3500,
    })
    loading.present()

    this.commonUtilsProvider
      .getLocation(this.geolocation, this.nativeGeocoder, true)
      .subscribe(
        (res: any) => {
          loading.dismiss()
          this.userLocation = res
          console.log('user location', this.userLocation)
        },
        (err) => {
          loading.dismiss()
          this.userLocation = ''
        }
      )
  }

  async skip() {
    // this.navCtrl.push(BusinessListing7Page)
    await this.navCtrl.navigateForward('BusinessListing7Page')
  }

  // Push On Focus
  scrollTo(ht: any) {
    this.pushNow = true
  }

  removeSroll() {
    this.pushNow = false
  }

  async showVerifyDialog() {
    this.checkValidation = true
    if (this.businessList6Form.valid) {
      let profileModal = await this.modalCtrl.create({
        component:PopupConfirmationAlertComponent,
        componentProps: {
          title: 'Confirm',
          text: 'Have you verified your address as it will be appearing on the agreement?',
          cancelText: 'No',
          okText: 'Yes',
        },
        cssClass: 'popupConfirmationAlert threeLineHeight' 
      })
      profileModal.present()
      if (this.platform.is('ios')) {
        console.log('in ios platform popup opened')
        this.scrollBlock = true
      }
      const {data} = await profileModal.onDidDismiss()
      this.scrollBlock = false
      if (data == 'ok') {
        this.goToBusinessListing7()
      } else {
        this.disableSave = ''
      }
    }
  }
  insertLoggingApi() {
    let Input = {
      'address before edit': this.companyAddress,
      'address after edit': '',
      userLocation: this.userLocation,
      userFlat_Wing: this.userFlat_Wing,
      userLocality: this.userLocality,
    }
    this.logError.Url = Urls.baseUrl + Urls.port + Constants.getBusinessAddress
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error =
      'input by user' + JSON.stringify(Input) + ' ' + this.stackTrace
    this.logError.message = this.message
    this.logError.method = 'goToBusinessListing7'
    this.logError.screen = 'BusinessListing6Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)
    this.logErrorService.insertLogError(this.logError)
  }
}
