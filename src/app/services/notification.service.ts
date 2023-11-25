import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public http: HttpClient) {
    console.log('Hello NotificationProvider Provider')
  }
  notificationListApi(userId: string, skipTotal: any) {
    ////

    console.log('notification api in provider', userId)
    let request = { userId: userId, skipTotal: skipTotal }
    console.log('jsonreq,', JSON.stringify(request))
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.notificationList, request, {observe: 'response'})
      .pipe(map((res: any) => {
        ////

        console.log('res', res)
        console.log('in_provider_notification.ts', res)

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
          //return { "status": error.status, "json": error.json() };
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

  notificationUpdateApi(notificationId: string[]) {
    ////

    // // console.log("notification api in provider", userId)
    let request = { notificationIds: notificationId }
    console.log('jsonreq for notification update,', JSON.stringify(request))
    return this.http
      .put(Urls.baseUrl + Urls.port + Constants.notificationUpdate, request, {observe: 'response'})
      .pipe(map((res: any) => {
        ////

        console.log('res', res)
        console.log('in_provider_notification.ts', res)

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
  fcmTokenUpdateApi(userId: string, token: any) {
    console.log('notification api in provider', userId)
    let request = { userId: userId, token: token }
    console.log('jsonreq,', JSON.stringify(request))
    return this.http
      .put(Urls.baseUrl + Urls.port + Constants.fcmTokenUpdate, request, {observe: 'response'})
      .pipe(map((res: any) => {
        console.log('res', res)
        console.log('in_provider_fcm token updatenotification.ts', res)

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
          //return { "status": error.status, "json": error.json() };
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
