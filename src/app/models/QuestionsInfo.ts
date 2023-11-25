import { AddressInfo } from './address_info'

/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/* Model for the user profile
 * Revision History:
 *     Initial:            2019/05/27        Gitesh
 *     Added more fields   2019/05/27        Gitesh
 */

export class QuestionsInfo {
  constructor() {
    this.hobbies = new Array<string>()
    this.interests = new Array<string>()
    this.Localities = new Array<string>()
    this.addressInfo = new AddressInfo()
  }

  userId?: string
  gender?: string
  birthDate?: string
  maritalStatus?: string
  passiveIncome?: string
  hobbies?: string[]
  interests?: string[]
  canImpartTrainning?: Boolean
  knowledgeSource?: string
  entityOne?: string
  entityTwo?: string
  Localities?: string[]
  addressInfo?: AddressInfo
  mentorCode?: string
  organisationType?: string
  userType?: string
  countryId?: string
  stateId?: string
}
