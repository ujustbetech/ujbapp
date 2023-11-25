import { KYCDocs } from './KYCDocs'
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
 *     Initial:            2019/03/05        Meghana
 *     Added more fields   2019/05/27        Gitesh
 */

export class AadharInfo extends KYCDocs {
  constructor() {
    super()
    this.aadharNumber = ''
    this.FrontImageURL = ''
    this.aadharFrontBase64 = ''
    this.aadharFrontType = ''
    this.FrontFileName = ''
    this.BackImageURL = ''
    this.aadharBackBase64 = ''
    this.aadharBackType = ''
    this.BackFileName = ''
  }

  docType = Enums.KYCDocumentType.AADHAR
  userId?: string
  aadharNumber?: string
  FrontImageURL?: string
  aadharFrontBase64?: string
  aadharFrontType?: string
  FrontFileName?: string
  BackImageURL?: string
  aadharBackBase64?: string
  aadharBackType?: string
  BackFileName?: string
}
