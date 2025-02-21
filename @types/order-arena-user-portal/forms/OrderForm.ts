import { OrderStep } from '../StepStatus';

export interface OrderFormSteps {
  currentStep: number;
  steps: OrderStep[];
}
