import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-empty-placeholder',
  templateUrl: './empty-placeholder.component.html',
  styleUrls: ['./empty-placeholder.component.scss'],
})
export class EmptyPlaceholderComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
