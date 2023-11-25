import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ModalController } from '@ionic/angular'

/**
 * Generated class for the PopupConfirmationAlertComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'popup-confirmation-alert',
  templateUrl: 'popup-confirmation-alert.html',
  styleUrls: ['popup-confirmation-alert.scss']
})
export class PopupConfirmationAlertComponent {
  @Input('text') text: string = 'Are you sure, you want to remove this item?'
  @Input('title') title: string //= "Please confirm"
  @Input('cancelText') cancelText: string = 'Cancel'
  @Input('cancelClass') cancelClass: string = ''
  @Input('okText') okText: string = 'OK'
  constructor(public modalCtrl: ModalController, private route: ActivatedRoute) {
    // route.queryParams.subscribe((params: any) => {
    //   console.log('Hello PopupConfirmationAlertComponent Component')
  
    //   if (params.text) {
    //     this.text = params.text
    //   }
    //   if (params.title) {
    //     this.title = params.title
    //   }
    //   if (params.hideCancel) {
    //     this.cancelClass = params.hideCancel
    //   }
    //   if (params.cancelText) {
    //     this.cancelText = params.cancelText
    //   }
    //   if (params.okText) {
    //     this.okText = params.okText
    //   }
    // })
  }

  cancel() {
    let data = 'cancel'
    this.modalCtrl.dismiss(data)
  }
  ok() {
    let data = 'ok'
    this.modalCtrl.dismiss(data)
  }
}
