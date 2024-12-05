import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Allergen } from 'src/@types/order-arena-user-portal/Allergen';
import { Food } from 'src/@types/order-arena-user-portal/Food';
import { CmTranslateModule } from 'src/app/pipes/cm-translate/cm-translate.module';

@Component({
  standalone: true,
  imports: [CommonModule, CmTranslateModule],
  selector: 'app-allergens-list',
  templateUrl: './allergens-list.component.html',
  styleUrls: ['./allergens-list.component.scss'],
})
export class AllergensListComponent {
  allergens: Allergen[] = [];
  list: string;

  @Input() set food(food: Food) {
    this.collectFromFood(food);
    this.list = this.allergens
      .reduce((acc, { name }) => {
        if (!acc.includes(name)) {
          acc.push(name);
        }
        return acc;
      }, [])
      .join(', ');
  }

  private collectAllergens(food: Food) {
    this.pushAllergens(food.allergens);
    if ((food as Food).childFoodRelations) {
      ((food as Food).childFoodRelations || []).forEach((child) => {
        this.collectFromFood(child.childFood);
      });
    }
  }

  private collectFromFood(food: Food) {
    this.collectAllergens(food);
  }

  private pushAllergens(source: Allergen[] | undefined) {
    if (source === undefined || source == null) {
      return;
    }
    source.forEach((allergen: Allergen) => {
      this.allergens.push(allergen);
    });
  }
}
