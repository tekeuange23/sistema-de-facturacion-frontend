import { Injectable } from '@angular/core';
import { DatePipe } from "@angular/common";
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { environment } from 'src/environments/environment';
import { Client, ClientData, Region } from './client.model';
@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private clients: Client[] = null;
  private clientsURI = '/clients';
  private httpHeaders = new HttpHeaders({
    'content-type': 'application/json',
  });

  constructor(private http: HttpClient, private route: Router) {}

  public clientSubject: Subject<Client[]> = new Subject<Client[]>();
  public paginatorSubject: Subject<any> = new Subject<any>();
  emitClientSubject(): void {
    this.clientSubject.next(this.clients);
  }
  emitPaginatorSubject(paginator): void {
    this.paginatorSubject.next(paginator);
  }

  index(page: number): void {
    this.http.get<Client[]>(`${environment.url}${this.clientsURI}/page/${page}`).subscribe(
      (data: any) => {
        this.clients = data.content as Client[];
        this.emitPaginatorSubject(data);

        this.clients.map(client => {
          const datePipe = new DatePipe('en');
          client.lastName = client.lastName.toUpperCase();
          client.updatedAt = datePipe.transform(client.updatedAt, 'fullDate');
          return client;
        });
        this.emitClientSubject();
      },
      (err) => {
        environment.onError(`OnIndexClientsService`, err);
      },
      () => {
        environment.onComplete(
          `OnIndexClientsService`,
          `All clients have been retrieved.`
        );
      }
    );
  }

  show(id: number): Observable<Client> {
    return this.http
      .get<Client>(`${environment.url}${this.clientsURI}/${id}`)
      .pipe(
        catchError((err) => {
          this.route.navigate(['/', 'clients']);
          Swal.fire(`Error to fetch client #${id}`, err.error.message, 'error');
          return throwError(err);
        })
      );
  }

  create(client: Client): Observable<ClientData> {
    return this.http
      .post<ClientData>(`${environment.url}${this.clientsURI}`, client, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((err) => {
          Swal.fire(`An error occurred.`, err.error.message, 'error');
          return throwError(err);
        })
      );
  }

  uploadPhoto(file: File, id): Observable<any | HttpEvent<any>> {
    let formData = new FormData();
    formData.append('photo', file);
    formData.append('id', id);

    const req = new HttpRequest("POST", `${environment.url}${this.clientsURI}/upload`, formData, {
      reportProgress: true
    });

    return this.http
      .request<any>(req)
      .pipe(
        catchError((err) => {
          Swal.fire(`An error occurred.`, err.error.message, 'error');
          return throwError(err);
        })
      );
  }

  update(client: Client): Observable<ClientData> {
    return this.http
      .put<ClientData>(
        `${environment.url}${this.clientsURI}/${client.id}`,
        client,
        { headers: this.httpHeaders }
      )
      .pipe(
        catchError((err) => {
          Swal.fire(`An error occurred.`, err.error.message, 'error');
          return throwError(err);
        })
      );
  }

  delete(id: number): Observable<ClientData> {
    return this.http
      .delete<ClientData>(`${environment.url}${this.clientsURI}/${id}`, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((err) => {
          Swal.fire(`An error occurred.`, err.error.message, 'error');
          return throwError(err);
        })
      );
  }

  getRegions() : Observable<Region[]>{
    return this.http
      .get<Region[]>(`${environment.url}${this.clientsURI}/regions`)
      .pipe(
        catchError((err) => {
          this.route.navigate(['/', 'clients']);
          Swal.fire(`Error to fetch regions`, err.message, 'error');
          return throwError(err);
        })
      );
  }
}
