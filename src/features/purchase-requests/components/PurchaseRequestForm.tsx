import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { PurchaseRequestService } from "../purchaseRequest.service";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { useState, SubmitEvent, type RefObject, useRef } from "react";
import { parsePurchaseRequestAmount } from "../purchaseRequest.validation";
import { toPurchaseRequestPayload } from "../purchaseRequest.service";

type PurchaseRequestFormProps = {
  service: PurchaseRequestService;
};
type SubmitState =
  | { status: "idle" }
  | { status: "invalid" }
  | { status: "submitting" }
  | { status: "error"; message: string }
  | { status: "success"; requestId: string };

import InputAdornment from "@mui/material/InputAdornment";
import {
  initialPurchaseRequestErrors,
  initialPurchaseRequestTouched,
  initialPurchaseRequestValues,
  purchaseRequestFieldOrder,
  purchaseCategories,
  type PurchaseRequestField,
  type PurchaseRequestTouched,
  type PurchaseRequestValues,
} from "../purchaseRequest.types";
import {
  validateField,
  validatePurchaseRequest,
} from "../purchaseRequest.validation";

const placeholderSx = {
  mt: 2.5,
  minHeight: 96,
  display: "grid",
  placeItems: "center",
  border: "1px dashed",
  borderColor: "divider",
  borderRadius: 1,
  bgcolor: "#F8FAFC",
  color: "text.secondary",
  textAlign: "center",
  px: 2,
};

const fieldGridSx = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(2, minmax(0, 1fr))",
  },
  gap: 2.5,
  mt: 2.5,
};

export function PurchaseRequestForm({ service }: PurchaseRequestFormProps) {
  void service;
  const [errors, setErrors] = useState(initialPurchaseRequestErrors);
  const [touched, setTouched] = useState(initialPurchaseRequestTouched);
  const titleRef = useRef<HTMLInputElement>(null);
  const categoryRef = useRef<HTMLInputElement>(null);
  const costCenterRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const neededByRef = useRef<HTMLInputElement>(null);
  const justificationRef = useRef<HTMLInputElement>(null);
  const fieldRefs: Record<
    PurchaseRequestField,
    RefObject<HTMLInputElement | null>
  > = {
    title: titleRef,
    category: categoryRef,
    costCenter: costCenterRef,
    amount: amountRef,
    neededBy: neededByRef,
    justification: justificationRef,
  };
  const [values, setValues] = useState<PurchaseRequestValues>(
    initialPurchaseRequestValues,
  );
  const allFieldsTouched: PurchaseRequestTouched = {
    title: true,
    category: true,
    costCenter: true,
    amount: true,
    neededBy: true,
    justification: true,
  };

  function updateValue(field: PurchaseRequestField, value: string) {
    const nextValues = { ...values, [field]: value } as PurchaseRequestValues;
    setValues(nextValues);

    if (touched[field] || (field === "amount" && touched.justification)) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        ...(touched[field]
          ? { [field]: validateField(field, nextValues) }
          : {}),
        ...(field === "amount" && touched.justification
          ? { justification: validateField("justification", nextValues) }
          : {}),
      }));
    }
  }

  function handleBlur(field: PurchaseRequestField) {
    setTouched((currentTouched) => ({
      ...currentTouched,
      [field]: true,
    }));
    setErrors((currentErrors) => ({
      ...currentErrors,
      [field]: validateField(field, values),
    }));
  }

  const parsedAmount = parsePurchaseRequestAmount(values.amount);
  const isJustificationRequired = parsedAmount !== null && parsedAmount > 5_000;

  const defaultHelperText: Record<PurchaseRequestField, string> = {
    title: "Da 5 a 80 caratteri.",
    category: "Scegli la tipologia più vicina alla spesa.",
    costCenter: "Formato richiesto: CC-1234.",
    amount: "Usa la virgola o il punto per i centesimi.",
    neededBy: "Indica quando la fornitura deve essere disponibile.",
    justification: "Obbligatoria sopra 5.000 euro.",
  };

  const fieldError = (field: PurchaseRequestField) =>
    touched[field] && errors[field] !== "";

  function helperTextFor(field: PurchaseRequestField) {
    if (fieldError(field)) {
      return errors[field];
    }

    if (field === "justification") {
      return (
        String(values.justification.length) +
        "/500 caratteri. " +
        defaultHelperText.justification
      );
    }

    return defaultHelperText[field];
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    // La ref cambia nello stesso evento, prima che React esegua un nuovo render.
    if (submitLockRef.current) {
      return;
    }

    const nextErrors = validatePurchaseRequest(values);
    setTouched(allFieldsTouched);
    setErrors(nextErrors);

    const firstInvalidField = purchaseRequestFieldOrder.find(
      (field) => nextErrors[field] !== "",
    );

    if (firstInvalidField) {
      setSubmitState({ status: "invalid" });
      fieldRefs[firstInvalidField].current?.focus();
      return;
    }

    submitLockRef.current = true;
    setSubmitState({ status: "submitting" });

    try {
      const payload = toPurchaseRequestPayload(values);
      const receipt = await service.submit(payload);
      setSubmitState({
        status: "success",
        requestId: receipt.requestId,
      });
    } catch {
      setSubmitState({
        status: "error",
        message:
          "Non è stato possibile inviare la richiesta. " +
          "I dati sono ancora disponibili: riprova.",
      });
    } finally {
      submitLockRef.current = false;
    }
  }

  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
  });
  const submitLockRef = useRef(false);
  const isSubmitting = submitState.status === "submitting";
  const isComplete = submitState.status === "success";
  const controlsDisabled = isSubmitting || isComplete;

  // Aggiungi queste righe alla fine di updateValue.
  if (submitState.status === "invalid") {
    setSubmitState({ status: "idle" });
  }

  // TODO 09: gestisci errore, successo, retry e reset.

  return (
    <Paper
      component="form"
      aria-label="Richiesta di acquisto"
      noValidate
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
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
        <Box sx={fieldGridSx}>
          <TextField
            id="purchase-title"
            name="title"
            label="Titolo della richiesta"
            required
            value={values.title}
            onChange={(event) => updateValue("title", event.target.value)}
            onBlur={() => handleBlur("title")}
            sx={{ gridColumn: { md: "1 / -1" } }}
            error={fieldError("title")}
            helperText={helperTextFor("title")}
            inputRef={titleRef}
          />

          <TextField
            id="purchase-category"
            name="category"
            select
            label="Categoria"
            required
            value={values.category}
            onChange={(event) => updateValue("category", event.target.value)}
            onBlur={() => handleBlur("category")}
            error={fieldError("category")}
            helperText={helperTextFor("category")}
            inputRef={titleRef}
            disabled={controlsDisabled}
          >
            {purchaseCategories.map((category) => (
              <MenuItem key={category.value} value={category.value}>
                {category.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            id="purchase-cost-center"
            name="costCenter"
            label="Centro di costo"
            required
            value={values.costCenter}
            onChange={(event) => updateValue("costCenter", event.target.value)}
            autoComplete="off"
            onBlur={() => handleBlur("costCenter")}
            error={fieldError("costCenter")}
            helperText={helperTextFor("costCenter")}
            inputRef={costCenterRef}
            disabled={controlsDisabled}
          />
        </Box>
        <Box sx={fieldGridSx}>
          <TextField
            id="purchase-amount"
            name="amount"
            label="Importo"
            required
            value={values.amount}
            onChange={(event) => updateValue("amount", event.target.value)}
            onBlur={() => handleBlur("amount")}
            error={fieldError("amount")}
            helperText={helperTextFor("amount")}
            inputRef={amountRef}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">€</InputAdornment>
                ),
              },
              htmlInput: { inputMode: "decimal" },
            }}
            disabled={controlsDisabled}
          />

          <TextField
            id="purchase-needed-by"
            name="neededBy"
            label="Data necessaria"
            type="date"
            required
            value={values.neededBy}
            onChange={(event) => updateValue("neededBy", event.target.value)}
            onBlur={() => handleBlur("neededBy")}
            slotProps={{ inputLabel: { shrink: true } }}
            error={fieldError("neededBy")}
            helperText={helperTextFor("neededBy")}
            inputRef={neededByRef}
            disabled={controlsDisabled}
          />
        </Box>
        <TextField
          id="purchase-justification"
          name="justification"
          label="Motivazione della spesa"
          value={values.justification}
          onChange={(event) => updateValue("justification", event.target.value)}
          onBlur={() => handleBlur("justification")}
          multiline
          minRows={4}
          required={isJustificationRequired}
          error={fieldError("justification")}
          helperText={helperTextFor("justification")}
          inputRef={justificationRef}
          sx={{ mt: 2.5 }}
          disabled={controlsDisabled}
        />
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
        direction={{ xs: "column", sm: "row" }}
        spacing={1.5}
        sx={{ justifyContent: "flex-end", p: { xs: 2.5, sm: 4 } }}
      >
        <Button type="button" variant="outlined" disabled>
          Azzera
        </Button>
        <Button
          type="submit"
          variant="contained"
          loading={isSubmitting}
          loadingPosition="center"
        >
          Invia richiesta
        </Button>
      </Stack>
    </Paper>
  );
}
