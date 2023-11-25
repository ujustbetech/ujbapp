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

export class CategoryInfo {
  constructor() {
    this.selected = false
    this.disabled = false
    this.pager = new pager()
    this.selectedCategory = ''
  }
  userId?: string
  businessId?: string
  catId?: string
  categoryName?: string
  categoryImgBase64?: string
  categoryImgUrl?: string
  submitCatId?: string[]
  categories?: string[]
  tagline?: string
  selected: boolean
  disabled: boolean
  CompanyName
  UserType
  nameOfPartner
  totalCount: any
  pager: pager
  selectedCategory: any
  disableCategory: any
}

export class pager {
  constructor() {
    this.totalPages = 0
  }
  pageSize: any
  currentPage: any
  totalPages: any
  totalRecords: any
  isPagingRequired: boolean
}
