import type {
  PurchaseRequestPayload,
  PurchaseRequestReceipt,
  PurchaseRequestValues,
} from './purchaseRequest.types';

export interface PurchaseRequestService {
  submit(payload: PurchaseRequestPayload): Promise<PurchaseRequestReceipt>;
}

// TODO 07: normalizza i valori e implementa il servizio simulato iniettabile.
export function toPurchaseRequestPayload(
  values: PurchaseRequestValues,
): PurchaseRequestPayload {
  if (values.category === '') {
    throw new Error('Completa la categoria prima di creare il payload.');
  }

  return {
    ...values,
    category: values.category,
    amount: Number(values.amount),
  };
}

export function createSimulatedPurchaseRequestService(): PurchaseRequestService {
  return {
    async submit() {
      return { requestId: 'REQ-DEMO' };
    },
  };
}
