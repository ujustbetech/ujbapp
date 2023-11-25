import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController, Platform, ToastController } from '@ionic/angular'

import { File } from '@ionic-native/file/ngx'

import { ProductServiceTipComponent } from '../popups/product-service-tip/product-service-tip'

import { Storage } from '@ionic/storage'
import { Constants } from '../../Utils/Constants'
import { Utility } from '../../Utils/Utility'
import { Urls } from '../../Utils/urls'
import { ProductInfo } from '../../models/CPProductInfo'
import { ProductImageInfo } from '../../models/ProductImageInfo'
import { ReferralDataInfo } from '../../models/ReferralDataInfo'
import { InsertErrorLog } from '../../models/insertErrorLog'
import { PopupConfirmationAlertComponent } from '../popups/popup-confirmation-alert/popup-confirmation-alert'
import { BusinessListingService } from '../../services/business-listing.service'
import { InserErrorLogService } from '../../services/inser-error-log.service'
import { CommonUtilsService } from '../../services/common-utils.service'
import { ActivatedRoute } from '@angular/router'


/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Meghana    2019/03/01    Initial:
 *     Gitesh     2019/07/11    removed unused inmports, added code for new accordian, removed extra variables,
 *                              removed default values sets from here, added comments for methods
 *
 */
@Component({
  selector: 'product-service-add-edit-form',
  templateUrl: 'product-service-add-edit-form.html',
  styleUrls: ['product-service-add-edit-form.scss']
})
export class ProductServiceAddEditFormComponent {
  @Input() set setProductDetails(val: any) {
    console.log('----------------------------',val)
    this.productDetails = JSON.parse(JSON.stringify(val))
  }
  @Input() productDetails: ProductInfo
  @Input() productList: ProductInfo[]
  @Input() index: number
  //@Input() mode: string
  @Input('expanded') expanded: boolean = false
  @ViewChild('expandWrapper', { read: ElementRef, static: true })
  expandWrapper: ElementRef
  @Input('expandHeight') expandHeight: string = 'auto'

  productDetailForm: FormGroup
  checkValidation: boolean = false
  myClass: any
  uploadClick: boolean = false
  addImage: boolean = false
  //productImageList: ProductImageInfo[]
  showText: any
  addMoreRef: any
  //isInputGiven: boolean = false
  singleClass
  businessId
  prodServiceFlag
  userId
  shareTypeVal
  typeOfVal
  ProductsOrService
  loading
  slabOrProduct
  checkError: boolean = false
  public hideInput: boolean = false
  logError: InsertErrorLog = new InsertErrorLog()
  stackTrace
  message
  method
  url
  //isSlabProdRadioInvalid: boolean = true
  isMinDealValueInvalid: boolean = true
  resetVal = false
  //radioValue
  @Output() _removeProduct = new EventEmitter<any>()
  @Output() getProducts = new EventEmitter<string>()
  @Output() pushNowComp = new EventEmitter<any>()
  @Output() pushNowTemp = new EventEmitter<any>()
  actionSheetCtrl
  //valueText = ""
  //@Output() productAdded = new EventEmitter<string>();

  constructor(
    public actionSheet: ActionSheetController,
    public navCtrl: NavController,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private platform: Platform,
    private storage: Storage,
    public toastCtrl: ToastController,
    public renderer: Renderer2,
    public modalCtrl: ModalController,
    public businessListService: BusinessListingService,
    private alertCtrl: AlertController,
    public logErrorService: InserErrorLogService,
    private file: File,
    public loadingCtrl: LoadingController,
    public imgService: CommonUtilsService
  ) {
    route.queryParams.subscribe((params: any) => {  
      this.storage.get('specialCategory').then((val) => {
        if (
          val == '5d88e505240f0263e42c615c' ||
          val == '5d88e546240f0263e42c62ff' ||
          val == '5d88e55b240f0263e42c63aa'
        ) {
          this.hideInput = false
        } else {
          this.hideInput = true
        }
      })
      this.prodServiceFlag = params.selectedItem
      console.log('selectedItem', this.prodServiceFlag)
      this.productDetailForm = this.fb.group({
        productName: [null, Validators.required],
        description: [null, Validators.required],
        url: [
          null,
          Validators.pattern(
            '(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'
          ),
        ],
        //productPrice: [null, Validators.pattern("[0-9^\d{1,8}(?:\.?\d{1,4})?$]*")],
        //productPrice: [null, Validators.pattern("^([0-9]*((.)[0-9]{0,2}))$")],
        //productPrice: [null, Validators.pattern("^\d{0,8}(\.\d{1,4})?$")],
        productPrice: [
          null,
          Validators.pattern('^[0-9]?([0-9]+(?:[.][0-9]{0,2})?|.[0-9]+)$'),
        ],
        slabOrProduct: [null, ''],
        dealValue: [
          null,
          Validators.compose([
            Validators.required,
            Validators.pattern('^[0-9]?([0-9]+(?:[.][0-9]{0,2})?|.[0-9]+)$'),
          ]),
        ],
        radioValueTypeOf: [null, Validators.required],
        radioValueshareType: [null, ''],
      })


      // this.productDetails = new ProductInfo()
      this.productList = new Array<ProductInfo>()
      //this.uploadClick = false
      this.addMoreRef = 'hide'
      //this.addImage = false
      this.storage.get('userInfo').then((val) => {
        console.log('userid', val)
        this.userId = val.userId
        this.businessId = val.businessId
      })
  
      // if (this.productDetails.productImages.length < 5 && this.productDetails.productImages.length > 0) {
      //
      //   this.uploadClick = false
      //   this.addImage = true
      //   this.showText = "view"
      // }
      // else if (this.productDetails.productImages.length == 5) {
      //   this.uploadClick = false
      //   this.addImage = false
      //   this.showText = "hide"
      // }
      // else if(this.productDetails.productImages.length == 0){
      //   this.uploadClick = true
      //   this.addImage = false
      //   this.showText = "view"
      // }
      this.platform.backButton.subscribe(() => {
        console.log('cp personel tab')
        if (this.actionSheetCtrl) {
          this.actionSheetCtrl.dismiss()
          this.actionSheetCtrl = undefined
        } else {
          this.navCtrl.pop()
        }
      })
    })
  }

  /**
   * sets the max height to view. It should be a number but currently set to auto.
   */
  ngAfterViewInit() {
    this.renderer.setStyle(
      this.expandWrapper.nativeElement,
      'max-height',
      this.expandHeight
    )
    setTimeout(() => {
      this.selectedImage('', '')
      if (
        this.productDetails.shareType == 1 ||
        this.productDetails.shareType == 2
      ) {
        this.productDetails.isSlabProdRadioInvalid = false
      }
    })
  }

  /**
   * gets an image from camera/gallery
   */
  addProductImage() {
    this.actionSheetCtrl = this.actionSheet.create({
      header: Constants.uploadFromPhone,
      buttons: [
        {
          text: 'Camera',
          handler: () => {
            this.imgService.getImagePromise('Camera').subscribe(
              (res: any) => {
                console.log('Camera', res)
                let productInfo = new ProductImageInfo()
                productInfo.prodImgName = res.fileName
                productInfo.prodImgBase64 = res.base64
                this.myClass = 'view'
                this.uploadClick = false
                this.addImage = true
                this.productDetails.productImages.push(productInfo)
                if (this.productDetails.productImages.length == 5) {
                  this.addImage = false
                  this.showText = 'hide'
                }
                console.log('length', this.productDetails.productImages.length)
              },
              (err) => {
                console.log('Camera', err)
                //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
              }
            )
          },
        },
        {
          text: 'Gallery',
          handler: () => {
            this.imgService.getImagePromise('Gallery').subscribe(
              (res: any) => {
                console.log('Gallery', res)
                let productInfo = new ProductImageInfo()
                productInfo.prodImgName = res.fileName
                productInfo.prodImgBase64 = res.base64
                this.myClass = 'view'
                this.uploadClick = false
                this.addImage = true
                this.productDetails.productImages.push(productInfo)
                if (this.productDetails.productImages.length == 5) {
                  this.addImage = false
                  this.showText = 'hide'
                }
                console.log('length', this.productDetails.productImages.length)
              },
              (err) => {
                console.log('Gallery', err)
                //  Utility\.showToast\(this\.toastCtrl, Constants\.sorryCantAccessTheFile, false, ''\)
              }
            )
          },
        },
      ],
    }).then(actionSheetCtrl => actionSheetCtrl.present())
  }

  async selectedImage(img, index) {
    //
    if (img != '') {
      if (this.productDetails.productImages[index].isDefaultImg == false) {
        let profileModal = await this.modalCtrl.create({
          component: PopupConfirmationAlertComponent, 
          componentProps: {
            text: Constants.doYouWantToMakeThisDefault,
          },
          cssClass: 'popupConfirmationAlert'
        })
        profileModal.present()
        let { data } = await profileModal.onDidDismiss()
          //
        if (data == 'ok') {
          for (let i = 0; i < this.productDetails.productImages.length; i++) {
            if (index == i) {
              this.productDetails.productImages[i].isDefaultImg = true
              this.productDetails.productImages[i].myClass = 'defaultImage'
            } else {
              this.productDetails.productImages[i].myClass = ''
              this.productDetails.productImages[i].isDefaultImg = false
            }
          }

          /*           this.productDetails.productImages.forEach(item => {
                      if (item.prodImgBase64 == img.prodImgBase64) {
                        item.isDefaultImg = true
                        item.myClass = 'defaultImage'
                      } else {
                        item.myClass = ''
                        item.isDefaultImg = false
                      }
                    }) */
        }
        
      }
    } else {
      this.productDetails.productImages.forEach((item) => {
        //
        if (item.isDefaultImg) {
          item.isDefaultImg = true
          item.myClass = 'defaultImage'
        } else {
          item.myClass = ''
          item.isDefaultImg = false
        }
      })
    }
  }

  /**
   * removes imageObject from the list and add the add more button to ui if it was invisible before
   * @param imageData object to remove
   * @param index index of the object to remove
   */
  async deleteImage(imageData, index) {
    console.log('imagedata', imageData)

    let profileModal = await this.modalCtrl.create({
      component: PopupConfirmationAlertComponent,
      componentProps: { text: Constants.areYouSureToRemovePhoto },
      cssClass: 'popupConfirmationAlert dualLineHeight'
    })
    profileModal.present()
    const {data} = await profileModal.onDidDismiss()
    //
    if (data == 'ok') {
      //this.productDetails.productImages.splice(index, 1)
      console.log('prod details', this.productDetails)
      if (this.productDetails.productId && imageData.uniqueName) {
        console.log(
          'prod details',
          this.productDetails.productImages[index].uniqueName
        )
        console.log('prod details image data', imageData.uniqueName)

        // for (let i = 0; i < this.productDetails.productImages.length; i++) {
        //   if (this.productDetails.productImages[i].ImageURL != null
        //     && this.productDetails.productImages[i].ImageURL != undefined
        //     && this.productDetails.productImages[i].ImageURL != "") {
        //     this.productDetails.productImages[i].prodImgBase64 = ""
        //   }
        // }
        // this.checkValidations("image")

        this.businessListService
          .removeImage(this.productDetails.productId, imageData.uniqueName)
          .subscribe((res: any) => {
            console.log('res in remove image', res)
            if (res.status == 200) {
              Utility.showToast(
                this.toastCtrl,
                this.productDetails.type +
                  ' ' +
                  'image removed successfully.',
                false,
                '',
                false
              )
              this.productDetails.productImages.splice(index, 1)
              // if(this.productDetails.productImages.length == 5){
              //   this.addImage = false
              //   this.uploadClick = false
              // }
              // else if(this.productDetails.productImages.length < 5){
              //   this.addImage = true
              //   this.uploadClick = false
              // }
              // else if(this.productDetails.productImages.length < 0){
              //   this.addImage = false
              //   this.uploadClick = true
              // }

              if (
                this.productDetails.productImages.length < 5 &&
                this.productDetails.productImages.length > 0
              ) {
                this.addImage = true
                this.uploadClick = false
                this.showText = 'view'
              } else if (this.productDetails.productImages.length == 0) {
                this.uploadClick = true
                this.addImage = false
                this.showText = 'view'
              }
            }
          }),
          (err) => {
            console.log('err in remove image', err)
            Utility.showToast(
              this.toastCtrl,
              this.productDetails.type + ' ' + 'image failed to remove.',
              false,
              '',
              false
            )
            this.url = Urls.baseUrl + Urls.port + Constants.removeImage
            this.stackTrace = err.stack
            this.message = err.message
            this.method = 'deleteImage'
            this.inserErrorApi()
          }
      } else {
        Utility.showToast(
          this.toastCtrl,
          this.productDetails.type + ' ' + 'image removed successfully.',
          false,
          '',
          false
        )
        this.productDetails.productImages.splice(index, 1)
        if (
          this.productDetails.productImages.length < 5 &&
          this.productDetails.productImages.length > 0
        ) {
          this.addImage = true
          this.uploadClick = false
          this.showText = 'view'
        } else if (this.productDetails.productImages.length == 0) {
          this.uploadClick = true
          this.addImage = false
          this.showText = 'view'
        }
      }
      // if (this.productDetails.productImages.length < 5 && this.productDetails.productImages.length > 0) {
      //   this.addImage = true
      //   this.showText = 'view'
      // } else {
      //   this.uploadClick = true
      //   this.addImage = false
      //   this.showText = 'view'
      // }
      console.log(
        'array list in delete',
        this.productDetails.productImages.length
      )
    }
  }

  /**
   * shows the upload view
   */
  addMoreImage() {
    this.uploadClick = true
    this.addImage = false
  }

  /**
   *
   * @param index
   */
  async selectReferancePer(index: any) {
    if (this.resetVal) {
      this.resetVal = false
      return
    }
    if (this.productDetails.canUpdateRefData == true) {
      this.shareTypeVal = index
      //this.isInputGiven = true
      if (index == 1) {
        // this.isInputGiven = true
        this.productDetails.isSlabProdRadioInvalid = false
        if (this.productDetails.ProductsOrServices.length == 0) {
          this.productDetails.ProductsOrServices = new Array<ReferralDataInfo>()
          let refData = new ReferralDataInfo()
          refData.type = '1'
          this.productDetails.ProductsOrServices.push(refData)
          this.productDetails.showMultiple = false
          this.productDetails.addSingleProduct = true
          this.productDetails.showSlabs = false
          this.productDetails.showProducts = false
          this.productDetails.typeOf = index || 1
          this.productDetails.shareType = null
          this.addMoreRef = 'hide'
          this.singleClass = 'single-ref'
        } else {
          this.alertCtrl.create({
            message: Constants.yourDataWillBeLost,
            buttons: [
              {
                text: 'Cancel',
                handler: () => {
                  this.productDetails.typeOf = 2
                },
              },
              {
                text: Constants.continueAnyway,
                handler: () => {
                  this.productDetails.showMultiple = false
                  this.productDetails.addSingleProduct = true
                  this.productDetails.showSlabs = false
                  this.productDetails.showProducts = false
                  
                  this.productDetails.shareType = null
                  this.addMoreRef = 'hide'
                  this.singleClass = 'single-ref'
                  this.productDetails.ProductsOrServices =
                    new Array<ReferralDataInfo>()
                  let refData = new ReferralDataInfo()
                  refData.type = '1'
                  this.productDetails.ProductsOrServices.push(refData)
                },
              },
            ],
          }).then(alertChange => alertChange.present())
        }
      } else {
        //this.isInputGiven = true
        this.productDetails.isSlabProdRadioInvalid = true
        if (this.productDetails.ProductsOrServices.length == 0) {
          //let refData = new ReferralDataInfo()
          // refData.type = "1"
          //this.productDetails.ProductsOrServices.push(refData)
          this.productDetails.ProductsOrServices = new Array<ReferralDataInfo>()
          this.productDetails.addSingleProduct = false
          this.productDetails.showMultiple = true
          this.productDetails.typeOf = index || 1
          this.addMoreRef = 'hide'
          this.singleClass = 'multi-ref'
        } else {
          this.alertCtrl.create({
            message: Constants.yourDataWillBeLost,
            buttons: [
              {
                text: 'Cancel',
                handler: () => {
                  this.productDetails.typeOf = 1
                },
              },
              {
                text: Constants.continueAnyway,
                handler: () => {
                  this.productDetails.addSingleProduct = false
                  this.productDetails.showMultiple = true
                  this.productDetails.typeOf = index || 1
                  this.addMoreRef = 'hide'
                  this.singleClass = 'multi-ref'
                  this.productDetails.ProductsOrServices =
                    new Array<ReferralDataInfo>()
                },
              },
            ],
          }).then(alertChange => alertChange.present())
        }
      }
    } else {
      let profileModal = await this.modalCtrl.create({
        component: PopupConfirmationAlertComponent,
        componentProps: {
          text: Constants.cantChangeRefData, cancelClass: 'invisible',
        },
        cssClass: 'popupConfirmationAlert threeLineHeight'
      })
      profileModal.present()
      
      const {data} = await profileModal.onDidDismiss()
      this.resetVal = true
      console.log('res in dialuag confirmation---------', data)
        if (index == 1) {
          this.productDetails.typeOf = 2
        } else {
          this.productDetails.typeOf = 1
        }
    }
  }

  /**
   *
   * @param value
   */
  async selectValue(value: any) {
    if (this.resetVal) {
      this.resetVal = false
      return
    }
    //
    this.productDetails.isSlabProdRadioInvalid = false
    if (this.productDetails.canUpdateRefData == true) {
      this.typeOfVal = value
      if (value == 1) {
        this.productDetails.showSlabs = true
        this.productDetails.showProducts = false
        this.productDetails.addSingleProduct = false
        this.productDetails.shareType = value
        this.addMoreRef = 'view'
        if (this.productDetails.ProductsOrServices.length == 0) {
          this.productDetails.ProductsOrServices = new Array<ReferralDataInfo>()
          let refData = new ReferralDataInfo()
          refData.type = '1'
          this.productDetails.ProductsOrServices.push(refData)
        } else {
          this.alertCtrl.create({
            message: Constants.yourProdDataWillBeLost,
            buttons: [
              {
                text: 'Cancel',
                handler: () => {
                  this.productDetails.showSlabs = false
                  this.productDetails.showProducts = true
                  this.productDetails.addSingleProduct = false
                  this.productDetails.shareType = 2
                  this.addMoreRef = 'view'
                  this.slabOrProduct = 'multiple'
                  /* this.productDetails.ProductsOrServices = new Array<ReferralDataInfo>()
                  let refData = new ReferralDataInfo()
                  refData.type = "1"
                  this.productDetails.ProductsOrServices.push(refData) */
                },
              },
              {
                text: Constants.continueAnyway,
                handler: () => {
                  this.productDetails.ProductsOrServices = new Array<any>()
                  if (this.productDetails.ProductsOrServices.length == 0) {
                    let refData = new ReferralDataInfo()
                    refData.type = '1'
                    this.productDetails.ProductsOrServices.push(refData)
                  }
                },
              },
            ],
          }).then(alertChange => alertChange.present())
        }
      } else {
        this.productDetails.showProducts = true
        this.productDetails.showSlabs = false
        this.productDetails.addSingleProduct = false
        this.productDetails.shareType = value
        this.addMoreRef = 'view'
        if (this.productDetails.ProductsOrServices.length == 0) {
          this.productDetails.ProductsOrServices = new Array<ReferralDataInfo>()
          let refData = new ReferralDataInfo()
          refData.type = '1'
          this.productDetails.ProductsOrServices.push(refData)
        } else {
          this.alertCtrl.create({
            message: Constants.yourSlabDataWillBeLost,
            buttons: [
              {
                text: 'Cancel',
                handler: () => {
                  this.productDetails.showSlabs = true
                  this.productDetails.showProducts = false
                  this.productDetails.addSingleProduct = false
                  this.productDetails.shareType = 1
                  this.addMoreRef = 'view'
                  this.slabOrProduct = 'single'
                  /* this.productDetails.ProductsOrServices = new Array<ReferralDataInfo>()
                  let refData = new ReferralDataInfo()
                  refData.type = "1"
                  this.productDetails.ProductsOrServices.push(refData) */
                },
                // role: 'cancel'
              },
              {
                text: Constants.continueAnyway,
                handler: () => {
                  this.productDetails.ProductsOrServices = new Array<any>()
                  if (this.productDetails.ProductsOrServices.length == 0) {
                    let refData = new ReferralDataInfo()
                    refData.type = '1'
                    this.productDetails.ProductsOrServices.push(refData)
                  }
                },
                //role: 'ok'
              },
            ],
          }).then(alertChange => alertChange.present())
        }
      }
    } else {
      let profileModal = await this.modalCtrl.create({
        component: PopupConfirmationAlertComponent,
        componentProps: {
          title: ' ',
          text: Constants.cantChangeRefData,
          cancelClass: 'invisible',
        },
        cssClass: 'popupConfirmationAlert threeLineHeight'
      })
      profileModal.present()
      
      const {data} = await profileModal.onDidDismiss()
      
      console.log('res in dialuag confirmation22222222', data)
      this.resetVal = true
        if (value == 1) {
          this.productDetails.shareType = 2
        } else {
          this.productDetails.shareType = 1
        }
    }
    console.log('this.productDetails.shareType', this.productDetails)
  }

  //save the product/service the server
  async saveProductDetail() {
    this.productDetails.name = this.productDetailForm.value.productName
    this.productDetails.description = this.productDetailForm.value.description
    this.productDetails.minimumDealValue =
      this.productDetailForm.value.dealValue
    this.productDetails.businessId = this.businessId
    if (this.prodServiceFlag == 'products') {
      this.productDetails.type = 'Product'
      this.productDetails.productPrice =
        this.productDetailForm.value.productPrice
      if (this.hideInput == false) {
        this.productDetails.productPrice = 0
      }
    } else if (this.prodServiceFlag == 'services') {
      this.productDetails.type = 'Service'
    } else {
      this.productDetails.type = 'Service'
    }
    this.productDetails.url = this.productDetailForm.value.url
    if (this.productDetails.productId) {
      for (let i = 0; i < this.productDetails.productImages.length; i++) {
        if (
          this.productDetails.productImages[i].ImageURL != null &&
          this.productDetails.productImages[i].ImageURL != undefined &&
          this.productDetails.productImages[i].ImageURL != ''
        ) {
          this.productDetails.productImages[i].prodImgBase64 = ''
        }
      }
    }
    this.productDetails.createdBy = this.userId
    console.log('object', this.productDetails.ProductsOrServices)
    console.log('main object', this.productDetails)
    console.log('main object json', JSON.stringify(this.productDetails))
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.loading.present()
    this.businessListService
      .updateProductOrServicesApi(this.productDetails)
      .subscribe(
        (data) => {
          console.log('data rcv ', data)
          if (this.loading) this.loading.dismiss()
          if (data != null) {
            if (data.status == 200) {
              if (this.productDetails.productId) {
                Utility.showToast(
                  this.toastCtrl,
                  this.productDetails.type + ' ' + 'updated successfully',
                  false,
                  '',
                  false
                )
              } else {
                Utility.showToast(
                  this.toastCtrl,
                  this.productDetails.type + ' added successfully.',
                  false,
                  '',
                  false
                )
              }
              this.productDetails.expanded = false
              this.getProducts.emit()
            }
          }
        },
        (err) => {
          if (this.loading) this.loading.dismiss()
          if (this.productDetails.productId) {
            Utility.showToast(
              this.toastCtrl,
              this.productDetails.type + ' failed to update.',
              false,
              '',
              false
            )
          } else {
            Utility.showToast(
              this.toastCtrl,
              this.productDetails.type + ' failed to add.',
              false,
              '',
              false
            )
          }
          console.log('data error ', err)
          this.productDetails.expanded = true
          this.url =
            Urls.baseUrl + Urls.port + Constants.updateProductOrservices
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'saveProductDetail'
          this.inserErrorApi()
        }
      )
  }

  removeItem() {}

  async checkValidations(type: string) {
    console.log('checkValidations', this.productDetails)
    this.checkValidation = true
    this.validateMinDealValue()
    this.nameChanged()

    if (this.hideInput == false) {
      // this.productDetailForm.removeControl('dealValue')
      // this.productDetailForm.removeControl('radioValueTypeOf')
      if (this.productDetailForm.valid) {
        if (type == 'add') {
          if (this.isMinDealValueInvalid == false) this.saveProductDetail()
          //else
          // this.scrollToError()
        } else {
          this.removeProductData(type)
        }
      } else {
        // this.scrollToError()
      }
    } else {
      if (this.productDetails.ProductsOrServices.length > 0) {
        if (this.productDetailForm.valid) {
          if (this.productDetails.isSameProductName == false) {
            if (this.productDetails.typeOf == 1) {
              if (
                this.productDetails.ProductsOrServices[0].type != null &&
                this.productDetails.ProductsOrServices[0].type != undefined &&
                this.productDetails.ProductsOrServices[0].type != ''
              ) {
                this.productDetails.ProductsOrServices[0].isInValidType = false
                if (
                  this.productDetails.ProductsOrServices[0].value != null &&
                  this.productDetails.ProductsOrServices[0].value != undefined
                ) {
                  this.productDetails.ProductsOrServices[0].isValueNotEntered =
                    false

                  if (this.productDetails.ProductsOrServices[0].value >= 0) {
                    this.productDetails.ProductsOrServices[0].isInValidValue =
                      false

                    if (this.checkDataChangedValidations(type) == true) {
                      if (
                        this.productDetails.ProductsOrServices[0].type == '1'
                      ) {
                        if (
                          this.productDetails.ProductsOrServices[0].value <
                            100 &&
                          this.productDetails.ProductsOrServices[0].value > 0
                        ) {
                          this.productDetails.ProductsOrServices[0].isInValidValue =
                            false
                          if (this.isMinDealValueInvalid == false)
                            this.checkValidation = false
                          this.productDetails.ProductsOrServices[0].isInValid =
                            false
                          if (type == 'add') {
                            if (this.isMinDealValueInvalid == false) {
                              this.saveProductDetail()
                            } else {
                              this.checkError = false
                              this.scrollToError()
                            }
                          } else {
                            this.removeProductData(type)
                          }
                        } else {
                          this.checkValidation = true
                          this.productDetails.ProductsOrServices[0].isInValidValue =
                            true

                          this.productDetails.ProductsOrServices[0].isValueNotEntered =
                            false
                        }
                      } else {
                        if (
                          this.productDetails.ProductsOrServices[0].value > 0
                        ) {
                          if (
                            this.productDetails.ProductsOrServices[0].value >
                            999999999
                          ) {
                            this.productDetails.ProductsOrServices[0].isInValidLengthValue =
                              true
                            this.productDetails.ProductsOrServices[0].isInValid =
                              true
                            this.scrollToError()
                            this.checkError = false
                          } else {
                            this.productDetails.ProductsOrServices[0].isInValidValue =
                              false
                            if (
                              this.productDetails.ProductsOrServices[0].value <
                              +this.productDetails.minimumDealValue
                            ) {
                              this.productDetails.ProductsOrServices[0].isInValidValueRup =
                                false
                              if (this.isMinDealValueInvalid == false)
                                this.checkValidation = false
                              this.productDetails.ProductsOrServices[0].isInValid =
                                false
                              if (type == 'add') {
                                if (this.isMinDealValueInvalid == false)
                                  this.saveProductDetail()
                                else {
                                  this.scrollToError()
                                  this.checkError = false
                                }
                              } else this.removeProductData(type)
                            } else {
                              this.productDetails.ProductsOrServices[0].isInValidValueRup =
                                true

                              this.productDetails.ProductsOrServices[0].isValueNotEntered =
                                false
                            }
                          }
                        } else if (
                          +this.productDetails.ProductsOrServices[0].value <= 0
                        ) {
                          //asdasdasdasd rupee
                          this.productDetails.ProductsOrServices[0].isInValidValue =
                            true
                          this.productDetails.ProductsOrServices[0].isInValid =
                            true
                          this.scrollToError()
                          this.checkError = false
                        }
                      }
                    } else {
                      let profileModal = await this.modalCtrl.create({
                        component: PopupConfirmationAlertComponent,
                        componentProps: {
                          text: Constants.cantChangeRefData,
                          cancelClass: 'invisible',
                        },
                        cssClass: 'popupConfirmationAlert threeLineHeight' 
                      })
                      profileModal.present()
                      const {data} = await profileModal.onDidDismiss()
                      this.productDetails.ProductsOrServices = JSON.parse(
                        JSON.stringify(
                          this.productDetails.tempProductsOrServices
                        )
                      )
                      
                    }
                  } else {
                    this.productDetails.ProductsOrServices[0].isInValidValue =
                      true
                    this.productDetails.ProductsOrServices[0].isValueNotEntered =
                      false

                    this.checkError = false
                    this.scrollToError()
                  }
                } else {
                  this.productDetails.ProductsOrServices[0].isValueNotEntered =
                    true

                  console.log('checkValidations not valid 1')
                  this.checkError = false
                  this.productDetails.ProductsOrServices[0].isValueNotEntered =
                    true
                  this.scrollToError()
                }
              } else {
                console.log('checkValidations not valid 2')
                this.checkError = false

                this.scrollToError()
                this.productDetails.ProductsOrServices[0].isInValidType = true
              }
            } else if (this.productDetails.typeOf == 2) {
              this.checkError = false

              if (
                this.productDetails.ProductsOrServices.length == 0 &&
                type == 'reference'
              ) {
                this.checkError = true
                console.log('this.checkError 1')
              } else {
                for (
                  let i = 0;
                  i < this.productDetails.ProductsOrServices.length;
                  i++
                ) {
                  if (
                    this.productDetails.ProductsOrServices[i].type != null &&
                    this.productDetails.ProductsOrServices[i].type !=
                      undefined &&
                    this.productDetails.ProductsOrServices[i].type != ''
                  ) {
                    this.productDetails.ProductsOrServices[i].isInValidType =
                      false
                    if (
                      this.productDetails.ProductsOrServices[i].value != null &&
                      this.productDetails.ProductsOrServices[i].value !=
                        undefined
                    ) {
                      this.productDetails.ProductsOrServices[
                        i
                      ].isValueNotEntered = false

                      if (
                        this.productDetails.ProductsOrServices[i].value >= 0
                      ) {
                        this.productDetails.ProductsOrServices[
                          i
                        ].isInValidValue = false

                        if (
                          this.productDetails.ProductsOrServices[i].type == '1'
                        ) {
                          if (
                            this.productDetails.ProductsOrServices[i].value <
                              100 &&
                            this.productDetails.ProductsOrServices[i].value > 0
                          ) {
                            this.productDetails.ProductsOrServices[
                              i
                            ].isInValidValue = false

                            if (this.productDetails.shareType == 1) {
                              //slab
                              if (
                                this.productDetails.ProductsOrServices[i]
                                  .from != null &&
                                this.productDetails.ProductsOrServices[i]
                                  .from != undefined &&
                                this.productDetails.ProductsOrServices[i]
                                  .from != ''
                              ) {
                                this.productDetails.ProductsOrServices[
                                  i
                                ].isInValidSlabFrom = false
                                if (
                                  this.productDetails.ProductsOrServices[i]
                                    .to != null &&
                                  this.productDetails.ProductsOrServices[i]
                                    .to != undefined &&
                                  this.productDetails.ProductsOrServices[i]
                                    .to != ''
                                ) {
                                  this.productDetails.ProductsOrServices[
                                    i
                                  ].isInValidSlabTo = false
                                  if (this.isMinDealValueInvalid == false)
                                    this.checkValidation = false
                                  this.productDetails.ProductsOrServices[
                                    i
                                  ].isInValid = false
                                  this.checkError = true
                                  //this.saveProductDetail()
                                  this.onKey(
                                    this.productDetails.ProductsOrServices[i],
                                    i
                                  )
                                } else {
                                  console.log('checkValidations not valid 1')
                                  this.checkError = false
                                  this.productDetails.ProductsOrServices[
                                    i
                                  ].isInValid = true
                                  //this.scrollToError()
                                  this.productDetails.ProductsOrServices[
                                    i
                                  ].isInValidSlabTo = true
                                }
                              } else {
                                console.log('checkValidations not valid 1')
                                this.checkError = false
                                //this.scrollToError()
                                this.productDetails.ProductsOrServices[
                                  i
                                ].isInValidSlabFrom = true
                                this.productDetails.ProductsOrServices[
                                  i
                                ].isInValid = true
                              }
                            } else if (this.productDetails.shareType == 2) {
                              //product

                              if (
                                this.productDetails.ProductsOrServices[i]
                                  .productName != null &&
                                this.productDetails.ProductsOrServices[i]
                                  .productName != undefined &&
                                this.productDetails.ProductsOrServices[i]
                                  .productName != ''
                              ) {
                                this.productDetails.ProductsOrServices[
                                  i
                                ].isInvalidProduct = false
                                if (
                                  this.productDetails.ProductsOrServices[i]
                                    .isSameProductName == false
                                ) {
                                  if (this.isMinDealValueInvalid == false)
                                    this.checkValidation = false
                                  this.productDetails.ProductsOrServices[
                                    i
                                  ].isInValid = false
                                  this.checkError = true
                                } else {
                                  console.log('checkValidations not valid 1')
                                  this.checkError = false
                                  this.scrollToError()
                                  this.productDetails.ProductsOrServices[
                                    i
                                  ].isInValid = true
                                  this.productDetails.ProductsOrServices[
                                    i
                                  ].isInvalidProduct = true
                                }

                                //this.saveProductDetail()
                                //this.onKey(this.productDetails.ProductsOrServices[i], i)
                              } else {
                                console.log('checkValidations not valid 1')
                                this.checkError = false
                                // this.scrollToError()
                                this.productDetails.ProductsOrServices[
                                  i
                                ].isInValid = true
                                this.productDetails.ProductsOrServices[
                                  i
                                ].isInvalidProduct = true
                              }
                            }
                          } else {
                            this.checkError = false
                            this.scrollToError()
                            this.productDetails.ProductsOrServices[
                              i
                            ].isInValid = true
                            this.checkValidation = true

                            this.productDetails.ProductsOrServices[
                              i
                            ].isInValidValue = true

                            this.productDetails.ProductsOrServices[
                              i
                            ].isValueNotEntered = false
                          }
                        } else {
                          if (
                            this.productDetails.ProductsOrServices[i].value > 0
                          ) {
                            if (
                              this.productDetails.ProductsOrServices[i].value >
                              999999999
                            ) {
                              this.productDetails.ProductsOrServices[
                                i
                              ].isInValidLengthValue = true
                              this.productDetails.ProductsOrServices[
                                i
                              ].isInValid = true
                              this.scrollToError()
                              this.checkError = false
                            } else {
                              if (this.productDetails.shareType == 1) {
                                //slab

                                if (
                                  this.productDetails.ProductsOrServices[i]
                                    .from != null &&
                                  this.productDetails.ProductsOrServices[i]
                                    .from != undefined &&
                                  this.productDetails.ProductsOrServices[i]
                                    .from != ''
                                ) {
                                  if (
                                    this.productDetails.ProductsOrServices[i]
                                      .to != null &&
                                    this.productDetails.ProductsOrServices[i]
                                      .to != undefined &&
                                    this.productDetails.ProductsOrServices[i]
                                      .to != ''
                                  ) {
                                    if (this.isMinDealValueInvalid == false)
                                      this.checkValidation = false
                                    this.productDetails.ProductsOrServices[
                                      i
                                    ].isInValid = false
                                    this.checkError = true
                                    console.log('this.checkError 2')
                                    //this.saveProductDetail()
                                    this.onKey(
                                      this.productDetails.ProductsOrServices[i],
                                      i
                                    )
                                  } else {
                                    console.log('checkValidations not valid 1')
                                    this.checkError = false
                                    //this.scrollToError()
                                    this.productDetails.ProductsOrServices[
                                      i
                                    ].isInValid = true
                                  }
                                } else {
                                  console.log('checkValidations not valid 1')
                                  this.checkError = false
                                  // this.scrollToError()
                                  this.productDetails.ProductsOrServices[
                                    i
                                  ].isInValid = true
                                }
                              } else if (this.productDetails.shareType == 2) {
                                //product

                                if (
                                  this.productDetails.ProductsOrServices[i]
                                    .productName != null &&
                                  this.productDetails.ProductsOrServices[i]
                                    .productName != undefined &&
                                  this.productDetails.ProductsOrServices[i]
                                    .productName != ''
                                ) {
                                  if (
                                    this.productDetails.ProductsOrServices[i]
                                      .value > 0
                                  ) {
                                    if (this.isMinDealValueInvalid == false)
                                      this.checkValidation = false
                                    this.productDetails.ProductsOrServices[
                                      i
                                    ].isInValid = false
                                    this.checkError = true
                                    console.log('this.checkError 3')
                                    //this.saveProductDetail()
                                    //this.onKey(this.productDetails.ProductsOrServices[i], i)
                                  } else {
                                    this.productDetails.ProductsOrServices[
                                      i
                                    ].isInValid = true
                                    console.log('checkValidations not valid 1')
                                    this.checkError = false
                                  }
                                } else {
                                  console.log('checkValidations not valid 1')
                                  this.checkError = false
                                  //this.scrollToError()
                                  this.productDetails.ProductsOrServices[
                                    i
                                  ].isInValid = true
                                }
                              }
                            }
                          } else {
                            console.log('checkValidations not valid 2')
                            this.checkError = false
                            // this.scrollToError()
                            this.productDetails.ProductsOrServices[
                              i
                            ].isInValid = true
                          }
                        }
                      } else {
                        this.checkError = false
                        this.scrollToError()
                        this.productDetails.ProductsOrServices[i].isInValid =
                          true
                        this.productDetails.ProductsOrServices[
                          i
                        ].isInValidValue = true
                        this.productDetails.ProductsOrServices[
                          i
                        ].isValueNotEntered = false
                      }
                    } else {
                      console.log('checkValidations not valid 2')
                      this.checkError = false
                      this.productDetails.ProductsOrServices[i].isInValid = true
                      this.scrollToError()
                      this.productDetails.ProductsOrServices[
                        i
                      ].isValueNotEntered = true
                    }
                  } else {
                    console.log('checkValidations not valid 2')
                    this.productDetails.ProductsOrServices[i].isInValidType =
                      true
                    this.productDetails.ProductsOrServices[i].isInValid = true
                  }
                }
                if (this.checkError == true) {
                  for (
                    let j = 0;
                    j < this.productDetails.ProductsOrServices.length;
                    j++
                  ) {
                    console.log(
                      'this.productDetails.ProductsOrServices[' +
                        j +
                        '].isInValid',
                      this.productDetails.ProductsOrServices[j].isInValid
                    )
                    if (
                      this.productDetails.ProductsOrServices[j].isInValid ==
                      true
                    ) {
                      this.checkError = false
                      // this.scrollToError()
                      break
                    } else if (
                      this.productDetails.ProductsOrServices[j].isSlabInValid ==
                      true
                    ) {
                      this.checkError = false
                      // this.scrollToError()
                      break
                    } else {
                      this.checkError = true
                    }
                  }
                } else {
                  this.checkError = false
                  this.scrollToError()
                }
                if (this.checkError == true) {
                  if (this.checkDataChangedValidations(type) == true) {
                    if (type == 'add') {
                      if (this.isMinDealValueInvalid == false) {
                        if (this.productDetails.ProductsOrServices.length > 1) {
                          this.productDetails.isSlabProdLengthInvalid = false
                          this.saveProductDetail()
                        } else {
                          if (
                            this.productDetails.ProductsOrServices.length ==
                              1 &&
                            this.productDetails.ProductsOrServices[0]
                              .isInValid == false
                          ) {
                            this.productDetails.isSlabProdLengthInvalid = true
                            this.checkError = false
                            this.scrollToError()
                          }
                        }
                      } else {
                        this.checkError = false
                        this.scrollToError()
                      }
                    } else this.removeProductData(type)
                  } else {
                    let profileModal = await this.modalCtrl.create({
                      component: PopupConfirmationAlertComponent,
                      componentProps: {
                        text: Constants.cantChangeRefData,
                        cancelClass: 'invisible',
                      },
                      cssClass: 'popupConfirmationAlert threeLineHeight' 
                    })
                    profileModal.present()
                    const {data} = await profileModal.onDidDismiss()
                    this.productDetails.ProductsOrServices = JSON.parse(
                      JSON.stringify(
                        this.productDetails.tempProductsOrServices
                      )
                    )
                  }
                }
              }
            }
          } else {
            this.checkError = false
            this.scrollToError()
          }
        } else {
          this.checkError = false
          this.scrollToError()
        }
      } else {
        this.checkError = false
        this.scrollToError()
      }
    }
  }

  getSelectedCurrency(event) {
    console.log('event', event)
    console.log('event2', this.productDetails)
    /* if (this.productDetails.ProductsOrServices.length == 0) {
        let refData = new ReferralDataInfo()
        refData.type=event
        this.productDetails.ProductsOrServices.push(refData)
    }
    if(this.productDetails.ProductsOrServices.length == 1){
        this.productDetails.ProductsOrServices[0].type=event
    }
 */
  }

  async removeReference(i) {
    /*   if (this.productDetails.ProductsOrServices.length == 1) {
       Utility.showToast(this.toastCtrl, Constants.atleastOneReferralPercAmt, false, "", true)
     } else{  */
    if (this.productDetails.ProductsOrServices.length > 2) {
      let profileModal = await this.modalCtrl.create({
        component: PopupConfirmationAlertComponent,
        componentProps: {},
        cssClass: 'popupConfirmationAlert dualLineHeight'
      })
      profileModal.present()
      const {data} = await profileModal.onDidDismiss()
      if (data == 'ok') {
        if (this.productDetails.ProductsOrServices[i].productDetailsId) {
          this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
          this.loading.present()
          this.businessListService
            .removeReference(
              this.productDetails.ProductsOrServices[i].productDetailsId
            )
            .subscribe(
              (res: any) => {
                if (this.loading) this.loading.dismiss()
                if (res.status == 200) {
                  this.productDetails.ProductsOrServices.splice(i, 1)
                  if (this.productDetails.ProductsOrServices.length < 10) {
                    this.addMoreRef = 'view'
                  }
                  if (
                    this.productDetails.ProductsOrServices.length == 1 &&
                    this.productDetails.ProductsOrServices[0].isInValid ==
                      false
                  ) {
                    this.productDetails.isSlabProdLengthInvalid = true
                    this.checkError = false
                    this.scrollToError()
                  }
                  Utility.showToast(
                    this.toastCtrl,
                    Constants.refPercentDataRemovedSuccessfully,
                    false,
                    '',
                    false
                  )
                }
              },
              (err) => {
                if (this.loading) this.loading.dismiss()
                console.log('err', err)
                Utility.showToast(
                  this.toastCtrl,
                  Constants.refPercentDataRemovelFailed,
                  false,
                  '',
                  false
                )
                this.url =
                  Urls.baseUrl + Urls.port + Constants.removeReferrence
                this.stackTrace = err.stack
                this.message = err.message
                this.method = 'removeReference'
                this.inserErrorApi()
              }
            )
        } else {
          if (this.productDetails.ProductsOrServices.length > 2) {
            this.productDetails.ProductsOrServices.splice(i, 1)
            Utility.showToast(
              this.toastCtrl,
              Constants.refPercentDataRemovedSuccessfully,
              false,
              '',
              false
            )
            if (this.productDetails.ProductsOrServices.length < 10) {
              this.addMoreRef = 'view'
            }
            if (
              this.productDetails.ProductsOrServices.length == 1 &&
              this.productDetails.ProductsOrServices[0].isInValid == false
            ) {
              this.productDetails.isSlabProdLengthInvalid = true
              this.checkError = false
              this.scrollToError()
            }
          }
        }

        /*           if (this.productDetails.ProductsOrServices[i].productDetailsId) {
                    this.productDetails.ProductsOrServices[i].isActive = false
                    this.checkValidations("reference")
                  } else {
                    if (this.productDetails.ProductsOrServices.length >= 1) {
                      this.productDetails.ProductsOrServices.splice(i, 1)
                      if (this.productDetails.ProductsOrServices.length < 10) {
                        this.addMoreRef = 'view'
                      }
                    }
                  } */
      }
    }
  }

  addMoreRefData() {
    console.log('addMoreRefData')
    let refData = new ReferralDataInfo()
    refData.type = '1'
    this.productDetails.ProductsOrServices.push(refData)
    if (this.productDetails.ProductsOrServices.length == 10) {
      this.addMoreRef = 'hide'
    }
    if (this.productDetails.ProductsOrServices.length > 1) {
      this.productDetails.isSlabProdLengthInvalid = false
    } else if (this.productDetails.ProductsOrServices.length <= 1) {
      this.productDetails.isSlabProdLengthInvalid = true
    }
  }

  removeProduct(productDetail: ProductInfo) {
    /*     console.log("Remove")
        if (this.productDetails.productId) {
        this.businessListService.removeProduct(productDetail.productId).subscribe(res => {
          if (res.status == 200) {
            this.productList.slice(this.index, 1)
          }
        }, err => {
          Utility.showToast(this.toastCtrl, "Failed to remove product.", false, "", false)
        })
      } */

    console.log('Remove')
    /*      if (this.productDetails.productId) {
           for (let i = 0; i < this.productDetails.productImages.length; i++) {
             if (this.productDetails.productImages[i].ImageURL != null
               && this.productDetails.productImages[i].ImageURL != undefined
               && this.productDetails.productImages[i].ImageURL != "") {
               this.productDetails.productImages[i].prodImgBase64 = ""
             }
           }
         } */
    this._removeProduct.emit({ product: productDetail, index: this.index })
  }

  convertToBase64(imagePath: string): any {
    ////

    if (imagePath != null && imagePath != undefined && imagePath != '') {
      let path = imagePath.substring(0, imagePath.lastIndexOf('/'))
      let filename = imagePath.substring(
        imagePath.lastIndexOf('/'),
        imagePath.length
      )
      filename = filename.replace('/', '')
      console.log('path', path)
      console.log('filename', filename)
      this.file
        .readAsDataURL(path, filename)
        .then((content) => {
          ////
          console.log('content', content)
          let productInfo = new ProductImageInfo()
          productInfo.prodImgName = filename
          productInfo.prodImgBase64 = content
          this.myClass = 'view'
          this.uploadClick = false
          this.addImage = true
          this.productDetails.productImages.push(productInfo)
          if (this.productDetails.productImages.length == 5) {
            this.addImage = false
            this.showText = 'hide'
          }
          console.log('length', this.productDetails.productImages.length)
        })
        .catch((error) => {
          ////
          console.log('file creation error', JSON.stringify(error))
        })
    }
  }

  checkDataChangedValidations(type: string) {
    let canUpdateRefData: boolean = true
    if (type == 'reference') {
      return true
    } else {
      for (let i = 0; i < this.productDetails.ProductsOrServices.length; i++) {
        if (this.productDetails.ProductsOrServices[i].canUpdate == false) {
          if (this.productDetails.typeOf == 1) {
            if (
              this.productDetails.ProductsOrServices[i].type ==
                this.productDetails.tempProductsOrServices[i].type &&
              this.productDetails.ProductsOrServices[i].value ==
                this.productDetails.tempProductsOrServices[i].value
            ) {
              canUpdateRefData = true
            } else {
              canUpdateRefData = false
              break
            }
          } else if (this.productDetails.typeOf == 2) {
            if (this.productDetails.shareType == 1) {
              //slab
              if (
                this.productDetails.ProductsOrServices[i].type ==
                  this.productDetails.tempProductsOrServices[i].type &&
                this.productDetails.ProductsOrServices[i].value ==
                  this.productDetails.tempProductsOrServices[i].value &&
                this.productDetails.ProductsOrServices[i].from ==
                  this.productDetails.tempProductsOrServices[i].from &&
                this.productDetails.ProductsOrServices[i].to ==
                  this.productDetails.tempProductsOrServices[i].to
              ) {
                canUpdateRefData = true
              } else {
                canUpdateRefData = false
                break
              }
            } else if (this.productDetails.shareType == 2) {
              //product
              if (
                this.productDetails.ProductsOrServices[i].type ==
                  this.productDetails.tempProductsOrServices[i].type &&
                this.productDetails.ProductsOrServices[i].value ==
                  this.productDetails.tempProductsOrServices[i].value &&
                this.productDetails.ProductsOrServices[i].productName ==
                  this.productDetails.tempProductsOrServices[i].productName
              ) {
                canUpdateRefData = true
              } else {
                canUpdateRefData = false
                break
              }
            }
          }
        }
      }
      return canUpdateRefData
    }
  }

  async removeProductData(type: string) {
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.loading.present()
    if (this.productDetails.productId) {
      for (let i = 0; i < this.productDetails.productImages.length; i++) {
        if (
          this.productDetails.productImages[i].ImageURL != null &&
          this.productDetails.productImages[i].ImageURL != undefined &&
          this.productDetails.productImages[i].ImageURL != ''
        ) {
          this.productDetails.productImages[i].prodImgBase64 = ''
        }
      }
    }
    console.log('removeProductData', JSON.stringify(this.productDetails))
    this.businessListService
      .updateProductOrServicesApi(this.productDetails)
      .subscribe(
        (data) => {
          console.log('data rcv ', data)
          if (this.loading) this.loading.dismiss()
          if (data != null) {
            if (data.status == 200) {
              if (type == 'image') {
                Utility.showToast(
                  this.toastCtrl,
                  Constants.photoRemovedSuccessfully,
                  false,
                  '',
                  false
                )
              } else {
                Utility.showToast(
                  this.toastCtrl,
                  Constants.refPercentDataRemovedSuccessfully,
                  false,
                  '',
                  false
                )
              }
              this.productDetails.expanded = false
              this.getProducts.emit()
            }
          }
        },
        (err) => {
          if (this.loading) this.loading.dismiss()
          if (type == 'image') {
            Utility.showToast(
              this.toastCtrl,
              Constants.photoRemovelFailed,
              false,
              '',
              false
            )
          } else {
            Utility.showToast(
              this.toastCtrl,
              Constants.refPercentDataRemovelFailed,
              false,
              '',
              false
            )
          }
          console.log('data error ', err)
          this.productDetails.expanded = true
          this.url =
            Urls.baseUrl + Urls.port + Constants.updateProductOrservices
          this.stackTrace = err.stack
          this.message = err.message
          this.method = 'removeProductData'
          this.inserErrorApi()
        }
      )
  }

  // Product Service Tip Popup
  async openTipPopup() {
    let tipPopup = await this.modalCtrl.create({
      component: ProductServiceTipComponent,
      componentProps: {},
      cssClass: 'tipPopup ujb_theme'
    })
    tipPopup.present()
  }

  onKey(refInfo: ReferralDataInfo, index) {
    if (refInfo.from != undefined && refInfo.from.length > 0) {
      refInfo.isInValidSlabFrom = false
    }
    if (refInfo.from != undefined && refInfo.from.length > 9) {
      refInfo.isSlabFromLengthInValid = true
      refInfo.isSlabInValid = true
    } else {
      refInfo.isSlabFromLengthInValid = false
      refInfo.isSlabInValid = false
    }
    if (refInfo.to != undefined && refInfo.to.length > 0) {
      refInfo.isInValidSlabTo = false
    }
    if (refInfo.to != undefined && refInfo.to.length > 9) {
      refInfo.isSlabToLengthInValid = true
      refInfo.isSlabInValid = true
    } else if (refInfo.isSlabFromLengthInValid == true) {
      refInfo.isSlabToLengthInValid = false
      //refInfo.isSlabInValid = false
    } else if (refInfo.isSlabInValid == false) {
      refInfo.isSlabToLengthInValid = false
      refInfo.isSlabInValid = false
    }
    if (refInfo.isSlabInValid == false) {
      if (refInfo.to != null && refInfo.to != undefined && refInfo.to != '')
        if (+refInfo.from < +refInfo.to) {
          refInfo.isSlabFromInValid = false
          if (index != 0) {
            let a = this.productDetails.ProductsOrServices[index - 1].to
            console.log('+a', +a)
            console.log('+refInfo.from', +refInfo.from)
            if (+a >= +refInfo.from) {
              refInfo.isSlabGreatInValid = true
              refInfo.isSlabInValid = true
              this.checkError = false
            } else {
              refInfo.isSlabInValid = false
              refInfo.isSlabGreatInValid = false
            }
          } else {
            refInfo.isSlabInValid = false
          }
        } else {
          this.checkError = false
          refInfo.isSlabFromInValid = true
          refInfo.isSlabGreatInValid = false
          refInfo.isSlabInValid = true
        }
    }
    console.log('refInfo', refInfo)
  }

  checkPrice(productPrice) {
    console.log('productPrice', productPrice.indexOf('.'))
  }

  // Push On Focus
  scrollTo(num: any) {
    this.pushNowComp.emit(true)
    console.log('scrollTo func')
  }

  removeSroll() {
    this.pushNowComp.emit(false)
    console.log('removeScroll func')
  }

  validateMinDealValue() {
    if (
      this.productDetails.productPrice != null &&
      this.productDetails.productPrice != undefined &&
      this.productDetails.productPrice != 0
    ) {
      if (
        this.productDetails.productPrice > +this.productDetails.minimumDealValue
      ) {
        this.isMinDealValueInvalid = true
      } else {
        this.isMinDealValueInvalid = false
      }
    } else {
      this.isMinDealValueInvalid = false
    }
  }

  // Push On Focus
  tempscrollTo(ht: any) {
    this.pushNowTemp.emit(true)
  }

  tempRemoveSroll() {
    this.pushNowTemp.emit(false)
  }

  scrollToError() {
    if (this.productDetailForm.get('productName').invalid) {
      let a = document.getElementById('productName' + this.index)
      if (a) a.scrollIntoView({ behavior: 'smooth' })
      if (a) a.focus()
    } else if (this.productDetails.isSameProductName) {
      let a = document.getElementById('productName' + this.index)
      if (a) a.scrollIntoView({ behavior: 'smooth' })
      if (a) a.focus()
    } else if (this.productDetailForm.get('description').invalid) {
      let a = document.getElementById('description' + this.index)
      if (a) a.scrollIntoView({ behavior: 'smooth' })
      if (a) a.focus()
    } else if (this.productDetailForm.get('url').invalid) {
      let a = document.getElementById('url' + this.index)
      if (a) a.scrollIntoView({ behavior: 'smooth' })
      if (a) a.focus()
    } else if (this.productDetailForm.get('productPrice').invalid) {
      let a = document.getElementById('productPrice' + this.index)
      if (a) a.scrollIntoView({ behavior: 'smooth' })
      if (a) a.focus()
    } else if (this.productDetailForm.get('dealValue').invalid) {
      let a = document.getElementById('dealValue' + this.index)
      if (a) a.scrollIntoView({ behavior: 'smooth' })
      if (a) a.focus()
    } else if (this.productDetailForm.get('radioValueTypeOf').invalid) {
      let a = document.getElementById('radioValueTypeOf' + this.index)
      if (a) a.scrollIntoView({ behavior: 'smooth' })
      if (a) a.focus()
    } else if (this.productDetailForm.get('radioValueshareType').invalid) {
      let a = document.getElementById('radioValueshareType' + this.index)
      if (a) a.scrollIntoView({ behavior: 'smooth' })
      if (a) a.focus()
    } else if (this.productDetailForm.get('slabOrProduct').invalid) {
      let a = document.getElementById('slabOrProduct' + this.index)
      if (a) a.scrollIntoView({ behavior: 'smooth' })
      if (a) a.focus()
    } else if (this.productDetails.isSlabProdLengthInvalid == true) {
      let a = document.getElementById('addMoreButton' + this.index)
      if (a) a.scrollIntoView({ behavior: 'smooth' })
      if (a) a.focus()
    } else {
      for (let i = 0; i < this.productDetails.ProductsOrServices.length; i++) {
        if (
          this.productDetails.ProductsOrServices[i].isInValid ||
          this.productDetails.ProductsOrServices[i].isInValidType ||
          this.productDetails.ProductsOrServices[i].isInValidValue ||
          this.productDetails.ProductsOrServices[i].isValueNotEntered
        ) {
          if (this.productDetails.shareType == 1) {
            let a = document.getElementById('slabFrom' + this.index + i)
            if (a) a.scrollIntoView({ behavior: 'smooth' })
            if (a) a.focus()
            break
          } else if (this.productDetails.shareType == 2) {
            let a = document.getElementById('prodName' + this.index + i)
            if (a) a.scrollIntoView({ behavior: 'smooth' })
            if (a) a.focus()
            break
          } else {
            let a = document.getElementById('value' + this.index + i)
            if (a) a.scrollIntoView({ behavior: 'smooth' })
            if (a) a.focus()
            break
          }
        } else if (
          this.productDetails.ProductsOrServices[i].isSlabInValid ||
          this.productDetails.ProductsOrServices[i].isInValidSlabFrom ||
          this.productDetails.ProductsOrServices[i].isInValidSlabTo
        ) {
          let a = document.getElementById('slabFrom' + this.index + i)
          if (a) a.scrollIntoView({ behavior: 'smooth' })
          if (a) a.focus()
          break
        } else if (this.productDetails.ProductsOrServices[i].isInvalidProduct) {
          let a = document.getElementById('prodName' + this.index + i)
          if (a) a.scrollIntoView({ behavior: 'smooth' })
          if (a) a.focus()
          break
        }
      }
    }
  } //

  nameChanged() {
    //console.log("nameChanged")
    for (let i = 0; i < this.productList.length; i++) {
      if (this.productDetails.name == this.productList[i].name) {
        if (i != this.index) {
          this.productDetails.isSameProductName = true
          break
        } else {
          this.productDetails.isSameProductName = false
        }
      }
    }
    console.log('nameChanged', this.productDetails.isSameProductName)
  }

  checkSubProducts(refInfo: ReferralDataInfo, index) {
    let flag = false
    /* for(let i = 0; i < this.productDetails.ProductsOrServices.length; i++){
      this.productDetails.ProductsOrServices[i].isSameProductName =false
    } */
    if (refInfo.productName != undefined && refInfo.productName.length > 0) {
      refInfo.isInvalidProduct = false
    }
    for (let j = 0; j < this.productDetails.ProductsOrServices.length; j++) {
      flag = false
      for (let i = 0; i < this.productDetails.ProductsOrServices.length; i++) {
        //if (index != 0) {
        if (this.productDetails.ProductsOrServices.length > 1)
          if (this.productDetails.ProductsOrServices[j].productName)
            if (this.productDetails.ProductsOrServices[i].productName)
              if (
                this.productDetails.ProductsOrServices[j].productName ==
                this.productDetails.ProductsOrServices[i].productName
              ) {
                console.log(
                  'true',
                  refInfo.productName +
                    '==' +
                    this.productDetails.ProductsOrServices[i].productName
                )
                if (j != i) {
                  flag = true
                  break
                }
              }
        //}
      }
      if (flag == true) {
        this.productDetails.ProductsOrServices[j].isSameProductName = true
      } else {
        this.productDetails.ProductsOrServices[j].isSameProductName = false
      }
    }
    /* if (flag == true) {
      refInfo.isSameProductName = true
    } else {
      refInfo.isSameProductName = false
    } */
  }

  inserErrorApi() {
    this.logError.Url = this.url
    this.logError.UserId = this.userId
    this.logError.createdBy = this.userId
    this.logError.date = new Date().toLocaleString()
    this.logError.error = this.stackTrace
    this.logError.message = this.message
    this.logError.method = this.method
    this.logError.screen = 'ProductServiceAddEditFormComponent'
    this.logError.source = 'mobile'
    console.log('responce log', this.logError)

    this.logErrorService.insertLogError(this.logError).subscribe((res: any) => {
      console.log('res in 200', res)
    })
  }

  onKey1(productsOrService: ReferralDataInfo, i: number) {
    console.log('onKey1', productsOrService, i)
    if (productsOrService.value > 0) {
      productsOrService.isValueNotEntered = false
    } else if (productsOrService.value < 0) {
      productsOrService.isValueNotEntered = true
      productsOrService.isInValid = true
    }
    if (productsOrService.value < +this.productDetails.minimumDealValue) {
      productsOrService.isInValidValueRup = false
    } else {
      productsOrService.isInValidValueRup = true
      productsOrService.isInValid = true
    }

    if (productsOrService.type == '1') {
      if (productsOrService.value < 100 && productsOrService.value > 0) {
        productsOrService.isInValidValue = false
      } else if (productsOrService.value == 0) {
        productsOrService.isInValidValue = true
        productsOrService.isInValid = true
      } else if (productsOrService.value >= 100) {
        productsOrService.isInValidValue = true
        productsOrService.isInValid = true
      }
    } else {
      if (productsOrService.value > 0) {
        productsOrService.isInValidValue = false
      } else if (productsOrService.value == 0) {
        productsOrService.isInValidValue = true
        productsOrService.isInValid = true
      }
    }

    if (
      productsOrService.value > 999999999 &&
      productsOrService.isInValidValueRup == false
    ) {
      productsOrService.isInValidLengthValue = true
      productsOrService.isInValid = true
    } else {
      productsOrService.isInValidLengthValue = false
    }
  }
}
