import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { QuestionsInfo } from '../../app/models/QuestionsInfo'
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {

  constructor(public http: HttpClient) {
    console.log('Hello QuestionnaireProvider Provider')
  }
  enrollPartnerApi(questionnaireObj: QuestionsInfo) {
    ////
    console.log('req', questionnaireObj)
    console.log('req1', JSON.stringify(questionnaireObj))
    return this.http
      .post(
        Urls.baseUrl + Urls.port + Constants.enrollPartner,
        questionnaireObj, 
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
  getCountryApi() {
    return this.http
      .get(Urls.baseUrl + Urls.port + Constants.getCountries, {observe: 'response'})
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
  getStateApi(countryCode: any, searchTearm: any) {
    return this.http
      .get(
        Urls.baseUrl +
          Urls.port +
          Constants.getState +
          countryCode +
          '/' +
          searchTearm,
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
  }}
