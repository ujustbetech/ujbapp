import { Component, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular'
import { DomSanitizer } from '@angular/platform-browser'

/**
 * Generated class for the YoutubePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-youtube',
  templateUrl: 'youtube.html',
  styleUrls: ['youtube.scss'],
})
export class YoutubePage implements OnInit {
  videourl = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/0lsT-cZXkDY')
  constructor(
    public navCtrl: NavController,
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() {
    console.log('ngOnInit YoutubePage')
  }

  closeMe() {
    this.navCtrl.pop()
  }
}

/* 
<iframe width="560" height="315" src="https://www.youtube.com/embed/r2ga-iXS5i4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
*/
