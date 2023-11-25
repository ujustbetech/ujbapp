/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/*
 * Revision History:
 *     Initial:                2019/03/01        Meghana
 *     Added more fields       2019/05/27        Gitesh
 *     Added searchtype        2019/07/10        Gitesh
 *     and sortValue
 *     Added ReferralStatus    2019/07/11        Gitesh
 */

export enum userRoles {
  Guest,
  Partner,
  ClientPartner,
}

export enum maritalStatus {
  Single,
  Married,
  Divorced,
}

export enum gender {
  male,
  female,
}

export enum KYCDocumentType {
  PAN,
  AADHAR,
  BankCheque,
}
export enum ReferralUnit {
  percentage,
  amount,
}

export enum PanType {
  Business,
  Individual,
}

export enum LoginStatus {
  loggedOut,
  loggedIn,
}

export enum SortValue {
  Rating = 0,
  NearToFar = 1,
  Ascending = 2,
  Descending = 3,
  Default = null,
}

export enum SearchType {
  Dashboard = 0,
  Empty = 1,
  Advanced = 'Advanced',
}

export enum ReferralStatus {
  NotConnected = 1,
  CalledButNoResponse = 2,
  DealNotClosed = 3,
  DiscussionInProgress = 4,
  DealClosed = 5,
  ReceivedPartPayment = 6,
  WorkInProgress = 7,
  WorkCompleted = 8,
  ReceivedFullAndFinalPayment = 9,
  AgreedPercentageTransferredToUJB = 10,
  All = 11,
}
export enum UserType {
  Freelancer = 1,
  PartnerShipFirm = 2,
  LLP = 3,
  Company = 4,
}
