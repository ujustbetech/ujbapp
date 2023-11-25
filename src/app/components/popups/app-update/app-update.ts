import { Component, OnInit } from '@angular/core'
import { ModalController } from '@ionic/angular'

/**
 * Generated class for the AppUpdateComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'app-update',
  templateUrl: 'app-update.html',
  styleUrls: ['app-update.scss']
})
export class AppUpdateComponent {
  text: string

  constructor(private modalCtrl: ModalController) {
    console.log('Hello AppUpdateComponent Component')
    this.text = 'Hello World'
  }

  close() {
    this.modalCtrl.dismiss()
  }
}
