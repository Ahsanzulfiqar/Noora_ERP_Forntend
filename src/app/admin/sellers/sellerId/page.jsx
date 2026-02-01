import PageTItle from '@/components/PageTItle';
import SellerDetails from './components/SellerDetails';
import { useParams } from 'react-router-dom';
// Endpoints
import {
  useGetSellerByIdQuery
} from '@/services/authenticateendpoint/sellers';
const SellerDetailsPage = () => {
  const { sellerId } = useParams();
  const { data: sellerData, isLoading: isLoadingSeller } = useGetSellerByIdQuery(sellerId, { skip: !sellerId });
  console.log(sellerData, isLoadingSeller);
  return <>
    <PageTItle title="Seller Details" />
    <SellerDetails sellerData={sellerData} isLoadingSeller={isLoadingSeller} />
  </>;
};
export default SellerDetailsPage;