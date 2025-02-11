/*
 * Copyright (c) 2019. Prosit A.S.
 */

import { ArticleImageBackgroundModule } from './article-image-background.module';

describe('ArticleImageBackgroundModule', () => {
  let articleImageBackgroundModule: ArticleImageBackgroundModule;

  beforeEach(() => {
    articleImageBackgroundModule = new ArticleImageBackgroundModule();
  });

  it('should create an instance', () => {
    expect(articleImageBackgroundModule).toBeTruthy();
  });
});
