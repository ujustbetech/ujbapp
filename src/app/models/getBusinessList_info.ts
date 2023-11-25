import { CategoryInfo } from './CategoryInfo'
import * as Enums from '../models/Enums'

export class GetBusinessListInfo {
  constructor() {
    this.categoryListForSort = new Array<CategoryInfo>()
    this.categoryIds = new Array<string>()
    this.searchTerm = ''
    this.sortValue = Enums.SortValue.Default
    this.latitude = 0
    this.longitude = 0
    this.SearchType = Enums.SearchType.Dashboard
    this.skipTotal = 0
  }
  categoryIds?: string[]
  searchTerm?: string
  sortValue?: Enums.SortValue
  SearchType?: Enums.SearchType
  latitude?: number
  longitude?: number
  categoryListForSort: CategoryInfo[]
  //googleApiToken?: string
  userId?: string
  skipTotal?: number
}
