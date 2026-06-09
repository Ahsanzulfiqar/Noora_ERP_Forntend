import PageTItle from '@/components/PageTItle';
import SellerDetails from './components/SellerDetails';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
// Endpoints
import {
  useGetSaleByIdQuery
} from '@/services/authenticateendpoint/sales';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
const SalesDetailPage = () => {
  const { salesId } = useParams();
  const { data: saleData, isLoading: isLoadingSale, error: saleError } = useGetSaleByIdQuery(salesId, { skip: !salesId });
  useEffect(() => {
    if (saleError) {
      toast.error(extractApiErrorMessage(saleError));
    }
  }, [saleError]);
  return <>
    <PageTItle title="Sales Detail" />
    <SellerDetails saleData={saleData} isLoadingSale={isLoadingSale} />
  </>;
};
export default SalesDetailPage;