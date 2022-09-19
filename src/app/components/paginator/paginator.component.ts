import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from "rxjs";

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() paginator: any;
  pagesIndices: any;
  from: number;
  to: number;


  constructor() { }

  ngOnInit(): void {
    this.initPaginator();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let isPaginatorRefreshed = changes['paginator'];

    if(isPaginatorRefreshed.previousValue) {
      this.initPaginator();
    }
  }

  private initPaginator(): void {
    this.from = Math.min(Math.max(1, this.paginator.number - 4), this.paginator.totalPages - 5);
    this.to = Math.max(Math.min(this.paginator.totalPages, this.paginator.number + 4), 6);

    if(this.paginator.totalPages > 5){
      this.pagesIndices = new Array(this.to - this.from + 1).fill(0).map((_, index) => index + this.from);
    }
    else {
      this.pagesIndices = new Array(this.paginator.totalPages).fill(0).map((_, index) => index + 1);
    }
  }
}
