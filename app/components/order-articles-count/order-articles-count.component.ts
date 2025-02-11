import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { ThemePalette } from '@angular/material/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrderArticlesServiceModule } from 'src/app/services/order-articles/order-articles-service.module';
import { OrderArticlesService } from 'src/app/services/order-articles/order-articles.service';

@Component({
  standalone: true,
  imports: [
    // Angular
    CommonModule,

    // Angular Material
    MatBadgeModule,

    // Prosit
    OrderArticlesServiceModule,
  ],
  selector: 'app-order-articles-count',
  templateUrl: './order-articles-count.component.html',
  styleUrls: ['./order-articles-count.component.css'],
})
export class OrderArticlesCountComponent implements OnInit {
  @Input() color: ThemePalette = 'primary';

  constructor(private orderArticlesService: OrderArticlesService) {}

  count$: Observable<number>;

  ngOnInit() {
    this.count$ = this.orderArticlesService.orderArticles.pipe(
      map((orderArticles) => orderArticles?.length ?? 0)
    );
  }
}
