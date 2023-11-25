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

export class ProductImageInfo {
  constructor() {
    this.isDefaultImg = false
    this.ImageURL = ''
    this.prodImgBase64 = ''
    this.prodImgName = ''
  }
  prodImgId?: String
  ImageURL?: String
  prodImgBase64?: String
  prodImgType?: String
  prodImgName?: String
  isDefaultImg?: boolean
  myClass?: any
  uniqueName?: string
  selectedImage: string
}
