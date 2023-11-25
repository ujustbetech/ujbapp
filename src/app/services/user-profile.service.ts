import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { catchError, map, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(public http: HttpClient) {
    console.log('Hello UserProfileProvider Provider')
  }

  getProfile(id) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http
      .get(Urls.baseUrl + Urls.port + Constants.getUserProfile + id, {
        headers,
        observe: 'response'
      })
      .pipe(timeout(15000))
      .pipe(map((res: any) => {
        return {
          status: res.status,
          json: res.body,
        }
      }))
      .pipe(catchError((error) => {
        console.log('getProfile', error)
        if (error.status === 500) {
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          return throwError(new Error(error.status))
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  getconnectors(userId: any) {
    return this.http
      .get(
        Urls.baseUrl + Urls.port + Constants.getConnectors + 'UserId=' + userId, {observe: 'response'}
      )
      .pipe(timeout(15000))
      .pipe(map((res: any) => {
        console.log('userinfoone', res)
        console.log('in_provider_login.ts', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('inside catch', error)
        if (error.status === 500) {
          //
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          //
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          //
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          //
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          //
          return throwError(new Error(error.status))
        }
      }))
  }

  updatePartnerProfile(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    console.log('updatePartnerProfile', JSON.stringify(data))
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.updatePartnerProfile, data, {
        headers,
        observe: 'response'
      })
      .pipe(map((res: any) => {
        return {
          status: res.status,
          json: res.body,
        }
      }))
      .pipe(catchError((error) => {
        if (error.status === 500) {
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          return throwError(new Error(error.status))
        }
      }))
  }

  updateProfileImage(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.updateProfileImage, data, {
        headers,
        observe: 'response'
      })
      .pipe(map((res: any) => {
        return {
          status: res.status,
          json: res.body,
        }
      }))
      .pipe(catchError((error) => {
        if (error.status === 500) {
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          return throwError(new Error(error.status))
        }
      }))
  }

  updateMobileNumber(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    let Str =
      Constants.updateMobileNumberUserId +
      data.userId +
      Constants.updateMobileNumberMobile +
      data.MobileNumber +
      Constants.updateMobileNumberCountryCode +
      data.CountryCode
    console.log('req for mobile', JSON.stringify(Str))
    return this.http
      .get(Urls.baseUrl + Urls.port + Str, { headers, observe: 'response' })
      .pipe(map((res: any) => {
        return {
          status: res.status,
          json: res.body,
        }
      }))
      .pipe(catchError((error) => {
        if (error.status === 500) {
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          return throwError(new Error(error.status))
        }
      }))
  }

  updateLocation(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.updateLocation, data, {
        headers,
        observe: 'response'
      })
      .pipe(map((res: any) => {
        return {
          status: res.status,
          json: res.body,
        }
      }))
      .pipe(catchError((error) => {
        if (error.status === 500) {
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          return throwError(new Error(error.status))
        }
      }))
  }

  updateLocalities(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.uodateLocalities, data, {
        headers,
        observe: 'response'
      })
      .pipe(map((res: any) => {
        return {
          status: res.status,
          json: res.body,
        }
      }))
      .pipe(catchError((error) => {
        if (error.status === 500) {
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          return throwError(new Error(error.status))
        } else if (error.status === 406) {
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          return throwError(new Error(error.status))
        }
      }))
  }}
