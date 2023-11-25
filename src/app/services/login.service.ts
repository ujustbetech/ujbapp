import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { changePassword } from '../../app/models/ChangePasswordInfo'
import { ForgotPassword } from '../../app/models/ForgotPasswordInfo'
import { LoginInfo } from '../../app/models/login_info'
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(public http: HttpClient) {
    console.log('Hello LoginProvider Provider')
  }

  LogIn(LoginUser: LoginInfo) {
    ////
    console.log('loginUser', JSON.stringify(LoginUser))
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.loginApi, LoginUser, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('res', res)
        console.log('in_provider_login.ts', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('inside catch', error)
        return throwError(new Error(error.status))
      }))
  }

  forgotPasswordApi(forgotpassword: ForgotPassword) {
    ////
    console.log('loginUser', forgotpassword)
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.forgotApi, forgotpassword, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('res', res)
        console.log('in_provider_login.ts', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('inside catch', error)
        return throwError(new Error(error.status))
      }))
  }

  /**
   * call the change password api
   * @param changepassword object containing new passwor and userId
   * returns success/failure msg
   */
  changePasswordApi(changePassword: changePassword) {
    // console.log("loginUser", changePassword)
    // return this.http.post(Urls.baseUrl + Urls.port + Constants.changePasswordApi, changePassword).map(res => {

    //   ////
    //   console.log("res", res);
    //   console.log("in_provider_login.ts", res);
    //   return { "status": res.status, "json": res }
    // }).catch((error) => {
    //
    //   console.log("inside catch", error);
    //   return throwError(new Error(error.status));
    // });
    return this.http
      .post(
        Urls.baseUrl + Urls.port + Constants.changePasswordApi,
        changePassword,
        {observe: 'response'}
      )
      .pipe(map((res: any) => {
        ////

        console.log('res', res)
        console.log('in_provider_login change password.ts', res)

        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
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
