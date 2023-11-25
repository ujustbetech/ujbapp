import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, NavController, AlertController } from '@ionic/angular';
import { Observable, Observer, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { Urls } from '../Utils/urls';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation/ngx'
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
import { File } from '@ionic-native/file/ngx'
import { ImageData } from '../models/KYCDocs'
import { catchError, map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {

  constructor(
    public camera: Camera,
    public platform: Platform,
    public filePath: FilePath,
    public file: File,
    public http: HttpClient,
    public alertCtrl: AlertController
    
  ) {
    console.log('Hello ImageProvider Provider')
  }

  /**
   * gets users current location
   * @param geolocation
   * @param nativeGeocoder
   */
  getLocation(
    geolocation: Geolocation,
    nativeGeocoder: NativeGeocoder,
    shouldReturnState: boolean
  ) {
    console.log('getLocation in util')
    return new Observable((observer: Observer<any>) => {
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5,
      }
      let geoLocationOption: GeolocationOptions = {
        timeout: 5000,
      }
      console.log('getLocation before getCurrentPosition util')
      geolocation.getCurrentPosition(geoLocationOption).then(
        (resp) => {
          console.log('getLocation in getCurrentPosition util')

          //console.log("getLocation in getCurrentPosition util")
          console.log('get currnt pos in util', resp)
          nativeGeocoder
            .reverseGeocode(
              resp.coords.latitude,
              resp.coords.longitude,
              options
            )
            .then(
              (result: any[]) => {
                console.log('nativeGeocoder.reverseGeocode', result)
                console.log(
                  'nativeGeocoder.reverseGeocode json',
                  JSON.stringify(result)
                )
                let userFlat = ''
                let userlocality = ''
                let usersubloc = ''
                let userStateName = ''
                let userPostal = ''
                for (let i = 0; i < result.length; i++) {
                  if (result[i].areasOfInterest.length > 0 && userFlat == '') {
                    userFlat = result[i].areasOfInterest[0].toString()
                  }
                  if (result[i].locality != '' && userlocality == '') {
                    userlocality = result[i].locality.toString()
                  }
                  if (result[i].subLocality != '' && usersubloc == '') {
                    usersubloc = result[i].subLocality.toString()
                  }
                  if (
                    result[i].administrativeArea != '' &&
                    userStateName == ''
                  ) {
                    userStateName = result[i].administrativeArea.toString()
                  }
                  if (result[i].postalCode != '' && userPostal == '') {
                    userPostal = result[i].postalCode.toString()
                  }
                }
                let userlocation = ''
                if (userFlat != '') userlocation = userFlat
                if (usersubloc != '')
                  userlocation = userlocation + ' , ' + usersubloc
                if (userlocality != '')
                  userlocation = userlocation + ' , ' + userlocality
                if (userStateName != '' && shouldReturnState == true)
                  userlocation = userlocation + ' , ' + userStateName
                if (userPostal != '')
                  userlocation = userlocation + ' , ' + userPostal

                observer.next(userlocation)
                observer.complete()
                console.log('user location', userlocation)
              },
              (error) => {
                observer.error(error)
                observer.complete()
                console.log(error)
              }
            )
        },
        (error) => {
          console.log('Error getting location', error)
          throw error
        }
      )
    })
  }

  getLocationPromise(
    geolocation: Geolocation,
    nativeGeocoder: NativeGeocoder,
    shouldReturnState: boolean
  ) {
    console.log('getLocation in util')
    return new Promise((resolve: any, reject: any) => {
      let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5,
      }
      let geoLocationOption: GeolocationOptions = {
        timeout: 60000,
        maximumAge: 10000,
        enableHighAccuracy: true
      }
      geolocation.getCurrentPosition(geoLocationOption).then(
        async (resp) => {
          console.log('get currnt pos in util', resp)
          nativeGeocoder
            .reverseGeocode( resp.coords.latitude, resp.coords.longitude, options )
            .then(
              (result: any[]) => {
                let userFlat = ''
                let userlocality = ''
                let usersubloc = ''
                let userStateName = ''
                let userPostal = ''
                for (let i = 0; i < result.length; i++) {
                  if (result[i].areasOfInterest.length > 0 && userFlat == '') {
                    userFlat = result[i].areasOfInterest[0].toString()
                  }
                  if (result[i].locality != '' && userlocality == '') {
                    userlocality = result[i].locality.toString()
                  }
                  if (result[i].subLocality != '' && usersubloc == '') {
                    usersubloc = result[i].subLocality.toString()
                  }
                  if (
                    result[i].administrativeArea != '' &&
                    userStateName == ''
                  ) {
                    userStateName = result[i].administrativeArea.toString()
                  }
                  if (result[i].postalCode != '' && userPostal == '') {
                    userPostal = result[i].postalCode.toString()
                  }
                }
                let userlocation = ''
                if (userFlat != '') userlocation = userFlat
                if (usersubloc != '')
                  userlocation = userlocation + ' , ' + usersubloc
                if (userlocality != '')
                  userlocation = userlocation + ' , ' + userlocality
                if (userStateName != '' && shouldReturnState == true)
                  userlocation = userlocation + ' , ' + userStateName
                if (userPostal != '')
                  userlocation = userlocation + ' , ' + userPostal

                console.log('user location', userlocation)
              // alert(`195 - ${userlocation}`)
                
                resolve(userlocation)
              },
              async (error) => {
                // await this.alertCtrl.create({
                //   message: '199' + JSON.stringify(error),
                //   buttons: [
                //     {
                //       text: 'Cancel'
                //     }]
                // }).then(alertChange => alertChange.present())
                reject(error)
              }
            )
        }).catch(async (error) => {
          // alert(`216 - ${JSON.stringify(error)}`)
          console.log('Error getting location', error)
          throw error
        })
    })
  }

  /**
   * gets image file from device
   * @param source source of image can be Camera or Gallery
   */
  getImage(source: string) {
    return new Observable((observer: Observer<any>) => {
      if (source == 'Camera') {
        console.log('in cam')
        const options: CameraOptions = {
          quality: 50,
          targetHeight: 720,
          targetWidth: 720,
          destinationType: this.camera.DestinationType.FILE_URI,
          sourceType: this.camera.PictureSourceType.CAMERA,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true,
          saveToPhotoAlbum: false,
        }

        this.camera.getPicture(options).then(
          (imageData1) => {
            let imageURI
            if (this.platform.is('ios')) {
              imageURI = imageData1
            } else {
              // TODO
              imageURI = encodeURI(imageData1)
            }
            this.convertFileAndUpload(imageURI)
              .subscribe(
                (data) => {
                  if (data) {
                    observer.next(data)
                    observer.complete()
                  }
                },
                (err) => {
                  console.log('err', err)
                }
              )
              .catch((err) => {
                console.log('in errrrr', err)
              })
          },
          (err) => {
            console.log('in error')
            console.log(err)
            observer.error(err)
            observer.complete()
          }
        )
      } else {
        const options: CameraOptions = {
          quality: 100,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          saveToPhotoAlbum: false,
          correctOrientation: true,
        }

        this.camera.getPicture(options).then(
          (imageData) => {
            console.log('imageData', imageData)
            if (this.platform.is('android')) {
              this.filePath
                .resolveNativePath(imageData)
                .then((entry) => {
                  console.log('entry', entry)
                  // TODO
                  let imageURI = encodeURIComponent(entry)
                  let imageData: ImageData = new ImageData()
                  imageData.base64 = entry

                  this.convertFileAndUpload(imageURI).subscribe(
                    (data) => {
                      console.log('data', data)
                      if (data) {
                        observer.next(data)
                        observer.complete()
                      }
                    },
                    (err) => {
                      console.log('err', err)
                      observer.error(err)
                      observer.complete()
                    }
                  )
                })
                .catch((err) => {
                  console.log('catch err', err)
                })
            } else {
              let imageURI
              let mimageData = imageData.replace('/private', 'file://')
              let path1 = imageData.substring(0, imageData.lastIndexOf('/'))
              let fname = imageData.substring(
                imageData.lastIndexOf('/') + 1,
                imageData.length
              )
              console.log('path1', path1)
              console.log('fname', fname)
              console.log('mimageData', JSON.stringify(mimageData))
              console.log('imageData', JSON.stringify(imageData))
              imageURI = imageData

              this.convertFileAndUpload(imageURI).subscribe(
                (data) => {
                  if (data) {
                    observer.next(data)
                    observer.complete()
                  }
                },
                (err) => {
                  console.log('err', err)
                }
              )
            }
          },
          (err) => {
            console.log(err)
            observer.error(err)
            observer.complete()
          }
        )
      }
    })
  }

  getImagePromise(source: string) {
    return new Observable((observer: Observer<any>) => {
      if (source == 'Camera') {
        const options: CameraOptions = {
          quality: 50,
          targetHeight: 720,
          targetWidth: 720,
          destinationType: this.camera.DestinationType.DATA_URL,
          sourceType: this.camera.PictureSourceType.CAMERA,
          encodingType: this.camera.EncodingType.JPEG,
          mediaType: this.camera.MediaType.PICTURE,
          correctOrientation: true,
          saveToPhotoAlbum: false,
        }

        this.camera.getPicture(options)
          .then(async (imageData1) => {
              observer.next({base64: 'data:image/jpeg;base64,' + imageData1, fileName: 'test.png', fileType: ''})
            observer.complete()
          }).catch((err) => {
            observer.error(err)
            observer.complete()
          })
      } else {
        const options: CameraOptions = {
          quality: 100,
          sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
          destinationType: this.camera.DestinationType.DATA_URL,
          saveToPhotoAlbum: false,
          correctOrientation: true,
        }

        this.camera.getPicture(options)
          .then(async (iData) => {
            observer.next({base64: 'data:image/jpeg;base64,' + iData, fileName: 'test.png', fileType: ''})
            observer.complete()
          }).catch((err) => {
            observer.error(err)
            observer.complete()
          })
      }
    })
  }

  /**
   * converts imagefile to base64 string
   * @param imagePath imagefile path
   */
  convertFileAndUpload(imagePath: string): any {
    if (imagePath != null && imagePath != undefined && imagePath != '') {
      let path = imagePath.substring(0, imagePath.lastIndexOf('/'))
      let filename = imagePath.substring(
        imagePath.lastIndexOf('/'),
        imagePath.length
      )
      filename = filename.replace('/', '')

      console.log('path', path)
      console.log('filename', filename)
      return Observable.create((observer: Observer<any>) => {
        this.file
          .readAsDataURL(path, filename)
          .then((content) => {
            console.log('content', content)
            let fileType = ''
            let imageData: ImageData = new ImageData()
            imageData.base64 = content
            imageData.fileName = filename
            imageData.filePath = path
            imageData.fileType = fileType
            observer.next(imageData)
            observer.complete()
          })
          .catch((error) => {
            observer.error(error)
            observer.complete()
            console.log('file creation error', JSON.stringify(error))
          })
      })
    }
  }

  checkNetwork(storage: Storage, navCtrl: NavController): boolean {
    console.log('checkNetwork')
    return Observable.create((observer: Observer<any>) => {
      console.log('checkNetwork observer')
      storage
        .get(Constants.connection)
        .then((res: any) => {
          if (res) {
            console.log('checkNetwork res if', res)
            if (res == Constants.connected) {
              console.log('checkNetwork connected')
              observer.next(true)
              observer.complete()
            } else {
              console.log('checkNetwork not connected')
              observer.next(false)
              observer.complete()
              // navCtrl.push(ErrorInternetPage)
            }
          } else {
            console.log('checkNetwork res else', res)
            observer.next(false)
            observer.complete()
            // navCtrl.push(ErrorInternetPage)
          }
        })
        .catch((err) => {
          console.log('checkNetwork err', err)
          observer.next(false)
          observer.complete()
          // navCtrl.push(ErrorInternetPage)
        })
    })
  }

  sendAppVersion(userId: string, versionCode: string) {
    let request = {
      userId: userId,
      versionCode: versionCode,
    }
    console.log('sendAppVersion request', request)
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.sendVersionCode, request, {observe: 'response'})
      .pipe(map((res: any) => {
        console.log('sendAppVersion res', res)
        console.log('sendAppVersion', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        console.log('sendAppVersion inside catch', error)
        return throwError(new Error(error.status))
      }))
  }}
