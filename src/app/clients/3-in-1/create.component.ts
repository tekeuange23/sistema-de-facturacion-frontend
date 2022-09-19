import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { Client, ClientData, Region } from '../client.model';
import { ClientService } from '../client.service';

const ADD_MODE = 'ADD-MODE';
const EDIT_MODE = 'EDIT-MODE';
const SHOW_MODE = 'SHOW-MODE';
const BUTTON_EDIT_TITLE = 'Save';
const BUTTON_ADD_TITLE = 'Create';
const TOGGLE_BUTTON_EDIT_TITLE = 'Edit';
const TOGGLE_BUTTON_CANCEL_TITLE = 'Cancel';
const CREATE_TITLE = 'New Client';
const EDIT_TITLE = 'Edit';
const DETAILS_TITLE = ' Details';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  title;
  toggleButtonTitle = TOGGLE_BUTTON_EDIT_TITLE;
  buttonTitle = BUTTON_ADD_TITLE;
  mode = SHOW_MODE;
  client: Client;
  regions: Region[];
  clientForm: FormGroup;

  constructor(
    private clientService: ClientService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getClientToEdit(() => {
      this.getMode(false);
      this.initClientForm();
    });
  }

  initClientForm = () => {
    this.clientForm = new FormGroup(
      {
        firstName: new FormControl(this.client?.firstName, [
          this.trimValidator,
        ]),
        lastName: new FormControl(this.client?.lastName, [
          Validators.minLength(3),
          Validators.minLength(3),
          this.noWhitespaceValidator,
        ]),
        email: new FormControl(this.client?.email, [
          Validators.required,
          Validators.email,
        ]),
        regionId: new FormControl(this.client?.region?.id, [
          Validators.required,
        ]),
      },
      [this.canEdit]
    );
  };

  onSubmit(): void {
    const client: Client = {
      id: this.client ? this.client.id : null,
      firstName: this.clientForm.value['firstName'],
      lastName: this.clientForm.value['lastName'],
      email: this.clientForm.value['email'],
      region: this.regions.find(rg => rg.id === +this.clientForm.value['regionId']),
      createdAt: "",
      updatedAt: "",
      photo: ""
    };

    switch (this.mode) {
      case ADD_MODE:
        this.clientService.create(client).subscribe(
          (data: ClientData) => {
            this.route.navigate(['/', 'clients']);
            Swal.fire(
              'New Client!',
              `The Client ${data.client.firstName} has been added.`,
              'success'
            );
          },
          (err) => {
            environment.onError(`OnCreateNewClient-Component`, err);
          },
          () => {
            environment.onComplete(
              `OnCreateNewClient-Component`,
              `A new client is added.`
            );
          }
        );
        break;
      case EDIT_MODE:
        this.clientService.update(client).subscribe(
          (data: ClientData) => {
            this.route.navigate(['/', 'clients']);
            Swal.fire(
              'Client Edition!',
              `The Client #${data.client.id} has been edited.`,
              'success'
            );
          },
          (err) => {
            environment.onError(`OnEditClient-Component`, err);
          },
          () => {
            environment.onComplete(
              `OnEditClient-Component`,
              `A new client is added.`
            );
          }
        );
        break;
      default:
        break;
    }
  }

  getClientToEdit(cb): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params['id'];
      if (+id) {
        this.clientService.show(id).subscribe(
          (data: Client) => {
            this.client = data;
            console.log(this.client);
          },
          (err) => {
            environment.onError(`OnEditClient-CreateComponent`, err);
          },
          () => {
            environment.onComplete(
              `OnEditClient-CreateComponent`,
              `Edit client with id: ${id}.`
            );
            cb();
          }
        );
      } else {
        cb();
      }
    });

    this.clientService.getRegions().subscribe((regions: Region[]) => {
      this.regions = regions;
    });
  }

  /**
   *                                        HELPERS
   **************************************************************************************************
   */
  getMode = (clicked): void => {
    if (clicked && this.isShowMode()) {
      this.mode = EDIT_MODE;
      this.toggleButtonTitle = TOGGLE_BUTTON_CANCEL_TITLE;
      this.buttonTitle = BUTTON_EDIT_TITLE;
    } else if (clicked && this.isEditMode()) {
      this.mode = SHOW_MODE;
      this.toggleButtonTitle = TOGGLE_BUTTON_EDIT_TITLE;
    }

    if (!this.client) {
      this.mode = ADD_MODE;
      this.title = CREATE_TITLE;
      this.buttonTitle = BUTTON_ADD_TITLE;
    } else if (this.isShowMode()) {
      this.title = `${this.client.firstName.toUpperCase()}${DETAILS_TITLE}`;
    } else if (this.isEditMode()) {
      this.title = `${EDIT_TITLE} ${this.client.firstName.toUpperCase()}`;
      this.buttonTitle = BUTTON_EDIT_TITLE;
    }
  };
  isAddMode = () => {
    return this.mode === ADD_MODE;
  };
  isEditMode = () => {
    return this.mode === EDIT_MODE;
  };
  isShowMode = () => {
    return this.mode === SHOW_MODE;
  };
  isAddOrEditMode = () => {
    return this.mode === EDIT_MODE || this.mode === ADD_MODE;
  };

  /**
   *                                        CUSTOM VALIDATORS
   **************************************************************************************************
   */
  //allow the edition do be done with new inputs data
  canEdit = (group: FormGroup): { [s: string]: boolean } => {
    const anyChangesAppend = (): boolean => {
      return (
        group.value['firstName'] !== this.client.firstName ||
        group.value['lastName'] !== this.client.lastName ||
        group.value['email'] !== this.client.email ||
        +group.value['regionId'] !== this.client.region.id
      );
    };
    // console.log(anyChangesAppend());
    let checked = null;

    if (this.isEditMode() && !anyChangesAppend()) {
      checked = { cannotEdit: true };
    } else if (this.isEditMode() && anyChangesAppend()) {
      checked = null;
    }
    // console.log(`RETURN ===`, checked);
    return checked;
  };

  noWhitespaceValidator = (control: FormControl): { [s: string]: boolean } => {
    const trimedValue = (control.value || '').trim();
    const isValid = trimedValue === control.value || trimedValue.length > 3;
    return isValid ? null : { isWhitespace: true };
  };
  trimValidator = (control: FormControl): { [s: string]: boolean } => {
    const trimedValue = (control.value || '').trim();
    const isValid = trimedValue === control.value;
    return isValid ? null : { isWhitespace: true };
  };

  // forbiddenEmails(control: FormControl): Promise<any> | Observable<any> {
  //   const promise = new Promise<any>((resolve, rejects) => {

  //   })
  // }
}
