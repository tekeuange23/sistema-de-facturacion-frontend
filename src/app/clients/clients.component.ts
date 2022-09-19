import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  template: `
    <div class="container">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class ClientsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
