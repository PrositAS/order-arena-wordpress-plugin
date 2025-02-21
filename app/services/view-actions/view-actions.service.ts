import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable()
export class ViewActionsService {
  private defaultScrollBehavior: ScrollBehavior = 'smooth';
  private defaultScrollPosition: ScrollLogicalPosition = 'start';

  constructor(@Inject(DOCUMENT) private document: Document) {}

  scrollToIdInPage(id: string, shadowRootId: string = null): void {
    if (id) {
      const shadowRootElement: HTMLElement = shadowRootId ? this.document.getElementById(shadowRootId) : null;
      const mainElement: ShadowRoot | Document =
        shadowRootId && shadowRootElement ? shadowRootElement.shadowRoot : this.document;

      this.scrollToIdInParent(id, mainElement);
    }
  }

  scrollToIdInDialogComponent(id: string, dialogId: string, dialogComponentTag: string): void {
    if (id && dialogId && dialogComponentTag) {
      const dialogElement: HTMLElement = this.document.getElementById(dialogId);

      if (dialogElement) {
        const componentElements: HTMLCollectionOf<Element> =
          dialogElement.getElementsByTagName(dialogComponentTag);

        if (!!componentElements.length) {
          const componentElement: ShadowRoot = componentElements[0].shadowRoot;
          this.scrollToIdInParent(id, componentElement);
        }
      }
    }
  }

  private scrollToIdInParent(id: string, parent: Document | ShadowRoot): void {
    if (id && parent) {
      const element: HTMLElement = parent.getElementById(id);

      if (element) {
        element.scrollIntoView({ behavior: this.defaultScrollBehavior, block: this.defaultScrollPosition });
      }
    }
  }
}
