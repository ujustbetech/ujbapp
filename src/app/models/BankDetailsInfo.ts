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

export class BankDetailsInfo extends KYCDocs {
  constructor() {
    super()
    this.BankDetails = new BanckDetail()
  }
  // docType = Enums.KYCDocumentType.BankCheque;
  userId?: string
  /* name?: string
    accNumber?: string
    bankName?: string
    IFSC?: string */
  BankDetails?: BanckDetail
}

export class BanckDetail {
  constructor() {
    this.accountHolderName = ''
    this.bankName = ''
    this.IFSCCode = ''
    this.cancelChequebase64Img = ''
    this.cancelChequeImgType = ''
    this.accountNumber = ''
    this.FileName = ''
    this.ImageURL = ''
  }
  accountHolderName?: string
  bankName?: string
  IFSCCode?: string
  cancelChequebase64Img?: string
  cancelChequeImgType?: string
  accountNumber?: string
  FileName?: string
  ImageURL?: string
}
