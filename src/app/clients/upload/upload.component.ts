import { Component, Input, OnInit } from '@angular/core';
import Swal from "sweetalert2";
import { Client, ClientData } from "../client.model";
import { ClientService } from "../client.service";
import { environment } from 'src/environments/environment';
import { HttpEventType } from "@angular/common/http";
import { ModalService } from "./modal.service";


const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @Input() client: Client;
  url: string = environment.host;
  selectedPhoto: File;
  progress: number = 0;


  constructor(
    private clientService: ClientService,
    public modalService: ModalService
  ) { }

  ngOnInit(): void { }

  selectPhoto(event) {
    this.selectedPhoto = event.target.files[0];
    this.progress = 0;

    if(this.selectedPhoto.type.indexOf('image') === -1) {
      swalWithBootstrapButtons.fire(
        'Selection error:',
        `The selected file should be an image.`,
        'error'
      );
      this.selectedPhoto = null;
      event.target.value = null;
    }
  }

  submitPhoto() {
    if(!this.selectedPhoto){
      swalWithBootstrapButtons.fire(
        'Upload error!',
        `No image selected.`,
        'error'
      );
    }
    else {
      this.clientService.uploadPhoto(this.selectedPhoto, this.client.id).subscribe(event => {
        console.log(event);

        switch (event.type) {
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / event.total) * 100);
            break;

          case HttpEventType.Response:
            const response: ClientData = event.body;
            this.client = response.client as Client;
            this.modalService.uploadEvent.emit(this.client);

            swalWithBootstrapButtons.fire(
              'Upload completed!',
              `${response.message}.`,
              'success'
            );
            this.selectedPhoto = null;
            break;

          default:
            break;
        }

      });
    }

  }

  closeModal() {
    this.modalService.close();
    this.selectedPhoto = null;
    this.progress = 0;
  }
  openModal() {
    this.modalService.open();
  }
}
