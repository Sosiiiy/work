import { Component, Input, OnInit, Output, EventEmitter,      NO_ERRORS_SCHEMA } from '@angular/core';
import { ClientOrder } from 'projects/tools/src/public-api';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
 
})
export class OrderCardComponent implements OnInit {
  @Input('data') data!: ClientOrder;
  @Input('showControls') showControls: boolean = false;
  @Output('accept') accept = new EventEmitter();
  @Output('refused') refused = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
