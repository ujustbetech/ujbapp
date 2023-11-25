import { AddressInfo } from './AddressInfo'
import { CategoryInfo } from './CategoryInfo'
import { UploadCompanyLogoInfo } from './companyLogo_info'

export class GetBusinessListRes {
  constructor() {
    this.businessList = new Array<businessList>()
  }

  listCount?: string
  googleApiNextToken?: string
  businessList: businessList[]
}
export class businessList {
  constructor() {
    this.address = new AddressInfo()
    this.categories = new Array<CategoryInfo>()
    this.shareDetails = new Array<shareDetails>()
    this.logo = new UploadCompanyLogoInfo()
    this.showShared = true
  }
  userId?: string
  businessId?: string
  rating?: string
  categories: CategoryInfo[]
  businessName?: string
  tagline?: string
  address: AddressInfo
  businessDescription?: string
  businessUrl?: string
  shareDetails: shareDetails[]
  logo: UploadCompanyLogoInfo
  shareValue: any
  showArrow: boolean
  showValue: boolean
  showAmount: boolean
  showPercent: boolean
  showShared: boolean
  shareDatailValue
}
export class shareDetails {
  shareType?: string
  value?: string
}
