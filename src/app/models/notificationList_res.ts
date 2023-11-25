export class notificationListRes {
  constructor() {
    this.notifications = new Array<notifications>()
  }
  notifications: notifications[]
  totalCount?: number
  totalUnreadCount?: number
}
export class notifications {
  id?: string
  message?: string
  date?: string
  type?: string
  isRead?: boolean
  isSystemGenerated?: boolean
  timeToShow?: string
  notificationIcon
  isReferredByMe: boolean
  blueLink
}
