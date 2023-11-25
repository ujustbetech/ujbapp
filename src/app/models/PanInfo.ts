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

export class PanInfo extends KYCDocs {
  //  docType = Enums.KYCDocumentType.PAN
  constructor() {
    super()
    this.panNumber = ''
    this.ImageURL = ''
    this.panImgBase64 = ''
    this.FileName = ''
    this.panType = ''
  }
  userId?: string
  panNumber?: string
  ImageURL?: string
  panImgBase64?: string
  //panImgType?: string
  FileName?: string
  panType?: string
}
