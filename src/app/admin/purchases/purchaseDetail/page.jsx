import PageTItle from '@/components/PageTItle';
import { getProductById } from '@/helpers/data';
import { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import ItemDetails from './components/ItemDetails';
import Step from './components/Step';
import { useGetPurchaseByIdQuery } from '../../../../services/authenticateendpoint/purchases';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
const ProductDetailsPage = () => {
  const { purchaseId } = useParams();

  const { data: purchaseData, isLoading: isLoadingPurchase, error: purchaseError, refetch: refetchPurchase } = useGetPurchaseByIdQuery(purchaseId, {
    skip: !purchaseId,
    refetchOnMountOrArgChange: true
  });
  const [_product, setProduct] = useState();
  const {
    productId
  } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    ;
    (async () => {
      if (productId) {
        const data = await getProductById(productId);
        if (data) setProduct(data); else navigate('/pages-404');
      }
    })();
  }, []);
  useEffect(() => {
    if (purchaseError) toast.error(extractApiErrorMessage(purchaseError));
  }, [purchaseError]);
  return <>
    <PageTItle title="Purchase Details" />
    <Row>
      <ItemDetails purchaseData={purchaseData} isLoading={isLoadingPurchase}/>
    </Row>
  </>;
};
export default ProductDetailsPage;