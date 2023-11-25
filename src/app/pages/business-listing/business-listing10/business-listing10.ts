import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'
import { BusinessListing11Page } from '../business-listing11/business-listing11'
import { BusinessListing12Page } from '../business-listing12/business-listing12'
import { BusinessListing2Page } from '../business-listing2/business-listing2'
import { BusinessListingInfo } from '../../../../app/models/businessListingQuestionInfo'
import * as Enums from '../../../../app/models/Enums'
import * as $ from 'jquery'
import { ActivatedRoute } from '@angular/router'

/**
 * Generated class for the BusinessListing10Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-business-listing10',
  templateUrl: 'business-listing10.html',
  styleUrls: ['business-listing10.scss']
})
export class BusinessListing10Page implements OnInit {
  pageTitle = 'Business Listing'
  selectedVal: any
  isInputGiven: boolean = false
  checkValidation: boolean = false
  inputVal
  myClass1
  showSave
  public static businessListingObj: BusinessListingInfo
  constructor(public navCtrl: NavController, private route: ActivatedRoute) {
    BusinessListing10Page.businessListingObj = new BusinessListingInfo()
  }

  ngOnInit() {
    console.log('ngOnInit BusinessListing10Page')
  }
  goToPreviousBusiness() {
    this.navCtrl.pop()
  }
  async goToNextBusiness() {
    this.checkValidation = true
    if (this.isInputGiven == true && this.inputVal == 'Freelancer') {
      BusinessListing10Page.businessListingObj.UserType =
        Enums.UserType.Freelancer
      // this.navCtrl.push(BusinessListing2Page, { inputVal: this.inputVal })
      await this.navCtrl.navigateForward('BusinessListing2Page', { queryParams: { inputVal: this.inputVal} } )
    } else if (
      this.isInputGiven == true &&
      this.inputVal == 'Partnership Firm'
    ) {
      BusinessListing10Page.businessListingObj.UserType =
        Enums.UserType.PartnerShipFirm
      // this.navCtrl.push(BusinessListing11Page, { inputVal: this.inputVal })
      await this.navCtrl.navigateForward('BusinessListing11Page', { queryParams: { inputVal: this.inputVal} } )
    } else if (this.isInputGiven == true && this.inputVal == 'LLP') {
      BusinessListing10Page.businessListingObj.UserType = Enums.UserType.LLP
      // this.navCtrl.push(BusinessListing12Page, { inputVal: this.inputVal })
      await this.navCtrl.navigateForward('BusinessListing12Page', { queryParams: { inputVal: this.inputVal} } )
    } else if (this.isInputGiven == true && this.inputVal == 'Company') {
      BusinessListing10Page.businessListingObj.UserType = Enums.UserType.Company
      // this.navCtrl.push(BusinessListing2Page, { inputVal: this.inputVal })
      await this.navCtrl.navigateForward('BusinessListing2Page', { queryParams: { inputVal: this.inputVal} } )
    }
    // else{
    //   this.isInputGiven == false
    // }
  }

  selectValue(val, data) {
    this.inputVal = data
    this.selectedVal = val
    // BusinessListing10Page.businessListingObj.UserType=this.inputVal
    this.isInputGiven = true

    switch (val) {
      case 1: {
        $('#freelancer1').css('background-color', '#003366')
        $('#freelancer1').css('color', '#ffffff')
        $('#PartnershipFirm').css('background-color', '#ffffff')
        $('#PartnershipFirm').css('color', '#003366')
        $('#llp').css('background-color', '#ffffff')
        $('#llp').css('color', '#003366')
        $('#company1').css('background-color', '#ffffff')
        $('#company1').css('color', '#003366')

        break
      }
      case 2: {
        $('#freelancer1').css('background-color', '#ffffff')
        $('#freelancer1').css('color', '#003366')
        $('#PartnershipFirm').css('background-color', '#003366')
        $('#PartnershipFirm').css('color', '#ffffff')
        $('#llp').css('background-color', '#ffffff')
        $('#llp').css('color', '#003366')
        $('#company1').css('background-color', '#ffffff')
        $('#company1').css('color', '#003366')

        break
      }
      case 3: {
        $('#freelancer1').css('background-color', '#ffffff')
        $('#freelancer1').css('color', '#003366')
        $('#PartnershipFirm').css('background-color', '#ffffff')
        $('#PartnershipFirm').css('color', '#003366')
        $('#llp').css('background-color', '#003366')
        $('#llp').css('color', '#ffffff')
        $('#company1').css('background-color', '#ffffff')
        $('#company1').css('color', '#003366')

        break
      }
      case 4: {
        $('#freelancer1').css('background-color', '#ffffff')
        $('#freelancer1').css('color', '#003366')
        $('#PartnershipFirm').css('background-color', '#ffffff')
        $('#PartnershipFirm').css('color', '#003366')
        $('#llp').css('background-color', '#ffffff')
        $('#llp').css('color', '#003366')
        $('#company1').css('background-color', '#003366')
        $('#company1').css('color', '#ffffff')

        break
      }
    }
  }
}
