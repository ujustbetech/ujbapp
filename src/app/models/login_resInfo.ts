export class LoginResponseInfo {
  constructor() {
    this.data = new Data()
    this.message = new Array<Message>()
  }
  data: Data
  message: Message[]
}
export class Data {
  _id: string
  role: string
  is_Otp_Verified: boolean
  language: string
  businessId?: string
  mobile_number?: string
  country_code?: string
}
export class Message {
  message: string
  type: string
}
