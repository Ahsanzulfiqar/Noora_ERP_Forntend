import PageTItle from '@/components/PageTItle';
import { getProductById } from '@/helpers/data';
import { useEffect, useState } from 'react';
import { Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import ItemDetails from './components/ItemDetails';
import Step from './components/Step';
import { useGetPurchaseByIdQuery } from '../../../../services/endpoints/purchases';
const ProductDetailsPage = () => {
  const { purchaseId } = useParams();

  const { data: purchaseData, isLoading: isLoadingPurchase } = useGetPurchaseByIdQuery(purchaseId, {
    skip: !purchaseId,
    refetchOnMountOrArgChange: true
  });
  console.log('purchaseData', purchaseData);
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
  return <>
    <PageTItle title="Purchase Details" />
    <Row>
      <ItemDetails purchaseData={purchaseData} isLoading={isLoadingPurchase}/>
    </Row>
  </>;
};
export default ProductDetailsPage;