import { Component, Input, OnInit } from '@angular/core'
import {  NavController } from '@ionic/angular' //Temp PR

/**
 * Generated class for the HeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'header',
  templateUrl: 'header.html',
  styleUrls: ['header.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() pageTitle: string
  headerTitle: any

  constructor(public navCtrl: NavController) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    //Assign pageTitle as headerTitle
    this.headerTitle = this.pageTitle
  }
}
