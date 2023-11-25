import * as moment from 'moment'

import { Component, NgZone, ViewChild } from '@angular/core'
import {
  
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  Platform,
  ToastController,
} from '@ionic/angular'

import { Constants } from '../../../Utils/Constants'
import { PopupConfirmationAlertComponent } from '../../../../app/components/popups/popup-confirmation-alert/popup-confirmation-alert'
import { ProductImageInfo } from '../../../../app/models/ProductImageInfo'
import { ProductInfo } from '../../../../app/models/CPProductInfo'
import { ProductServiceAddEditFormComponent } from '../../../../app/components/product-service-add-edit-form/product-service-add-edit-form'
import { ReferralDataInfo } from '../../../../app/models/ReferralDataInfo'
import { Storage } from '@ionic/storage'

import { UploadCompanyLogoInfo } from '../../../../app/models/companyLogo_info'
import { Utility } from '../../../Utils/Utility'
import { BusinessListingService } from '../../../services/business-listing.service'
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
 *     Gitesh     2019/07/11    removed unused imports, removed extra variables, removed static code,
 *                              removed timebased Naviagation, removed old accordian code
 */

// @IonicPage()
@Component({
  selector: 'page-product-service-add-edit',
  templateUrl: 'product-service-add-edit.html',
  styleUrls: ['product-service-add-edit.scss']
})
export class ProductServiceAddEditPage {
  @ViewChild(ProductServiceAddEditFormComponent, { static: true })
  ProductServiceAddEditFormComponent: ProductServiceAddEditFormComponent
  pageTitle: string //= "List your Product (Max 5)"
  productDetailsList: ProductInfo[]
  addProdServiceText: string = '+ add another product'
  prodServiceFlag: string
  nextButtonText: string = 'Go to Business Kyc'
  userId
  //productDetail: ProductInfo
  //mode
  type
  from
  hideAddButton: any
  loading
  specialCategory
  pushNow = false
  hideInputPage
  pushUp = true
  focused
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private platform: Platform,
    public modalCtrl: ModalController,
    public businessListService: BusinessListingService,
    private storage: Storage,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    private menu: MenuController,
    private zone: NgZone
  ) {
    route.queryParams.subscribe((params: any) => {
      this.productDetailsList = new Array<ProductInfo>()
      this.prodServiceFlag = params.selectedItem
      this.from = params.from
      this.specialCategory = params.specialCategory
  
      this.setUiText()
  
      this.storage.get('userInfo').then((val) => {
        console.log('userid', val)
        this.userId = val.userId
        this.getProductServices()
      })
    })
  }

  /**
   * sets UI text according to the flag
   */
  setUiText() {
    if (this.prodServiceFlag == 'products') {
      this.type = 'Product'
      this.pageTitle = 'List your Products (Max 5)'
      this.addProdServiceText = '+ add another product'
      this.nextButtonText = 'Go to Business Kyc'
    } else if (this.prodServiceFlag == 'services') {
      this.type = 'Service'
      this.pageTitle = 'List your Services (Max 5)'
      this.addProdServiceText = '+ add another service'
      this.nextButtonText = 'Go to Business Kyc'
    } else {
      this.type = 'Service'
      this.pageTitle = 'List your Services (Max 5)'
      this.addProdServiceText = '+ add another service'
      this.nextButtonText = 'Add Products'
    }
  }

  ionViewWillEnter() {
    this.platform.backButton.subscribe(async () => {
      const getOpen: any = await this.menu.getOpen()
      if (getOpen) {
        //console.log("menu open", getOpen.isOpen)
        if (getOpen.isOpen == true) {
          this.menu.close()
          //this.registerBackButton()
        }
      } else {
        this.navCtrl.pop()
      }
    })
  }

  ionViewDidEnter() {
    this.hideInputPage = this.ProductServiceAddEditFormComponent ? this.ProductServiceAddEditFormComponent.hideInput : false
  }

  /**
   * Add new empty product/service to the list
   */
  addNewService() {
    //
    let productInfoEmpty = new ProductInfo()
    if (this.prodServiceFlag == 'products') {
      productInfoEmpty.type = 'Product'
    } else if (this.prodServiceFlag == 'services') {
      productInfoEmpty.type = 'Service'
    } else {
      productInfoEmpty.type = 'Service'
    }
    this.productDetailsList.push(productInfoEmpty)
    this.expandItem(productInfoEmpty)
    if (this.productDetailsList.length == 0) {
      if (this.prodServiceFlag == 'products') {
        this.addProdServiceText = '+ add a product'
      } else if (this.prodServiceFlag == 'services') {
        this.addProdServiceText = '+ add a service'
      } else {
        this.addProdServiceText = '+ add a service'
      }
    } else {
      if (this.prodServiceFlag == 'products') {
        this.addProdServiceText = '+ add another product'
      } else if (this.prodServiceFlag == 'services') {
        this.addProdServiceText = '+ add another service'
      } else {
        this.addProdServiceText = '+ add another service'
      }
    }
  }

  /**
   * Expand the selected item and collapse all the others
   * @param productDetail productInfo clicked card
   */
  expandItem(productDetail: ProductInfo): void {
    if (productDetail.expanded) {
      productDetail.expanded = false
    } else {
      this.productDetailsList.map((listItem) => {
        if (productDetail == listItem) {
          listItem.expanded = !listItem.expanded
        } else {
          listItem.expanded = false
        }

        if (
          this.ProductServiceAddEditFormComponent != null &&
          this.ProductServiceAddEditFormComponent != undefined
        )
          this.ProductServiceAddEditFormComponent.selectedImage('', '')

        return listItem
      })
    }
  }

  /**
   * removes selected products
   * @param productDetail Selected product
   */
  async _removeProduct(obj) {
    let productDetail = obj.product
    let index = obj.index

    console.log('_removeProduct', productDetail)
    let message = 'Are you sure, you want to remove this item?'
    if (this.prodServiceFlag == 'products') {
      message = 'Are you sure, you want to remove this Product?'
    } else if (this.prodServiceFlag == 'services') {
      message = 'Are you sure, you want to remove this Service?'
    } else {
      message = 'Are you sure, you want to remove this Service?'
    }
    let profileModal = await this.modalCtrl.create({
      component:PopupConfirmationAlertComponent,
      componentProps: { text: message },
      cssClass: 'popupConfirmationAlert dualLineHeight' 
    })
    profileModal.present()
    const {data} = await profileModal.onDidDismiss()
    if (data == 'ok') {
      if (productDetail.productId) {
        this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
        this.loading.present()
        this.businessListService
          .removeProduct(productDetail.productId)
          .subscribe(
            (res: any) => {
              if (this.loading) this.loading.dismiss()
              console.log('data rcv ', res)
              if (res.status == 200) {
                /*  this.zone.run(() => {
                console.log('force update the screen');
              });
              this.productDetailsList.slice(index, 1) */
                Utility.showToast(
                  this.toastCtrl,
                  productDetail.type + ' removed successfully.',
                  false,
                  '',
                  false
                )
                this.getProductServices()
              }
            },
            (err) => {
              if (this.loading) this.loading.dismiss()
              Utility.showToast(
                this.toastCtrl,
                productDetail.type + ' failed to remove.',
                false,
                '',
                false
              )
              console.log('data error ', err)
            }
          )
        /*           productDetail.isActive = false
                  this.businessListService.updateProductOrServicesApi(productDetail).subscribe((data) => {
                    if (this.loading)
                      this.loading.dismiss()
                    console.log("data rcv ", data)
                    if (data != null) {
                      if (data.status == 200) {
                        //this.productDetailsList.splice(productDetail, 1)
                        Utility.showToast(this.toastCtrl, productDetail.type + " removed successfully.", false, "", false)
                        productDetail.expanded = false
                        this.getProductServices()
                      }
                    }
                  }, err => {
                    if (this.loading)
                      this.loading.dismiss()
                    Utility.showToast(this.toastCtrl, productDetail.type + " failed to remove.", false, "", false)
                    console.log("data error ", err)
                    productDetail.expanded = true
        
                  }) */
      } else {
        this.productDetailsList.splice(index, 1)

        /* this.zone.run(() => {
          console.log('force update the screen');
        }); */
        //this.getProductServices()
        Utility.showToast(
          this.toastCtrl,
          productDetail.type + ' removed successfully.',
          false,
          '',
          false
        )
      }
      if (this.productDetailsList.length == 0) {
        if (this.prodServiceFlag == 'products') {
          this.addProdServiceText = '+ add a product'
        } else if (this.prodServiceFlag == 'services') {
          this.addProdServiceText = '+ add a service'
        } else {
          this.addProdServiceText = '+ add a service'
        }
      } else {
        if (this.prodServiceFlag == 'products') {
          this.addProdServiceText = '+ add another product'
        } else if (this.prodServiceFlag == 'services') {
          this.addProdServiceText = '+ add another service'
        } else {
          this.addProdServiceText = '+ add another service'
        }
      }
    }
  }

  /**
   * opens another instance of the same page to add products when user selected to both
   */
  async next() {
    await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: {
        selectedItem: 'products',
        type: 'Product',
      }})
    // }
  }

  /**
   * takes to businessKyc page
   */
  async goToBusinessKyc() {
    await this.navCtrl.navigateForward('BusinessKycPanPage')
  }

  /**
   * close current page
   */
  goBack() {
    this.navCtrl.pop()
  }

  /**
   * gets user to dashboard
   */
  async goToDashboard() {
    Utility.companyLogoDetails = new UploadCompanyLogoInfo()
    await this.navCtrl.navigateRoot('DashboardPage')
  }

  /**
   * get list of products or services
   */
  async getProductServices() {
    //
    this.productDetailsList = new Array<ProductInfo>()
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.loading.present()
    this.businessListService
      .getProductOrServices(this.userId, this.type)
      .subscribe(
        (res: any) => {
          //
          if (this.loading) this.loading.dismiss()
          if (res != null) {
            if (res.status == 200) {
              let data = res.json.data
              console.log('a', data)

              for (let i = 0; i < data.length; i++) {
                let productDetail = new ProductInfo()
                productDetail.name = data[i].name
                console.log('prodname', productDetail.name)
                productDetail.productId = data[i].productId
                productDetail.type = data[i].type
                productDetail.description = data[i].description
                productDetail.url = data[i].url
                productDetail.productPrice = data[i].productPrice
                productDetail.minimumDealValue = data[i].minimumDealValue
                productDetail.shareType = data[i].shareType

                if (
                  productDetail.shareType == 1 ||
                  productDetail.shareType == 2
                ) {
                  productDetail.isSlabProdRadioInvalid = false
                }
                productDetail.typeOf = data[i].typeOf
                productDetail.isActive = data[i].isActive
                if (productDetail.typeOf == 1) {
                  productDetail.addSingleProduct = true
                } else {
                  productDetail.showMultiple = true
                }
                if (productDetail.shareType == null) {
                  productDetail.showSlabs = false
                  productDetail.showProducts = false
                } else {
                  if (productDetail.shareType == 1) {
                    productDetail.showSlabs = true
                  } else {
                    productDetail.showProducts = true
                  }
                }
                if (data[i].productImages) {
                  for (let k = 0; k < data[i].productImages.length; k++) {
                    let prodImg = new ProductImageInfo()
                    if (data[i].productImages[k].prodImgName == null)
                      data[i].productImages[k].prodImgName = ''
                    prodImg.prodImgName = data[i].productImages[k].prodImgName
                    prodImg.ImageURL = data[i].productImages[k].imageURL
                    prodImg.uniqueName = data[i].productImages[k].uniqueName
                    if (data[i].productImages[k].imageURL == null) {
                      data[i].productImages[k].prodImgBase64 =
                        Constants.businessLogoConst
                    } else {
                      prodImg.prodImgBase64 = Utility.getImageUrl(
                        data[i].productImages[k].imageURL
                      )
                    }
                    prodImg.isDefaultImg = data[i].productImages[k].isDefaultImg
                    productDetail.productImages.push(prodImg)
                  }
                }

                if (data[i].productsOrServices) {
                  for (let j = 0; j < data[i].productsOrServices.length; j++) {
                    let productOrServceObj = new ReferralDataInfo()
                    if (data[i].productsOrServices[j].from == null)
                      data[i].productsOrServices[j].from = ''
                    productOrServceObj.from =
                      data[i].productsOrServices[j].from + ''
                    if (data[i].productsOrServices[j].to == null)
                      data[i].productsOrServices[j].to = ''
                    productOrServceObj.to =
                      data[i].productsOrServices[j].to + ''

                    /*  if(productOrServceObj.to!=""){
                   productDetail.showSlabs = true
                   
                 } */

                    productOrServceObj.productDetailsId =
                      data[i].productsOrServices[j].productDetailsId
                    if (data[i].productsOrServices[j].productName == null)
                      data[i].productsOrServices[j].productName = ''
                    productOrServceObj.productName =
                      data[i].productsOrServices[j].productName
                    /* if(productOrServceObj.productName!=""){
                  productDetail.showProducts = true
                  productDetail.showMultiple = true
                } */
                    if (data[i].productsOrServices[j].type == null)
                      data[i].productsOrServices[j].type = ''
                    productOrServceObj.type = data[i].productsOrServices[j].type
                    if (data[i].productsOrServices[j].value == null)
                      data[i].productsOrServices[j].value = ''
                    productOrServceObj.value =
                      data[i].productsOrServices[j].value
                    if (data[i].productsOrServices[j].isActive == null)
                      data[i].productsOrServices[j].isActive = false
                    productOrServceObj.isActive =
                      data[i].productsOrServices[j].isActive

                    if (data[i].productsOrServices[j].createdOn == null)
                      data[i].productsOrServices[j].createdOn = false
                    productOrServceObj.createdOn =
                      data[i].productsOrServices[j].createdOn

                    if (data[i].productsOrServices[j].updatedOn == null)
                      data[i].productsOrServices[j].updatedOn =
                        data[i].productsOrServices[j].createdOn
                    productOrServceObj.updatedOn =
                      data[i].productsOrServices[j].updatedOn

                    let split: any = productOrServceObj.updatedOn.substring(
                      0,
                      productOrServceObj.updatedOn.lastIndexOf('T')
                    )
                    let current = moment()
                    let daysDiff = current.diff(
                      moment(split, 'YYYY-MM-DD'),
                      'days'
                    )
                    console.log('daysDiff', daysDiff)
                    if (daysDiff < 90) {
                      productDetail.canUpdateRefData = false
                      productOrServceObj.canUpdate = false
                    } else {
                      productOrServceObj.canUpdate = true
                    }
                    productDetail.ProductsOrServices.push(productOrServceObj)
                    productDetail.tempProductsOrServices.push(
                      JSON.parse(JSON.stringify(productOrServceObj))
                    )
                  }
                }

                this.productDetailsList.push(productDetail)
                console.log('listDetail', this.productDetailsList)
              }
              if (this.productDetailsList.length <= 0) {
                this.addNewService()
              }
            }
          }
        },
        (err) => {
          if (this.loading) this.loading.dismiss()
          console.log('error in prod', err)
          this.setUiText()
          if (JSON.stringify(err).indexOf('404')) {
            this.addNewService()
          } else {
            //Utility.showToast(this.toastCtrl, Constants.someErrorOccurred, false, "")
          }
          // let message = err.message[0].type
          // console.log("message",message)

          //Utility.showToast(this.toastCtrl, Constants.someErrorOccurred, false, "")
        }
      )
  }

  // Push On Focus
  // scrollTo() {
  //   this.pushNow.emit(true);
  // }

  // removeSroll(){
  //   this.pushNow.emit(false);
  // }

  handleScroll(value) {
    //   this.pushNow = value;
    console.log('handleScroll func')
  }

  // pushUpwardTemp(value) {
  //   this.pushUp = value;
  //   console.log(this.pushUp);
  // }
}
