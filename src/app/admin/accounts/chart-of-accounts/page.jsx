import PageTItle from '@/components/PageTItle'
import { Col, Row } from 'react-bootstrap'
import AccountList from './Components/AccountList'

const ChartOfAccountsPage = () => {
    return (
        <>
            <PageTItle title="Chart of Accounts" />
            <Row>
                <Col xl={12}>
                    <AccountList />
                </Col>
            </Row>
        </>
    )
}

export default ChartOfAccountsPage
