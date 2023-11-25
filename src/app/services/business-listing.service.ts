import { Injectable } from '@angular/core';
import { Urls } from '../Utils/urls';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Constants } from '../Utils/Constants';
import { map, catchError } from 'rxjs/operators';
import { BusinessAddressInfo } from '../../app/models/businessAddressInfo'
import { ProductInfo } from '../models/CPProductInfo';
import { GetBusinessDetails } from '../models/getBusinessDetails_info';

@Injectable({
  providedIn: 'root'
})
export class BusinessListingService {

  constructor(public http: HttpClient) {}

  getBusinessAddress(businessAddress: BusinessAddressInfo) {
    ////
    console.log('req', businessAddress)
    return this.http
      .post(
        Urls.baseUrl + Urls.port + Constants.getBusinessAddress,
        businessAddress, {observe: 'response'}
      )
      .pipe(map((res: any) => {
        ////
        console.log('res', res)
        console.log('in_provider_businesslist.ts', res)
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

  getBusinessDetails(getBusinessDetails: GetBusinessDetails) {
    ////
    console.log('req')
    return this.http
      .post(
        Urls.baseUrl + Urls.port + Constants.getBusinessDetails,
        getBusinessDetails, {observe: 'response'}
      )
      .pipe(map((res: any) => {
        ////
        console.log('res', res)
        console.log('in_provider_businesslist.ts', res)
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

  updateProductOrServicesApi(addProductServices: ProductInfo) {
    let request = JSON.parse(JSON.stringify(addProductServices))

    delete request.tempProductsOrServices
    delete request.expanded
    delete request.showMultiple
    delete request.addSingleProduct
    delete request.showSlabs
    delete request.showProducts
    delete request.canUpdateRefData
    console.log('updateProductOrServicesApi req', JSON.stringify(request))

    return this.http
      .post(
        Urls.baseUrl + Urls.port + Constants.updateProductOrservices,
        addProductServices, {observe: 'response'}
      )
      .pipe(map((res: any) => {
        console.log('res', res)
        console.log('in_provider_addupdateproduct', res)
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

  getProductOrServices(userId: string, type: string) {
    return this.http
      .get(
        Urls.baseUrl +
          Urls.port +
          Constants.getProductOrService +
          'userId=' +
          userId +
          '&type=' +
          type,
          {observe: 'response'}
      )
      .pipe(map((res: any) => {
        console.log('res', res)
        console.log('in_provider_getproductservice', res)
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

  removeProduct(id: string) {
    ////
    console.log('removeProduct id', id)

    return this.http
      .get(Urls.baseUrl + Urls.port + Constants.removeProdService + id, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('removeProduct res', res)
        console.log('removeProduct', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        ////
        console.log('removeProduct inside catch', error)
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

  removeImage(productId, ImgUniquename) {
    ////

    let request = { productId: productId, ImgUniquename: ImgUniquename }
    console.log('removeImage data', request)
    return this.http
      .post(Urls.baseUrl + Urls.port + Constants.removeImage, request, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('removeImage res', res)
        console.log('removeProduct', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        ////
        console.log('removeProduct inside catch', error)
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
  removeReference(id: string) {
    ////
    console.log('removeReference id', id)

    return this.http
      .get(Urls.baseUrl + Urls.port + Constants.removeReferrence + id, {observe: 'response'})
      .pipe(map((res: any) => {
        ////
        console.log('removeProduct res', res)
        console.log('removeProduct', res)
        return { status: res.status, json: res.body }
      }))
      .pipe(catchError((error) => {
        ////
        console.log('removeProduct inside catch', error)
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
