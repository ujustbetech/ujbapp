import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Network } from '@ionic-native/network/ngx'

export enum ConnectionStatus {
  Online = 'Online',
  Offline = 'Offline',
}
@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  public status: ConnectionStatus
  private _status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(null)
  constructor(public network: Network, public events: Events) {
    this.status = ConnectionStatus.Online
    //this.getNetworkType()
    console.log('Hello NetworkProvider Provider')
  }

  public initializeNetworkEvents(): void {
    /* OFFLINE */
    this.network.onDisconnect().subscribe(() => {
      if (this.status === ConnectionStatus.Online) {
        this.setStatus(ConnectionStatus.Offline)
        console.log('this.network.onDisconnect()', this.status)
      }
    })

    if (this.getNetworkType() != 'none') {
      this.setStatus(ConnectionStatus.Online)
      console.log('this.getNetworkType()', this.status)
    }

    /* ONLINE */
    this.network.onConnect().subscribe(() => {
      if (this.status === ConnectionStatus.Offline) {
        this.setStatus(ConnectionStatus.Online)
        console.log('this.network.onDisconnect()', this.status)
      }
    })
  }

  public getNetworkType(): string {
    console.log('this.network.type', this.network.type)
    return this.network.type
  }

  public getNetworkStatus(): Observable<ConnectionStatus> {
    console.log('getNetworkStatus()', this._status.asObservable())
    return this._status.asObservable()
  }

  private setStatus(status: ConnectionStatus) {
    console.log('setStatus', this.status)
    this.status = status
    this._status.next(this.status)
  }}
