import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class LinkedInAuthService {

  constructor(public http: HttpClient) {
    console.log('Hello LinkedInAuthProvider Provider')
  }
  linkLogin(code) {
    ////
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    })

    var data: any
    data =
      'grant_type=authorization_code&code=' +
      code +
      '&redirect_uri=http://localhost/callback&client_id=81f0f6jx274got&client_secret=QUkhSeeBU2ZGOWbj'
    console.log('data : ' + data)
    let body = data
    console.log('body : ' + body)
    return this.http
      .post('https://www.linkedin.com/oauth/v2/accessToken', body, { headers, observe: 'response'})
      .toPromise()
      .then(
        (res: any) => {
          ////
          let result = res

          console.log('http result : ' + result)
          console.log('response1', JSON.stringify(result))
          if (result) {
            ////
            if (result['access_token'] !== undefined) {
              console.log('Done : ' + result['access_token'])
            } else {
              //return resolve("Failed");
              console.log('Failed')
            }
          }
          return result
        },
        (err) => {
          ////
          console.log(err)
          //return resolve("Failed");
          console.log('Failed')
        }
      )
  }
  getLinkedInUserDetails(token: string) {
    ////
    ////
    let headers = new HttpHeaders({
      Authorization: 'Bearer ' + token, //,
    })

    return this.http
      .get(
        'GET https://api.linkedin.com/v2/people/(id:{profile ID})?projection=(id,firstName,lastName)',
        { headers, observe: 'response' }
      )
      .toPromise()
      .then(
        (res: any) => {
          ////
          let result1 = res
          console.log('res1', result1)
          console.log('res12', JSON.stringify(result1))
          return result1
        },
        (err) => {
          console.log('error', err)
        }
      )
  }

}
