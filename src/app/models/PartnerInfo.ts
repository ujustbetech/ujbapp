/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:            2019/03/01        Meghana
 *     Added more fields   2019/05/27        Gitesh
 */

import { GuestInfo } from './GuestInfo'
import * as Enums from './Enums'
import { UserInfo } from './userInfo'
import { PanInfo } from './PanInfo'
import { BankDetailsInfo } from './BankDetailsInfo'
import { QuestionsInfo } from './QuestionsInfo'
import { Localities } from './locality_info'

export class PartnerInfo extends GuestInfo {
  constructor() {
    super()
    this.userRole = 'Partner'
    this.connections = new Array<UserInfo>()
    this.mentor = new UserInfo()
    this.userInfo = new UserInfo()
    this.pan = new PanInfo()
    this.bankDetails = new BankDetailsInfo()
    this.questions = new QuestionsInfo()
    this.otherDetails = new UserOtherDetails()
    this.localities = new PreferredLocations()
    this.location = new Location()
  }
  connections?: UserInfo[]
  about?: string
  role?: string
  mentor?: UserInfo
  userInfo?: UserInfo
  statusMessage?: string
  pan?: PanInfo
  bankDetails?: BankDetailsInfo
  questions?: QuestionsInfo
  passiveIncome?: string
  gender?: string
  birthDate?: string
  otherDetails?: UserOtherDetails
  location?: Location
  knowledgeSource?: string
  organisationType?: string
  userType?: string
  localities?: PreferredLocations
  countryCode: string
  location1?: string
  countryId?: any
  stateId?: any
}

export class Location {
  location?: string
  locality?: string
  flatWing?: string
}

export class UserOtherDetails {
  maritalStatus?: string
  hobbies?: string
  aboutMe?: string
  areaOfInterest?: string
  canImpartTraining?: string
}

export class PreferredLocations {
  location1?: string
  location2?: string
  location3?: string
}
