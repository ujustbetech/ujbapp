export class Constants {
  static male_img: string = 'assets/icon/male@2x.png'
  static female_img: string = 'assets/icon/female@2x.png'
  static businessLogoConst: string =
    'assets/imgs/content-imgs/businessprofileCopy@2x.png'
  static maleSelected: string = 'assets/imgs/content-imgs/maleSelected@2x.png'
  static femaleSelected: string =
    'assets/imgs/content-imgs/femaleSelected@2x.png'
  static logoImage: string =
    'assets/imgs/content-imgs/businessprofileCopy@2x.png'
  static coverImage: string = 'assets/imgs/content-imgs/banner-cp-default.jpg'
  static weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  static linkedInUrl = 'https://www.linkedin.com/oauth/v2/authorization?'
  static response_type = 'response_type'
  static code = 'code'
  static client_id = 'client_id'
  //static countryCode
  //static mobileNo
  //static userId;
  static toastTimeOut = 3000
  static UjbPartnerMentorCode = 'UJB10122000000001'
  public static UjbVideoUrl = '0lsT-cZXkDY' //"nIFm8RMU-h4"
  public static clientPartner = 'Listed Partner'
  public static connection = 'connection'
  public static connected = 'connected'
  public static disconnected = 'disconnected'

  public static playStoreLink =
    'https://play.google.com/store/apps/details?id=com.app.ujustbe'
  public static appStoreLink =
    'https://apps.apple.com/in/app/ujustbe/id1484101645'
  public static ujbLink = ''
  public static registrationApi = '/register'
  public static checkEmailApi = '/email-check'
  public static checkMobileApi = '/mobile-check'
  public static loginApi = '/login'
  public static logError = '/error-log/insert'
  public static forgotApi = '/forgot-password'
  public static changePasswordApi = '/change-password'
  public static getMentorApi = '/mentor/mentor-list'
  // public static getCategoriesApi="/category/all/5/1?query="
  public static getCategoriesApi = '/category/all?query='
  public static getCategoriesApi2 = '&CurrentPage='
  //public static getcategoriesApi= "/category/all/5/1"
  public static validateOtp = '/validate-otp'
  public static resendOtp = '/resend-otp'
  public static getUjbStats = '/dashboard/ujb-status'
  public static getUserStats = '/dashboard/partner-stats?'
  public static getBusinessAddress = '/update-company-address'
  public static getBusinessDetails = '/update-company'
  public static enrollPartner = '/enroll-partner'
  public static updateBusiness = '/update-business'
  public static kycPAN = '/upload-pan'
  public static kycBank = '/upload-bank-details'

  public static kycAadhar = '/upload-aadhar'
  public static kycGST = '/update-company'
  //public static userProfile ="/Check-partners-KYC?UserId="
  public static getUserInfoApi = '/user-info?'
  public static getConnectors = '/GetConnectors?'
  public static getUserProfile = '/Partner-Profile?UserId='
  public static getPartnerKYC = '/Partner-KYC?UserId='
  public static uploadLogo = '/update-company-logo'
  public static updateBanner = '/update-business-banner'
  public static searchData = '/search-dashboard/suggestion?query='
  public static UserId = '&UserId='
  public static getBusinessList = '/search-dashboard/business'
  public static updateProductOrservices = '/update-product-service'
  public static getProductOrService = '/product-service/all?'
  public static getCpBusinessApi = '/client-partner/details?'
  public static getSearchRefferal = '/referral/lookup'
  public static createNewReferral = '/referral/create'
  public static getCountries = '/Get-countries'
  public static getState = '/search-state/'
  //public static getSearchRefferal = "/referral/lookup"
  // public static createNewReferral = "/referral/create"
  public static updatePartnerProfile = '/UpdateProfile'
  public static updateProfileImage = '/update-profile-image'
  public static getReferralStatuses = '/referral-status/Get-status/'
  public static updateDealStatus = '/referral-status/update'
  public static updateMobileNumberUserId = '/Update-MobileNo?UserId='
  public static updateMobileNumberMobile = '&MobileNo='
  public static updateMobileNumberCountryCode = '&CountryCode='
  public static updateLocation = '/update-partner-address'
  public static uodateLocalities = '/update-partner-locations'

  public static notificationList = '/notification/list'
  public static notificationUpdate = '/notification/update'
  public static fcmTokenUpdate = '/fcmtoken/update'
  public static acceptReferral = '/referral/update'
  public static getPromotionMedia = '/Get-PromotionMedia'
  public static getVersionDetails = '/Get-VerisonDetails?type='
  public static partnerAgreementUpdate = '/Partner-agreement-update'
  public static listedPartnerAgreementUpdate = '/ListedPartner-agreement-update'
  public static updateBirthDate = '/Update-BirthDate'
  public static removeProdService = '/ProductService?ProdServiceId='
  public static removeImage = '/Delete-product/Image'
  public static removeReferrence = '/ProductServiceDetails?ProdServicedetailId='
  public static sendVersionCode = '/Update/CurrentAppVersion'

  /******User Massages */
  public static changedPassword = 'Your password has been changed successfully.'
  public static businessCategoriesUpdated =
    'Business categories updated successfully.'
  public static someErrorOccurred =
    'Some error occured. Please try again after some time.'
  public static panUpload = 'PAN details updated successfully.'
  public static aadharUpload = 'Aadhar details updated successfully.'
  public static bankUpload = 'Bank details updated successfully.'
  public static gstUpload = 'GST details updated successfully.'

  public static logoUpload = 'Logo Uploaded successfully.'
  public static internalServerError =
    'Internal server error. Please try again after some time.'
  public static invalidUsernamePassword = 'Invalid credentials.'
  public static inActiveUser =
    'Your account is deactivated. Please contact administrator.'
  public static userNotFound = 'Email id / mobile number not found'
  public static serverIssue = 'Server issue. Please try again after some time.'
  public static timeoutIssue =
    'Timeout issue. Please try again after some time.'
  public static cantChangeRefData =
    'You can only change referral Percentage / Amount every 3 months.'
  public static uploadFromPhone = 'Upload from Phone'
  public static areYouSureToRemovePhoto =
    'Are you sure, you want to remove this photo?'
  public static photoRemovedSuccessfully =
    'Selected photo removed successfully.'
  public static photoRemovelFailed = 'Failed to remove selected photo.'
  public static yourDataWillBeLost = 'Your data will be lost.'
  public static yourProdDataWillBeLost = 'Your product data will be lost.'
  public static yourSlabDataWillBeLost = 'Your slab data will be lost.'
  public static continueAnyway = 'Continue Anyway'
  public static alreadyRegister = 'Email already exist.'
  public static checkEmail = 'Please check your mail for new password'
  public static refPercentDataRemovedSuccessfully =
    'Referral percentage / Amount data removed successfully.'
  public static refPercentDataRemovelFailed =
    'Failed to remove Referral percentage / Amount data.'
  public static areYouSureToLogout = 'Are you sure, you want to logout?'
  //public static areYouSureToRemovePhoto = "Are you sure, you want to logout?"
  public static sorryCantAccessTheFile =
    'Sorry, We are not able to access the selected file.'
  public static areYouSureToChangeStatus =
    'Are you sure, you want to change deal status?'
  public static dealUpdatedSuccessfully = 'Deal status updated successfully.'
  public static dealacceptedSuccessfully = 'You have accepted the deal.'
  public static dealrejectedSuccessfully = 'You have rejected the deal.'
  public static yourDataUpdatedSuccessfully = 'Your data updated successfully.'
  public static doYouWantToMakeThisDefault =
    'Do you want to make this photo as default?'
  public static areYouSureToAcceptDeal =
    'Are you sure, you want to accept the deal?'
  public static areYouSureToRejectDeal =
    'Are you sure, you want to reject the deal?'
  public static update = 'Update'
  public static updateAvailable =
    'New update is available. Would you like to update now?'
  public static invitePeopleMessage =
    'Invite more people to the platform and grow your network.'
  public static atleastOneReferralPercAmt =
    'There should be atleast one Referral Percentage / Amount.'
  public static bannerUpdatedSuccessfully = 'Banner updated successfully.'
  public static bannerRemoveSuccessfully = 'Banner removed successfully.'
  public static agreementAccepted = 'Thank you for accepting the agreement.'
  public static pleaseAcceptPartnerAgreement = 'Please accept Partner Agreement'
  public static guestSearchText = 'Location/ Category'
  public static partnerSearchText = 'Name/ Location/ Category/ Keyword'
  public static online = 'Online'
  public static offline = 'Offline'
  //public static someErrorOccurred = 'Some error occured. Please try again after some time.'
  /****************** */

  public static dealStatuses = [
    {
      id: 1,
      src: 'assets/imgs/icons/no@2x.png',
      text: 'Not connected',
      selected: false,
    },
    {
      id: 3,
      src: 'assets/imgs/icons/no@2x.png',
      text: 'Deal not closed',
      selected: false,
    },
    {
      id: 2,
      src: 'assets/imgs/icons/no@2x.png',
      text: 'Called but no response',
      selected: false,
    },
    {
      id: 6,
      src: 'assets/imgs/icons/inprogress@2x.png',
      text: 'Received part payment',
      selected: false,
    },
    {
      id: 4,
      src: 'assets/imgs/icons/inprogress@2x.png',
      text: 'Discussion in progress',
      selected: false,
    },
    {
      id: 5,
      src: 'assets/imgs/icons/inprogress@2x.png',
      text: 'Deal closed',
      selected: false,
    },
    {
      id: 7,
      src: 'assets/imgs/icons/inprogress@2x.png',
      text: 'Work in progress',
      selected: false,
    },
    {
      id: 8,
      src: 'assets/imgs/icons/done@2x.png',
      text: 'Work completed',
      selected: false,
    },
    {
      id: 9,
      src: 'assets/imgs/icons/done@2x.png',
      text: 'Received full and final payment',
      selected: false,
    },
    {
      id: 10,
      src: 'assets/imgs/icons/done@2x.png',
      text: 'Agreed percentage transferred to UJustBe',
      selected: false,
    },
    { id: 11, src: 'assets/imgs/icons/done@2x.png', text: 'All' },
  ]
}
