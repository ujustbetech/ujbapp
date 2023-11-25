/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *
 *    update   email partner and guest  2019/08/13        Yogesh Chavan
 */

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ModalController, NavController, ToastController } from '@ionic/angular'

import { Component, Input, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { GuestInfo } from '../../../../app/models/GuestInfo'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { UserProfileService } from '../../../services/user-profile.service'
import { RegistrationService } from '../../../services/registration.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the EditEmailComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'edit-email',
  templateUrl: 'edit-email.html',
  styleUrls: ['edit-email.scss'],
})
export class EditEmailComponent implements OnInit{
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
  isEmailExist: boolean = false
  result: boolean = true
  checkEmailValue
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  @Input('obj') obj = null

  constructor(
    private modalCtrl: ModalController,
    private storage: Storage,
    public logErrorService: InserErrorLogService,
    private loadingCtrl: LoadingController,
    public provider: UserProfileService,
    public toastCtrl: ToastController,
    private fb: FormBuilder,
    public navCtrl: NavController,
    private route: ActivatedRoute,
    public registrationService: RegistrationService
  ) {
    
  }

  async ngOnInit(): Promise<any> {
    // route.queryParams.subscribe((params: any) => {
      this.formGroup = this.fb.group({
        userId: [''],
        EmailId: ['', Validators.compose([Validators.required])],
      })
      this.formGroup.addControl(
        'EmailId',
        this.fb.control(
          '',
          Validators.compose([Validators.required, Validators.email])
        )
      )
      console.log('Hello EditEmailComponent Component')
      this.text = 'Hello World'
      this.geustInfo = this.obj
  
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.storage.get('userInfo').then((val) => {
        this.userId = val.userId
      })
  
      let data = this.obj
      this.title = data.title
      this.value = data.value
      this.checkEmailValue = this.value
      this.validation = data.validation
      this.type = data.type
    // })
  }

  cancel() {
    this.modalCtrl.dismiss()
  }

  ok() {
    this.modalCtrl.dismiss({ data: this.geustInfo })
  }

  close() {
    this.modalCtrl.dismiss('data')
  }
  saveData() {
    let data = {
      userId: this.userId,
      type: this.type,
      value: this.formGroup.value.EmailId,
    }

    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    this.result = re.test(this.formGroup.value.EmailId)
    this.checkValidation = true
    if (this.formGroup.valid && this.result && this.isEmailExist == false) {
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
          this.method = 'saveData'
          this.inserErrorApi()
          //// this.navCtrl.push(ErrorPage)
        }
      )
    } else {
      this.valid = false
    }
    //
  }

  changeErrorMessages(value: any) {
    this.result = true
    if (value == 'email') {
      this.isEmailExist = false
    }
  }

  checkEmail() {
    this.registrationService.checkEmailApi(this.value).subscribe(
      (data) => {
        ////
        console.log('res in ts', data)
        if (data != null) {
          if (data.status == 200) {
            let res = data.json
            console.log('res in 200', res)
            if (res) {
              for (let i = 0; i < res.message.length; i++) {
                if (res.message[i].type == 'ERROR') {
                  this.isEmailExist = false
                  this.saveData()
                } else if (res.message[i].type == 'SUCCESS') {
                  if (this.checkEmailValue != this.formGroup.value.EmailId) {
                    this.isEmailExist = true
                  } else {
                    Utility.showToast(
                      this.toastCtrl,
                      'No update required',
                      false,
                      '',
                      false
                    )
                    this.modalCtrl.dismiss('updated')
                  }
                }
              }
            }
          } else {
            // console.log("error");
          }
        }
      },
      (err) => {
        console.log(err)
        this.url = Urls.baseUrl + Urls.port + Constants.checkEmailApi
        this.stackTrace = err.stack
        this.message = err.message
        this.method = 'checkEmail'
        this.inserErrorApi()
      }
    )
  }
  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'EditEmailComponent'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
