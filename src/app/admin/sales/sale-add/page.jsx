import PageTItle from '@/components/PageTItle'
import { Row } from 'react-bootstrap'
import SaleAdd from './components/SaleAdd'
const SaleAddPage = () => {
  return (
    <>
      <PageTItle title="Create Sale" />
      <Row>
        <SaleAdd />
      </Row>
    </>
  )
}
export default SaleAddPage
