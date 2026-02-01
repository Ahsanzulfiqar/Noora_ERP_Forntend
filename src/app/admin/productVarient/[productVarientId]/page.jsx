import PageTItle from '@/components/PageTItle';
import { Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetVariantByIdQuery } from '@/services/authenticateendpoint/productvariant';
import ItemDetails from './components/ItemDetails';
import ProductDetails from './components/ProductDetails';
import Review from './components/Review';
import Step from './components/Step';

const ProductDetailsPage = () => {
  const { productvarientId } = useParams();
  const { data: variant, isLoading } = useGetVariantByIdQuery(productvarientId, {
    skip: !productvarientId,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <PageTItle title="Product Details" />
      <ProductDetails variant={variant} productvarientId={productvarientId} />
      {/* <Step /> */}
      {/* <Row>
        <ItemDetails variant={variant} />
        <Review />
      </Row> */}
    </>
  );
};
export default ProductDetailsPage;