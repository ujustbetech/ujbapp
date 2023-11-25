import {  NavController } from '@ionic/angular'
import { Platform } from '@ionic/angular'

import { Component, OnInit } from '@angular/core'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'
import { Storage } from '@ionic/storage'

import { ProductInfo } from '../../../../app/models/CPProductInfo'
import { BusinessListingService } from '../../../services/business-listing.service'
import { ActivatedRoute } from '@angular/router'

declare var cordova
/**
 * Generated class for the ProductServiceViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-product-service-view',
  templateUrl: 'product-service-view.html',
  styleUrls: ['product-service-view.scss']
})
export class ProductServiceViewPage implements OnInit {
  userFirstName
  userId
  type
  productDetail: ProductInfo
  showProductPrice: boolean = false
  showPager = true
  checkCategory
  hideInput: boolean = false
  url
  showImageViewer: boolean = false
  hideImageViewer: boolean = false
  constructor(
    public navCtrl: NavController,
    private route: ActivatedRoute,
    private storage: Storage,
    public platform: Platform,
    public businessListService: BusinessListingService,
    private iab: InAppBrowser
  ) {
    route.queryParams.subscribe((params: any) => {
      this.storage.get('specialCategory').then((val) => {
        this.checkCategory = val
        // this.storage.set('specialCategory',this.checkCategory)
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
      this.productDetail = new ProductInfo()
  
      this.type = params.type
      if (this.type == 'Product') {
        this.showProductPrice = true
      }
      this.productDetail = params.productDetail
      console.log('details of product', this.productDetail)
      // if (this.productDetail.productImages.length == 0) {
      //   this.showPager = false
      //   let prodImg = new ProductImageInfo()
      //   prodImg.prodImgBase64 = "assets/imgs/content-imgs/intro-1.jpg"
      //   this.productDetail.productImages.push(prodImg)
      // }
      console.log(
        'details of product img',
        this.productDetail.productImages[0].ImageURL
      )
      if (this.productDetail.productImages[0].ImageURL != '') {
        this.hideImageViewer = false
        this.showImageViewer = true
      } else {
        this.hideImageViewer = true
        this.showImageViewer = false
      }
      if (this.productDetail.productImages.length == 1) {
        this.showPager = false
      }
      console.log('prddetail', this.productDetail)
      this.storage.get('userInfo').then((val) => {
        console.log('userid', val)
        this.userId = val.userId
      })
      
    })
  }

  ngOnInit() {
    console.log('ngOnInit ProductServiceViewPage')
  }

  openUrl(url) {
    // const options: InAppBrowserOptions = {
    //   hidenavigationbuttons: 'no',
    //   location:'no'
    // }
    // const browser = this.iab.create(url,"_system",options)
    // browser.close();

    this.platform.ready().then(() => {
      this.url = 'https://' + url
      console.log('url', this.url)
      var inAppBrowserRef

      inAppBrowserRef = cordova.InAppBrowser.open(this.url, '_blank')
    })
  }
}
