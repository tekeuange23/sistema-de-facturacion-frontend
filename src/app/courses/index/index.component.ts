import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  courses: any[] = ['TypeScript', 'JavaScript', 'Java SE', 'C#', 'PHP'];

  constructor() {}

  ngOnInit(): void {}
}
