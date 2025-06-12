import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { SaasSettingsService } from '../../services/saas-settings/saas-settings.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TermsComponent implements OnInit {
  terms$: Observable<string>;

  constructor(private settingsService: SaasSettingsService) {}

  ngOnInit() {
    this.terms$ = this.settingsService.getTerms();
  }
}
