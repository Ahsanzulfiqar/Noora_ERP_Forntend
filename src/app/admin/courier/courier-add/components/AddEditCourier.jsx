import { useEffect } from 'react'
import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import FormikTextField from '@/components/formikfield/FormikTextField'
import { useCreateCourierMutation, useGetCourierByIdQuery, useUpdateCourierMutation } from '../../../../../services/authenticateendpoint/courier'
import Button from '@mui/material/Button'
import StatusAlert from '../../../../../components/StatusAlert'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import FormikToggleSwitch from '../../../../../components/formikfield/FormikToggleSwitch'

const AddEditCourier = () => {
    const [createCourier, { isLoading: isCreating, error: createError, isSuccess: createSuccess }] = useCreateCourierMutation()
    const [updateCourier, { isLoading: isUpdating, error: updateError, isSuccess: updateSuccess }] = useUpdateCourierMutation()
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const courierId = searchParams.get('courierId');

    const { data, error: courierError } = useGetCourierByIdQuery(courierId, { skip: !courierId })

    useEffect(() => {
        if (courierError) toast.error(extractApiErrorMessage(courierError));
    }, [courierError]);
    useEffect(() => {
        if (createError) toast.error(extractApiErrorMessage(createError));
    }, [createError]);
    useEffect(() => {
        if (updateError) toast.error(extractApiErrorMessage(updateError));
    }, [updateError]);

    return (
        <Col xl={12} lg={12}>
            <StatusAlert
                isSuccess={createSuccess || updateSuccess}
                error={createError || updateError}
                message={courierId ? "Courier updated successfully" : "Courier created successfully"}
                path="/admin/courier/courier-list"
                redirect={true}
            />
            <Card>
                <CardHeader>
                    <CardTitle as={'h4'}>{courierId ? 'Edit' : 'Add'} Courier Information</CardTitle>
                </CardHeader>

                <CardBody>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            name: data?.name || '',
                            isActive: data?.isActive !== undefined ? data.isActive : true,
                            charges: {
                                baseCharge: data?.charges?.baseCharge || 0,
                                codCharge: data?.charges?.codCharge || 0,
                                returnCharge: data?.charges?.returnCharge || 0,
                            }
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            isActive: Yup.boolean(),
                            charges: Yup.object({
                                baseCharge: Yup.number().min(0, 'Must be positive').required('Required'),
                                codCharge: Yup.number().min(0, 'Must be positive').required('Required'),
                                returnCharge: Yup.number().min(0, 'Must be positive').required('Required'),
                            })
                        })}


                        onSubmit={async (values, { resetForm }) => {
                            try {
                                if (courierId) {
                                    await updateCourier({ id: courierId, data: values }).unwrap()
                                    console.log('Courier updated')
                                } else {
                                    await createCourier(values).unwrap()
                                    resetForm()
                                    console.log('Courier created')
                                }
                                navigate('/admin/courier/courier-list')
                            } catch (err) {
                                console.error('Operation failed:', err)
                            }
                        }}

                    >

                        {({ values, errors, touched, setFieldValue }) => {
                            return (
                                <Form>
                                    <Row>
                                        <Col lg={6}>
                                            <FormikTextField name="name" label="Courier Name" placeholder="Enter Courier Name" />
                                        </Col>
                                        <Col lg={6}>
                                            <FormikToggleSwitch
                                                name="isActive"
                                                label="Active Status"
                                            />
                                        </Col>
                                    </Row>

                                    <Row className="mt-3">
                                        <Col lg={4}>
                                            <FormikTextField
                                                name="charges.baseCharge"
                                                label="Base Charge"
                                                type="number"
                                                placeholder="0.00"
                                            />
                                        </Col>
                                        <Col lg={4}>
                                            <FormikTextField
                                                name="charges.codCharge"
                                                label="COD Charge"
                                                type="number"
                                                placeholder="0.00"
                                            />
                                        </Col>
                                        <Col lg={4}>
                                            <FormikTextField
                                                name="charges.returnCharge"
                                                label="Return Charge"
                                                type="number"
                                                placeholder="0.00"
                                            />
                                        </Col>
                                    </Row>

                                    <div className="p-3 bg-light mt-4 rounded">
                                        <Row className="justify-content-end g-2">
                                            <Col lg={2}>
                                                <Link to="/admin/courier/courier-list" className="btn btn-primary w-100">
                                                    Cancel
                                                </Link>
                                            </Col>
                                            <Col lg={2}>
                                                <Button
                                                    type="submit"
                                                    className="btn btn-outline-secondary w-100"
                                                    disabled={isCreating || isUpdating}
                                                >
                                                    {isCreating || isUpdating ? 'Saving...' : 'Save'}
                                                </Button>

                                            </Col>


                                        </Row>
                                    </div>
                                </Form>
                            )
                        }}
                    </Formik>
                </CardBody>
            </Card>
        </Col >
    )
}

export default AddEditCourier
