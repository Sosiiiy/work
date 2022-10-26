import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ClientRoutesList } from './routes/clients-routes.enum';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  links = [...ClientRoutesList];
  title: BehaviorSubject<string> = CLIENTS_MODULE_TITLE;
  constructor() {}

  ngOnInit(): void {}
}

export let CLIENTS_MODULE_TITLE = new BehaviorSubject<string>(
  'clients.clients'
);
