import {
  normalizePurchaseRequestText,
  parsePurchaseRequestAmount,
} from './purchaseRequest.validation';
import type {
  PurchaseRequestPayload,
  PurchaseRequestReceipt,
  PurchaseRequestValues,
} from './purchaseRequest.types';

export interface PurchaseRequestService {
  submit(payload: PurchaseRequestPayload): Promise<PurchaseRequestReceipt>;
}
export interface PurchaseRequestService {
  submit(
    payload: PurchaseRequestPayload,
  ): Promise<PurchaseRequestReceipt>;
}

export function toPurchaseRequestPayload(
  values: PurchaseRequestValues,
): PurchaseRequestPayload {
  const amount = parsePurchaseRequestAmount(values.amount);

  if (values.category === '' || amount === null) {
    throw new Error(
      'I valori devono essere validati prima di creare il payload.',
    );
  }

  return {
    title: normalizePurchaseRequestText(values.title),
    category: values.category,
    costCenter: values.costCenter.trim().toUpperCase(),
    amount,
    neededBy: values.neededBy,
    justification: normalizePurchaseRequestText(values.justification),
  };
}

type SimulatedServiceOptions = {
  delayMs?: number;
  failFirst?: boolean;
};

export function createSimulatedPurchaseRequestService({
  delayMs = 700,
  failFirst = false,
}: SimulatedServiceOptions = {}): PurchaseRequestService {
  let shouldFail = failFirst;
  let nextRequestNumber = 1042;

  return {
    async submit() {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, delayMs);
      });

      if (shouldFail) {
        shouldFail = false;
        throw new Error('Servizio temporaneamente non disponibile.');
      }

      const requestId =
        'REQ-' + String(nextRequestNumber).padStart(4, '0');
      nextRequestNumber += 1;
      return { requestId };
    },
  };
}
