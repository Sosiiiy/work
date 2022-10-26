import { Component, OnInit } from '@angular/core';
import { ClientSidebar } from './routes/client-routes.enum';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  sidebarList = [...ClientSidebar];

  constructor() {}

  ngOnInit(): void {}
}
