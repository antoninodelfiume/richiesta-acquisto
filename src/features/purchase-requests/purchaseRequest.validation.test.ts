import { toPurchaseRequestPayload } from './purchaseRequest.service';
import {
  parsePurchaseRequestAmount,
  validateField,
  validatePurchaseRequest,
} from './purchaseRequest.validation';
import type { PurchaseRequestValues } from './purchaseRequest.types';

const validValues: PurchaseRequestValues = {
  title: 'Notebook per nuova postazione',
  category: 'hardware',
  costCenter: 'CC-1234',
  amount: '1499,90',
  neededBy: '2027-06-30',
  justification: '',
};

describe('schema di validazione della richiesta', () => {
  it('segnala tutti i campi obbligatori vuoti', () => {
    const errors = validatePurchaseRequest({
      title: '',
      category: '',
      costCenter: '',
      amount: '',
      neededBy: '',
      justification: '',
    });

    expect(errors.title).not.toBe('');
    expect(errors.category).not.toBe('');
    expect(errors.costCenter).not.toBe('');
    expect(errors.amount).not.toBe('');
    expect(errors.neededBy).not.toBe('');
    expect(errors.justification).toBe('');
  });

  it('controlla lunghezza del titolo e categoria ammessa', () => {
    expect(
      validateField('title', { ...validValues, title: '12345' }),
    ).toBe('');
    expect(
      validateField('title', { ...validValues, title: 'x'.repeat(80) }),
    ).toBe('');
    expect(validateField('title', { ...validValues, title: 'Pc' })).toMatch(
      /almeno 5/,
    );
    expect(
      validateField('title', { ...validValues, title: 'A   B' }),
    ).toMatch(/almeno 5/);
    expect(
      validateField('title', { ...validValues, title: 'x'.repeat(81) }),
    ).toMatch(/massimo 80/);
    expect(
      validateField('category', {
        ...validValues,
        category: 'consulenza' as PurchaseRequestValues['category'],
      }),
    ).toMatch(/categoria/);
  });

  it('accetta il centro di costo anche in minuscolo e rifiuta altri formati', () => {
    expect(
      validateField('costCenter', { ...validValues, costCenter: 'cc-9876' }),
    ).toBe('');
    expect(
      validateField('costCenter', { ...validValues, costCenter: '9876' }),
    ).toMatch(/CC-1234/);
  });

  it('accetta virgola o punto e richiede un importo positivo', () => {
    expect(parsePurchaseRequestAmount('125,50')).toBe(125.5);
    expect(parsePurchaseRequestAmount('125.50')).toBe(125.5);
    expect(validateField('amount', { ...validValues, amount: '0' })).toMatch(
      /maggiore di 0/,
    );
    expect(
      validateField('amount', { ...validValues, amount: '12,345' }),
    ).toMatch(/massimo due decimali/);
    expect(
      validateField('amount', { ...validValues, amount: '-10' }),
    ).not.toBe('');
  });

  it('richiede una data ISO che esista nel calendario', () => {
    expect(
      validateField('neededBy', { ...validValues, neededBy: '2027-02-29' }),
    ).toMatch(/data valida/);
    expect(
      validateField('neededBy', { ...validValues, neededBy: '2028-02-29' }),
    ).toBe('');
  });

  it('rende obbligatoria una motivazione di 20 caratteri sopra 5.000 euro', () => {
    expect(
      validateField('justification', {
        ...validValues,
        amount: '5000',
        justification: '',
      }),
    ).toBe('');
    expect(
      validateField('justification', {
        ...validValues,
        amount: '5000,01',
        justification: 'x'.repeat(19),
      }),
    ).toMatch(/almeno 20/);
    expect(
      validateField('justification', {
        ...validValues,
        amount: '5000,01',
        justification: 'A         B         C',
      }),
    ).toMatch(/almeno 20/);
    expect(
      validateField('justification', {
        ...validValues,
        amount: '5000,01',
        justification: 'x'.repeat(20),
      }),
    ).toBe('');
    expect(
      validateField('justification', {
        ...validValues,
        justification: 'x'.repeat(500),
      }),
    ).toBe('');
    expect(
      validateField('justification', {
        ...validValues,
        justification: 'x'.repeat(501),
      }),
    ).toMatch(/massimo 500/);
  });

  it('normalizza il payload solo dopo la validazione', () => {
    expect(
      toPurchaseRequestPayload({
        ...validValues,
        title: '  Notebook   per team  ',
        costCenter: ' cc-1234 ',
        justification: '  Nuova   postazione  ',
      }),
    ).toEqual({
      title: 'Notebook per team',
      category: 'hardware',
      costCenter: 'CC-1234',
      amount: 1499.9,
      neededBy: '2027-06-30',
      justification: 'Nuova postazione',
    });
  });

  it('rifiuta un payload con categoria o importo non convertibili', () => {
    expect(() =>
      toPurchaseRequestPayload({ ...validValues, category: '' }),
    ).toThrow(/validati/);
    expect(() =>
      toPurchaseRequestPayload({ ...validValues, amount: 'non valido' }),
    ).toThrow(/validati/);
  });
});
