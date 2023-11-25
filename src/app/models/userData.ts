import { ListedPartnerStatsInfo } from './ListedPartnerStatsInfo'
import { LoginStatus } from './Enums'
import { ReferralsEarnedInfo } from './ReferralsEarnedInfo'

export class UserData {
  constructor() {
    this.firstName = ''
    this.userRole = ''
    this.userReferralEarnedInfo = new ReferralsEarnedInfo()
    this.userStatInfo = new ListedPartnerStatsInfo()
  }
  firstName?: string
  languagePreference?: string
  userId?: string
  userRole?: string
  businessId?: string
  emailId?: string
  countryCode: string
  mobileNumber: string
  lastName?: string
  base64Image?: string
  userStatInfo: ListedPartnerStatsInfo
  userReferralEarnedInfo: ReferralsEarnedInfo
  is_Otp_Verified: boolean
  otp: any
  isKycAdded?: boolean
  kycApprovalStatus?: boolean
  myMentorCode?: string
}
