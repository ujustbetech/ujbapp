import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { InsertErrorLog } from '../models/insertErrorLog';
import { catchError, map } from "rxjs/operators"; 

@Injectable({
  providedIn: 'root'
})
export class InserErrorLogService {

  constructor(public http: HttpClient) {
    console.log('Hello InserErrorLogProvider Provider')
  }
  insertLogError(logError: InsertErrorLog) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })

    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.logError, logError, {
        headers,
        observe: 'response'
      })
      .pipe(map((res: any) => {
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('in provider logs', error)
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
