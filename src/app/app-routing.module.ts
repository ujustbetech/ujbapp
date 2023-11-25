import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroScreenComponent } from './pages/intro-screen/intro-screen.component';
import { LanguageSelectionPage } from './pages/language-selection/language-selection'
import { RegistrationOptionPage } from './pages/registration-option/registration-option'
import { RegistrationPage } from './pages/registration/registration/registration';
import { LoginPage } from './pages/onboarding/login/login';
import { ForgotPasswordPage } from './pages/onboarding/forgot-password/forgot-password';
import { ChangePasswordPage } from './pages/onboarding/change-password/change-password';
import { YoutubePage } from './pages/youtube/youtube';
import { OtpPage } from './pages/onboarding/otp/otp';
import { OtpSuccessPage } from './pages/onboarding/otp-success/otp-success';
import { DashboardPage } from './pages/dashboard/dashboard';
import { ClientPartnerViewPage } from './pages/profile/client-partner-view/client-partner-view';
import { ClientPartnerPage } from './pages/profile/client-partner/client-partner';
import { GuestPage } from './pages/profile/guest/guest';
import { PartnerPage } from './pages/profile/partner/partner';
import { BusinessListPage } from './pages/search/business-list/business-list';
import { CategoryListPage } from './pages/search/category-list/category-list';
import { SearchResultsPage } from './pages/search/search-results/search-results';
import { ThemeModalPage } from './components/demo_modals/theme-modal/theme-modal';
import { ThemePopupPage } from './components/demo_modals/theme-popup/theme-popup';
import { HeaderComponent } from './components/header/header';
import { CompanyAggreementPage } from './pages/agreement/company-aggreement/company-aggreement';
import { FreelencerPage } from './pages/agreement/freelencer/freelencer';
import { LlpAggreementPage } from './pages/agreement/llp-aggreement/llp-aggreement';
import { PartnerAggreementPage } from './pages/agreement/partner-aggreement/partner-aggreement';
import { PartnershipFirmAggreementPage } from './pages/agreement/partnership-firm-aggreement/partnership-firm-aggreement';
import { BusinessKycGstPage } from './pages/business-kyc/business-kyc-gst/business-kyc-gst';
import { BusinessKycPanPage } from './pages/business-kyc/business-kyc-pan/business-kyc-pan';
import { BusinessListing1Page } from './pages/business-listing/business-listing1/business-listing1';
import { BusinessListing10Page } from './pages/business-listing/business-listing10/business-listing10';
import { BusinessListing11Page } from './pages/business-listing/business-listing11/business-listing11';
import { BusinessListing12Page } from './pages/business-listing/business-listing12/business-listing12';
import { BusinessListing2Page } from './pages/business-listing/business-listing2/business-listing2';
import { BusinessListing3Page } from './pages/business-listing/business-listing3/business-listing3';
import { BusinessListing4Page } from './pages/business-listing/business-listing4/business-listing4';
import { BusinessListing5Page } from './pages/business-listing/business-listing5/business-listing5';
import { BusinessListing6Page } from './pages/business-listing/business-listing6/business-listing6';
import { BusinessListing7Page } from './pages/business-listing/business-listing7/business-listing7';
import { BusinessListing8Page } from './pages/business-listing/business-listing8/business-listing8';
import { BusinessListing9Page } from './pages/business-listing/business-listing9/business-listing9';
import { AboutPage } from './pages/common/about/about';
import { ComingSoonPage } from './pages/common/coming-soon/coming-soon';
import { ContactUsPage } from './pages/common/contact-us/contact-us';
import { DisclaimerPage } from './pages/common/disclaimer/disclaimer';
import { ErrorInternetPage } from './pages/common/error-internet/error-internet';
import { ErrorPage } from './pages/common/error/error';
import { NotificationPage } from './pages/common/notification/notification';
import { PartneragreementPage } from './pages/common/partneragreement/partneragreement';
import { PrivacypolicyPage } from './pages/common/privacypolicy/privacypolicy';
import { TermsPage } from './pages/common/terms/terms';
import { CommunityPage } from './pages/community/community';
import { KycAdharCardPage } from './pages/kyc/kyc-adhar-card/kyc-adhar-card';
import { KycCancledChecquePage } from './pages/kyc/kyc-cancled-checque/kyc-cancled-checque';
import { KycPanCardPage } from './pages/kyc/kyc-pan-card/kyc-pan-card';
import { SplashPage } from './pages/onboarding/splash/splash';
import { ProductServiceAddEditPage } from './pages/product-service/product-service-add-edit/product-service-add-edit';
import { ProductServiceViewPage } from './pages/product-service/product-service-view/product-service-view';
import { QuestionnaireNewUiQuestionnairePage } from './pages/questionnaire-new-ui-questionnaire/questionnaire-new-ui-questionnaire';
import { Questionnaire1Page } from './pages/questionnaire/questionnaire1/questionnaire1';
import { Questionnaire2Page } from './pages/questionnaire/questionnaire2/questionnaire2';
import { Questionnaire3Page } from './pages/questionnaire/questionnaire3/questionnaire3';
import { Questionnaire4Page } from './pages/questionnaire/questionnaire4/questionnaire4';
import { Questionnaire5Page } from './pages/questionnaire/questionnaire5/questionnaire5';
import { Questionnaire6Page } from './pages/questionnaire/questionnaire6/questionnaire6';
import { Questionnaire7Page } from './pages/questionnaire/questionnaire7/questionnaire7';
import { Questionnaire8Page } from './pages/questionnaire/questionnaire8/questionnaire8';
import { Questionnaire9Page } from './pages/questionnaire/questionnaire9/questionnaire9';
import { ReferNowPage } from './pages/referrals/refer-now/refer-now';
import { ReferralSuccessPage } from './pages/referrals/referral-success/referral-success';
import { ReferralsGivenPage } from './pages/referrals/referrals-given/referrals-given';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'IntroScreenComponent',
    pathMatch: 'full'
  },
  { path: 'IntroScreenComponent', component: IntroScreenComponent },
  { path: 'LanguageSelectionPage', component: LanguageSelectionPage },
  { path: 'RegistrationOptionPage', component: RegistrationOptionPage },
  { path: 'RegistrationPage', component: RegistrationPage },
  { path: 'LoginPage', component: LoginPage },
  { path: 'ForgotPasswordPage', component: ForgotPasswordPage },
  { path: 'ChangePasswordPage', component: ChangePasswordPage },
  { path: 'YoutubePage', component: YoutubePage },
  { path: 'OtpPage', component: OtpPage },
  { path: 'OtpSuccessPage', component: OtpSuccessPage },
  { path: 'DashboardPage', component: DashboardPage },
  { path: 'ClientPartnerPage', component: ClientPartnerPage },
  { path: 'ClientPartnerViewPage', component: ClientPartnerViewPage },
  { path: 'GuestPage', component: GuestPage },
  { path: 'PartnerPage', component: PartnerPage },
  { path: 'BusinessListPage', component: BusinessListPage },
  { path: 'CategoryListPage', component: CategoryListPage },
  { path: 'SearchResultsPage', component: SearchResultsPage },
  { path: 'ThemePopupPage', component: ThemePopupPage },
  { path: 'ThemeModalPage', component: ThemeModalPage },
  { path: 'HeaderComponent', component: HeaderComponent },
  { path: 'CompanyAggreementPage', component: CompanyAggreementPage },
  { path: 'FreelencerPage', component: FreelencerPage },
  { path: 'LlpAggreementPage', component: LlpAggreementPage },
  { path: 'PartnerAggreementPage', component: PartnerAggreementPage },
  { path: 'PartnershipFirmAggreementPage', component: PartnershipFirmAggreementPage },
  { path: 'BusinessKycGstPage', component: BusinessKycGstPage },
  { path: 'BusinessKycPanPage', component: BusinessKycPanPage },
  { path: 'BusinessListing1Page', component: BusinessListing1Page },
  { path: 'BusinessListing2Page', component: BusinessListing2Page },
  { path: 'BusinessListing3Page', component: BusinessListing3Page },
  { path: 'BusinessListing4Page', component: BusinessListing4Page },
  { path: 'BusinessListing5Page', component: BusinessListing5Page },
  { path: 'BusinessListing6Page', component: BusinessListing6Page },
  { path: 'BusinessListing7Page', component: BusinessListing7Page },
  { path: 'BusinessListing8Page', component: BusinessListing8Page },
  { path: 'BusinessListing9Page', component: BusinessListing9Page },
  { path: 'BusinessListing10Page', component: BusinessListing10Page },
  { path: 'BusinessListing11Page', component: BusinessListing11Page },
  { path: 'BusinessListing12Page', component: BusinessListing12Page },
  { path: 'AboutPage', component: AboutPage },
  { path: 'ComingSoonPage', component: ComingSoonPage },
  { path: 'ContactUsPage', component: ContactUsPage },
  { path: 'DisclaimerPage', component: DisclaimerPage },
  { path: 'ErrorPage', component: ErrorPage },
  { path: 'ErrorInternetPage', component: ErrorInternetPage },
  { path: 'NotificationPage', component: NotificationPage },
  { path: 'PartneragreementPage', component: PartneragreementPage },
  { path: 'PrivacypolicyPage', component: PrivacypolicyPage },
  { path: 'TermsPage', component: TermsPage },
  { path: 'CommunityPage', component: CommunityPage },
  { path: 'SplashPage', component: SplashPage },
  { path: 'KycAdharCardPage', component: KycAdharCardPage },
  { path: 'KycCancledChecquePage', component: KycCancledChecquePage },
  { path: 'KycPanCardPage', component: KycPanCardPage },
  { path: 'ProductServiceAddEditPage', component: ProductServiceAddEditPage },
  { path: 'ProductServiceViewPage', component: ProductServiceViewPage },
  { path: 'QuestionnaireNewUiQuestionnairePage', component: QuestionnaireNewUiQuestionnairePage },
  { path: 'Questionnaire1Page', component: Questionnaire1Page },
  { path: 'Questionnaire2Page', component: Questionnaire2Page },
  { path: 'Questionnaire3Page', component: Questionnaire3Page },
  { path: 'Questionnaire4Page', component: Questionnaire4Page },
  { path: 'Questionnaire5Page', component: Questionnaire5Page },
  { path: 'Questionnaire6Page', component: Questionnaire6Page },
  { path: 'Questionnaire7Page', component: Questionnaire7Page },
  { path: 'Questionnaire8Page', component: Questionnaire8Page },
  { path: 'Questionnaire9Page', component: Questionnaire9Page },
  { path: 'ReferNowPage', component: ReferNowPage },
  { path: 'ReferralSuccessPage', component: ReferralSuccessPage },
  { path: 'ReferralsGivenPage', component: ReferralsGivenPage },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
