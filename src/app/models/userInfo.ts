import { AddressInfo } from './AddressInfo'

/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/* Model for the user profile
 * Revision History:
 *     Initial:            2019/02/13        Meghana
 *     Added more fields   2019/05/27        Gitesh
 */

export class UserInfo {
  constructor() {
    this.firstName = ''
    this.lastName = ''
    this.emailId = ''
    this.countryCode = ''
    this.mobileNumber = ''
    this.noOfLeads = 0
    this.businessDetails = new businessDetails()
    this.address = new AddressInfo()
  }
  userId?: string
  emailId?: string
  countryCode: string
  mobileNumber: string
  imgUrl?: string
  base64Image?: string
  imgType?: string
  languagePreference?: string
  firstName?: string
  lastName?: string
  currentStatus?: string
  ujbId?: string
  isMentor?: boolean
  password?: string
  socialMediaId?: string
  userRolestr?: string
  role?: string
  isKycAdded?: boolean
  kycApprovalStatus?: string
  otp?: string
  mentorCode?: string
  myMentorCode?: string
  locality?: string
  noOfConnects?: string
  noOfLeads?: number
  isPartnerAgreementAccepted?: boolean
  isMembershipAgreementAccepted?: boolean
  partnerAgreementURL?: string
  isRefer?: boolean
  businessDetails?: businessDetails
  address?: AddressInfo
  mentorName
}

export class ProfilePhotoInfo {
  constructor() {
    this.userId = ''
    this.FileName = ''
    this.ImageURL = ''
    this.UniqueName = ''
    this.ImageBase64 = ''
  }
  userId: string
  FileName: string
  ImageURL: string
  UniqueName: string
  ImageBase64: string
}
export class businessDetails {
  constructor() {
    this.bsnsAdd = new AddressInfo()
  }
  companyName
  businessEmail
  bsnsAdd: AddressInfo
  useTypeId
  userType
  partnerName
}
