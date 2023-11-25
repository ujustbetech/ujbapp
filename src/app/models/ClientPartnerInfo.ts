import { PartnerInfo } from './PartnerInfo'
import * as Enums from './Enums'
//import { CPService } from "./CPService";
import { ProductInfo } from './CPProductInfo'
import { QuestionsInfo } from './QuestionsInfo'
import { CategoryInfo } from './CategoryInfo'
import { PanInfo } from './PanInfo'
import { AddressInfo } from './AddressInfo'
import { UploadCompanyLogoInfo } from './companyLogo_info'
import { Constants } from '../Utils/Constants'

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

export class ClientPartnerInfo extends PartnerInfo {
  constructor() {
    super()
    this.userRole = Constants.clientPartner
    this.products = new Array<ProductInfo>()
    this.services = new Array<ProductInfo>()
    this.categories = new Array<CategoryInfo>()
    this.businessPan = new PanInfo()
    this.addressInfo = new AddressInfo()
    this.companyLogoDetails = new UploadCompanyLogoInfo()
  }
  addressInfo: AddressInfo
  products?: ProductInfo[]
  services?: ProductInfo[]
  categories?: CategoryInfo[]
  businessPan?: PanInfo
  businessGST?: string
  rating?: string
  tagline?: string
  sharedPercentage?: string
  businessEmail?: string
  businessDescription?: string
  websiteUrl?: string
  bannerBase64?: string
  bannerImageUrl?: string
  bannerImageType?: string
  bannerImageName?: string
  logoBase64?: string
  logoImageUrl?: string
  logoImgType?: string
  logoImgName?: string
  businessName?: string
  businessId?: string
  companyLogoDetails: UploadCompanyLogoInfo
  userTypeId
  userType
  nameofPartner
}
