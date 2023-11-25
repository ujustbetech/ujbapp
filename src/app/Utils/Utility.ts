/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/02/13        Meghana
 */

import * as Enums from '../models/Enums'
import * as moment from 'moment'
import { CategoryInfo } from '../models/CategoryInfo'
import { Constants } from './Constants'
import { UploadCompanyLogoInfo } from '../models/companyLogo_info'
import { Urls } from './urls'
import { NavController, ToastController } from '@ionic/angular'

export class Utility {
  static toastCtrl
  public static companyLogoDetails: UploadCompanyLogoInfo
  public static async showToast(
    toast: ToastController,
    text: string,
    shouldShowClose: boolean,
    closeButtonText: string,
    shouldDismissOnPageChange: boolean
  ) {
    Utility.toastCtrl = await toast.create({
      message: text,
      position: 'bottom',
      showCloseButton: shouldShowClose,
      closeButtonText: closeButtonText,
      duration: Constants.toastTimeOut,
      // dismissOnPageChange: shouldDismissOnPageChange, // TODO
      cssClass: 'ujb_toast',
    })
    Utility.toastCtrl.present()
  }

  public static closeToast(toast: ToastController) {
    if (Utility.toastCtrl) Utility.toastCtrl.dismiss()
  }

  public static getErrorMessage(status) {
    if (status === '400') {
      return Constants.someErrorOccurred
    } else if (status === '301') {
      return Constants.inActiveUser
    } else if (status === '401') {
      return Constants.invalidUsernamePassword
    } else if (status === '404') {
      return Constants.userNotFound
    } else if (status === '406') {
      return Constants.serverIssue
    } else if (status === '408') {
      return Constants.timeoutIssue
    } else if (status === '500') {
      return Constants.internalServerError
    } else if (status === '504') {
      return Constants.timeoutIssue
    } else {
      return Constants.someErrorOccurred
    }
  }

  public static getBusinessListInfo(data, getBusinessListInfo) {
    if (data && data.length) {
      /* if (data.categoryListForSort != undefined)
                     //getBusinessListInfo.categoryListForSort = data.categoryListForSort
                     data.categoryListForSort.forEach(element => {
                       
                        console.log("data search", element)
                        let selectedCategory = new CategoryInfo()
                        selectedCategory.categoryName = element.categoryName;
                        selectedCategory.catId = element.catId
                       
                        if (getBusinessListInfo.categoryListForSort != undefined) {
                           let flag = false
                           for (let i = 0; i < getBusinessListInfo.categoryListForSort.length; i++) {
                              if (getBusinessListInfo.categoryListForSort[i].catId == element.catId) {
                                 flag = true
                                 //getBusinessListInfo.categoryListForSort.splice(i, 1)
                                 break
                              } else {
                                 flag = false
                              }
                           }
                           if (flag == false) {
                              getBusinessListInfo.categoryListForSort.push(selectedCategory)
                           }
                          //  let index = getBusinessListInfo.categoryListForSort.indexOf(element)
                          //    if (index == -1) {
                          //    getBusinessListInfo.categoryListForSort.push(selectedCategory)
                          // } 
                        }
                     }); */
      if (data.categoryListForSort != undefined) {
        getBusinessListInfo.categoryListForSort = new Array<CategoryInfo>()
        getBusinessListInfo.categoryIds = new Array<string>()
        for (let i = 0; i < data.categoryListForSort.length; i++) {
          getBusinessListInfo.categoryIds.push(
            data.categoryListForSort[i].catId
          )
          getBusinessListInfo.categoryListForSort.push(
            data.categoryListForSort[i]
          )
        }
      } else {
        getBusinessListInfo.categoryIds = new Array<string>()
        getBusinessListInfo.categoryListForSort = new Array<CategoryInfo>()
      }
      getBusinessListInfo.latitude = data.latitude
      getBusinessListInfo.longitude = data.longitude
      getBusinessListInfo.searchTerm = data.searchTerm
      getBusinessListInfo.SearchType = Enums.SearchType.Advanced
      getBusinessListInfo.sortValue = data.sortValue
      getBusinessListInfo.skipTotal = 0
      console.log('sent dada', getBusinessListInfo)
    } else {
      getBusinessListInfo.categoryListForSort = []
    }
    return getBusinessListInfo
  }

  public static getUiDate(date) {
    return moment(moment(date, 'DD/MM/YYYY')).format('DD MMM YYYY').toString()
  }
  public static getFullDate(date: any) {
    //////
    let l = moment(date, 'YYYY-MM-DDTHH:mm:ssZZ')
    return l
    //return new Date(date);
  }

  public static removeInstances(page: any, navCtrl: any) {
    // if (navCtrl.getViews() && navCtrl.getViews().length > 1)
    //   for (let i = 0; i < navCtrl.getViews().length; i++) {
    //     if (navCtrl.getViews()[i].instance instanceof page) {
    //       navCtrl.removeView(navCtrl.getViews()[i])
    //     }
    //   }
  }
  //,shouldClosedPage:boolean,navCntrl:NavController

  public static getImageUrl(url) {
    return Urls.baseUrl + Urls.port + '/' + url
  }
}
