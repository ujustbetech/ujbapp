import { UserInfo } from './userInfo'

/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/03/01        Meghana
 */

import * as Enums from './Enums'

export class GuestInfo extends UserInfo {
  constructor() {
    super()
    this.userId = ''
    this.userRole = 'Guest'
  }
  userId?: string
  userRole?: string
}
