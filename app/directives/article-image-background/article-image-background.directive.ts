import { Directive, ElementRef, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
import { Article } from 'src/@types/order-arena-user-portal/Article';

@Directive({
  selector: '[appArticleImageBackground]',
})
export class ArticleImageBackgroundDirective implements OnChanges {
  @Input() appArticleImageBackground: Article;

  styleProp = 'background-image';

  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const current = changes.appArticleImageBackground.currentValue;
    if (current && current.images && current.images[0]) {
      this.renderer.setStyle(this.el.nativeElement, this.styleProp, `url("${current.images[0].url}")`);
    } else {
      this.renderer.removeStyle(this.el.nativeElement, this.styleProp);
    }
  }
}
