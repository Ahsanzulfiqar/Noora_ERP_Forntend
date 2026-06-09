import PageTItle from '@/components/PageTItle';
import SellerDetails from './components/SellerDetails';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
// Endpoints
import {
  useGetSellerByIdQuery
} from '@/services/authenticateendpoint/sellers';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
const SellerDetailsPage = () => {
  const { sellerId } = useParams();
  const { data: sellerData, isLoading: isLoadingSeller, error: sellerError, refetch } = useGetSellerByIdQuery(sellerId, { skip: !sellerId });
  useEffect(() => {
    if (sellerError) toast.error(extractApiErrorMessage(sellerError));
  }, [sellerError]);
  return <>
    <PageTItle title="Seller Details" />
    <SellerDetails sellerData={sellerData} isLoadingSeller={isLoadingSeller} />
  </>;
};
export default SellerDetailsPage;