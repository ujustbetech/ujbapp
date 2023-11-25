import { KYCDocumentType } from './Enums'

/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:        2019/03/05        Meghana
 */

export class KYCDocs {
  number?: number
  docType?: KYCDocumentType
}

export class ImageData {
  base64?: string
  fileName?: string
  filePath?: string
  fileType?: string
  // imageUrl?: string;
}
export class KYCGst {
  type?: string
  businessId?: string
  value?: string
}
