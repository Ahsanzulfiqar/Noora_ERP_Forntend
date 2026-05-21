import PageTItle from '@/components/PageTItle';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGetVariantByIdQuery } from '@/services/authenticateendpoint/productvariant';
import ProductDetails from './components/ProductDetails';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const ProductDetailsPage = () => {
  const { productvarientId } = useParams();
  const { data: variant, isLoading, error, refetch } = useGetVariantByIdQuery(productvarientId, {
    skip: !productvarientId,
  });

  useEffect(() => {
    if (error) toast.error(extractApiErrorMessage(error));
  }, [error]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <PageTItle title="Product Variant Details" />
      <ProductDetails variant={variant} productvarientId={productvarientId} />
    </>
  );
};
export default ProductDetailsPage;