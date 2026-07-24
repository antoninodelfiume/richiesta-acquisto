import { createSimulatedPurchaseRequestService } from './purchaseRequest.service';
import type { PurchaseRequestPayload } from './purchaseRequest.types';

const payload: PurchaseRequestPayload = {
  title: 'Notebook per nuova postazione',
  category: 'hardware',
  costCenter: 'CC-1234',
  amount: 1499.9,
  neededBy: '2027-06-30',
  justification: '',
};

describe('servizio simulato della richiesta', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('fallisce una sola volta quando failFirst è attivo', async () => {
    vi.useFakeTimers();
    const service = createSimulatedPurchaseRequestService({
      delayMs: 700,
      failFirst: true,
    });

    const firstSubmit = service.submit(payload);
    const firstExpectation = expect(firstSubmit).rejects.toThrow(
      /temporaneamente non disponibile/,
    );
    await vi.runAllTimersAsync();
    await firstExpectation;

    const retry = service.submit(payload);
    const retryExpectation = expect(retry).resolves.toEqual({
      requestId: 'REQ-1042',
    });
    await vi.runAllTimersAsync();
    await retryExpectation;
  });
});
