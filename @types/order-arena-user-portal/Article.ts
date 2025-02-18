import { ArticleGroup } from './ArticleGroup';
import { Equipment } from './Equipment';
import { Food } from './Food';
import { ID } from './ID';
import { Syncable } from './Syncable';
import { Venue } from './Venue';

export interface Article extends Syncable {
  activeWeb?: boolean;
  activePeriodEnd?: string;
  activePeriodStart?: string;
  articleGroups: ArticleGroup[];
  equipment?: Equipment;
  food?: Food;
  id?: number;
  kind?: string;
  minPersons?: number;
  price: number;
  priceMva: number;
  quantityPerPerson?: number;
  venue?: Venue;
  childArticles?: Article[];
  extraArticle?: boolean;
  images: ArticleImage[];
  vatRate: VatRate;
}

export interface ChildArticle extends Article {
  position: number;
}

export interface ArticleImage {
  id: ID;
  url: string;
}

export interface VatRate {
  id: ID;
  value: number;
}
