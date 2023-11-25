import * as Enums from '../models/Enums'

export class ReferralRequestInfo {
  constructor() {
    this.categoryIds = new Array<string>()
    this.status = new Array<string>()
    this.query = ''
    this.currentPage = 0
    this.referred = 'byMe'
  }
  status?: string[]
  query?: string
  categoryIds?: string[]
  referred?: string
  userId?: string
  currentPage?: number
}
