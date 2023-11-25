import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

import { Component, Input, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { GuestInfo } from '../../../../app/models/GuestInfo'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController, ModalController, NavController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { ToastController } from '@ionic/angular'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the EditGuestNameComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'edit-guest-name',
  templateUrl: 'edit-guest-name.html',
  styleUrls: ['edit-guest-name.scss']
})
export class EditGuestNameComponent implements OnInit {
  text: string
  geustInfo: GuestInfo
  loading
  userId: string = ''
  title: string = ''
  value: any
  validation: any
  type: any = ''
  formGroup: FormGroup
  checkValidation: boolean = false
  valid: boolean = true
  firstName
  lastName
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  @Input('obj') obj = null
  constructor(
    private storage: Storage,
    public logErrorService: InserErrorLogService,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public provider: UserProfileService,
    public toastCtrl: ToastController,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public navCtrl: NavController
  ) {
    
  }

  async ngOnInit(): Promise<any> {
    // route.queryParams.subscribe((params: any) => {
      
    console.log('Hello EditGuestNameComponent Component')
    //this.text = 'Hello World';

    this.geustInfo = this.obj
    this.firstName = this.geustInfo.firstName
    this.lastName = this.geustInfo.lastName

    this.formGroup = this.fb.group({
      userId: [''],
      //FirstName: ['', Validators.required],
      // LastName: ['', Validators.required]
      FirstName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z]*$'),
        ]),
      ],
      LastName: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z]*$'),
        ]),
      ],
    })
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.storage.get('userInfo').then((val) => {
      this.userId = val.userId
    })

    let data = this.obj
    this.title = data.title
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.geustInfo.firstName = data.firstName
    this.geustInfo.lastName = data.lastName
    this.validation = data.validation
    this.type = data.type
  // })
  }

  cancel() {
    this.modalCtrl.dismiss()
  }

  ok() {
    // this.modalCtrl.dismiss({ "data": this.geustInfo })
    let data = {
      userId: this.userId,
      type: 'Name',
      value:
        this.formGroup.value.FirstName + ',' + this.formGroup.value.LastName,
    }
    this.checkValidation = true
    if (this.formGroup.valid) {
      this.loading.present()
      this.provider.updatePartnerProfile(data).subscribe(
        (res: any) => {
          if (this.loading) this.loading.dismiss()
          Utility.showToast(
            this.toastCtrl,
            this.type + ' updated successfully',
            false,
            '',
            false
          )
          this.modalCtrl.dismiss('updated')
        },
        (err) => {
          if (this.loading) this.loading.dismiss()
          this.url = Urls.baseUrl + Urls.port + Constants.updatePartnerProfile
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'ok'
          this.inserErrorApi()
          //// this.navCtrl.push(ErrorPage)
        }
      )
    }
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'EditGuestNameComponent'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
