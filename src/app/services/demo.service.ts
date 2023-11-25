import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  items: any = []
  constructor() {
    this.items = [
      { catName: 'Entertainment', catImage: 'cat-heakthcare@2x' },
      { catName: 'Health Care', catImage: 'cat-itandtech@2x' },
      { catName: 'Arts and Crafts', catImage: 'cat-artndesign@2x' },
      { catName: 'IT and Tech', catImage: 'cat-engineering@2x' },
      { catName: 'Entertainment', catImage: 'cat-heakthcare@2x' },
      { catName: 'Health Care', catImage: 'cat-itandtech@2x' },
      { catName: 'Arts and Crafts', catImage: 'cat-artndesign@2x' },
      { catName: 'IT and Communications', catImage: 'cat-engineering@2x' },
      { catName: 'Professional Services', catImage: 'cat-heakthcare@2x' },
      { catName: 'Health Care', catImage: 'cat-itandtech@2x' },
      { catName: 'Arts and Crafts', catImage: 'cat-artndesign@2x' },
      { catName: 'IT and Information', catImage: 'cat-engineering@2x' },
      { catName: 'Professional Services', catImage: 'cat-heakthcare@2x' },
      { catName: 'Manufacturing', catImage: 'cat-itandtech@2x' },
      { catName: 'Arts and Crafts', catImage: 'cat-artndesign@2x' },
      { catName: 'Repairs & Maintenance', catImage: 'cat-engineering@2x' },
    ]
  }
  filterItems(searchTerm) {
    ////
    if (searchTerm.length > 1) {
      return this.items.filter((item) => {
        console.log('item', item)
        return item.catName.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
      })
    }
  }}
