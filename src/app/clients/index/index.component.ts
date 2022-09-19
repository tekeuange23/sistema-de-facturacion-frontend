import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from "src/environments/environment";
import Swal from 'sweetalert2';
import { Client } from '../client.model';
import { ClientService } from '../client.service';
import { ModalService } from "../upload/modal.service";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger',
  },
  buttonsStyling: false,
});

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, OnDestroy {
  clients: Client[] = null;
  selectedClient: Client = null;
  paginator: any;
  url = environment.host;

  clientsSubscription: Subscription;
  paginatorSubscription: Subscription;

  constructor(
    private clientService: ClientService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute
    ) {}

  ngOnInit(): void {
    this.getClients();

    this.modalService.uploadEvent.subscribe((client) => {
      this.clients.map((originalClient) => {
        if(client.id === originalClient.id) {
          originalClient.photo = client.photo;
        }
        return originalClient;
      });
    });
  }
  ngOnDestroy(): void {
    this.clientsSubscription.unsubscribe();
    this.paginatorSubscription.unsubscribe();
  }

  onSelectClient(client: Client) {
    this.selectedClient = client;
    this.modalService.open();
    console.log(this.selectedClient);
  }

  getClients(): void {
    this.activatedRoute.params.subscribe((params) => {
      let page = params['page'];
      page = +page || 0;

      this.clientService.index(page);
      this.clientsSubscription = this.clientService.clientSubject.subscribe(
        (data) => {
          this.clients = data ? data : null;
          console.log(this.clients);


          // PAGINATION
          this.paginatorSubscription = this.clientService.paginatorSubject.subscribe((pgntr) => {
            this.paginator = pgntr;
          });
        }
      );
      this.clientService.emitClientSubject();
    });

  }

  onDelete(client: Client): void {
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: `You want to delete the client ${client.firstName}!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.clientService.delete(client.id).subscribe((data) => {
            this.clients = this.clients.filter((cli) => cli !== client);
            swalWithBootstrapButtons.fire(
              'Deleted!',
              `The client ${client.firstName} has been deleted.`,
              'success'
            );
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            'Cancelled',
            `The client ${client.firstName} is safe :)`,
            'error'
          );
        }
      });
  }
}
