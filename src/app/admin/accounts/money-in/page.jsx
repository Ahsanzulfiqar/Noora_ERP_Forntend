import PageTItle from '@/components/PageTItle'
import { Col, Row } from 'react-bootstrap'
import MoneyTransactionForm from '../components/MoneyTransactionForm'

const MoneyInPage = () => {
  return (
    <>
      <PageTItle title="Create Money In" />
      <Row>
        <Col xl={12}>
          <MoneyTransactionForm mode="in" />
        </Col>
      </Row>
    </>
  )
}

export default MoneyInPage
