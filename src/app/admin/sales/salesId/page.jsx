import PageTItle from '@/components/PageTItle';
import SellerDetails from './components/SellerDetails';
import { useParams } from 'react-router-dom';
// Endpoints
import {
  useGetSaleByIdQuery
} from '@/services/authenticateendpoint/sales';
const SalesDetailPage = () => {
  const { salesId } = useParams();
  const { data: saleData, isLoading: isLoadingSale } = useGetSaleByIdQuery(salesId, { skip: !salesId });
  console.log(saleData, isLoadingSale);
  return <>
    <PageTItle title="Sales Detail" />
    <SellerDetails saleData={saleData} isLoadingSale={isLoadingSale} />
  </>;
};
export default SalesDetailPage;