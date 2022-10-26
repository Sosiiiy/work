import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  private canvas: any[] = [];
  constructor() {}

  add(modal: any) {
    // add modal to array of active modals
    console.log("model"+modal);
    this.canvas.push(modal);
    
  }

  remove(id: string) {
    // remove modal from array of active modals
    this.canvas = this.canvas.filter((x) => x.id !== id);
  }

  open(id: string) {
    // open modal specified by id
    console.log("id"+id)
    console.log("canvas"+this.canvas);
    const modal = this.canvas.find((x) => x.id === id);
    modal.open();
  }

  close(id: string) {
    // close modal specified by id
    const modal = this.canvas.find((x) => x.id === id);
    modal.close();
  }
}
