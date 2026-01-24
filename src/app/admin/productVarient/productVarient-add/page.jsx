import PageTItle from '@/components/PageTItle'
import { Row } from 'react-bootstrap'
import AddProductVariant from './components/AddProductVariant'
const ProductAddPage = () => {
  return (
    <>
      <PageTItle title="Create Product Variant" />
      <Row>
        <AddProductVariant />
      </Row>
    </>
  )
}
export default ProductAddPage
