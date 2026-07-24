import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { FormEvent } from 'react';
import type { PurchaseRequestService } from '../purchaseRequest.service';

type PurchaseRequestFormProps = {
  service: PurchaseRequestService;
};

const placeholderSx = {
  mt: 2.5,
  minHeight: 96,
  display: 'grid',
  placeItems: 'center',
  border: '1px dashed',
  borderColor: 'divider',
  borderRadius: 1,
  bgcolor: '#F8FAFC',
  color: 'text.secondary',
  textAlign: 'center',
  px: 2,
};

export function PurchaseRequestForm({ service }: PurchaseRequestFormProps) {
  void service;

  // TODO 02: aggiungi useState, updateValue, titolo e categoria controllati.
  // TODO 03: completa i campi e disponili nella griglia responsive.
  // TODO 05: valida al blur e rivalida i campi touched durante la modifica.
  // TODO 06: collega errori, helper text, ref e focus sul primo errore.
  // TODO 08: implementa il submit asincrono con loading e submitLockRef.
  // TODO 09: gestisci errore, successo, retry e reset.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <Paper
      component="form"
      aria-label="Richiesta di acquisto"
      noValidate
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Typography component="h2" variant="h2">
          Dettagli della richiesta
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75 }}>
          I campi contrassegnati con * sono obbligatori.
        </Typography>
      </Box>

      <Divider />

      <Box
        component="section"
        aria-labelledby="request-data-heading"
        sx={{ p: { xs: 2.5, sm: 4 } }}
      >
        <Typography id="request-data-heading" component="h3" variant="h3">
          Dati della richiesta
        </Typography>
        <Box sx={placeholderSx}>
          Titolo, categoria e centro di costo entreranno nei passaggi 02 e 03.
        </Box>
      </Box>

      <Divider />

      <Box
        component="section"
        aria-labelledby="budget-heading"
        sx={{ p: { xs: 2.5, sm: 4 } }}
      >
        <Typography id="budget-heading" component="h3" variant="h3">
          Budget e tempistiche
        </Typography>
        <Box sx={placeholderSx}>
          Importo e data necessaria entreranno nel passaggio 03.
        </Box>
      </Box>

      <Divider />

      <Box
        component="section"
        aria-labelledby="justification-heading"
        sx={{ p: { xs: 2.5, sm: 4 } }}
      >
        <Typography id="justification-heading" component="h3" variant="h3">
          Motivazione
        </Typography>
        <Box sx={placeholderSx}>
          La motivazione e il suo contatore entreranno nel passaggio 03.
        </Box>
      </Box>

      <Divider />

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ justifyContent: 'flex-end', p: { xs: 2.5, sm: 4 } }}
      >
        <Button type="button" variant="outlined" disabled>
          Azzera
        </Button>
        <Button type="submit" variant="contained" disabled>
          Invia richiesta
        </Button>
      </Stack>
    </Paper>
  );
}
