/*
 * Revision History:
 *
 *
 *    update location from profile for partner       2019/08/13       Yogesh Chavan
 */

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {
  
  AlertController,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular'
import {
  NativeGeocoder,
  NativeGeocoderOptions,
} from '@ionic-native/native-geocoder/ngx'

import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { GetCountriesRes } from '../../../../app/models/getCountriesRes'
import { GetStateRes } from '../../../../app/models/getStateRes'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx'
import { PopupConfirmationAlertComponent } from '../../../../app/components/popups/popup-confirmation-alert/popup-confirmation-alert'
import { Questionnaire1Page } from '../questionnaire1/questionnaire1'
import { Questionnaire4Page } from '../../questionnaire/questionnaire4/questionnaire4'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { QuestionnaireService } from '../../../services/questionnaire.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the Questionnaire3Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-questionnaire3',
  templateUrl: 'questionnaire3.html',
  styleUrls: ['questionnaire3.scss']
})
export class Questionnaire3Page {
  disableSave
  questionnaire3Form: FormGroup
  pageTitle = 'Enroll as Partner'
  checkValidation: boolean = false
  userlocation: any
  countries: GetCountriesRes[]
  countryCode
  stateList: GetStateRes[]
  //userlocation: any;
  showSave: boolean = false
  //userPostal: any
  //userStateName: any
  //usersubloc: any
  //userlocality: any
  //userFirstName: any
  flat: any
  locality: any
  loading
  userId: any
  hideSearchbar: boolean = false
  searchTerm
  stateId
  countryName
  editLocation
  StateName
  public pushNow = false
  scrollBlock: boolean = false
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  params
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public logErrorService: InserErrorLogService,
    public loadingCtrl: LoadingController,
    public commonUtilsProvider: CommonUtilsService,
    public toastCtrl: ToastController,
    public questionnnaireService: QuestionnaireService,
    private storage: Storage,
    private profileProvider: UserProfileService,
    private locationAccuracy: LocationAccuracy,
    private modalCtrl: ModalController,
    private platform: Platform,
    private alertCtrl: AlertController,
  ) {
    route.queryParams.subscribe((params: any) => {
      this.params = params
      this.countries = new Array<GetCountriesRes>()
      this.stateList = new Array<GetStateRes>()
      this.getCountries()
  
      this.editLocation = params ? params.editLocation : null
  
      this.questionnaire3Form = this.fb.group({
        location: [null, Validators.required],
        flat: [null, Validators.required],
        locality: [null, Validators.required],
        countryName: [null, Validators.required],
        state: [null, Validators.required],
      })
      this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
    })
  }

  /* ngOnInit(){
     let a = document.getElementById('state');
       if (a) a.scrollIntoView({ behavior: "smooth" })
   }  */

  ionViewWillEnter() {
    this.disableSave = ''
    this.scrollBlock = false
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
    })

    if (this.editLocation != 'editLocation') {
      if (
        this.userlocation == null ||
        this.userlocation == undefined ||
        this.userlocation == ''
      ) {
        this.getUserLocation()
        // this.getLocAccuracy()
      }
    } else {
      this.countryCode = this.params.countryCode
      this.locality = this.params.locality
      this.flat = this.params.flatWing
      this.userlocation = this.params.location
      this.countryName = this.params.countryName1
      this.searchTerm = this.params.searchTerm
      this.stateId = this.params.stateId
      this.getState(this.countryCode)
    }

    let referedPage = this.params.referrer
    if (referedPage == 'PartnerPage') {
      this.showSave = true
    }
  }

  goToQ2() {
    this.navCtrl.pop()
  }

  validate(isNextPage: boolean) {
    this.checkValidation = true
    if (this.questionnaire3Form.valid) {
      this.disableSave = 'disabled'
      this.showVerifyDialog(isNextPage)
    } else {
      if (this.questionnaire3Form.get('locality').invalid) {
        let a = document.getElementById('locality')
        if (a) a.scrollIntoView({ behavior: 'smooth' })
      } else if (this.questionnaire3Form.get('country').invalid) {
        let a = document.getElementById('country')
        if (a) a.scrollIntoView({ behavior: 'smooth' })
      } else if (this.questionnaire3Form.get('state').invalid) {
        let a = document.getElementById('state')
        if (a) a.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  async getUserLocation() {
    let loading = await this.loadingCtrl.create({
      message: 'Getting your location...',
      duration: 3500,
    })
    loading.present()

    this.commonUtilsProvider
      .getLocationPromise(this.geolocation, this.nativeGeocoder, false)
      .then((res: any) => {
        if (this.loading) this.loading.dismiss()
          this.userlocation = res
        })
      .catch(async (err) => {
        // alert(`202 - ${JSON.stringify(err)}`)
        if (this.loading) this.loading.dismiss()
        this.userlocation = ''
      })
  }

  getCountryDetails() {
    this.stateList = new Array<GetStateRes>()
    //this.countryCode = data.countryId
    console.log('getCountryDetails', this.countryCode)
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countryCode == this.countries[i].countryId) {
        this.countryName = this.countries[i].countryName
      }
    }

    console.log('getCountryDetails name set', this.countryName)
    this.getState(this.countryCode)
    let a = document.getElementById('state')
    if (a) a.scrollIntoView({ behavior: 'smooth' })
  }

  getCountries() {
    this.questionnnaireService.getCountryApi().subscribe(
      (data) => {
        // console.log("data in question 3 ts", data)
        if (data != null) {
          if (data.status == 200) {
            ////
            let res = data.json.data.countries
            console.log('data in 200 question 3 ts', res)
            for (let i = 0; i <= res.length - 1; i++) {
              let countryDetail = new GetCountriesRes()
              countryDetail._id = res[i]._id
              countryDetail.code = res[i].code
              countryDetail.countryId = res[i].countryId
              countryDetail.countryName = res[i].countryName
              //console.log("obj in question 3 ts", countryDetail)
              this.countries.push(countryDetail)
              //console.log("list in question 3 ts", this.countries)
            }
            for (let i = 0; i < this.countries.length; i++) {
              if (this.countries[i].countryId == 101) {
                this.countries[i].disabled = false
              } else {
                this.countries[i].disabled = true
              }
            }
          }
          // this.countryCode=this.questionnaire3Form.value.countryName
          // console.log("codeind",this.countryCode)
          //this.countryCode = this.countries[0].countryId
          console.log('codeind', this.countryCode)
        }
      },
      (err) => {
        console.log('err', err)
      }
    )
  }
  disableItem() {
    for (let i = 0; i < this.countries.length; i++) {
      if (this.countries[i].countryId == 101) {
        this.countries[i].disabled = false
      } else {
        this.countries[i].disabled = true
      }
    }
  }
  getState(countryCode) {
    //this.stateList = new Array<GetStateRes>()
    // if (this.searchTerm == " " || this.searchTerm == undefined || this.searchTerm == null) {
    //

    //   this.searchTerm = null
    //   this.stateList = new Array<GetStateRes>()
    // }

    this.questionnnaireService.getStateApi(countryCode, null).subscribe(
      (data) => {
        this.stateList = new Array<GetStateRes>()
        //console.log("data in que 3 state", data)
        if (data != null) {
          if (data.status == 200) {
            ////

            let res = data.json.data
            console.log('data states in 200', res)
            for (let i = 0; i <= res.length - 1; i++) {
              let stateDetail = new GetStateRes()
              stateDetail.countryId = res[i].countryId
              stateDetail.id = res[i].id
              stateDetail.stateId = res[i].stateId
              stateDetail.stateName = res[i].stateName
              // console.log("obj in question 3 state ts", stateDetail)
              this.stateList.push(stateDetail)
              this.hideSearchbar = true
              // console.log("list in question 3 state ts", this.stateList)
            }
          }
        }
      },
      (err) => {
        this.stateList = new Array<GetStateRes>()
        this.hideSearchbar = false
      }
    )
  }

  getStateDetails() {
    // this.stateList = new Array<GetStateRes>()
    //this.stateId = data.stateId
    for (let i = 0; i < this.stateList.length; i++) {
      if (this.stateId == this.stateList[i].stateId) {
        this.StateName = this.stateList[i].stateName
      }
    }
    console.log('getStateDetails', this.stateId)
    console.log('getStateDetails name', this.StateName)
  }

  // selectedValue(item) {
  //
  //   console.log("item state", item)
  //   this.searchTerm = item.stateName;
  //   this.stateId = item.stateId
  //   this.hideSearchbar = false

  // }

  /*   getLocAccuracy() {
  
      
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        console.log('Request successful inn can req', canRequest)
        
        if (canRequest) {
          // the accuracy option will be ignored by iOS
  
          
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            (res: any) => {
              
              console.log('Request successful', res)
              this.getUserLocation()
            },
            error => {
              
              console.log('Error requesting location permissions')
            }
          ).catch(err => {
            
            console.log('Request fail', err)
          });
        } else {
          
          console.log('canRequest fail')
  
        }
  
      }).catch(err => {
        
        console.log('locationAccuracy fail', err)
      });
    } */

  saveLocation() {
    // this.disableSave = 'disabled'
    this.disableSave = 'disabled'
    let data = {
      userId: this.userId,
      address: {
        location: this.userlocation,
        flatWing: this.flat,
        locality: this.locality,
      },
      /***************Hardcoded for now make sure if you need these values then change */
      countryId: this.countryCode,
      stateId: this.stateId,
    }
    console.log('req', JSON.stringify(data))

    this.profileProvider.updateLocation(data).subscribe(
      (res: any) => {
        Utility.showToast(
          this.toastCtrl,
          'User location updated successfully',
          false,
          '',
          false
        )
        setTimeout(() => {
          if (this.loading) this.loading.dismiss()
          this.disableSave = ''
          this.navCtrl.pop()
        }, Constants.toastTimeOut)
      },
      (err) => {
        if (this.loading) this.loading.dismiss()
        this.disableSave = ''
        this.url = Urls.baseUrl + Urls.port + Constants.updateLocation
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'saveLocation'
        this.inserErrorApi()
        //// this.navCtrl.push(ErrorPage)
      }
    )
  }

  // Push On Focus
  scrollTo(ht: any) {
    this.pushNow = true
  }

  removeSroll() {
    this.pushNow = false
  }

  async showVerifyDialog(isNextPage: boolean) {
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
        if (isNextPage == true) {
          this.goToNextPage()
        } else {
          this.saveLocation()
        }
      } else {
        this.disableSave = ''
      }
  }

  async goToNextPage() {
    Questionnaire1Page.questionnaireObj.addressInfo.Location =
      this.questionnaire3Form.value.location
    Questionnaire1Page.questionnaireObj.addressInfo.FlatWing =
      this.questionnaire3Form.value.flat
    Questionnaire1Page.questionnaireObj.addressInfo.Locality =
      this.questionnaire3Form.value.locality
    Questionnaire1Page.questionnaireObj.stateId = this.stateId
    Questionnaire1Page.questionnaireObj.countryId = this.countryCode
    console.log(
      'loc1',
      Questionnaire1Page.questionnaireObj.addressInfo.Location
    )
    console.log(
      'loc1',
      Questionnaire1Page.questionnaireObj.addressInfo.FlatWing
    )
    console.log(
      'loc1',
      Questionnaire1Page.questionnaireObj.addressInfo.Locality
    )

    await this.navCtrl.navigateForward('Questionnaire4Page')
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'Questionnaire3Page'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
