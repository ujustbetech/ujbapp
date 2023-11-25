import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { GetBusinessListInfo } from '../models/getBusinessList_info';
import { catchError, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(public http: HttpClient) {
    console.log('Hello SearchProvider Provider')
  }

  getSearchData(data, userId) {
    //
    return this.http
      .get(
        Urls.baseUrl +
          Urls.port +
          Constants.searchData +
          data +
          Constants.UserId +
          userId,
          {observe: 'response'}
      )
      .pipe(map((res: any) => {
        //
        console.log('res', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        //
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

  getBusinessList(getBusinessListInfo: GetBusinessListInfo) {
    let req = JSON.parse(JSON.stringify(getBusinessListInfo))
    delete req.categoryListForSort
    console.log('getBusinessList request', JSON.stringify(req))
    return this.http
      .post(
        Urls.baseUrl + Urls.port + Constants.getBusinessList,
        getBusinessListInfo,
        {observe: 'response'}
      )
      .pipe(map((res: any) => {
        console.log('res', res)
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
