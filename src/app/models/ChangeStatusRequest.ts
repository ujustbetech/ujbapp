export class ChangeStatusRequest {
  leadId?: string
  statusId?: number
  updatedBy?: string
}

export class AcceptStatusRequest {
  userId?: string
  referralStatus?: number
  dealId?: string
  rejectionReason?: string
}
