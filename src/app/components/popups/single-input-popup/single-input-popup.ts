import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import {
  
  NavController,
  Platform,
  ToastController,
  ModalController,
  // normalizeURL,
} from '@ionic/angular'

import { Component, Input, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { UserProfileService } from '../../../services/user-profile.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the SingleInputPopupComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'single-input-popup',
  templateUrl: 'single-input-popup.html',
  styleUrls: ['single-input-popup.scss']
})
export class SingleInputPopupComponent implements OnInit {
  text: string
  loading
  userId: string = ''
  title: string = ''
  value: any
  validation: any
  type: any = ''
  formGroup: FormGroup
  checkValidation: boolean = false
  valid: boolean = true
  message: string
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  method
  url
  @Input('obj') obj

  constructor(
    private route: ActivatedRoute,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public provider: UserProfileService,
    public toastCtrl: ToastController,
    private fb: FormBuilder,
    public navCtrl: NavController,
    public logErrorService: InserErrorLogService
  ) {
  }

  ngOnInit(): void {
    // route.queryParams.subscribe((params: any) => {
      console.log('Hello SingleInputPopupComponent Component')
      this.text = 'Hello World'
      this.formGroup = this.fb.group({
        userId: [''],
      })
      this.loadingCtrl.create({ cssClass: 'transparent' }).then((ctrl) => this.loading = ctrl)
      this.storage.get('userInfo').then((val) => {
        //  this.getProfile(val)
        this.userId = val.userId
      })
  
      let data = this.obj
      console.log('data error', data)
      if (data) {
        this.title = data.title
        this.value = data.value
        this.validation = data.validation
        this.type = data.type
        this.message = data.message
      }
  
      // this.form = this.fb.array([])
      this.formGroup.addControl(
        this.type,
        this.fb.control('', Validators.compose([Validators.required]))
      )
    // })
  }

  ionViewWillEnter() {}
  //Single Input Popup
  singleInputPopup() {}
  close() {
    this.modalCtrl.dismiss('data')
  }
  saveData() {
    let data = {
      userId: this.userId,
      type: this.type,
      value: this.formGroup.value[this.type],
    }

    this.checkValidation = true
    if (this.formGroup.valid) {
      this.loading.present()
      this.provider.updatePartnerProfile(data).subscribe(
        (res: any) => {
          if (this.loading) this.loading.dismiss()
          Utility.showToast(
            this.toastCtrl,
            this.message + ' updated successfully',
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
          this.method = 'saveData'
          this.inserErrorApi()
          //// this.navCtrl.push(ErrorPage)
        }
      )
    } else {
      this.valid = false
    }
  }

  checkValidity() {
    console.log(!this.valid, this.checkValidation)
    this.valid = this.formGroup.valid
  }
  cancel() {
    this.modalCtrl.dismiss()
  }

  ok() {
    this.modalCtrl.dismiss()
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'SingleInputPopupComponent'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
