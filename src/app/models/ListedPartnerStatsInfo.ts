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

import { PartnerStatsInfo } from './PartnerStatsInfo'
import { BusinessStatsInfo } from './BusinessStatsInfo'

export class ListedPartnerStatsInfo {
  constructor() {
    this.referralStats = new PartnerStatsInfo()
    this.businessStats = new BusinessStatsInfo()
  }

  referralStats?: PartnerStatsInfo
  businessStats?: BusinessStatsInfo
}
