import { CategoryInfo } from './CategoryInfo'

/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:            2019/03/28        Meghana
 *     Added more fields   2019/05/27        Gitesh
 */

export class ReferralInfo {
  constructor() {
    this.productId = ''
    this.referralDescription = ''
    this.referredForEmailId = ''
    this.referredForMobileNo = ''
    this.referredForName = ''
    this.referredToPartnerId = ''
    this.referredToPartnerName = ''
    this.categories = new Array<CategoryInfo>()
    this.clientPartnerDetails = new ClientPartnerDetails()
    this.statusHistories = new StatusHistory()
    this.referredToDetails = new ReferredToDetails()
    this.referredByDetails = new ReferredByDetails()
    this.rejectReasonFlag = false
    this.acceptSelected = ''
    this.rejectSelected = ''
    this.referralRejectFlag = false
  }

  referralId?: string
  referredToPartnerName?: string
  referredToPartnerId?: string
  categories?: CategoryInfo[]
  dateCreated?: string
  refStatus?: number
  productId?: string
  productName?: string
  referralDescription?: string
  referredForName?: string
  referredForEmailId?: string
  referredForMobileNo?: string
  referredForCountryCode?: string
  isForSelf?: boolean
  businessId?: string
  businessName?: string
  referredToDetails?: ReferredToDetails
  referredByDetails?: ReferredByDetails
  clientPartnerDetails?: ClientPartnerDetails
  statusHistories?: StatusHistory
  referralStatusValue?: string
  referralCode?: string
  rejectedReason?: string
  dealValue?: number
  calcDealValue?: number
  dealStatus?: number
  referralStatusUpdatedOn?: string
  referralStatusUpdatedby?: string
  rejectReasonFlag?: boolean
  acceptSelected?: string
  rejectSelected?: string
  referralRejectFlag?: boolean
}

export class ClientPartnerDetails {
  name?: string
  mobileNumber?: string
  emailId?: string
  tagline?: string
  countryCode?: string
  userId?: string
}

export class ReferredToDetails {
  name?: string
  countryCode?: string
  mobileNumber?: string
  emailId?: string
}

export class ReferredByDetails {
  referredByName?: string
  referredByEmailId?: string
  referredByMobileNo?: string
  referredByCountryCode?: string
  referredByUserId?: string
  referredByRole?: string
}

export class StatusHistory {
  date?: string
  status?: string
  statusCode?: number
  icon?: string
}

export class ReferralParent {
  constructor() {
    this.referralInfo = new Array<ReferralInfo>()
    this.paging = new Paging()
  }
  referralInfo: ReferralInfo[]
  paging: Paging
}

export class Paging {
  pageSize: number
  currentPage: number
  totalPages: number
  totalRecords: number
  isPagingRequired: boolean
}
