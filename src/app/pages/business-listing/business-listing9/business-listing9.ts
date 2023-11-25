import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import {  NavController } from '@ionic/angular'
import * as $ from 'jquery'
/**
 * Generated class for the BusinessListing9Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-listing9',
  templateUrl: 'business-listing9.html',
  styleUrls: ['business-listing9.scss']
})
export class BusinessListing9Page {
  isInputGiven: boolean = false
  checkValidation: boolean = false
  userFirstName
  selectedItem: string
  constructor(public navCtrl: NavController, private route: ActivatedRoute) {}

  goToBL8() {
    this.navCtrl.pop()
  }
  async goToBKycPan() {
    this.checkValidation = true
    if (this.isInputGiven == true && this.selectedItem == 'products') {
      // // this.navCtrl.push(ProductServiceAddEditPage, {
      //   selectedItem: this.selectedItem,
      // })
      //// this.navCtrl.push(BusinessKycPanPage);
      await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: { selectedItem: this.selectedItem} })
    } else if (this.isInputGiven == true && this.selectedItem == 'services') {
      // this.navCtrl.push(ProductServiceAddEditPage, {
      //   selectedItem: this.selectedItem,
      // })
      //// this.navCtrl.push(BusinessKycPanPage);
      await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: { selectedItem: this.selectedItem} })
    } else if (this.isInputGiven == true && this.selectedItem == 'both') {
      // this.navCtrl.push(ProductServiceAddEditPage, {
      //   selectedItem: this.selectedItem,
      // })
      //// this.navCtrl.push(BusinessKycPanPage);
      await this.navCtrl.navigateForward('ProductServiceAddEditPage', { queryParams: { selectedItem: this.selectedItem} })
    }
  }
  selectValue(data: any, val) {
    ////
    this.selectedItem = data
    this.isInputGiven = true
    switch (val) {
      case '1': {
        {
          $('#Products').css('background-color', '#003366')
          $('#Products').css('color', '#ffffff')
          $('#Services').css('background-color', '#ffffff')
          $('#Services').css('color', '#003366')
          $('#Both').css('background-color', '#ffffff')
          $('#Both').css('color', '#003366')
          break
        }
      }
      case '2': {
        $('#Products').css('background-color', '#ffffff')
        $('#Products').css('color', '#003366')
        $('#Services').css('background-color', '#003366')
        $('#Services').css('color', '#ffffff')
        $('#Both').css('background-color', '#ffffff')
        $('#Both').css('color', '#003366')
        break
      }
      case '3': {
        $('#Products').css('background-color', '#ffffff')
        $('#Products').css('color', '#003366')
        $('#Services').css('background-color', '#ffffff')
        $('#Services').css('color', '#003366')
        $('#Both').css('background-color', '#003366')
        $('#Both').css('color', '#ffffff')
        break
      }
    }
  }
  async skip() {
    // this.navCtrl.push(BusinessKycPanPage)
    await this.navCtrl.navigateForward('BusinessKycPanPage')
  }

  // ngOnInit() {
  //   console.log('ngOnInit BusinessListing9Page');
  // }
}
