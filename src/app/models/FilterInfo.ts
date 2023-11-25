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

import { CategoryInfo } from './CategoryInfo'
import * as Enums from '../models/Enums'

export class FilterInfo {
  constructor() {
    this.categories = new Array<CategoryInfo>()
    this.sortBy = Enums.SortValue.Default
    this.searchTerm = ''
    this.longitude = 0
    this.lattitude = 0
  }
  searchTerm?: string
  sortBy?: Enums.SortValue
  categories?: CategoryInfo[]
  longitude?: number
  lattitude?: number
}
