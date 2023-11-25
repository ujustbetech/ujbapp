import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage'
import { UserProfileService } from '../services/user-profile.service';


@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(
    private storage: Storage,
    private provider: UserProfileService
  ){}

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return new Promise((resolve) => {
      this.storage.get('userInfo').then((val) => {
          let userId = val.userId
          this.provider.getProfile(userId).subscribe((res: any) => {
            resolve(res)
          }, 
          err => {
            resolve(false)
          })
        })
        .catch(() => {
          resolve(false)
        })
    })
  }
}