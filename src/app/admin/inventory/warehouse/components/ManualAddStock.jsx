import { Card, CardBody, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import FormikTextField from '@/components/formikfield/FormikTextField';
import FormikSelectField from '@/components/formikfield/FormikSelectField';
import FormikDateField from '@/components/formikfield/FormikDateField';
import { useGetAllWarehousesQuery } from '@/services/authenticateendpoint/warehouse';
import { useGetAllProductsQuery } from '@/services/authenticateendpoint/product';
import { useGetVariantsByProductQuery } from '@/services/authenticateendpoint/productvariant';
import { useAddManualStockMutation } from '@/services/authenticateendpoint/stock';
import StatusAlert from '@/components/StatusAlert';

const ManualAddStock = () => {
    const navigate = useNavigate();
    const [addManualStock, { isLoading: isCreating, error: createError, isSuccess: createSuccess }] = useAddManualStockMutation();

    const { data: warehouses } = useGetAllWarehousesQuery();
    const { data: products } = useGetAllProductsQuery();

    const warehouseOptions = warehouses?.map(w => ({ label: w.name, value: w._id })) || [];
    const productOptions = products?.map(p => ({ label: p.name, value: p._id })) || [];

    const initialValues = {
        warehouseId: '',
        productId: '',
        variantId: '',
        quantity: 0,
        batchNo: '',
        expiryDate: '',
        note: ''
    };

    const validationSchema = Yup.object({
        warehouseId: Yup.string().required('Required'),
        productId: Yup.string().required('Required'),
        variantId: Yup.string(),
        quantity: Yup.number().min(1, 'Must be at least 1').required('Required'),
        batchNo: Yup.string().required('Required'),
        expiryDate: Yup.date().required('Required'),
        note: Yup.string()
    });

    return (
        <Col xl={12}>
            <StatusAlert
                isSuccess={createSuccess}
                error={createError}
                message="Inventory added successfully"
                path="/inventory/warehouse"
                redirect={true}
            />
            <Card>
                <CardHeader>
                    <CardTitle as="h4">Add Manual Inventory</CardTitle>
                </CardHeader>
                <CardBody>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            try {
                                const data = {
                                    warehouseId: values.warehouseId,
                                    productId: values.productId,
                                    quantity: values.quantity,
                                    batchNo: values.batchNo,
                                    expiryDate: new Date(values.expiryDate).toISOString(),
                                    note: values.note,
                                    ...(values.variantId && { variantId: values.variantId }),
                                };
                                await addManualStock(data).unwrap();
                            } catch (err) {
                                console.error('Failed to add inventory:', err);
                            }
                        }}
                    >
                        {({ values, setFieldValue }) => (
                            <ManualAddStockForm
                                values={values}
                                setFieldValue={setFieldValue}
                                warehouseOptions={warehouseOptions}
                                productOptions={productOptions}
                                isCreating={isCreating}
                                navigate={navigate}
                            />
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </Col>
    );
};

const ManualAddStockForm = ({
    values,
    setFieldValue,
    warehouseOptions,
    productOptions,
    isCreating,
    navigate
}) => {
    const { data: variants } = useGetVariantsByProductQuery(values.productId, {
        skip: !values.productId
    });
    const variantOptions = variants?.map(v => ({ label: v.name, value: v._id })) || [];

    return (
        <Form>
            <Row className="mb-4">
                <Col md={4}>
                    <FormikSelectField name="warehouseId" label="Warehouse" options={warehouseOptions} />
                </Col>
                <Col md={4}>
                    <FormikSelectField
                        name="productId"
                        label="Product"
                        options={productOptions}
                        onChange={() => setFieldValue('variantId', '')}
                    />
                </Col>
                <Col md={4}>
                    <FormikSelectField
                        name="variantId"
                        label="Variant"
                        options={variantOptions}
                        disabled={!values.productId}
                    />
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={4}>
                    <FormikTextField name="batchNo" label="Batch No" placeholder="Enter Batch No" />
                </Col>
                <Col md={4}>
                    <FormikDateField name="expiryDate" label="Expiry Date" />
                </Col>
                <Col md={4}>
                    <FormikTextField name="quantity" label="Quantity" type="number" />
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={12}>
                    <FormikTextField name="note" label="Note" as="textarea" rows={3} placeholder="Enter any notes..." />
                </Col>
            </Row>

            <div className="p-3 bg-light mt-4 rounded d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={() => navigate('/inventory/warehouse')}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isCreating}>
                    {isCreating ? 'Adding...' : 'Add Inventory'}
                </Button>
            </div>
        </Form>
    );
}

export default ManualAddStock;
