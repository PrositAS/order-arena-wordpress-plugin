export interface Syncable {
  _id?: number;
  _sync?: 'OK' | 'ERROR' | 'DELETING' | 'UPDATING';
}
