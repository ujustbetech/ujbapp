/*
 * MIT License
 *
 *  Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/07/12        Dakshata Patil
 */

import * as $ from 'jquery'

import { Component, ViewChild, OnInit } from '@angular/core'
import {
  
  MenuController,
  NavController,
  Platform,
} from '@ionic/angular'

import { CategoryInfo } from '../../../../app/models/CategoryInfo'
import { LoadingController } from '@ionic/angular'
import { SearchResultsPage } from '../search-results/search-results'
import { Utility } from '../../../Utils/Utility'
import { DemoService } from '../../../services/demo.service'
import { CategoriesService } from '../../../services/categories.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the CategoryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-category-list',
  templateUrl: 'category-list.html',
  styleUrls: ['category-list.scss'],
})
export class CategoryListPage implements OnInit {
  pageTitle: string = 'Categories'
  catData: any
  items: string = ''
  searchTerm: string = ''
  myClass: any = 'hide'
  catList: CategoryInfo[]
  catViewList: CategoryInfo[]
  loading
  isKycAdded
  kycApprovalStatus
  CurrentPage
  totalCount
  getCategoryListRes: CategoryInfo
  canLoadMore: boolean = false
  constructor(
    public navCtrl: NavController,
    public demoService: DemoService,
    public getCategoryList: CategoriesService,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    private menu: MenuController,
    private route: ActivatedRoute

  ) {
    this.getCategoryListRes = new CategoryInfo()
    this.catList = new Array<CategoryInfo>()
    this.catViewList = new Array<CategoryInfo>()
    route.queryParams.subscribe((params: any) => {
      this.isKycAdded = params.KYCAdded
      this.kycApprovalStatus = params.KYCApprovalStatus
    })
    // IOS Footer hide on focus
    if (platform.is('ios')) {
      //hide footer when input box is on focus
      $(document).on('focus', 'input, textarea, select', function () {
        // $(".footer-med").hide();
        $('.footer-adj').css('display', 'none')
        $('.scroll-content').css('margin-bottom', '0')
      })
      //show footer when input is NOT on focus
      $(document).on('blur', 'input, textarea, select', function () {
        // $(".footer-med").show();
        $('.footer-adj').css('display', 'block')
        $('.scroll-content').css('margin-bottom', '45px')
      })
    }
  }

  /**
   * gets called everytime before page loads
   */
  ionViewWillEnter() {
    this.catViewList = new Array<CategoryInfo>()
    this.CurrentPage = 1
    this.searchTerm = ''
    this.setView(null)
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

  ngOnInit() {
    console.log('ngOnInit CategoryListPage')
  }

  /**
   * takes user to results page
   * @param data selected result
   */
  async goToResultPage(data: any) {
    console.log('data', data)
    await this.navCtrl.navigateForward('SearchResultsPage', { queryParams: {
      searchTerm: data.categoryName,
      KYCAdded: this.isKycAdded,
      KYCApprovalStatus: this.kycApprovalStatus,
    }})
  }

  /**
   * call api to get search suggestions
   */
  getSearchSuggestions() {
    if (this.searchTerm != '') {
      // this.CurrentPage=1
      this.getCategoryList.getcategoriesApi(this.searchTerm, 0).subscribe(
        (res: any) => {
          console.log('list', res)
          if (res.json.message[0].type == 'SUCCESS') {
            let data = res.json.data.categories

            if (data.length > 0) {
              this.catList = new Array<CategoryInfo>()

              for (let i = 0; i <= data.length - 1; i++) {
                let categoryinfoobj = new CategoryInfo()
                //userinfoobj.base64Img= data.base64Img;
                categoryinfoobj.catId = data[i].catId
                categoryinfoobj.categoryName = data[i].categoryName
                categoryinfoobj.categoryImgBase64 = data[i].categoryImgBase64
                console.log('obj', categoryinfoobj)
                this.catList.push(categoryinfoobj)
              }
            } else {
              this.catList = new Array<CategoryInfo>()
              let categoryinfoobj = new CategoryInfo()
              categoryinfoobj.categoryName = 'No data found'
              this.catList.push(categoryinfoobj)
            }

            console.log('list', this.catList)
          }
        },
        (err) => {
          this.catList = new Array<CategoryInfo>()
          let categoryinfoobj = new CategoryInfo()
          categoryinfoobj.categoryName = 'No data found'
          this.catList.push(categoryinfoobj)
          console.log(err)
        }
      )
      this.myClass = 'view'
    } else {
      this.catList = new Array<CategoryInfo>()
      this.myClass = 'hide'
    }
  }

  /**
   * calls and gets all categories from api amd sets to Ui
   */
  async setView(event) {
    this.loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    this.loading.present()

    this.getCategoryList.getcategoriesApi('', this.CurrentPage).subscribe(
      (res: any) => {
        this.loading.dismiss()
        console.log('list', res)
        if (res.json.message[0].type == 'SUCCESS') {
          let data = res.json.data.categories
          for (let i = 0; i <= data.length - 1; i++) {
            let categoryViewListObj = new CategoryInfo()
            categoryViewListObj.catId = data[i].catId
            categoryViewListObj.categoryName = data[i].categoryName
            categoryViewListObj.categoryImgBase64 = Utility.getImageUrl(
              data[i].categoryImgBase64
            )
            console.log('obj', categoryViewListObj)
            if (categoryViewListObj.categoryName != 'More')
              this.catViewList.push(categoryViewListObj)
          }
          console.log('list in category', this.catViewList)
          this.totalCount = res.json.data.totalCount
          this.getCategoryListRes.pager.currentPage =
            res.json.data.pager.currentPage
          this.CurrentPage = res.json.data.pager.currentPage
          this.getCategoryListRes.pager.pageSize = res.json.data.pager.pageSize
          this.getCategoryListRes.pager.totalPages =
            res.json.data.pager.totalPages
          this.getCategoryListRes.pager.totalRecords =
            res.json.data.pager.totalRecords
          console.log(
            'list in category get category res',
            this.getCategoryListRes
          )
          if (this.catViewList.length > 0) {
            if (this.catViewList.length < this.totalCount) {
              this.canLoadMore = true
            } else {
              this.canLoadMore = false
            }
          } else if (this.catViewList.length == 0) {
            //this.noBusinessFound = true
            this.canLoadMore = false
          } else {
            // this.noBusinessFound = true
            this.canLoadMore = false
          }
          if (event != null || event != undefined) event.complete()
        }
      },
      (err) => {
        this.loading.dismiss()
      }
    )
    this.myClass = 'hide'
  }

  onScroll(event) {
    if (this.catViewList.length < this.totalCount) {
      this.CurrentPage = this.getCategoryListRes.pager.currentPage + 1
      if (this.CurrentPage <= this.getCategoryListRes.pager.totalPages) {
        this.setView(event)
      } else {
        this.canLoadMore = false
      }
    } else {
      this.canLoadMore = false
    }
  }

  /**
   * gets called when user selects a caregory
   * @param item selected cartegory
   */
  selectValue(item) {
    console.log('item', item)
    this.searchTerm = item.categoryName

    this.myClass = 'hide'
    setTimeout(async () => {
      await this.navCtrl.navigateForward('SearchResultsPage', { queryParams: {
        searchTerm: this.searchTerm,
        KYCAdded: this.isKycAdded,
        KYCApprovalStatus: this.kycApprovalStatus,
      }})
      this.searchTerm = ''
    }, 1000)
  }

  searchData(data) {
    console.log('data search click search')

    console.log('item secrh', data)
    //this.myClass = 'hide'
    setTimeout(async () => {
      await this.navCtrl.navigateForward('SearchResultsPage', { queryParams: {
        searchTerm: data,
        KYCAdded: this.isKycAdded,
        KYCApprovalStatus: this.kycApprovalStatus,
      }})
      this.searchTerm = ''
    }, 1000)
  }
}
