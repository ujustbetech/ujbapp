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

import { ReferralsEarnedInfo } from './ReferralsEarnedInfo'

export class PartnerStatsInfo {
  constructor() {
    this.refsEarned = new ReferralsEarnedInfo()
  }
  refsGiven?: string
  dealsClosed?: string
  refsEarned?: ReferralsEarnedInfo
}
