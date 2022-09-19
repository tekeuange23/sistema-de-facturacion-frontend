import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientsRoutingModule } from './clients-routing.module';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './3-in-1/create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatorComponent } from "../components/paginator/paginator.component";
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [IndexComponent, CreateComponent, PaginatorComponent, UploadComponent],
  imports: [CommonModule, ClientsRoutingModule, ReactiveFormsModule],
})
export class ClientsModule {}
