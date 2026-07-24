import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { App } from './App';
import type { PurchaseRequestService } from './features/purchase-requests';
import { appTheme } from './theme';

// TODO 10: sostituisci questi smoke test con test di schema e flussi utente.
describe('Richiesta di acquisto starter', () => {
  it('mostra header, main e form landmark', () => {
    const service: PurchaseRequestService = {
      submit: vi.fn(),
    };

    render(
      <ThemeProvider theme={appTheme}>
        <App service={service} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(
      screen.getByRole('form', { name: 'Richiesta di acquisto' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Dati della richiesta' }),
    ).toBeInTheDocument();
    expect(service.submit).not.toHaveBeenCalled();
  });
});
