import PageTItle from '@/components/PageTItle'
import { Col, Row } from 'react-bootstrap'
import LedgerTable from './Components/LedgerTable'

const LedgerPage = () => {
    return (
        <>
            <PageTItle title="Account Ledger" />
            <Row>
                <Col xl={12}>
                    <LedgerTable />
                </Col>
            </Row>
        </>
    )
}

export default LedgerPage
