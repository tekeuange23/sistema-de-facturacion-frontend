import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CoursesComponent } from './courses/courses.component';
import { CoursesModule } from './courses/courses.module';
import { ClientsModule } from './clients/clients.module';
import { ClientsComponent } from './clients/clients.component';

import { registerLocaleData } from "@angular/common";
import localeEN from "@angular/common/locales/en";
import { PaginatorComponent } from './components/paginator/paginator.component'

registerLocaleData(localeEN, 'en');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClientsComponent,
    CoursesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,

    ClientsModule,
    CoursesModule,
    AppRoutingModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US'}],
  bootstrap: [AppComponent],
})
export class AppModule {}
