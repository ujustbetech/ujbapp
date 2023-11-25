import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { RegistrationInfo } from '../models/registration_info';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(public http: HttpClient) {
    console.log('Hello RegistrationProvider Provider')
  }

  registrationApi(RegisterUser: RegistrationInfo) {
    ////
    console.log('RegisterUser', RegisterUser)
    console.log('RegisterUser json', JSON.stringify(RegisterUser))
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.registrationApi, RegisterUser, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('res', res)
        console.log('in_provider_login.ts', res)

        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        ////
        console.log('inside catch', error)
        if (error.status === 500) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          ////
          return throwError(new Error(error.status))
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  checkEmailApi(emailId: string) {
    ////
    console.log('loginUser', emailId)
    let request = { EmailId: emailId }
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.checkEmailApi, request, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('res', res)
        console.log('in_provider_login.ts', res)

        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        ////
        console.log('inside catch', error)
        if (error.status === 500) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          ////
          return throwError(new Error(error.status))
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  checkMobileApi(mobileNo: string) {
    //
    console.log('loginUser', mobileNo)
    let request = { MobileNo: mobileNo }
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.checkMobileApi, request, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('res', res)
        console.log('in_provider_login.ts', res)

        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        ////
        console.log('inside catch', error)
        if (error.status === 500) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          ////
          return throwError(new Error(error.status))
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  validateOtp(
    userId: string,
    otpValidationFlag: boolean,
    countryCode: string,
    mobileNumber: string,
    type: string
  ) {
    ////

    console.log('otp Validation', userId)
    let request = {
      userId: userId,
      otpValidationFlag: otpValidationFlag,
      countryCode: countryCode,
      MobileNumber: mobileNumber,
      type: type,
    }
    console.log('jsonreq otp,', JSON.stringify(request))
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.validateOtp, request, {observe: 'response'})
      .pipe(map((res: any) => {
        ////

        console.log('res', res)
        console.log('in_provider_login.ts', res)

        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        ////

        console.log('inside catch', error)
        if (error.status === 500) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          ////
          return throwError(new Error(error.status))
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  resendOtp(userId: string, countryCode: string, mobileNo: string) {
    ////
    console.log('otp Validation', userId, mobileNo)
    let request = {
      userId: userId,
      MobileNumber: mobileNo,
      countryCode: countryCode,
    }
    return this.http
      .put(Urls.baseUrl + Urls.port + Constants.resendOtp, request, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('res', res)
        console.log('in_provider_login.ts', res)

        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        ////
        console.log('inside catch', error)
        if (error.status === 500) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          ////
          return throwError(new Error(error.status))
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  acceptAgreement(request: any, type: string) {
    console.log('acceptAgreement request', request)
    let url = Urls.baseUrl + Urls.port + Constants.partnerAgreementUpdate
    if (type == 'Partner') {
      url = Urls.baseUrl + Urls.port + Constants.partnerAgreementUpdate
    } else {
      url = Urls.baseUrl + Urls.port + Constants.listedPartnerAgreementUpdate
    }
    return this.http
      .put(url, request, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('acceptAgreement res', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        ////
        console.log('acceptAgreement inside catch', error)
        if (error.status === 500) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          ////
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          ////
          return throwError(new Error(error.status))
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }}
