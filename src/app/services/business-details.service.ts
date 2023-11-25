import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { map, catchError } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx'
import { File } from '@ionic-native/file/ngx'
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class BusinessDetailsService {

  constructor(
    public http: HttpClient,
    private nativeHttp: HTTP,
    private file: File,
    private streamingMedia: StreamingMedia,
    private storage: Storage
  ) {
    console.log('Hello BusinessDetailsProvider Provider')
  }
  submitCategories(businessData) {
    console.log('businessData', businessData)
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.updateBusiness, businessData, {observe: 'response'})
      .pipe(map((res: any) => {
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
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  updateLogo(logoDetails) {
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.uploadLogo, logoDetails, {observe: 'response'} )
      .pipe(map((res: any) => {
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
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  downloadFile() {
    this.nativeHttp.setDataSerializer('json')
    // this.nativeHttp.setSSLCertMode('nocheck')
    let headers: any = { 'Content-Type': 'application/json' }
    let url = Constants.UjbVideoUrl
    this.nativeHttp
      .downloadFile(url, {}, headers, this.file.dataDirectory + 'abc.mp4')
      .then((res: any) => {
        console.log('downloadFile', JSON.stringify(res))
        this.storage.set('ujbVideoPath', res.nativeURL)
        this.playVideo(res.nativeURL, false)
      })
      .catch((err) => {
        console.log('downloadFile', err)
      })
  }

  playVideo(path, retry: boolean) {
    let options: StreamingVideoOptions = {
      successCallback: () => {
        console.log('streamingMedia', 'Video played')
      },
      errorCallback: (e) => {
        if (retry == true) this.downloadFile()
        console.log('streamingMedia Error streaming', JSON.stringify(e))
      },
      orientation: 'landscape',
      shouldAutoClose: true,
      //controls: false
    }
    this.streamingMedia.playVideo(path, options)
  }

  getPromotions(currentPage, limit) {
    console.log(
      'getPromotions url',
      Urls.baseUrl +
        Urls.port +
        Constants.getPromotionMedia +
        '/' +
        currentPage +
        '/' +
        limit
    )
    return this.http
      .get(
        Urls.baseUrl +
          Urls.port +
          Constants.getPromotionMedia +
          '/' +
          currentPage +
          '/' +
          limit,
          {observe: 'response'}
      )
      .pipe(map((res: any) => {
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
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }

  checkVersionDetails(platform) {
    return this.http
      .get(Urls.baseUrl + Urls.port + Constants.getVersionDetails + platform, {observe: 'response'})
      .pipe(map((res: any) => {
        console.log('res', res)
        console.log('in_provider_login.ts', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('inside catch', error)
        return throwError(new Error(error.status))
      }))
  }

  updateBannerImage(bannerDetails) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    })
    let bannerDetail = JSON.parse(JSON.stringify(bannerDetails))
    let first = bannerDetails.Base64string.substring(
      0,
      bannerDetails.Base64string.lastIndexOf(';base64')
    )
    let fileType = first.substring(first.lastIndexOf(':') + 1, first.length)
    bannerDetail.Base64string = bannerDetails.Base64string.replace(
      'data:' + fileType + ';base64,',
      ''
    )
    console.log('updateBannerImage', JSON.stringify(bannerDetails))

    return this.http
      .put(Urls.baseUrl + Urls.port + Constants.updateBanner, bannerDetail, {
        headers,
        observe: 'response'
      })
      .pipe(map((res: any) => {
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
        } else {
          return throwError(new Error(Constants.someErrorOccurred))
        }
      }))
  }}
