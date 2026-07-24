export type PurchaseCategory = 'hardware' | 'software' | 'services';

export type PurchaseRequestValues = {
  title: string;
  category: PurchaseCategory | '';
  costCenter: string;
  amount: string;
  neededBy: string;
  justification: string;
};

export type PurchaseRequestField = keyof PurchaseRequestValues;

export type PurchaseRequestPayload = {
  title: string;
  category: PurchaseCategory;
  costCenter: string;
  amount: number;
  neededBy: string;
  justification: string;
};

export type PurchaseRequestReceipt = { requestId: string };
export type PurchaseRequestErrors = Record<PurchaseRequestField, string>;
export type PurchaseRequestTouched = Record<PurchaseRequestField, boolean>;

export const purchaseCategories = [
  { value: 'hardware', label: 'Hardware' },
  { value: 'software', label: 'Software' },
  { value: 'services', label: 'Servizi professionali' },
] satisfies ReadonlyArray<{ value: PurchaseCategory; label: string }>;

export const purchaseRequestFieldOrder: PurchaseRequestField[] = [
  'title',
  'category',
  'costCenter',
  'amount',
  'neededBy',
  'justification',
];

export const initialPurchaseRequestValues: PurchaseRequestValues = {
  title: '',
  category: '',
  costCenter: '',
  amount: '',
  neededBy: '',
  justification: '',
};

export const initialPurchaseRequestErrors: PurchaseRequestErrors = {
  title: '',
  category: '',
  costCenter: '',
  amount: '',
  neededBy: '',
  justification: '',
};

export const initialPurchaseRequestTouched: PurchaseRequestTouched = {
  title: false,
  category: false,
  costCenter: false,
  amount: false,
  neededBy: false,
  justification: false,
};