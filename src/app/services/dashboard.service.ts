import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { catchError, map } from "rxjs/operators"; 

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(public http: HttpClient) {}
  getUjbStatsApi() {
    ////
    return this.http
      .get(Urls.baseUrl + Urls.port + Constants.getUjbStats, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('res', res)
        console.log('in_provider_dashboard.ts', res)
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

  getcategoriesApi(searchTerm: string) {
    ////
    console.log('catList', searchTerm)
    let request = {
      searchTerm: searchTerm,
    }
    return this.http
      .get(Urls.baseUrl + Urls.port + Constants.getCategoriesApi, {observe: 'response'})
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

  getUserStatsApi(userId: any, userRole: any) {
    ////
    return this.http
      .get(
        Urls.baseUrl +
          Urls.port +
          Constants.getUserStats +
          'userId=' +
          userId +
          '&' +
          'type=' +
          userRole,
          {observe: 'response'}
      )
      .pipe(map((res: any) => {
        ////
        console.log('res', res)
        console.log('in_provider_dashboard.ts', res)
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

  getUserInfoApi(userId: any) {
    return this.http
      .get(
        Urls.baseUrl + Urls.port + Constants.getUserInfoApi + 'userId=' + userId, {observe: 'response'}
      )
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
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }
  getCpBusiness(userId: any) {
    //
    return this.http
      .get(
        Urls.baseUrl +
          Urls.port +
          Constants.getCpBusinessApi +
          'userId=' +
          userId,
          {observe: 'response'}
      )
      .pipe(map((res: any) => {
        //
        console.log('res', res)
        console.log('in_provider_dashboard.ts', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        //
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
  }}
