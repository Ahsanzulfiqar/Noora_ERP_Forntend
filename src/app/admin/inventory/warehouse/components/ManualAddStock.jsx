import { Card, CardBody, CardHeader, CardTitle, Col, Row, Button, Table } from 'react-bootstrap';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import FormikTextField from '@/components/formikfield/FormikTextField';
import FormikSelectField from '@/components/formikfield/FormikSelectField';
import FormikDateField from '@/components/formikfield/FormikDateField';
import { useGetAllWarehousesQuery } from '@/services/endpoints/warehouse';
import { useGetAllProductsQuery } from '@/services/endpoints/product';
import { useGetVariantsByProductQuery } from '@/services/endpoints/productvariant';
import { useCreateWarehouseStockMutation } from '@/services/endpoints/stock';
import StatusAlert from '@/components/StatusAlert';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const ManualAddStock = () => {
    const navigate = useNavigate();
    const [createWarehouseStock, { isLoading: isCreating, error: createError, isSuccess: createSuccess }] = useCreateWarehouseStockMutation();
    const [showBatchForm, setShowBatchForm] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const { data: warehouses } = useGetAllWarehousesQuery();
    const { data: products } = useGetAllProductsQuery();

    const warehouseOptions = warehouses?.map(w => ({ label: w.name, value: w._id })) || [];
    const productOptions = products?.map(p => ({ label: p.name, value: p._id })) || [];

    const initialValues = {
        warehouseId: '',
        productId: '',
        variantId: '',
        quantity: 0,
        reserved: 0,
        reorderLevel: 0,
        batches: []
    };

    const validationSchema = Yup.object({
        warehouseId: Yup.string().required('Required'),
        productId: Yup.string().required('Required'),
        quantity: Yup.number().min(0, 'Must be at least 0').required('Required'),
        reserved: Yup.number().min(0, 'Must be at least 0'),
        reorderLevel: Yup.number().min(0, 'Must be at least 0'),
        batches: Yup.array().of(
            Yup.object({
                batchNo: Yup.string().required('Required'),
                expiryDate: Yup.date().required('Required'),
                quantity: Yup.number().min(0, 'Must be at least 0').required('Required'),
            })
        ).min(1, 'At least one batch is required')
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
                                    variantId: values.variantId || undefined,
                                    quantity: values.quantity,
                                    reserved: values.reserved,
                                    reorderLevel: values.reorderLevel,
                                    batches: values.batches.map(b => ({
                                        batchNo: b.batchNo,
                                        expiryDate: new Date(b.expiryDate).toISOString(),
                                        quantity: b.quantity
                                    }))
                                };
                                await createWarehouseStock(data).unwrap();
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
                                showBatchForm={showBatchForm}
                                setShowBatchForm={setShowBatchForm}
                                editIndex={editIndex}
                                setEditIndex={setEditIndex}
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
    navigate,
    showBatchForm,
    setShowBatchForm,
    editIndex,
    setEditIndex
}) => {
    const { data: variants } = useGetVariantsByProductQuery(values.productId, {
        skip: !values.productId
    });
    const variantOptions = variants?.map(v => ({ label: v.name, value: v._id })) || [];

    const handleToggleForm = () => {
        if (showBatchForm) {
            setEditIndex(null);
        }
        setShowBatchForm(!showBatchForm);
    };

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
                    <FormikTextField name="quantity" label="Total Quantity" type="number" />
                </Col>
                <Col md={4}>
                    <FormikTextField name="reserved" label="Reserved Quantity" type="number" />
                </Col>
                <Col md={4}>
                    <FormikTextField name="reorderLevel" label="Reorder Level" type="number" />
                </Col>
            </Row>

            <div className="mt-4 border rounded">
                <div className="d-flex justify-content-between align-items-center p-2 bg-light-subtle border-bottom">
                    <h5 className="mb-0 ms-2">Items</h5>
                    <Button
                        variant={showBatchForm ? "danger" : "primary"}
                        size="sm"
                        onClick={handleToggleForm}
                        className="rounded"
                    >
                        <IconifyIcon icon={showBatchForm ? "solar:close-circle-broken" : "solar:add-circle-broken"} width={20} height={20} />
                    </Button>
                </div>

                <FieldArray name="batches">
                    {({ push, remove, replace }) => (
                        <div className="p-3">
                            {showBatchForm && (
                                <div className="border rounded p-3 mb-4 bg-light-subtle">
                                    <Formik
                                        initialValues={editIndex !== null ? values.batches[editIndex] : { batchNo: '', expiryDate: '', quantity: 0 }}
                                        enableReinitialize={true}
                                        validationSchema={Yup.object({
                                            batchNo: Yup.string().required('Required'),
                                            expiryDate: Yup.date().required('Required'),
                                            quantity: Yup.number().min(1, 'Must be at least 1').required('Required'),
                                        })}
                                        onSubmit={(batchValues, { resetForm }) => {
                                            if (editIndex !== null) {
                                                replace(editIndex, batchValues);
                                                setEditIndex(null);
                                            } else {
                                                push(batchValues);
                                            }
                                            resetForm();
                                            setShowBatchForm(false);
                                            // Update total quantity
                                            const allBatches = editIndex !== null
                                                ? values.batches.map((b, i) => i === editIndex ? batchValues : b)
                                                : [...values.batches, batchValues];
                                            const newTotal = allBatches.reduce((sum, b) => sum + Number(b.quantity), 0);
                                            setFieldValue('quantity', newTotal);
                                        }}
                                    >
                                        {({ handleSubmit }) => (
                                            <>
                                                <Row className="g-3">
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
                                                <div className="d-flex justify-content-end mt-3">
                                                    <Button variant="secondary" size="sm" onClick={handleSubmit}>
                                                        {editIndex !== null ? 'UPDATE ITEM' : 'ADD ITEM'}
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </Formik>
                                </div>
                            )}

                            <div className="table-responsive">
                                <Table className="table align-middle mb-0 table-hover">
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Batch No</th>
                                            <th>Expiry Date</th>
                                            <th>Qty</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {values.batches.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-muted">No batches added yet.</td>
                                            </tr>
                                        ) : (
                                            values.batches.map((batch, index) => (
                                                <tr key={index}>
                                                    <td>{batch.batchNo}</td>
                                                    <td>{batch.expiryDate}</td>
                                                    <td>{batch.quantity}</td>
                                                    <td className="text-center">
                                                        <div className="d-flex justify-content-center gap-2">
                                                            <Button
                                                                variant="link"
                                                                className="text-primary p-0 shadow-none"
                                                                onClick={() => {
                                                                    setEditIndex(index);
                                                                    setShowBatchForm(true);
                                                                }}
                                                            >
                                                                <IconifyIcon icon="solar:pen-2-broken" width={20} height={20} />
                                                            </Button>
                                                            <Button
                                                                variant="link"
                                                                className="text-danger p-0 shadow-none"
                                                                onClick={() => {
                                                                    remove(index);
                                                                    const newTotal = values.batches.filter((_, i) => i !== index).reduce((sum, b) => sum + Number(b.quantity), 0);
                                                                    setFieldValue('quantity', newTotal);
                                                                }}
                                                            >
                                                                <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" width={20} height={20} />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    )}
                </FieldArray>
            </div>

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
