import PageTItle from '@/components/PageTItle'
import { Col, Row } from 'react-bootstrap'
import TrialBalanceTable from './Components/TrialBalanceTable'

const TrialBalancePage = () => {
    return (
        <>
            <PageTItle title="Trial Balance" />
            <Row>
                <Col xl={12}>
                    <TrialBalanceTable />
                </Col>
            </Row>
        </>
    )
}

export default TrialBalancePage
