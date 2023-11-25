import { Component, OnInit } from '@angular/core'
import { ModalController } from '@ionic/angular'

/**
 * Generated class for the ProductServiceTipComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'product-service-tip',
  templateUrl: 'product-service-tip.html',
  styleUrls: ['product-service-tip.scss']
})
export class ProductServiceTipComponent {
  text: string

  constructor(public modalCtrl: ModalController) {
    console.log('Hello ProductServiceTipComponent Component')
    this.text = 'Hello World'
  }

  closeTip() {
    this.modalCtrl.dismiss()
  }
}
