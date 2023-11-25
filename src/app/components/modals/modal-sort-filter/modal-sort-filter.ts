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
 *     filter / sort bug:        2019/07/01        Yogesh Chavan
 */

import {
  AlertController,
  LoadingController,
  ModalController,
  NavController,
  Platform,
} from '@ionic/angular'
// import { App } from '@ionic/angular'

import { Component, Input, OnInit } from '@angular/core'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { Storage } from '@ionic/storage'
import { CategoryInfo } from '../../../../app/models/CategoryInfo'
import { GetBusinessListInfo } from '../../../../app/models/getBusinessList_info'
import { Utility } from '../../../Utils/Utility'
import { Constants } from '../../../Utils/Constants'
import { CommonUtilsService } from '../../../services/common-utils.service'
import { CategoriesService } from '../../../services/categories.service'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the ModalSortFilterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modal-sort-filter',
  templateUrl: 'modal-sort-filter.html',
  styleUrls: ['modal-sort-filter.scss']
})
export class ModalSortFilterComponent implements OnInit {
  modalHeader: string = 'Sort/Filter'
  modalDismiss: string = 'Done'
  txt_SortBy: string = 'Sort by'
  txt_Rating: string = 'Rating'
  txt_Distance: string = 'Distance'
  txt_NearToFar: string = 'Near to Far'
  txt_Categories: string = 'Categories'
  categoryList: CategoryInfo[]
  selectedItem: any
  catData: any
  searchTerm: string = ''
  catList: CategoryInfo[]
  //filterInfo: FilterInfo;
  //sortOption: any
  //userlocation: any
  CategoryInfo: CategoryInfo
  @Input() filterInfo: any
  getBusinessListInfo: GetBusinessListInfo
  userRole
  getCategoryListRes: CategoryInfo
  CurrentPage: any
  totalCount
  sortData = [
    {
      id: 0,
      src: 'assets/imgs/content-imgs/rating.png',
      active: 'assets/imgs/content-imgs/rating_active.png',
      inActive: 'assets/imgs/content-imgs/rating.png',
      text: this.txt_Rating,
      text2: '',
    },
    {
      id: 1,
      src: 'assets/imgs/content-imgs/near_to_far.png',
      active: 'assets/imgs/content-imgs/near_to_far_active.png',
      inActive: 'assets/imgs/content-imgs/near_to_far.png',
      text: this.txt_Distance,
      text2: this.txt_NearToFar,
    },
    {
      id: 2,
      src: 'assets/imgs/content-imgs/a_to_z.png',
      active: 'assets/imgs/content-imgs/a_to_z_active.png',
      inActive: 'assets/imgs/content-imgs/a_to_z.png',
      text: '',
      text2: '',
    },
    {
      id: 3,
      src: 'assets/imgs/content-imgs/z_to_a.png',
      active: 'assets/imgs/content-imgs/z_to_a_active.png',
      inActive: 'assets/imgs/content-imgs/z_to_a.png',
      text: '',
      text2: '',
    },
  ]

  constructor(
    public modalCtrl: ModalController,
    private navCtrl: NavController,
    // public appCtrl: App,
    private geolocation: Geolocation,
    public commonUtilsProvider: CommonUtilsService,
    public getCategoryList: CategoriesService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public storage: Storage,
    private platform: Platform,
    private route: ActivatedRoute
  ) {
    
    // route.queryParams.subscribe((params: any) => {
         
    // })
  }

  ngOnInit(): void {
    this.getBusinessListInfo = this.filterInfo
    this.CurrentPage = 1
      this.getCategoryListRes = new CategoryInfo()
      this.CategoryInfo = new CategoryInfo()
      this.categoryList = new Array<CategoryInfo>()
      // this.getBusinessListInfo = params.filterInfo
      this.catList = new Array<CategoryInfo>()
      this.getCategories(this.CurrentPage)
      this.setFilterUI()
      this.platform.backButton.subscribe(() => {
        if (this.modalCtrl) {
          this.modalCtrl.dismiss()
          this.modalCtrl = undefined
        } else this.navCtrl.pop()
      }) 
  }

  /**
   * closes model
   */
  async getCategories(CurrentPage) {
    let loading = await this.loadingCtrl.create({ cssClass: 'transparent' })
    loading.present()
    /// for(let j=1; j<=2;j++){
    //this.CurrentPage = j
    this.getCategoryList
      .getcategoriesApi(this.searchTerm, CurrentPage)
      .subscribe(
        (res: any) => {
          if (loading) loading.dismiss()
          console.log('list', res)
          if (res.json.message[0].type == 'SUCCESS') {
            let data = res.json.data.categories
            for (let i = 0; i < data.length; i++) {
              let categoryinfoobj = new CategoryInfo()
              categoryinfoobj.catId = data[i].catId
              categoryinfoobj.categoryName = data[i].categoryName
              categoryinfoobj.categoryImgBase64 = Utility.getImageUrl(
                data[i].categoryImgBase64
              )
              if (
                this.getBusinessListInfo && categoryinfoobj.categoryName == this.getBusinessListInfo.searchTerm
              ) {
                categoryinfoobj.disabled = true
              }
              this.catList.push(categoryinfoobj)

              this.totalCount = res.json.data.totalCount
              this.getCategoryListRes.pager.currentPage =
                res.json.data.pager.currentPage
              this.getCategoryListRes.pager.pageSize =
                res.json.data.pager.pageSize
              this.getCategoryListRes.pager.totalPages =
                res.json.data.pager.totalPages
              this.getCategoryListRes.pager.totalRecords =
                res.json.data.pager.totalRecords
              console.log(
                'list in category get category res',
                this.getCategoryListRes
              )

              console.log('list', this.catList)
              if (
                this.CurrentPage != this.getCategoryListRes.pager.totalPages
              ) {
                this.CurrentPage++
                this.getCategories(this.CurrentPage)
              }
              this.setSelected()
            }
            console.log('list', this.catList)
          }
        },
        (err) => {
          if (loading) loading.dismiss()
          console.log('err', err)
          this.catList = new Array<CategoryInfo>()
        }
      )
    // }
  }

  closeModal() {
    this.modalCtrl.dismiss(JSON.parse(JSON.stringify(this.getBusinessListInfo)))
  }

  /**
   * set selected sort result
   * @param result set param to variable
   */
  sortResults(result: any) {
    this.CategoryInfo.catId = result.catId
    if (this.catList != undefined) {
      this.catList.forEach((element) => {
        if (result.categoryName == element.categoryName) {
          if (element.selected) {
            let index = this.catList.indexOf(element)
            this.catList[index].selected = false
            if (this.getBusinessListInfo.categoryListForSort == undefined) {
              this.getBusinessListInfo.categoryListForSort =
                new Array<CategoryInfo>()
            }
            for (
              var i = 0;
              i < this.getBusinessListInfo.categoryListForSort.length;
              i++
            ) {
              if (
                this.getBusinessListInfo.categoryListForSort[i].categoryName ==
                element.categoryName
              ) {
                this.getBusinessListInfo.categoryListForSort.splice(i, 1)
              }
            }
          } else {
            if (this.categoryList != undefined) {
              let index = this.categoryList.indexOf(result.categoryName)
              if (index == -1) {
                this.categoryList.push(result)
                if (this.getBusinessListInfo.categoryListForSort == undefined) {
                  this.getBusinessListInfo.categoryListForSort =
                    new Array<CategoryInfo>()
                }
                let i =
                  this.getBusinessListInfo.categoryListForSort.indexOf(result)
                for (
                  var j = 0;
                  j < this.getBusinessListInfo.categoryListForSort.length;
                  j++
                ) {
                  if (
                    this.getBusinessListInfo.categoryListForSort[j]
                      .categoryName == result.categoryName
                  ) {
                    this.getBusinessListInfo.categoryListForSort.splice(j, 1)
                  }
                }
                if (i == -1) {
                  this.getBusinessListInfo.categoryListForSort.push(result)
                }
              }
            }
          }
        }
      })
    }
    this.selectedItem = result
  }

  setSelected() {
    if (this.getBusinessListInfo.categoryListForSort != undefined) {
      this.getBusinessListInfo.categoryListForSort.forEach((e) => {
        if (this.catList != undefined) {
          this.catList.forEach((element) => {
            if (element.categoryName == e.categoryName) {
              element.selected = true
            }
          })
        }
      })
    }
  }

  selectedSort(value: any) {
    console.log('selectedSort', value)
    if (value == this.getBusinessListInfo.sortValue) {
      this.sortData[value].src = this.sortData[value].inActive
      this.getBusinessListInfo.sortValue = null
    } else {
      if (value == 1) {
        this.storage.get('userInfo').then((val) => {
          this.userRole = val.userRole
          if (this.userRole == Constants.clientPartner) {
            this.alertConfirmLocation(value)
          } else {
            this.geolocation.getCurrentPosition().then((resp) => {
              console.log('resp', resp)
              this.getBusinessListInfo.latitude = resp.coords.latitude
              this.getBusinessListInfo.longitude = resp.coords.longitude
              this.getBusinessListInfo.sortValue = value
              this.setFilterUI()
            })
          }
        })
      } else {
        this.getBusinessListInfo.latitude = 0
        this.getBusinessListInfo.longitude = 0
        this.getBusinessListInfo.sortValue = value
        this.setFilterUI()
      }
    }
  }

  //Alert Address Confirmation
  alertConfirmLocation(value) {
    this.alertCtrl.create({
      message: 'Choose Location',
      cssClass: 'alertConfirmLocation',
      inputs: [
        {
          type: 'radio',
          label: 'Current Address',
          value: '0',
        },
        {
          type: 'radio',
          label: 'Registered Address',
          value: '1',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: () => {},
          //role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data: string) => {
            if (data == '0') {
              this.geolocation.getCurrentPosition().then((resp) => {
                console.log('resp', resp)
                this.getBusinessListInfo.latitude = resp.coords.latitude
                this.getBusinessListInfo.longitude = resp.coords.longitude
                this.getBusinessListInfo.sortValue = value
                this.setFilterUI()
              })
            } else {
              this.geolocation.getCurrentPosition().then((resp) => {
                console.log('resp', resp)
                this.getBusinessListInfo.latitude = 0
                this.getBusinessListInfo.longitude = 0
                this.getBusinessListInfo.sortValue = value
                this.setFilterUI()
              })
            }
            console.log('data selected', data)
          },
        },
      ],
    }).then(alertAddress => alertAddress.present())
    /* alertAddress.onDidDismiss((data) => {
      this.filterInfo.lattitude = this.latitude
      this.filterInfo.longitude = this.longitude
    }) */
  }

  setFilterUI() {
    for (let i = 0; i < this.sortData.length; i++) {
      if (this.getBusinessListInfo && this.sortData[i].id == this.getBusinessListInfo.sortValue) {
        this.sortData[i].src = this.sortData[i].active
      } else {
        this.sortData[i].src = this.sortData[i].inActive
      }
    }
  }
}
