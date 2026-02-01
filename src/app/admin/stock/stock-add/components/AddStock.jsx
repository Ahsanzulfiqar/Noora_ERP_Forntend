// React form with Formik
// Reusable Components

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import FormikSelectField from '@/components/formikfield/FormikSelectField'
import { usePostToStockMutation } from '../../../../../services/authenticateendpoint/purchases'
import { useGetAllPurchasesQuery } from '../../../../../services/authenticateendpoint/purchases'
import Button from '@mui/material/Button'
import StatusAlert from '../../../../../components/StatusAlert'

const AddStock = () => {
    const [postToStock, { isLoading: isPosting, error: postError, isSuccess: postSuccess }] = usePostToStockMutation()
    const { data: purchases, isLoading: isLoadingPurchases } = useGetAllPurchasesQuery()

    // Filter purchases that haven't been posted to stock yet, if necessary. 
    // For now showing all purchases or maybe we should only show those not posted?
    // The requirement didn't specify, but usually you only post once. 
    // However, for now I will just list them all. 
    // Ideally the backend should handle validation or we filter here.
    // Let's assume we show all for now as per "get this usePostToStockMutation and intgrate".

    const purchaseOptions = purchases?.map(purchase => ({
        label: `${purchase.invoiceNo} - ${purchase.supplierName}`,
        value: purchase._id
    })) || []

    return (
        <Col xl={12} lg={12}>
            <StatusAlert
                isSuccess={postSuccess}
                error={postError}
                message={"Stock posted successfully"}
                path="/post-to-stock"
                redirect={false}
            />
            <Card>
                <CardHeader>
                    <CardTitle as={'h4'}>Post Purchase to Stock</CardTitle>
                </CardHeader>

                <CardBody>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            purchaseId: '',
                        }}
                        validationSchema={Yup.object({
                            purchaseId: Yup.string().required('Required'),
                        })}
                        onSubmit={async (values, { resetForm }) => {
                            try {
                                await postToStock(values.purchaseId).unwrap()
                                console.log('Stock posted')
                                resetForm()
                            } catch (err) {
                                console.error('Post to stock failed:', err)
                            }
                        }}
                    >
                        {({ values }) => (
                            <Form>
                                <Row>
                                    <Col lg={12}>
                                        <FormikSelectField
                                            name="purchaseId"
                                            label="Select Purchase"
                                            options={purchaseOptions}
                                            disabled={isLoadingPurchases}
                                            placeholder={isLoadingPurchases ? "Loading purchases..." : "Select a purchase"}
                                        />
                                    </Col>
                                </Row>

                                <div className="p-3 bg-light mt-4 rounded">
                                    <Row className="justify-content-end g-2">
                                        <Col lg={2}>
                                            <Link to="" className="btn btn-primary w-100">
                                                Cancel
                                            </Link>
                                        </Col>
                                        <Col lg={2}>
                                            <Button
                                                type="submit"
                                                className="btn btn-secondary w-100"
                                                disabled={isPosting || isLoadingPurchases}
                                            >
                                                {isPosting ? 'Posting...' : 'Post to Stock'}
                                            </Button>

                                        </Col>


                                    </Row>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </Col>
    )
}

export default AddStock
