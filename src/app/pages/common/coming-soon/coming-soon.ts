import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'

/**
 * Generated class for the ComingSoonPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-coming-soon',
  templateUrl: 'coming-soon.html',
  styleUrls: ['coming-soon.scss']
})
export class ComingSoonPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    console.log('ngOnInit ComingSoonPage')
  }
  /**to go back to previous page */
  goBackTo() {
    this.navCtrl.pop()
  }
}
