import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';

@Injectable({
  providedIn: 'root'
})
export class KycService {

  constructor(public http: HttpClient) {}

  submitPan(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.kycPAN, data, { headers, observe: 'response' })
      .pipe(map((res: any) => {
        return { status: res.status, json: res.body }
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
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  submitAadhar(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.kycAadhar, data, { headers, observe: 'response' })
      .pipe(map((res: any) => {
        return { status: res.status, json: res.body }
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
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  submitChecque(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.kycBank, data, { headers, observe: 'response' })
      .pipe(map((res: any) => {
        return { status: res.status, json: res.body }
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
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  submitGst(data) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.kycGST, data, { headers, observe: 'response' })
      .pipe(map((res: any) => {
        return { status: res.status, json: res.body }
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
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  getPartnerKYC(id) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    return this.http
      .get(Urls.baseUrl + Urls.port + Constants.getPartnerKYC + id, { headers, observe: 'response' })
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
  }}
