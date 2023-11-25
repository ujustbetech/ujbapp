import * as Enums from './Enums'

/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:            2019/05/03        Meghana
 *     Added more fields   2019/05/27        Gitesh
 */

export class ReferralDataInfo {
  //To Be used while adding product or service
  constructor() {
    //    this.refUnit = Enums.ReferralUnit.amount //set default referral type
    this.isInValid = false
    this.canUpdate = true
    this.isSlabInValid = false
    this.isInValidType = false
    this.isInValidValue = false
    this.isValueNotEntered = false
    this.isSlabFromInValid = false
    this.isSlabGreatInValid = false
    this.isSameProductName = false
    this.isInValidValuePer = false
    //this.isValueNotEnteredPer = false
    this.isInValidValueRup = false
    // this.isValueNotEnteredRup = false
    this.isSlabFromLengthInValid = false
    this.isSlabToLengthInValid = false
    this.isInValidLengthValue = false
  }

  //TODO : Single/multiple/slab/prduct

  productDetailsId?: string
  //"Percent" (1) || "Amount" (2)
  type?: string
  //like 10
  value?: number
  /*     //% or amt etc
        refUnit?: Enums.ReferralUnit */

  //refSubType?: string
  refText?: string
  from?: string
  to?: string
  productName?: string
  isInValid?: boolean
  isActive?: boolean
  createdOn?: string
  updatedOn?: string
  canUpdate?: boolean
  isSlabInValid: boolean
  isInValidValuePer?: boolean
  //isValueNotEnteredPer?: boolean
  isInValidValueRup?: boolean
  //isValueNotEnteredRup?: boolean
  isSlabFromInValid: boolean
  isSlabGreatInValid: boolean
  isInValidType?: boolean
  isInValidValue?: boolean
  isValueNotEntered?: boolean
  isInValidSlabFrom?: boolean
  isInValidSlabTo?: boolean
  isInvalidProduct?: boolean
  isSameProductName?: boolean
  isSlabFromLengthInValid?: boolean
  isSlabToLengthInValid?: boolean
  isInValidLengthValue?: boolean
}
