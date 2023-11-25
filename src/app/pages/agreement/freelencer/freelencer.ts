import { NavController, ToastController } from '@ionic/angular'

import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { DashboardPage } from '../../dashboard/dashboard'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { ModalController } from '@ionic/angular'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { RegistrationService } from '../../../services/registration.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the FreelencerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-freelencer',
  templateUrl: 'freelencer.html',
  styleUrls: ['freelencer.scss']
})
export class FreelencerPage implements OnInit {
  role
  loading
  userId
  url: any
  disableAccept: boolean = true
  listed = ''
  type = ''
  userInfo
  showBusinessAdd: boolean = false
  showAdd: boolean = false
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  address
  businessAddress
  name
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public logErrorService: InserErrorLogService,
    public registrationService: RegistrationService,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {
    route.queryParams.subscribe((params: any) => {
      
      this.role = params.role
      this.type = params.type
      this.userInfo = params.userInfo
      this.name = this.userInfo.firstName + ' ' + this.userInfo.lastName
      this.businessAddress =
        this.userInfo.businessDetails.bsnsAdd.flat_Wing +
        ', ' +
        this.userInfo.businessDetails.bsnsAdd.location
  
      //     if(this.role == "Listed Partner")
      //     {
      // this.showBusinessAdd =true
      // this.showAdd =false
      // this.businessAddress = this.userInfo.businessDetails.bsnsAdd.location+" ,"+this.userInfo.businessDetails.bsnsAdd.flat_Wing+", "+this.userInfo.businessDetails.bsnsAdd.locality
      // console.log("businessadd",this.businessAddress)
      //     }else if(this.role == "Partner"){
      //       this.showBusinessAdd =false
      //       this.showAdd =true
      //       this.address =this.userInfo.address.location+","+this.userInfo.address.flatWing+","+this.userInfo.address.locality
      //       console.log("addrs",this.address)
      //     }
      console.log('userifo in partner aggremnt', this.userInfo)
      if (this.type == 'Listed') {
        this.listed = 'Listed'
      }
  
      this.storage.get('userInfo').then((val) => {
        this.userId = val.userId
      })
    })
  }

  ngOnInit() {
    console.log('ngOnInit FreelencerPage')
  }
  async Accept() {
    let request = {
      userId: this.userId,
      statusId: true,
      updatedBy: this.userId,
    }
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.loading.present()
    this.registrationService.acceptAgreement(request, this.type).subscribe(
      async (data) => {
        if (this.loading) this.loading.dismiss()
        console.log('res in ts', data)
        if (data != null) {
          if (data.status == 200) {
            Utility.showToast(
              this.toastCtrl,
              Constants.agreementAccepted,
              false,
              '',
              false
            )
            await this.navCtrl.navigateRoot('DashboardPage')
          }
        }
      },
      (err) => {
        console.log(err)
        if (this.loading) this.loading.dismiss()
        Utility.showToast(
          this.toastCtrl,
          Constants.someErrorOccurred,
          false,
          '',
          true
        )
        this.url = Urls.baseUrl + Urls.port + Constants.partnerAgreementUpdate
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'Accept'
        this.inserErrorApi()
      }
    )
  }

  async notNow() {
    await this.navCtrl.navigateRoot('DashboardPage')
  }

  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'FreelencerPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
