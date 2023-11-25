import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { CreateNewReferral } from '../models/CreateNewReferral';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReferralService {

  constructor(public http: HttpClient) {
    console.log('Hello ReferralProvider Provider')
  }

  getSearchRefferalApi(data) {
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.getSearchRefferal, data, {observe: 'response'})
      .pipe(map((res: any) => {
        console.log('', res)
        console.log('referral.ts', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('inside catch', error)
        if (error.status === 500) {
          return throwError(new Error(error.status))
        } else if (error.status === 400) {
          return throwError(new Error(error.status))
        } else if (error.status === 404) {
          throw(error.status)
        } else if (error.status === 406) {
          return throwError(new Error(error.status))
        } else if (error.status === 401) {
          return throwError(new Error(error.status))
        }
      }))
  }

  createNewReferralApi(createreferral: CreateNewReferral) {
    return this.http
      .post(
        Urls.baseUrl + Urls.port + Constants.createNewReferral,
        createreferral,
        {observe: 'response'}
      )
      .pipe(map((res: any) => {
        console.log('', res)
        console.log('referral.ts', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('inside catch', error)
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

  getStatuses(currentStatus) {
    return this.http
      .get(
        Urls.baseUrl + Urls.port + Constants.getReferralStatuses + currentStatus, {observe: 'response'}
      )
      .pipe(map((res: any) => {
        console.log('', res)
        console.log('referral.ts', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('inside catch', error)
        return throwError(new Error(error.status))
      }))
  }

  updateDealStatus(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http
      .put(Urls.baseUrl + Urls.port + Constants.updateDealStatus, data, {
        headers,
        observe: 'response'
      })
      .pipe(map((res: any) => {
        console.log('', res)
        console.log('referral.ts', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('inside catch', error)
        return throwError(new Error(error.status))
      }))
  }

  acceptDeal(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http
      .put(Urls.baseUrl + Urls.port + Constants.acceptReferral, data, {
        headers,
        observe: 'response'
      })
      .pipe(map((res: any) => {
        console.log('', res)
        console.log('referral.ts', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('inside catch', error)
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
