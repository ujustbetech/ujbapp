import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(public http: HttpClient) {
    console.log('Hello CategoriesProvider Provider')
  }

  getcategoriesApi(searchTerm: string, CurrentPage: any) {
    //
    console.log('catList', searchTerm)
    // let request={
    //   "searchTerm": searchTerm
    // }
    return this.http
      .get(
        Urls.baseUrl +
          Urls.port +
          Constants.getCategoriesApi +
          searchTerm +
          Constants.getCategoriesApi2 +
          CurrentPage,
          {observe: 'response'}
      )
      .pipe(map((res: any) => {
        //
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
  }}
