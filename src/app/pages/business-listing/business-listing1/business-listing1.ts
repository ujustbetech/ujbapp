/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Api integration:        2019/07/01        Yogesh Chavan
 */

import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import {  NavController, ToastController } from '@ionic/angular'

import { BusinessListing10Page } from '../business-listing10/business-listing10'
import { BusinessListing4Page } from '../business-listing4/business-listing4'
import { CategoryInfo } from '../../../../app/models/CategoryInfo'
import { Component, OnInit } from '@angular/core'
import { Constants } from '../../../Utils/Constants'
import { InsertErrorLog } from '../../../../app/models/insertErrorLog'
import { LoadingController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

import { Urls } from '../../../Utils/urls'
import { UserData } from '../../../../app/models/userData'
import { Utility } from '../../../Utils/Utility'
import { BusinessDetailsService } from '../../../services/business-details.service'
import { CategoriesService } from '../../../services/categories.service'
import { InserErrorLogService } from '../../../services/inser-error-log.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the BusinessListing1Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-listing1',
  templateUrl: 'business-listing1.html',
  styleUrls: ['business-listing1.scss']
})
export class BusinessListing1Page implements OnInit {
  categoryData: CategoryInfo[] = new Array<CategoryInfo>()
  submitCategoryData: CategoryInfo = new CategoryInfo()
  checkValidation: boolean = false
  businessList1Form: FormGroup
  CurrentPage
  loading
  showError: boolean = false
  catList: CategoryInfo[] = new Array<CategoryInfo>()
  catListSecond: CategoryInfo[] = new Array<CategoryInfo>()
  editMode
  isEdit: boolean = false
  hidePrevious: boolean = true
  hideNext: boolean = true
  businessCategory1
  businessCategory2
  businessData: CategoryInfo = new CategoryInfo()
  businessId
  categoryList
  companyTagline
  catInfo
  categoriesValid: boolean = true
  isDisabled: boolean = true
  businessCategorySecond
  userData: UserData
  userTypeId
  selected: any
  userType
  disableSave: boolean = true
  getCategoryListRes: CategoryInfo
  totalCount
  canLoadMore: boolean = false
  selectedBusinessCat: boolean = false
  selectMinBusinessCat: boolean = false
  maxCat: boolean = false
  bluecircle
  flag: boolean = false
  categoryRef: CategoryInfo[] = new Array<CategoryInfo>()
  logError: InsertErrorLog = new InsertErrorLog()
  alreadySelected: any[]

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public logErrorService: InserErrorLogService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private provider: BusinessDetailsService,
    private storage: Storage,
    public toastCtrl: ToastController,
    public getCategoryList: CategoriesService
  ) {
    route.queryParams.subscribe((params: any) => {
      // this.bluecircle="grey-circle"
      this.getCategoryListRes = new CategoryInfo()
      this.submitCategoryData.categories = new Array<any>()
      // this.loadingCtrl.create({ cssClass: 'transparent' }).then(ctrl => this.loading = ctrl)
      this.userData = new UserData()
      //this.disableSave=''
      this.isDisabled = true
  
      console.log('username123', this.isDisabled)
      this.catList = new Array<CategoryInfo>()
      this.CurrentPage = 1
      this.businessList1Form = this.fb.group({
        businessCategoryFirst: [null, Validators.required],
        businessCategorySecond: [null, ''],
      })
  
      this.editMode = params.edit
      if (this.editMode == 'editCat') {
        this.catInfo = params.catId
  
        this.businessCategory1 = this.catInfo[0]
        if (
          this.businessCategory1 != undefined &&
          this.businessCategory1 != null &&
          this.businessCategory1 != ''
        ) {
          this.submitCategoryData.categories.push(this.businessCategory1)
        }
  
        this.businessCategory2 = this.catInfo[1]
        if (
          this.businessCategory2 != undefined &&
          this.businessCategory2 != null &&
          this.businessCategory2 != ''
        ) {
          this.submitCategoryData.categories.push(this.businessCategory2)
        }
        this.alreadySelected = JSON.parse(
          JSON.stringify(this.submitCategoryData.categories)
        )
        console.log('username cat 1', this.businessCategory1)
        console.log('username cat 2', this.businessCategory2)
        this.businessData.tagline = params.companyTagline
        this.userTypeId = params.userTypeId
        this.userType = params.userType
        this.businessData.nameOfPartner = params.nameOfPartner
        this.businessData.CompanyName = params.companyName
        this.isEdit = true
        this.hidePrevious = false
        this.hideNext = false
      } else {
        BusinessListing10Page.businessListingObj.categories = new Array<any>()
      }
      this.businessList1Form.reset()
      
    })
  }
  async ngOnInit() {
      this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
      this.getCategories(this.CurrentPage)
  }
  ionViewWillEnter() {
    this.selectedBusinessCat = false
    this.selectMinBusinessCat = false
    this.CurrentPage = 1
    console.log('business category', BusinessListing10Page.businessListingObj)
    this.storage.get('userInfo').then((val) => {
      console.log('username', val)
      this.userData = val
      this.submitCategoryData.userId = this.userData.userId
      this.submitCategoryData.businessId = this.userData.businessId
    })
    console.log('1 disableSave true')
    this.disableSave = true
  }

  async getCategories(CurrentPage) {
    
    this.loading.present()
    // for (let j = 1; j <= 2; j++) {
    // this.CurrentPage = j
    // this.CurrentPage = 1
    // do{

    await this.getCategoryList.getcategoriesApi('', CurrentPage).subscribe(
      (res: any) => {
        this.loading.dismiss()
        console.log('list', res)

        if (res.json.message[0].type == 'SUCCESS') {
          let data = res.json.data.categories

          for (let i = 0; i <= data.length - 1; i++) {
            let categoryinfoobj = new CategoryInfo()
            categoryinfoobj.selectedCategory = 'grey-circle'
            categoryinfoobj.catId = data[i].catId
            if (this.editMode == 'editCat') {
              if (
                categoryinfoobj.catId == this.businessCategory1 ||
                categoryinfoobj.catId == this.businessCategory2
              ) {
                categoryinfoobj.selectedCategory = 'blue-circle'
              }
            }
            categoryinfoobj.categoryName = data[i].categoryName
            categoryinfoobj.categoryImgBase64 = Utility.getImageUrl(
              data[i].categoryImgBase64
            )
            console.log('obj', categoryinfoobj)

            this.catList.push(categoryinfoobj)
          }

          this.totalCount = res.json.data.totalCount
          this.getCategoryListRes.pager.currentPage =
            res.json.data.pager.currentPage
          this.getCategoryListRes.pager.pageSize = res.json.data.pager.pageSize
          this.getCategoryListRes.pager.totalPages =
            res.json.data.pager.totalPages
          this.getCategoryListRes.pager.totalRecords =
            res.json.data.pager.totalRecords
          console.log(
            'list in category get category res',
            this.getCategoryListRes
          )

          console.log('list', this.catList)
          if (this.CurrentPage != this.getCategoryListRes.pager.totalPages) {
            this.CurrentPage++
            this.getCategories(this.CurrentPage)
          }
        }
        if (this.editMode == 'editCat') {
          this.disableItem(1)
        }
        //this.CurrentPage ++
      },
      (err) => {
        console.log('err', err)
      }
    )

    // }
    // while(this.CurrentPage ==  this.getCategoryListRes.pager.totalPages){

    // }
  }

  selectValue(catId) {
    console.log('catid', catId)
    this.flag = false
    if (this.editMode == 'editCat') {
      if (
        this.submitCategoryData.categories.length == 0 ||
        this.submitCategoryData.categories.length == undefined
      ) {
        this.selectedBusinessCat = false
        this.selectMinBusinessCat = false
        catId.selectedCategory = 'blue-circle'
        this.submitCategoryData.categories.push(catId.catId)
      } else if (this.submitCategoryData.categories.length == 1) {
        this.selectedBusinessCat = false
        for (let i = 0; i <= this.submitCategoryData.categories.length; i++) {
          if (this.submitCategoryData.categories[i] == catId.catId) {
            catId.selectedCategory = 'grey-circle'
            this.submitCategoryData.categories.splice(i, 1)
            this.selectMinBusinessCat = false
            break
          } else {
            this.selectMinBusinessCat = false
            catId.selectedCategory = 'blue-circle'
            this.submitCategoryData.categories.push(catId.catId)
            break
          }
        }
      } else if (this.submitCategoryData.categories.length >= 2) {
        this.selectMinBusinessCat = true
        for (let i = 0; i <= this.submitCategoryData.categories.length; i++) {
          if (this.submitCategoryData.categories[i] == catId.catId) {
            this.selectMinBusinessCat = false
            this.flag = true
            catId.selectedCategory = 'grey-circle'
            this.submitCategoryData.categories.splice(i, 1)
          }
          if (
            this.submitCategoryData.categories.length <= 2 &&
            this.flag == true
          ) {
            this.selectMinBusinessCat = false
          } else {
            this.selectMinBusinessCat = true
            let a = document.getElementById('minCategory')
            a.scrollIntoView({ behavior: 'smooth' })
          }
          // break
        }
        //else {

        //   this.selectMinBusinessCat = true
        //   let a = document.getElementById('minCategory');
        //   a.scrollIntoView({ behavior: "smooth" })
        //   // if (this.submitCategoryData.categories.length <= 2) {
        //   //   this.selectMinBusinessCat = false
        //   // } else {
        //   //   this.selectMinBusinessCat = true
        //   // }
        //   // let a = document.getElementById('minCategory');
        //   // a.scrollIntoView({ behavior: "smooth" })
        //   // for (let i = 0; i <= this.catList.length - 1; i++) {
        //   //   this.catList[i].selectedCategory = 'grey-circle'
        //   // }
        //   // this.submitCategoryData.categories.splice(0, 2)
        //   // this.submitCategoryData.categories.push(catId.catId)

        //   // catId.selectedCategory = 'blue-circle'
        //   // console.log("removed", this.submitCategoryData.categories)

        // }
      } else {
        this.selectMinBusinessCat = false
        catId.selectedCategory = 'blue-circle'
        this.submitCategoryData.categories.push(catId.catId)
      }
      this.disableItem(1)
    } else {
      this.selectMinBusinessCat = false
      if (
        BusinessListing10Page.businessListingObj.categories.length == 0 ||
        BusinessListing10Page.businessListingObj.categories == undefined
      ) {
        catId.selectedCategory = 'blue-circle'
        BusinessListing10Page.businessListingObj.categories.push(catId.catId)
        this.selectedBusinessCat = false
      } else if (
        BusinessListing10Page.businessListingObj.categories.length == 1
      ) {
        this.selectedBusinessCat = false
        for (
          let i = 0;
          i <= BusinessListing10Page.businessListingObj.categories.length;
          i++
        ) {
          if (
            BusinessListing10Page.businessListingObj.categories[i] ==
            catId.catId
          ) {
            catId.selectedCategory = 'grey-circle'
            BusinessListing10Page.businessListingObj.categories.splice(i, 1)
            break
          } else {
            catId.selectedCategory = 'blue-circle'
            BusinessListing10Page.businessListingObj.categories.push(
              catId.catId
            )
            break
          }
        }
      } else if (
        BusinessListing10Page.businessListingObj.categories.length >= 2
      ) {
        this.selectMinBusinessCat = true
        this.selectedBusinessCat = false
        for (
          let i = 0;
          i <= BusinessListing10Page.businessListingObj.categories.length;
          i++
        ) {
          if (
            BusinessListing10Page.businessListingObj.categories[i] ==
            catId.catId
          ) {
            this.selectMinBusinessCat = false
            this.flag = true
            catId.selectedCategory = 'grey-circle'
            BusinessListing10Page.businessListingObj.categories.splice(i, 1)
            // break
          }
          if (
            BusinessListing10Page.businessListingObj.categories.length <= 2 &&
            this.flag == true
          ) {
            this.selectMinBusinessCat = false
          } else {
            this.selectMinBusinessCat = true
            let a = document.getElementById('minCategory')
            a.scrollIntoView({ behavior: 'smooth' })
          }

          // else {
          //   this.selectMinBusinessCat = true
          //   let a = document.getElementById('minCategory');
          //   a.scrollIntoView({ behavior: "smooth" })
          //   // catId.selectedCategory = 'blue-circle'
          //   //BusinessListing10Page.businessListingObj.categories.push(catId.catId)
          //   //break
          // }
        }
        // this.selectMinBusinessCat = true
        // BusinessListing10Page.businessListingObj.categories.pop()
        // for (let i = 0; i <= this.catList.length - 1; i++) {
        //   this.catList[i].selectedCategory = 'grey-circle'
        // }

        // catId.selectedCategory = 'blue-circle'
      }
      // else{
      //   catId.selectedCategory = 'blue-circle'
      // }

      this.disableItem(2)
    }
    if (this.editMode) {
      let flag = false
      if (
        this.alreadySelected &&
        this.submitCategoryData.categories.length > 0
      ) {
        if (
          this.alreadySelected.length !=
          this.submitCategoryData.categories.length
        ) {
          this.disableSave = false
        } else {
          for (let j = 0; j < this.alreadySelected.length; j++) {
            if (
              this.submitCategoryData.categories[0] == this.alreadySelected[j]
            ) {
              flag = true
              break
            }
          }
          if (flag == true && this.submitCategoryData.categories.length > 1) {
            for (let j = 0; j < this.alreadySelected.length; j++) {
              if (
                this.submitCategoryData.categories[1] == this.alreadySelected[j]
              ) {
                flag = true
                break
              } else {
                flag = false
              }
            }
          }

          if (flag == true) {
            this.disableSave = true
          } else {
            this.disableSave = false
          }
        }

        /*   if (JSON.stringify(this.submitCategoryData.categories) == JSON.stringify(this.alreadySelected)) {
            this.disableSave = true
          } else {
            if(this.submitCategoryData.categories.length>0)
            this.disableSave = false
          } */
      } else {
        this.disableSave = true
      }
    } else if (BusinessListing10Page.businessListingObj.categories.length > 0) {
      this.disableSave = false
    } else {
      this.disableSave = true
    }
  }

  // onScroll(event) {
  //
  //   if (this.catList.length < this.totalCount) {
  //
  //     this.CurrentPage = this.getCategoryListRes.pager.currentPage + 1
  //     if (this.CurrentPage <= this.getCategoryListRes.pager.totalPages) {
  //       this.getCategories(this.)
  //     }
  //     else {
  //       this.canLoadMore = false
  //     }
  //   } else {
  //
  //     this.canLoadMore = false
  //   }
  // }
  checkCategorySelection() {
    if (
      this.businessCategory1 &&
      this.businessCategory2 &&
      this.businessCategory1 == this.businessCategory2
    ) {
      return false
    } else {
      return true
    }
  }

  submitBusinessCategory() {
    BusinessListing10Page.businessListingObj.userId = this.userData.userId

    this.checkValidation = true
    // if (this.businessList1Form.valid && this.categoriesValid) {
    // this.disableSave= 'disabled'
    if (BusinessListing10Page.businessListingObj.categories.length >= 1) {
      // if (this.businessList1Form.value.businessCategoryFirst != null) {
      //   BusinessListing10Page.businessListingObj.categories.push(this.businessList1Form.value.businessCategoryFirst)
      // }
      // if (this.businessList1Form.value.businessCategorySecond != null && this.businessList1Form.value.businessCategorySecond != "None") {
      //   BusinessListing10Page.businessListingObj.categories.push(this.businessList1Form.value.businessCategorySecond)
      // }
      this.showError = false
      console.log('business category', BusinessListing10Page.businessListingObj)
      console.log(
        'business details api req cghcek',
        JSON.stringify(BusinessListing10Page.businessListingObj)
      )
      this.loading.present()
      if (
        this.submitCategoryData.businessId != null &&
        this.submitCategoryData.businessId != undefined &&
        this.submitCategoryData.businessId != ''
      ) {
        BusinessListing10Page.businessListingObj.businessId =
          this.submitCategoryData.businessId

        this.provider
          .submitCategories(BusinessListing10Page.businessListingObj)
          .subscribe(
            async (res: any) => {
              this.selectedBusinessCat = false
              this.selectMinBusinessCat = false

              if (this.loading) this.loading.dismiss()
              console.log('res from question 4 to back', res)

              // this.navCtrl.push(BusinessListing4Page)
              await this.navCtrl.navigateForward('BusinessListing4Page')

            },
            (err) => {
              if (this.loading) this.loading.dismiss()
              let Input = {
                userId: this.userData.userId,
                businessId: BusinessListing10Page.businessListingObj.businessId,
                CompanyName:
                  BusinessListing10Page.businessListingObj.CompanyName,
                categories: BusinessListing10Page.businessListingObj.categories,
                tagline: BusinessListing10Page.businessListingObj.tagline,
                UserType: BusinessListing10Page.businessListingObj.UserType,
                NameofPartner:
                  BusinessListing10Page.businessListingObj.NameofPartner,
              }
              this.logError.Url =
                Urls.baseUrl + Urls.port + Constants.updateBusiness
              this.logError.UserId = this.userData.userId
              this.logError.createdBy = this.userData.userId
              this.logError.date = new Date().toLocaleString()
              this.logError.error =
                'input by user' + JSON.stringify(Input) + '' + err.stack
              this.logError.message = err.message
              this.logError.method = 'submitBusinessCategory'
              this.logError.screen = 'BusinessListing1Page'
              this.logError.source = 'mobile'
              console.log('responce log', this.logError)

              this.logErrorService.insertLogError(this.logError)
              console.log('submitCategories err', err)
            }
          )
      } else {
        this.provider
          .submitCategories(BusinessListing10Page.businessListingObj)
          .subscribe(
            (res: any) => {
              this.selectedBusinessCat = false
              this.selectMinBusinessCat = false

              if (this.loading) this.loading.dismiss()
              console.log('res in new chnge', res)
              this.userData.userRole = Constants.clientPartner
              this.userData.businessId = res.json.data
              this.storage.set('userInfo', this.userData).then(async (val) => {
                // this.navCtrl.push(BusinessListing4Page)
                await this.navCtrl.navigateForward('BusinessListing4Page')

              })
            },
            (err) => {
              if (this.loading) this.loading.dismiss()
              let Input = {
                userId: this.userData.userId,
                businessId: BusinessListing10Page.businessListingObj.businessId,
                CompanyName:
                  BusinessListing10Page.businessListingObj.CompanyName,
                categories: BusinessListing10Page.businessListingObj.categories,
                tagline: BusinessListing10Page.businessListingObj.tagline,
                UserType: BusinessListing10Page.businessListingObj.UserType,
                NameofPartner:
                  BusinessListing10Page.businessListingObj.NameofPartner,
              }
              this.logError.Url =
                Urls.baseUrl + Urls.port + Constants.updateBusiness
              this.logError.UserId = this.userData.userId
              this.logError.createdBy = this.userData.userId
              this.logError.date = new Date().toLocaleString()
              this.logError.error =
                'input by user' + JSON.stringify(Input) + '' + err.stack
              this.logError.message = err.message
              this.logError.method = 'submitBusinessCategory'
              this.logError.screen = 'BusinessListing1Page'
              this.logError.source = 'mobile'
              console.log('responce log', this.logError)

              this.logErrorService.insertLogError(this.logError)
              console.log('submitCategories err', err)
            }
          )
      }
    } else if (BusinessListing10Page.businessListingObj.categories.length > 2) {
      //  this.disableSave= ''
      this.selectMinBusinessCat = true
      this.selectedBusinessCat = false
      let a = document.getElementById('minCategory')
      a.scrollIntoView({ behavior: 'smooth' })
    } else {
      this.selectedBusinessCat = true
      this.selectMinBusinessCat = false
      let a = document.getElementById('oneCategory')
      a.scrollIntoView({ behavior: 'smooth' })
    }
  }

  goToDashboard() {
    this.navCtrl.pop()
  }

  editCategory() {
    //if (this.businessList1Form.valid) {
    if (this.submitCategoryData.categories.length >= 1) {
      // if (this.businessList1Form.value.businessCategoryFirst != null) {
      //   this.submitCategoryData.categories.push(this.businessList1Form.value.businessCategoryFirst)
      // }
      // if (this.businessList1Form.value.businessCategorySecond != null && this.businessList1Form.value.businessCategorySecond != "None") {
      //   this.submitCategoryData.categories.push(this.businessList1Form.value.businessCategorySecond)
      // }
      this.showError = false
      this.businessData.UserType = this.userTypeId
      this.businessData.categories = this.submitCategoryData.categories
      this.businessData.userId = this.submitCategoryData.userId
      this.businessData.businessId = this.submitCategoryData.businessId
      this.checkValidation = true
      this.loading.present()
      console.log('category edit ', JSON.stringify(this.businessData))
      this.provider.submitCategories(this.businessData).subscribe(
        (res: any) => {
          this.selectedBusinessCat = false
          this.selectMinBusinessCat = false

          if (this.loading) this.loading.dismiss()
          // this.logError.Url = Urls.baseUrl + Urls.port + Constants.updateBusiness
          // this.logError.UserId = this.userData.userId
          // this.logError.createdBy = this.userData.userId
          // this.logError.date = new Date().toString()
          // this.logError.error ="input by user"+JSON.stringify(Input)
          // this.logError.message = res.json.message[0].message
          // this.logError.method = "editCategory"
          // this.logError.screen = "BusinessListing1Page"
          // this.logError.source = "mobile"
          // console.log("responce log", this.logError)
          //
          // this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
          //   console.log("res in 200", res)
          // })
          Utility.showToast(
            this.toastCtrl,
            Constants.yourDataUpdatedSuccessfully,
            false,
            '',
            false
          )
          this.navCtrl.pop()
        },
        (err) => {
          if (this.loading) this.loading.dismiss()
          let Input = {
            'cat1 before edit': this.catInfo[0],
            'cat2 befor edit': this.catInfo[1],
            'cat1 After edit':
              this.businessList1Form.value.businessCategoryFirst,
            'cat2 After edit':
              this.businessList1Form.value.businessCategorySecond,
          }
          this.logError.Url =
            Urls.baseUrl + Urls.port + Constants.updateBusiness
          this.logError.UserId = this.userData.userId
          this.logError.createdBy = this.userData.userId
          this.logError.date = new Date().toLocaleString()
          this.logError.error =
            'input by user' + JSON.stringify(Input) + '' + err.stack
          this.logError.message = err.message
          this.logError.method = 'editCategory'
          this.logError.screen = 'BusinessListing1Page'
          this.logError.source = 'mobile'
          console.log('responce log', this.logError)

          this.logErrorService.insertLogError(this.logError)
          Utility.showToast(this.toastCtrl, err, false, '', false)
        }
      )
    } else if (this.submitCategoryData.categories.length > 2) {
      this.selectMinBusinessCat = true
      this.selectedBusinessCat = false
      let a = document.getElementById('minCategory')
      a.scrollIntoView({ behavior: 'smooth' })
    } else {
      this.selectedBusinessCat = true
      this.selectMinBusinessCat = false
      let a = document.getElementById('oneCategory')
      a.scrollIntoView({ behavior: 'smooth' })
    }
  }

  disableItem(index: any) {
    if (index == 1) {
      //
      if (this.submitCategoryData.categories.length == 0) {
        for (let i = 0; i < this.catList.length; i++) {
          this.catList[i].disableCategory = ''
        }
      } else {
        //
        if (
          this.submitCategoryData.categories[0] == '5e3ae184179e9b78196d1860' ||
          this.submitCategoryData.categories[0] == '5e43e5c14297dcb1714d4f23' ||
          this.submitCategoryData.categories[0] == '5d88e546240f0263e42c62ff' ||
          this.submitCategoryData.categories[0] == '5d88e55b240f0263e42c63aa' ||
          this.submitCategoryData.categories[1] == '5e3ae184179e9b78196d1860' ||
          this.submitCategoryData.categories[1] == '5e43e5c14297dcb1714d4f23' ||
          this.submitCategoryData.categories[1] == '5d88e546240f0263e42c62ff' ||
          this.submitCategoryData.categories[1] == '5d88e55b240f0263e42c63aa'
        ) {
          for (let i = 0; i < this.catList.length; i++) {
            //
            if (
              this.catList[i].catId == '5e3ae184179e9b78196d1860' ||
              this.catList[i].catId == '5e43e5c14297dcb1714d4f23' ||
              this.catList[i].catId == '5d88e546240f0263e42c62ff' ||
              this.catList[i].catId == '5d88e55b240f0263e42c63aa'
            ) {
              this.catList[i].disableCategory = ''
            } else {
              //
              this.catList[i].disableCategory = 'disabled'
            }
          }
        } else {
          for (let i = 0; i < this.catList.length; i++) {
            if (
              this.catList[i].catId == '5e3ae184179e9b78196d1860' ||
              this.catList[i].catId == '5e43e5c14297dcb1714d4f23' ||
              this.catList[i].catId == '5d88e546240f0263e42c62ff' ||
              this.catList[i].catId == '5d88e55b240f0263e42c63aa'
            ) {
              //
              this.catList[i].disableCategory = 'disabled'
            } else {
              //
              this.catList[i].disableCategory = ''
            }
          }
        }
      }
    } else {
      if (BusinessListing10Page.businessListingObj.categories.length == 0) {
        for (let i = 0; i < this.catList.length; i++) {
          this.catList[i].disableCategory = ''
        }
      } else {
        if (
          BusinessListing10Page.businessListingObj.categories[0] ==
            '5e3ae184179e9b78196d1860' ||
          BusinessListing10Page.businessListingObj.categories[0] ==
            '5e43e5c14297dcb1714d4f23' ||
          BusinessListing10Page.businessListingObj.categories[0] ==
            '5d88e546240f0263e42c62ff' ||
          BusinessListing10Page.businessListingObj.categories[0] ==
            '5d88e55b240f0263e42c63aa'
        ) {
          for (let i = 0; i < this.catList.length; i++) {
            if (
              this.catList[i].catId == '5e3ae184179e9b78196d1860' ||
              this.catList[i].catId == '5e43e5c14297dcb1714d4f23' ||
              this.catList[i].catId == '5d88e546240f0263e42c62ff' ||
              this.catList[i].catId == '5d88e55b240f0263e42c63aa'
            ) {
              this.catList[i].disableCategory = ''
            } else {
              this.catList[i].disableCategory = 'disabled'
            }
          }
          //this.catList[i].disabled = true
        } else {
          for (let i = 0; i < this.catList.length; i++) {
            if (
              this.catList[i].catId == '5e3ae184179e9b78196d1860' ||
              this.catList[i].catId == '5e43e5c14297dcb1714d4f23' ||
              this.catList[i].catId == '5d88e546240f0263e42c62ff' ||
              this.catList[i].catId == '5d88e55b240f0263e42c63aa'
            ) {
              this.catList[i].disableCategory = 'disabled'
            } else {
              this.catList[i].disableCategory = ''
            }
          }
        }
      }
    }
  }
}
