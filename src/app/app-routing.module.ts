import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientsComponent } from './clients/clients.component';
import { CoursesComponent } from './courses/courses.component';

const routes: Routes = [
  {
    path: 'clients',
    // component: ClientsComponent,
    loadChildren: () => import('./clients/clients.module').then(m => m.ClientsModule)
  },
  {
    path: 'courses',
    // component: CoursesComponent,
    loadChildren: () => import('./courses/courses.module').then(m => m.CoursesModule)
  },
  {
    path: '',
    redirectTo: 'clients',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //, {enableTracing: true}
  exports: [RouterModule],
})
export class AppRoutingModule {}
