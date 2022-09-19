import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from '../clients/index/index.component';
import { CreateComponent } from './3-in-1/create.component';
// import { UploadComponent } from "./upload/upload.component";

const routes: Routes = [
  {
    path: 'clients',
    children: [
      {
        path: ':id',
        component: CreateComponent,
      },
      // {
      //   path: 'upload/:id',
      //   component: UploadComponent,
      // },
      {
        path: 'page/:page',
        component: IndexComponent,
      },
      {
        path: '',
        component: IndexComponent,
      },
    ],
  },
  {
    path: '',
    redirectTo: '/clients',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClientsRoutingModule {}
