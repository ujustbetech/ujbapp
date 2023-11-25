import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage'


@Injectable({
  providedIn: 'root'
})
export class ClientPartnerGuard implements CanActivate {

  constructor(
    private storage: Storage
  ){}

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return new Promise(async (resolve) => {
        try {
            let userInfo = await this.storage.get('userInfo')
            if (userInfo) {
                resolve(true)
            } else {
                resolve(false)
            }    
        } catch (error) {
            resolve(false)            
        }
    })
  }
}