import {
  type PurchaseRequestErrors,
  type PurchaseRequestField,
  type PurchaseRequestValues,
} from './purchaseRequest.types';

export type PurchaseRequestValidator = (values: PurchaseRequestValues) => string;

// TODO 04: sostituisci questi stub con i validator puri dello schema.
export const purchaseRequestValidationSchema: Record<
  PurchaseRequestField,
  PurchaseRequestValidator
> = {
  title: () => '',
  category: () => '',
  costCenter: () => '',
  amount: () => '',
  neededBy: () => '',
  justification: () => '',
};

export function validateField(
  field: PurchaseRequestField,
  values: PurchaseRequestValues,
) {
  return purchaseRequestValidationSchema[field](values);
}

export function validatePurchaseRequest(
  values: PurchaseRequestValues,
): PurchaseRequestErrors {
  return {
    title: validateField('title', values),
    category: validateField('category', values),
    costCenter: validateField('costCenter', values),
    amount: validateField('amount', values),
    neededBy: validateField('neededBy', values),
    justification: validateField('justification', values),
  };
}
