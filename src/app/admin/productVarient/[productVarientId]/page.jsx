import PageTItle from '@/components/PageTItle';
import { useParams } from 'react-router-dom';
import { useGetVariantByIdQuery } from '@/services/authenticateendpoint/productvariant';
import ProductDetails from './components/ProductDetails';

const ProductDetailsPage = () => {
  const { productvarientId } = useParams();
  const { data: variant, isLoading } = useGetVariantByIdQuery(productvarientId, {
    skip: !productvarientId,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <PageTItle title="Product Variant Details" />
      <ProductDetails variant={variant} productvarientId={productvarientId} />
    </>
  );
};
export default ProductDetailsPage;