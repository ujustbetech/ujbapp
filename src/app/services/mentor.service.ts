import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';

@Injectable({
  providedIn: 'root'
})
export class MentorService {

  constructor(public http: HttpClient) {
    console.log('Hello MentorProvider Provider')
  }

  /**
   * calls the api to get mentor list
   * @param searchTerm term based on which results returned
   */
  getMentorList(searchTerm: string) {
    ////
    console.log('mentor', searchTerm)
    let request = {
      searchTerm: searchTerm,
    }
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.getMentorApi, request, {observe: 'response'})
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

  getResults(keyword: string) {
    let request = {
      searchTerm: keyword,
    }
    console.log('getResults req', request)
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.getMentorApi, request, {observe: 'response'})
      .pipe(map((result: any) => {
        // console.log('getResults', result.json())
        let data = result.body
        //return data
        console.log('getResults data', data)
        let data1: any[] = new Array<any>()
        for (let i = 0; i < data.length; i++) {
          data1.push(JSON.stringify(data[i]))
        }
        return data1
        //return data.filter(item => JSON.stringify(item.fullName).toLowerCase().startsWith(keyword.toLowerCase()) )
      }))
  }}
