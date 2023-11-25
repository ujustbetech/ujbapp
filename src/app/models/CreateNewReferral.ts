import { FormStyle } from '@angular/common'

export class CreateNewReferral {
  constructor() {
    this.businessId = ''
    this.selectedProductId = ''
    this.productServiceSlabId = ''
    this.shortDescription = ''
    this.referredByName = ''
    this.referredById = ''
    this.referredToName = ''
    this.countryCode = ''
    this.mobileNumber = ''
    this.emailId = ''
    this.selectedProduct = ''
  }
  businessId?: string
  selectedProductId?: string
  productServiceSlabId?: string
  shortDescription?: string
  referredByName?: string
  referredById?: string
  referredToName?: string
  countryCode?: string
  mobileNumber?: string
  emailId?: string
  forSelf?: boolean
  selectedProduct?: string
}
