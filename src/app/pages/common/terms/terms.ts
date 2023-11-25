import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'

/**
 * Generated class for the TermsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
  styleUrls:['terms.scss']
})
export class TermsPage implements OnInit {
  constructor(public navCtrl: NavController) {}

  ngOnInit() {
    console.log('ngOnInit TermsPage')
  }

  goBackTo() {
    this.navCtrl.pop()
  }
}
