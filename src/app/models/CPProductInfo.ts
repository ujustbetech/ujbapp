import { ArrayType } from '@angular/compiler/src/output/output_ast'
import { ProductImageInfo } from './ProductImageInfo'
import { ReferralDataInfo } from './ReferralDataInfo'
import { analyzeAndValidateNgModules } from '@angular/compiler'

/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/* Model for the user profile
 * Revision History:
 *     Initial:            2019/05/27        Gitesh
 *     Added more fields   2019/05/27        Gitesh
 *     set default fields   2019/07/11        Gitesh
 */

export class ProductInfo {
  constructor() {
    this.productImages = new Array<ProductImageInfo>()
    this.ProductsOrServices = new Array<ReferralDataInfo>()
    this.tempProductsOrServices = new Array<ReferralDataInfo>()
    this.expanded = false
    this.showMultiple = false
    this.addSingleProduct = false
    this.showSlabs = false
    this.showProducts = false
    //this.productPrice = "0"
    this.canUpdateRefData = true
    this.isSlabProdRadioInvalid = true
    this.isSlabProdLengthInvalid = false
  }
  selectedImage?: string
  productId?: string
  businessId?: string
  // Product/Service
  type?: string
  name?: string
  description?: string
  productImgUrl?: string
  productPrice?: number
  minimumDealValue?: string
  minimumDealValueUnit?: string
  productImages?: ProductImageInfo[]
  ProductsOrServices?: ReferralDataInfo[]
  showMultiple?: boolean
  addSingleProduct: boolean
  showSlabs: boolean
  showProducts: boolean
  url?: string
  createdBy?: string
  expanded?: boolean
  // "Single" (1) || "Multiple" (2)
  typeOf?: number
  // "Slab" (1) || "Product" (2)
  shareType?: number
  isActive?: string
  canUpdateRefData?: boolean
  tempProductsOrServices?: ReferralDataInfo[]
  isSameProductName?: boolean
  isSlabProdRadioInvalid?: boolean
  isSlabProdLengthInvalid: boolean
}
