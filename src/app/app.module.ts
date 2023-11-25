import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IntroScreenComponent } from './pages/intro-screen/intro-screen.component';
import { LanguageSelectionPage } from './pages/language-selection/language-selection'
import { RegistrationOptionPage } from './pages/registration-option/registration-option'
import { RegistrationPage } from './pages/registration/registration/registration'
import { LoginPage } from './pages/onboarding/login/login'
import { SplashPage } from './pages/onboarding/splash/splash'
import { OtpPage } from './pages/onboarding/otp/otp'
import { OtpSuccessPage } from './pages/onboarding/otp-success/otp-success'
import { YoutubePage } from './pages/youtube/youtube'
import { DashboardPage } from './pages/dashboard/dashboard'
import { ForgotPasswordPage } from './pages/onboarding/forgot-password/forgot-password'
import { ChangePasswordPage } from './pages/onboarding/change-password/change-password'
import { ClientPartnerPage } from './pages/profile/client-partner/client-partner'
import { ClientPartnerViewPage } from './pages/profile/client-partner-view/client-partner-view'
import { GuestPage } from './pages/profile/guest/guest'
import { PartnerPage } from './pages/profile/partner/partner'
import { BusinessListPage } from './pages/search/business-list/business-list'
import { CategoryListPage } from './pages/search/category-list/category-list'
import { SearchResultsPage } from './pages/search/search-results/search-results'
import { CompanyAggreementPage } from './pages/agreement/company-aggreement/company-aggreement'
import { QuestionnaireNewUiQuestionnairePage } from './pages/questionnaire-new-ui-questionnaire/questionnaire-new-ui-questionnaire'
import { ReferNowPage } from './pages/referrals/refer-now/refer-now'
import { ReferralSuccessPage } from './pages/referrals/referral-success/referral-success'
import { ReferralsGivenPage } from './pages/referrals/referrals-given/referrals-given'
import { Questionnaire1Page } from './pages/questionnaire/questionnaire1/questionnaire1'
import { Questionnaire2Page } from './pages/questionnaire/questionnaire2/questionnaire2'
import { Questionnaire3Page } from './pages/questionnaire/questionnaire3/questionnaire3'
import { Questionnaire5Page } from './pages/questionnaire/questionnaire5/questionnaire5'
import { Questionnaire6Page } from './pages/questionnaire/questionnaire6/questionnaire6'
import { Questionnaire7Page } from './pages/questionnaire/questionnaire7/questionnaire7'
import { Questionnaire8Page } from './pages/questionnaire/questionnaire8/questionnaire8'
import { Questionnaire9Page } from './pages/questionnaire/questionnaire9/questionnaire9'
import { FreelencerPage } from './pages/agreement/freelencer/freelencer'
import { LlpAggreementPage } from './pages/agreement/llp-aggreement/llp-aggreement'
import { PartnerAggreementPage } from './pages/agreement/partner-aggreement/partner-aggreement'
import { PartnershipFirmAggreementPage } from './pages/agreement/partnership-firm-aggreement/partnership-firm-aggreement'
import { BusinessKycGstPage } from './pages/business-kyc/business-kyc-gst/business-kyc-gst'
import { BusinessKycPanPage } from './pages/business-kyc/business-kyc-pan/business-kyc-pan'
import { BusinessListing1Page } from './pages/business-listing/business-listing1/business-listing1'
import { BusinessListing2Page } from './pages/business-listing/business-listing2/business-listing2'
import { BusinessListing3Page } from './pages/business-listing/business-listing3/business-listing3'
import { BusinessListing4Page } from './pages/business-listing/business-listing4/business-listing4'
import { BusinessListing5Page } from './pages/business-listing/business-listing5/business-listing5'
import { BusinessListing6Page } from './pages/business-listing/business-listing6/business-listing6'
import { BusinessListing7Page } from './pages/business-listing/business-listing7/business-listing7'
import { BusinessListing8Page } from './pages/business-listing/business-listing8/business-listing8'
import { BusinessListing9Page } from './pages/business-listing/business-listing9/business-listing9'
import { BusinessListing10Page } from './pages/business-listing/business-listing10/business-listing10'
import { BusinessListing11Page } from './pages/business-listing/business-listing11/business-listing11'
import { BusinessListing12Page } from './pages/business-listing/business-listing12/business-listing12'
import { AboutPage } from './pages/common/about/about'
import { ComingSoonPage } from './pages/common/coming-soon/coming-soon'
import { ContactUsPage } from './pages/common/contact-us/contact-us'
import { DisclaimerPage } from './pages/common/disclaimer/disclaimer'
import { ErrorPage } from './pages/common/error/error'
import { ErrorInternetPage } from './pages/common/error-internet/error-internet'
import { NotificationPage } from './pages/common/notification/notification'
import { PartneragreementPage } from './pages/common/partneragreement/partneragreement'
import { PrivacypolicyPage } from './pages/common/privacypolicy/privacypolicy'
import { TermsPage } from './pages/common/terms/terms'
import { ProductServiceAddEditPage } from './pages/product-service/product-service-add-edit/product-service-add-edit'
import { ProductServiceViewPage } from './pages/product-service/product-service-view/product-service-view'
import { KycAdharCardPage } from './pages/kyc/kyc-adhar-card/kyc-adhar-card'
import { KycCancledChecquePage } from './pages/kyc/kyc-cancled-checque/kyc-cancled-checque'
import { KycPanCardPage } from './pages/kyc/kyc-pan-card/kyc-pan-card'
import { CommunityPage } from './pages/community/community'
import {LinkedInAuthService} from './services/linked-in-auth.service'
import {InserErrorLogService} from './services/inser-error-log.service'
import {RegistrationService} from './services/registration.service'
import {LoginService} from './services/login.service'
import {UserProfileService} from './services/user-profile.service'
import {QuestionnaireService} from './services/questionnaire.service'
import {CategoriesService} from './services/categories.service'
import {CommonUtilsService} from './services/common-utils.service'
import {DashboardService} from './services/dashboard.service'
import {DemoService} from './services/demo.service'
import {NetworkService} from './services/network.service'
import {NotificationService} from './services/notification.service'
import {KycService} from './services/kyc.service'
import {MentorService} from './services/mentor.service'
import {SearchService} from './services/search.service'
import {BusinessListingService} from './services/business-listing.service'
import {ReferralService} from './services/referral.service'
import {BottombarComponent} from './components/bottombar/bottombar'
// import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
import { EditEmailComponent } from './components/popups/edit-email/edit-email'
import { EditGuestNameComponent } from './components/popups/edit-guest-name/edit-guest-name'
import { EditMobileNumberComponent } from './components/popups/edit-mobile-number/edit-mobile-number'
import { PopupBooleanYesNoComponent } from './components/popups/popup-boolean-yes-no/popup-boolean-yes-no'
import { PopupConfirmationAlertComponent } from './components/popups/popup-confirmation-alert/popup-confirmation-alert'
import { ProductServiceAddEditFormComponent } from './components/product-service-add-edit-form/product-service-add-edit-form'
import { ProductServiceTipComponent } from './components/popups/product-service-tip/product-service-tip'
import { ReferralPanelComponent } from './components/referral-panel/referral-panel'
import { SingleInputPopupComponent } from './components/popups/single-input-popup/single-input-popup'
import { ThemeMainModalComponent } from './components/theme-main-modal/theme-main-modal'
import { ModalSortFilterComponent } from './components/modals/modal-sort-filter/modal-sort-filter'
import { AppUpdateComponent } from './components/popups/app-update/app-update'
import { PartnerPopupComponent } from './components/popups/partner-popup/partner-popup'
import { ThemeModalPage } from './components/demo_modals/theme-modal/theme-modal'
import { ThemePopupPage } from './components/demo_modals/theme-popup/theme-popup'
import { HeaderComponent } from './components/header/header'
import { PopupBecomePartnerComponent } from './components/popup-become-partner/popup-become-partner'
import { ModalRefSortFilterComponent } from './components/modal-ref-sort-filter/modal-ref-sort-filter'
import { ProfileCpPersonalTabComponent } from './components/profile-cp-personal-tab/profile-cp-personal-tab'
import { CommonModule } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { File } from '@ionic-native/file/ngx'
import { Camera } from '@ionic-native/camera/ngx'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
import { HTTP } from '@ionic-native/http/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { Network } from '@ionic-native/network/ngx';
import { Device } from '@ionic-native/device/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Questionnaire4Page } from './pages/questionnaire/questionnaire4/questionnaire4';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Badge } from '@ionic-native/badge/ngx'
import { Market } from '@ionic-native/market/ngx'
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx'
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { ClientPartnerGuard } from './guards/client-partner-guards'
import { ClientPartnerViewGuard } from './guards/client-partner-view-guard'
import { GuestGuard } from './guards/guest-guard'
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { RouteReuseStrategy } from '@angular/router';
// import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, 
    CommonModule,
    // IonicImageViewerModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot()
    // ServiceWorkerModule.register('ngsw-worker.js', {
      // enabled: environment.production
    // })
  ],
  declarations: [
    AppComponent,
    IntroScreenComponent,
    LanguageSelectionPage,
    RegistrationPage,
    RegistrationOptionPage,
    PartnerPopupComponent,
    LoginPage,
    ForgotPasswordPage,
    ChangePasswordPage,
    YoutubePage,
    OtpPage,
    OtpSuccessPage,
    DashboardPage,
    PopupBecomePartnerComponent,
    ClientPartnerPage,
    ClientPartnerViewPage,
    GuestPage,
    PartnerPage,
    AppUpdateComponent,
    EditEmailComponent,
    EditGuestNameComponent,
    EditMobileNumberComponent,
    PopupBooleanYesNoComponent,
    PopupConfirmationAlertComponent,
    ProductServiceAddEditFormComponent,
    ProductServiceTipComponent,
    ReferralPanelComponent,
    SingleInputPopupComponent,
    ThemeMainModalComponent,
    ModalSortFilterComponent,
    ModalRefSortFilterComponent,
    ProfileCpPersonalTabComponent,
    BottombarComponent,
    BusinessListPage,
    CategoryListPage,
    SearchResultsPage,
    ThemeModalPage,
    ThemePopupPage,
    HeaderComponent,
    CompanyAggreementPage,
    FreelencerPage,
    LlpAggreementPage,
    PartnerAggreementPage,
    PartnershipFirmAggreementPage,
    BusinessKycGstPage,
    BusinessKycPanPage,
    BusinessListing1Page,
    BusinessListing2Page,
    BusinessListing3Page,
    BusinessListing4Page,
    BusinessListing5Page,
    BusinessListing6Page,
    BusinessListing7Page,
    BusinessListing8Page,
    BusinessListing9Page,
    BusinessListing10Page,
    BusinessListing11Page,
    BusinessListing12Page,
    AboutPage,
    ComingSoonPage,
    ContactUsPage,
    DisclaimerPage,
    ErrorPage,
    ErrorInternetPage,
    NotificationPage,
    PartneragreementPage,
    PrivacypolicyPage,
    TermsPage,
    CommunityPage,
    SplashPage,
    KycAdharCardPage,
    KycCancledChecquePage,
    KycPanCardPage,
    ProductServiceAddEditPage,
    ProductServiceViewPage,
    QuestionnaireNewUiQuestionnairePage,
    Questionnaire1Page,
    Questionnaire2Page,
    Questionnaire3Page,
    Questionnaire4Page,
    Questionnaire5Page,
    Questionnaire6Page,
    Questionnaire7Page,
    Questionnaire8Page,
    Questionnaire9Page,
    ReferNowPage,
    ReferralSuccessPage,
    ReferralsGivenPage
  ],
  providers: [
    // InAppBrowser,
    Facebook, 
    GooglePlus,
    StatusBar,
    SplashScreen,
    Keyboard,
    File,
    Camera,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    NativeGeocoder,
    FilePath,
    HTTP,
    Network,
    Device,
    AppVersion,
    Badge,
    Market,
    MobileAccessibility,
    SocialSharing,
    LocalNotifications,
    FCM,
    CallNumber,
    EmailComposer,
    // Storage,
    StreamingMedia,
    LocationAccuracy,
    LinkedInAuthService,
    InserErrorLogService,
    RegistrationService,
    QuestionnaireService,
    LoginService,
    UserProfileService,
    CategoriesService,
    CommonUtilsService,
    DashboardService,
    DemoService,
    NetworkService,
    NotificationService,
    SearchService,
    BusinessListingService,
    ReferralService,
    KycService,
    MentorService,
    ClientPartnerGuard,
    ClientPartnerViewGuard,
    GuestGuard,
    YoutubeVideoPlayer,
    InAppBrowser,
    
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    PartnerPopupComponent,
    PopupBecomePartnerComponent,
    AppUpdateComponent,
    EditEmailComponent,
    EditGuestNameComponent,
    EditMobileNumberComponent,
    PopupBooleanYesNoComponent,
    PopupConfirmationAlertComponent,
    ProductServiceAddEditFormComponent,
    ReferralPanelComponent,
    SingleInputPopupComponent,
    ThemeMainModalComponent,
    ModalSortFilterComponent,
    ModalRefSortFilterComponent,
    ProductServiceTipComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
