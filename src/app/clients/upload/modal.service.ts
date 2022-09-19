import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;
  uploadEvent = new EventEmitter<any>();

  constructor() { }

  open() {
    this.modal = true;
  }
  close() {
    this.modal = false;
  }
}
