import PageTItle from '@/components/PageTItle'
import { Col, Row } from 'react-bootstrap'
import VoucherForm from './Components/VoucherForm'

const JournalEntryPage = () => {
    return (
        <>
            <PageTItle title="New Journal Voucher" />
            <Row>
                <Col xl={12}>
                    <VoucherForm />
                </Col>
            </Row>
        </>
    )
}

export default JournalEntryPage
