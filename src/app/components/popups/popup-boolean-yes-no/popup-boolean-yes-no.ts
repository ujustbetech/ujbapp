import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import {
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular'

import { Component, Input, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the PopupBooleanYesNoComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popup-boolean-yes-no',
  templateUrl: 'popup-boolean-yes-no.html',
  styleUrls: ['popup-boolean-yes-no.scss']
})
export class PopupBooleanYesNoComponent implements OnInit {
  // text: string;
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
  message
  inputVal
  isInputGiven: boolean = false
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace

  method
  url
  @Input('obj') obj = null

  constructor(
    private route: ActivatedRoute,
    private storage: Storage,
    public logErrorService: InserErrorLogService,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public provider: UserProfileService,
    public toastCtrl: ToastController,
    private fb: FormBuilder,
    public navCtrl: NavController
  ) {
    // this.form = this.fb.array([])
    // this.formGroup.addControl(this.type, this.fb.control('', Validators.compose([Validators.required])))
  }

  async ngOnInit(): Promise<void> {
    // route.queryParams.subscribe((params: any) => {
      console.log('Hello PopupBooleanYesNoComponent Component')
      this.text = 'Hello World'
  
      this.formGroup = this.fb.group({
        userId: [''],
      })
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.storage.get('userInfo').then((val) => {
        this.userId = val.userId
      })
  
      let data = this.obj
      console.log('data error', data)
      this.title = data.title
      this.value = data.value
      this.validation = data.validation
      this.type = data.type
      this.message = data.message
      
    // })
  }

  close() {
    this.modalCtrl.dismiss('data')
  }
  saveData() {
    if (this.value == true || this.value == false) {
      this.isInputGiven = true
    }
    let data = {
      userId: this.userId,
      type: this.type,
      value: this.value,
    }

    this.checkValidation = true
    // if (this.formGroup.valid) {
    if (this.isInputGiven == true) {
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
    } //
  }
  selectValue() {
    //this.inputVal = data
    this.isInputGiven = true
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'PopupBooleanYesNoComponent'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
