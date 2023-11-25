import { Component, OnInit } from '@angular/core'

/**
 * Generated class for the ThemeMainModalComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'theme-main-modal',
  templateUrl: 'theme-main-modal.html',
  styleUrls: ['theme-main-modal.scss'],
})
export class ThemeMainModalComponent {
  text: string

  constructor() {
    console.log('Hello ThemeMainModalComponent Component')
    this.text = 'Hello World'
  }
}
