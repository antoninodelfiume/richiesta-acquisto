import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import type { PurchaseRequestService } from '../purchaseRequest.service';
import { PurchaseRequestForm } from './PurchaseRequestForm';

type PurchaseRequestPageProps = {
  service: PurchaseRequestService;
};

export function PurchaseRequestPage({ service }: PurchaseRequestPageProps) {
  return (
    <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default' }}>
      <Box component="header" sx={{ bgcolor: '#0B2545', color: '#F8FAFC' }}>
        <Container maxWidth="md" sx={{ py: { xs: 3, sm: 4 } }}>
          <Typography
            component="p"
            variant="overline"
            sx={{ color: '#BFDBFE', fontWeight: 700, letterSpacing: '0.08em' }}
          >
            Operations Italia
          </Typography>
          <Typography component="h1" variant="h1" sx={{ mt: 0.5 }}>
            Nuova richiesta di acquisto
          </Typography>
          <Typography sx={{ mt: 1, maxWidth: 680, color: '#CBD5E1' }}>
            Inserisci i dati necessari alla valutazione amministrativa e
            all'approvazione del budget.
          </Typography>
        </Container>
      </Box>

      <Box component="main">
        <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 } }}>
          <PurchaseRequestForm service={service} />
        </Container>
      </Box>
    </Box>
  );
}
