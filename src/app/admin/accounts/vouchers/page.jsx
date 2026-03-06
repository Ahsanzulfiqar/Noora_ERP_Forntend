import PageTItle from '@/components/PageTItle'
import { Col, Row } from 'react-bootstrap'
import VoucherListTable from './Components/VoucherListTable'

const VouchersListPage = () => {
    return (
        <>
            <PageTItle title="Vouchers List" />
            <Row>
                <Col xl={12}>
                    <VoucherListTable />
                </Col>
            </Row>
        </>
    )
}

export default VouchersListPage
