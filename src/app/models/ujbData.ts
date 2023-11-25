import { UJBStatsInfo } from './UJBStatsInfo'
import { GetBusinessListInfo } from './getBusinessList_info'
import { CategoryInfo } from './CategoryInfo'
import { businessList } from './getBusinessList_res'

export class UjbData {
  constructor() {
    this.getUjbDataStat = new UJBStatsInfo()
    this.getUjbDataBusinessList = new Array<businessList>()
    this.getUjbDataCategories = new Array<CategoryInfo>()
  }
  getUjbDataStat: UJBStatsInfo
  getUjbDataBusinessList: businessList[]
  getUjbDataCategories: CategoryInfo[]
}
