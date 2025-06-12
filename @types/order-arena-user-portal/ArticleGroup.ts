import { ArticleInGroup } from './ArticleInGroup';
import { ArticleType } from './ArticleType';
import { ID } from './ID';
import { Syncable } from './Syncable';

export interface ArticleGroup extends Syncable {
  id?: string | number;
  name?: string;
  description?: string;
  position?: number;
  active?: boolean;
  activePeriodStart?: string;
  activePeriodEnd?: string;
  articleGroupId?: ID;
  kind?: ArticleType;
  createdAt?: string;
  updatedAt?: string;
  articles?: ArticleInGroup[];
}

export type ArticleGroupsTreeNode = {
  group: ArticleGroup;
  childGroups: ArticleGroupsTreeNode[];
};

export type ArticleGroupsFlattenedTreeNode = {
  group: ArticleGroup;
  childGroups: ArticleGroup[];
};

export type ArticleGroupsTree = ArticleGroupsTreeNode[];

export type ArticleGroupsFlattenedTree = ArticleGroupsFlattenedTreeNode[];
