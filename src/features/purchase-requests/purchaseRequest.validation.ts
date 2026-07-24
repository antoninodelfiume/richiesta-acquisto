import {
  purchaseRequestFieldOrder,
  type PurchaseRequestErrors,
  type PurchaseRequestField,
  type PurchaseRequestValues,
} from './purchaseRequest.types';

export type PurchaseRequestValidator =
  (values: PurchaseRequestValues) => string;

const allowedCategories = new Set(['hardware', 'software', 'services']);
const amountPattern = /^\d+(?:[.,]\d{1,2})?$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function normalizePurchaseRequestText(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function parsePurchaseRequestAmount(value: string): number | null {
  const normalizedValue = value.trim().replace(',', '.');

  if (!amountPattern.test(normalizedValue)) {
    return null;
  }

  const amount = Number(normalizedValue);
  return Number.isFinite(amount) ? amount : null;
}

function isValidIsoDate(value: string) {
  if (!isoDatePattern.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export const purchaseRequestValidationSchema: Record<
  PurchaseRequestField,
  PurchaseRequestValidator
> = {
  title: ({ title }) => {
    const normalizedTitle = normalizePurchaseRequestText(title);
    if (normalizedTitle.length < 5) return 'Inserisci almeno 5 caratteri.';
    if (normalizedTitle.length > 80) return 'Usa al massimo 80 caratteri.';
    return '';
  },
  category: ({ category }) =>
    allowedCategories.has(category) ? '' : 'Seleziona una categoria.',
  costCenter: ({ costCenter }) =>
    /^CC-\d{4}$/.test(costCenter.trim().toUpperCase())
      ? ''
      : 'Usa il formato CC-1234.',
  amount: ({ amount }) => {
    const parsedAmount = parsePurchaseRequestAmount(amount);
    if (parsedAmount === null) {
      return 'Usa un numero con massimo due decimali.';
    }
    return parsedAmount > 0 ? '' : 'Inserisci un importo maggiore di 0.';
  },
  neededBy: ({ neededBy }) =>
    isValidIsoDate(neededBy) ? '' : 'Inserisci una data valida.',
  justification: (values) => {
    const text = normalizePurchaseRequestText(values.justification);
    const amount = parsePurchaseRequestAmount(values.amount);

    if (text.length > 500) return 'Usa al massimo 500 caratteri.';

    // La regola usa due campi, quindi riceve tutti i valori del form.
    if (amount !== null && amount > 5_000 && text.length < 20) {
      return 'Per importi sopra 5.000 euro inserisci almeno 20 caratteri.';
    }

    return '';
  },
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
  return purchaseRequestFieldOrder.reduce<PurchaseRequestErrors>(
    (errors, field) => {
      errors[field] = validateField(field, values);
      return errors;
    },
    {
      title: '',
      category: '',
      costCenter: '',
      amount: '',
      neededBy: '',
      justification: '',
    },
  );
}