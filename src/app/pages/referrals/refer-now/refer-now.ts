/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *    Bug Fix:        2019/07/10        Yogesh Chavan
 *     Initial:        2019/07/12        Dakshata Patil
 */

import * as $ from 'jquery'

import { Component, OnInit, ViewChild } from '@angular/core'
import {
  IonContent,
  
  LoadingController,
  NavController,
  NavParams,
  Platform,
  ToastController,
} from '@ionic/angular'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Constants } from '../../../Utils/Constants'
import { CreateNewReferral } from '../../../../app/models/CreateNewReferral'
import { GetCountriesRes } from '../../../../app/models/getCountriesRes'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { ProductInfo } from '../../../../app/models/CPProductInfo'
import { ReferralSuccessPage } from '../referral-success/referral-success'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { Utility } from '../../../Utils/Utility'
import { BusinessListingService } from '../../../services/business-listing.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { QuestionnaireService } from '../../../services/questionnaire.service'
import { ReferralService } from '../../../services/referral.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the ReferNowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-refer-now',
  templateUrl: 'refer-now.html',
  styleUrls: ['refer-now.scss']
})
export class ReferNowPage implements OnInit {
  @ViewChild('Content', { static: true }) content: IonContent
  @ViewChild('pushMeOnFocus', { static: true }) pushMeOnFocus
  referNowForm1: FormGroup
  referNowForm2: FormGroup
  productDescription: FormGroup
  businessList
  productDetailsList: ProductInfo[]
  prodServiceFlag: string
  userId
  type
  userfirstname
  userlastname
  productDetail: ProductInfo
  createnewreferal: CreateNewReferral = new CreateNewReferral()
  //newrefobj = new CreateNewReferral()
  //businessList1:businessList[]
  checkValidation: boolean = false
  checkSomeoneElseValidation: boolean = false
  referSomeoneElse: boolean = false
  canSend: boolean = false
  businessId
  businessName
  countryCode
  url
  stackTrace
  message
  method
  countries: GetCountriesRes[]
  public pushNow = false
  public focused = false
  title: string = 'Refer now'
  productPlaceholder: string = 'Product or Service referred*'
  buttonTextSend: string = 'Send Referral'
  mobileNo
  isNan
  logError: InsertErrorLog = new InsertErrorLog()
  validMobileNum: boolean = false
  shortDescp

  constructor(
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public platform: Platform,
    private fb: FormBuilder,
    public newrefferalservice: ReferralService,
    // public keyBoard: Keyboard,
    public businessListService: BusinessListingService,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private toast: ToastController,
    public logErrorService: InserErrorLogService,
    public questionnnaireService: QuestionnaireService
  ) {
    //this.isInputGiven=false
    route.queryParams.subscribe((params: any) => {
      this.countries = new Array<GetCountriesRes>()
      this.countryCode = '+91'
      this.createnewreferal = new CreateNewReferral()
      //this.businessList=new Array<businessList>()
      this.businessList = params.userbusinesslist
      this.userfirstname = params.fName
      this.userlastname = params.lName
      this.getCountries()
      this.storage
        .get('userData')
        .then((data) => {
          console.log('userData', data)
          this.userfirstname = data.firstName
          this.userlastname = data.lastName
          if (data == null || data == undefined) {
            this.createnewreferal.referredByName = ''
          }
          this.userId = data.userId
        })
        .catch((err) => {
          console.log('err', err)
        })
  
      for (let j = 0; j < this.businessList.categories.length; j++) {
        if (
          this.businessList.categories[j].categoryName == 'Legal' ||
          this.businessList.categories[j].categoryName == 'Doctor' ||
          this.businessList.categories[j].categoryName == 'Chartered Accountant'
        ) {
          this.title = 'Connect Now'
          this.productPlaceholder = 'Product or Service*'
          this.buttonTextSend = 'Connect'
        }
      }
  
      this.referNowForm1 = this.fb.group({
        businessCategory: [null, Validators.required],
        productDescription: [null, Validators.required],
      })
  
      this.referNowForm2 = this.fb.group({
        referralName: [null, Validators.required],
        countryCode: [null, ''],
        mobileNo: [
          null,
          Validators.compose([
            Validators.required,
            Validators.min(1000000000),
            Validators.max(9999999999999),
          ]),
        ],
        referElseEmail: [null, Validators.email],
      })
      
      this.referSomeoneElse = false
      this.productDetail = new ProductInfo()
      this.productDetailsList = new Array<ProductInfo>()
      this.prodServiceFlag = params.selectedItem
      this.type = 'Both'
      // this.platform.backButton.subscribe(() => {
      //
      //   console.log("is keyboard open",this.keyBoard.isOpen())
  
      //
      //     let a = document.getElementById('imageCircle');
      //     a.scrollIntoView({ behavior: "smooth" })
  
      // })
      // this.keyBoard.onClose(this.closeCallback)
    })
  }

  ngOnInit() {
    this.getProductServices()
  }
  // closeCallback(){
  //          let a = document.getElementById('imageCircle');
  //       a.scrollIntoView({ behavior: "smooth" })
  // }
  selectRefer(index: any, val) {
    ////
    this.canSend = true
    if (index == 'forself') {
      this.referSomeoneElse = false
    } else {
      this.referSomeoneElse = true
    }
    switch (val) {
      case '1': {
        $('#self').css('background-color', '#003366')
        $('#self').css('color', '#ffffff')
        $('#someOneElse').css('background-color', '#ffffff')
        $('#someOneElse').css('color', '#003366')
        break
      }
      case '2':
        {
          $('#self').css('background-color', '#ffffff')
          $('#self').css('color', '#003366')
          $('#someOneElse').css('background-color', '#003366')
          $('#someOneElse').css('color', '#ffffff')
        }
        break
    }
  }

  sendReferral() {
    if (this.referSomeoneElse == false) {
      this.checkValidation = true
      if (this.referNowForm1.valid && this.canSend) {
        //this.createnewreferal.selectedProductId= this. referNowForm1.value.selectedProductId
        this.createnewreferal.shortDescription =
          this.referNowForm1.value.productDescription
        this.createnewreferal.businessId = this.businessList.businessId
        //this.createnewreferal.selectedProduct = this.businessList.businessName
        this.createnewreferal.forSelf = true
        this.createnewreferal.productServiceSlabId = null
        this.createnewreferal.referredByName =
          this.userfirstname + this.userlastname
        this.createnewreferal.referredById = this.userId
        for (let i = 0; i < this.productDetailsList.length; i++) {
          if (
            this.createnewreferal.selectedProductId ==
            this.productDetailsList[i].productId
          ) {
            this.createnewreferal.selectedProduct =
              this.productDetailsList[i].name
            break
          }
        }
        //console.log("id",this.createnewreferal.selectedProductId)
        console.log('req', this.createnewreferal)
        //console.log("type",this.createnewreferal.shortDescription)
        this.createNewReferral()
        //this.newrefferalservice.createNewReferralApi(this.createnewreferal).subscribe((res: any) =>
        //// this.navCtrl.push(ReferralSuccessPage)
      }
    } else if (this.referSomeoneElse == true) {
      this.checkSomeoneElseValidation = true
      this.checkValidation = true
      if (
        this.referNowForm2.valid &&
        this.referNowForm1.valid &&
        this.canSend
      ) {
        this.createnewreferal.referredToName =
          this.referNowForm2.value.referralName
        this.createnewreferal.mobileNumber = this.referNowForm2.value.mobileNo
        this.createnewreferal.countryCode = this.countryCode
        this.createnewreferal.emailId = this.referNowForm2.value.referElseEmail
        this.createnewreferal.referredByName =
          this.userfirstname + this.userlastname
        this.createnewreferal.referredById = this.userId
        this.createnewreferal.productServiceSlabId = null
        this.createnewreferal.shortDescription =
          this.referNowForm1.value.productDescription
        this.createnewreferal.businessId = this.businessList.businessId
        this.createnewreferal.forSelf = false
        for (let i = 0; i < this.productDetailsList.length; i++) {
          if (
            this.createnewreferal.selectedProductId ==
            this.productDetailsList[i].productId
          ) {
            this.createnewreferal.selectedProduct =
              this.productDetailsList[i].name
            break
          }
        }
        console.log('requestone', this.createnewreferal)
        this.createNewReferral()
      }
    }
  }

  async getProductServices() {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    this.businessListService
      .getProductOrServices(this.businessList.userId, this.type)
      .subscribe(
        (res: any) => {
          if (res != null) {
            if (res.status == 200) {
              let data = res.json.data
              for (let i = 0; i <= data.length - 1; i++) {
                this.productDetail = new ProductInfo()
                this.productDetail.name = data[i].name
                console.log('prodname', this.productDetail.name)
                //this.productDetail.type=data[i].type
                //this.productDetail.description = data[i].description
                //this.productDetail.productPrice = data[i].productPrice
                this.productDetail.productId = data[i].productId
                //this.productDetail.businessId= data [i].businessId
                //this.productDetail.typeOf = data[i].typeOf
                this.productDetailsList.push(this.productDetail)
              }
              if (loading) loading.dismiss()
            }
          }
        },
        (err) => {
          console.log('err', err)
          this.url = Urls.baseUrl + Urls.port + Constants.getProductOrService
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'getProductServices'
          this.inserErrorApi()
          Utility.showToast(
            this.toast,
            Constants.someErrorOccurred,
            false,
            '',
            false
          )
          if (loading) loading.dismiss()
        }
      )
  }

  async createNewReferral() {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()

    this.newrefferalservice
      .createNewReferralApi(this.createnewreferal)
      .subscribe(
        async (res: any) => {
          if (res != null) {
            if (res.status == 200) {
              if (loading) loading.dismiss()
              await this.navCtrl.navigateForward('ReferralSuccessPage', { queryParams: {
                businessList: this.businessList,
              }})
            }
          }
        },
        (err) => {
          if (loading) loading.dismiss()
          console.log('a', err)
          this.url = Urls.baseUrl + Urls.port + Constants.createNewReferral
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'createNewReferral'
          this.inserErrorApi()
          Utility.showToast(
            this.toast,
            Constants.someErrorOccurred,
            false,
            '',
            false
          )
          //Toast to be given "some err occured"
        }
      )
  }

  getCountries() {
    this.questionnnaireService.getCountryApi().subscribe(
      (data) => {
        console.log('data in question 3 ts', data)
        if (data != null) {
          if (data.status == 200) {
            let res = data.json.data.countries
            console.log('data in 200 question 3 ts', res)
            for (let i = 0; i <= res.length - 1; i++) {
              let countryDetail = new GetCountriesRes()
              countryDetail._id = res[i]._id
              countryDetail.code = res[i].code
              countryDetail.countryId = res[i].countryId
              countryDetail.countryName = res[i].countryName
              this.countries.push(countryDetail)
            }
          }
        }
      },
      (err) => {
        console.log('err', err)
      }
    )
  }

  // Push On Focus
  scrollTo(ht: string) {
    // TODO
    // this.content.scrollTo(0, parseInt(ht), 950)
    scrollTo({ behavior: 'smooth' })
  }

  // scrollTo(ht: string) {
  //   this.pushNow = true;
  // }

  // removeSroll() {
  //   this.pushNow = false;
  // }
  inputFocused(ht: any) {
    this.focused = true;
  }

  inputBlur() {
    this.focused = false;
  }
  changeErrorMessages(event) {
    this.mobileNo = this.referNowForm2.value.mobileNo
    if (this.mobileNo) {
      if (isNaN(Number(event.srcElement.value))) {
        this.isNan = true
        console.log('loc1nan if', this.isNan)
      } else {
        this.isNan = false
        console.log('loc1nan else', this.isNan)
      }
      if (this.countryCode == '+91') {
        if (
          this.mobileNo.charAt(0) == '6' ||
          this.mobileNo.charAt(0) == '7' ||
          this.mobileNo.charAt(0) == '8' ||
          this.mobileNo.charAt(0) == '9'
        ) {
          this.validMobileNum = false
        } else {
          this.validMobileNum = true
        }
      } else {
        this.validMobileNum = false
      }
    } else {
      this.isNan = false
      this.validMobileNum = false
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
    this.logError.screen = 'ReferNowPage'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }
}
