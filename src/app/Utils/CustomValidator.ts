import { AbstractControl } from '@angular/forms'
/*
 * MIT License
 *
 * Copyright (c) 2019 Abacus Infosystem Pvt Ltd
 *
 (License Content) 
 */

/* Class to write validators
 * Revision History:
 *     Initial:        2019/02/13        Meghana
 */

export class CustomValidation {
  static MatchPassword(AC: AbstractControl) {
    let passwordNew: any
    let retypePass: any
    if (AC.get('passwordNew') != null) {
      passwordNew = AC.get('passwordNew').value
    }
    if (AC.get('retypePass') != null) {
      retypePass = AC.get('retypePass').value
    }
    if (passwordNew != retypePass) {
      // console.log('false');
      AC.get('retypePass').setErrors({ MatchPassword: true })
    } else {
      //  console.log('true');
      return null
    }
  }

  static isEmailValid(control: AbstractControl): any {
    if (control.get('email').value != null) {
      let myvalue = control.get('email').value.toString()

      if (myvalue.indexOf('@') == -1) {
        control.get('email').setErrors({ EmailInvalid: true })
      } else if (myvalue.includes('..')) {
        control.get('email').setErrors({ EmailInvalid: true })
      } else if (myvalue.indexOf(' ') != -1) {
        control.get('email').setErrors({ EmailInvalid: true })
      } else {
        //console.log("@ present");
        let a = myvalue.split('@')
        console.log('length', a.length)
        console.log('length name', a)
        if (a.length > 2) {
          control.get('email').setErrors({ EmailInvalid: true })
        } else {
          if (a.length == 2) {
            let c = myvalue.substring(
              myvalue.indexOf('@'),
              myvalue.indexOf('.')
            )
            let b = a[1]
            console.log('length name substring', c)
            console.log('length name substring length', c.length)
            if (c.length == 1) {
              control.get('email').setErrors({ EmailInvalid: true })
            } else if (b.indexOf('.') == -1) {
              control.get('email').setErrors({ EmailInvalid: true })
            } else {
              if (b.includes('..')) {
                control.get('email').setErrors({ EmailInvalid: true })
              } else {
                let c = b.split('.')
                if (c[1].length <= 1) {
                  control.get('email').setErrors({ EmailInvalid: true })
                } else {
                  if (!isNaN(c[c.length - 1])) {
                    control.get('email').setErrors({ EmailInvalid: true })
                  }
                }
              }
            }
          }
        }
      }
    } else {
      // console.log("null");
    }
  }
}
