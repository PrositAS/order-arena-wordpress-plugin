export interface OrderStep {
  title: string;
  description?: string;
  valid: number;
  validate: number;
  accessable?: boolean;
  validators?: (string | string[])[];
  isFinal?: true;
}
