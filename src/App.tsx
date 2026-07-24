import {
  createSimulatedPurchaseRequestService,
  PurchaseRequestPage,
  type PurchaseRequestService,
} from './features/purchase-requests';

const defaultPurchaseRequestService = createSimulatedPurchaseRequestService();

type AppProps = {
  service?: PurchaseRequestService;
};

export function App({ service = defaultPurchaseRequestService }: AppProps) {
  return <PurchaseRequestPage service={service} />;
}
