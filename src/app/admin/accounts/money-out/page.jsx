import PageTItle from '@/components/PageTItle'
import { Col, Row } from 'react-bootstrap'
import MoneyTransactionForm from '../components/MoneyTransactionForm'

const MoneyOutPage = () => {
  return (
    <>
      <PageTItle title="Create Money Out" />
      <Row>
        <Col xl={12}>
          <MoneyTransactionForm mode="out" />
        </Col>
      </Row>
    </>
  )
}

export default MoneyOutPage
