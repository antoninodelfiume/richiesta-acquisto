# Richiesta di acquisto: starter

Lo starter fornisce tema Material UI, header, form landmark, sezioni e confini
della feature. I campi e i comportamenti verranno aggiunti seguendo il
[brief del Modulo 4](../../documentazione/brief-modulo-4.md).

## Avvio

```bash
nvm use
npm ci
npm run dev
```

All'avvio devi vedere:

- l'header `Nuova richiesta di acquisto`;
- un solo contenitore `Paper`;
- le sezioni dati, budget e motivazione;
- due azioni disabilitate;
- nessuna chiamata di rete.

Prima di iniziare esegui:

```bash
npm run check
```

Il comando esegue lint, test e build. Ripetilo dopo ogni TODO.

## Percorso

1. Contratti e valori iniziali.
2. Titolo e categoria controllati.
3. Form Material UI completo.
4. Schema di validazione manuale.
5. Touched state e correzioni.
6. Errori accessibili e focus.
7. Payload e servizio.
8. Submit sicuro.
9. Errore, successo e reset.
10. Test e code review.

I segnaposto `TODO 01` fino a `TODO 10` sono distribuiti nei file coinvolti.
La soluzione completa si trova in
[`progetto4/soluzione/richiesta-acquisto`](../../soluzione/richiesta-acquisto/README.md).
