import { useEffect, useMemo } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import FormikTextField from '@/components/formikfield/FormikTextField';
import FormikSelectField from '@/components/formikfield/FormikSelectField';
import FormikDateField from '@/components/formikfield/FormikDateField';
import { useGetAllWarehousesQuery } from '@/services/authenticateendpoint/warehouse';
import { useGetAllProductsQuery } from '@/services/authenticateendpoint/product';
import { useGetVariantsByProductQuery } from '@/services/authenticateendpoint/productvariant';
import {
    useUpdateStockWithBatchesMutation,
    useGetWarehouseStockByIdQuery,
} from '@/services/authenticateendpoint/stock';
import StatusAlert from '@/components/StatusAlert';
import LoaderSpinner from '@/components/loaders/LoaderSpinner';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/assets/data/roles';

const emptyBatch = { batchNo: '', expiryDate: '', quantity: 0, unitCost: 0 };

const toDateInputValue = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
};

const ManualUpdateStock = () => {
    const navigate = useNavigate();
    const { inventoryId } = useParams();
    const { role } = useAuth();
    const canEditStock = role === ROLES.ADMIN;

    const {
        data: stockData,
        isLoading: isStockLoading,
        error: stockError,
    } = useGetWarehouseStockByIdQuery(inventoryId, { skip: !inventoryId || !canEditStock });

    const [updateStockWithBatches, { isLoading: isUpdating, error: updateError, isSuccess: updateSuccess }] =
        useUpdateStockWithBatchesMutation();

    const { data: warehouses, error: warehousesError } = useGetAllWarehousesQuery();
    const { data: products, error: productsError } = useGetAllProductsQuery();

    useEffect(() => {
        if (warehousesError) toast.error(extractApiErrorMessage(warehousesError));
    }, [warehousesError]);
    useEffect(() => {
        if (productsError) toast.error(extractApiErrorMessage(productsError));
    }, [productsError]);
    useEffect(() => {
        if (stockError) toast.error(extractApiErrorMessage(stockError));
    }, [stockError]);
    useEffect(() => {
        if (updateError) toast.error(extractApiErrorMessage(updateError));
    }, [updateError]);

    const warehouseOptions = warehouses?.map((w) => ({ label: w.name, value: w._id })) || [];
    const productOptions = products?.map((p) => ({ label: p.name, value: p._id })) || [];

    const initialValues = useMemo(() => ({
        warehouseId: stockData?.warehouse || '',
        productId: stockData?.product || '',
        variantId: stockData?.variant || '',
        note: '',
        batches:
            stockData?.batches && stockData.batches.length > 0
                ? stockData.batches.map((b) => ({
                      batchNo: b.batchNo || '',
                      expiryDate: toDateInputValue(b.expiryDate),
                      quantity: b.quantity ?? 0,
                      unitCost: b.unitCost ?? 0,
                  }))
                : [{ ...emptyBatch }],
    }), [stockData]);

    const validationSchema = Yup.object({
        warehouseId: Yup.string().required('Required'),
        productId: Yup.string().required('Required'),
        variantId: Yup.string(),
        note: Yup.string(),
        batches: Yup.array()
            .of(
                Yup.object({
                    batchNo: Yup.string().required('Required'),
                    expiryDate: Yup.date().required('Required'),
                    quantity: Yup.number().min(0, 'Must be 0 or more').required('Required'),
                    unitCost: Yup.number().min(0, 'Must be 0 or more').required('Required'),
                })
            )
            .min(1, 'At least one batch is required'),
    });

    if (!canEditStock) {
        return <Navigate to="/inventory/warehouse" replace />;
    }

    if (isStockLoading) {
        return (
            <Col xl={12}>
                <Card>
                    <CardBody>
                        <LoaderSpinner show={true} />
                    </CardBody>
                </Card>
            </Col>
        );
    }

    return (
        <Col xl={12}>
            <StatusAlert
                isSuccess={updateSuccess}
                error={updateError}
                message="Inventory updated successfully"
                path="/inventory/warehouse"
                redirect={true}
            />
            <Card>
                <CardHeader>
                    <CardTitle as="h4">Edit Manual Inventory</CardTitle>
                </CardHeader>
                <CardBody>
                    <Formik
                        enableReinitialize
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            try {
                                const data = {
                                    warehouseId: values.warehouseId,
                                    productId: values.productId,
                                    variantId: values.variantId || null,
                                    note: values.note,
                                    batches: values.batches.map((b) => ({
                                        batchNo: b.batchNo,
                                        expiryDate: new Date(b.expiryDate).toISOString(),
                                        quantity: Number(b.quantity),
                                        unitCost: Number(b.unitCost),
                                    })),
                                };
                                await updateStockWithBatches(data).unwrap();
                            } catch (err) {
                                console.error('Failed to update inventory:', err);
                            }
                        }}
                    >
                        {({ values, setFieldValue }) => (
                            <ManualUpdateStockForm
                                values={values}
                                setFieldValue={setFieldValue}
                                warehouseOptions={warehouseOptions}
                                productOptions={productOptions}
                                isUpdating={isUpdating}
                                navigate={navigate}
                            />
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </Col>
    );
};

const ManualUpdateStockForm = ({
    values,
    setFieldValue,
    warehouseOptions,
    productOptions,
    isUpdating,
    navigate,
}) => {
    const { data: variants } = useGetVariantsByProductQuery(values.productId, {
        skip: !values.productId,
    });
    const variantOptions = variants?.map((v) => ({ label: v.name, value: v._id })) || [];

    return (
        <Form>
            <Row className="mb-4">
                <Col md={4}>
                    <FormikSelectField name="warehouseId" label="Warehouse" options={warehouseOptions} isDisabled />
                </Col>
                <Col md={4}>
                    <FormikSelectField
                        name="productId"
                        label="Product"
                        options={productOptions}
                        isDisabled
                        onChange={() => setFieldValue('variantId', '')}
                    />
                </Col>
                <Col md={4}>
                    <FormikSelectField
                        name="variantId"
                        label="Variant"
                        options={variantOptions}
                        isDisabled
                    />
                </Col>
            </Row>

            <Box sx={{ border: '1px solid #dfdfdfff', borderRadius: '10px', mb: 3 }}>
                <FieldArray name="batches">
                    {({ push, remove }) => (
                        <>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingLeft: '16px',
                                    paddingRight: '8px',
                                    paddingY: '8px',
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Batches
                                </Typography>
                                <IconButton
                                    type="button"
                                    onClick={() => push({ ...emptyBatch })}
                                    sx={{
                                        backgroundColor: '#5c7186',
                                        borderRadius: '7px',
                                        '&:hover': {
                                            backgroundColor: '#7b8792ff !important',
                                            '& svg': { stroke: '#ffffffff !important' },
                                        },
                                    }}
                                >
                                    <Plus size={20} color="#ffffff" strokeWidth={2.5} />
                                </IconButton>
                            </Box>
                            <Divider />
                            <Box sx={{ paddingX: '16px', paddingY: '12px' }}>
                                {values.batches.map((_, index) => (
                                    <Grid key={index} container spacing={2} alignItems="flex-start">
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <FormikTextField
                                                name={`batches.${index}.batchNo`}
                                                label="Batch No"
                                                placeholder="BATCH-001"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <FormikDateField
                                                name={`batches.${index}.expiryDate`}
                                                label="Expiry Date"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                                            <FormikTextField
                                                name={`batches.${index}.quantity`}
                                                label="Quantity"
                                                type="number"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                            <FormikTextField
                                                name={`batches.${index}.unitCost`}
                                                label="Unit Cost"
                                                type="number"
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 12, md: 1 }}>
                                            <IconButton
                                                type="button"
                                                onClick={() => remove(index)}
                                                disabled={values.batches.length === 1}
                                                sx={{
                                                    backgroundColor: '#ffdcdcff',
                                                    marginTop: '28px',
                                                    marginLeft: '2px',
                                                }}
                                            >
                                                <Trash2 size={17} color="#ff3939ff" strokeWidth={2} />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                            </Box>
                        </>
                    )}
                </FieldArray>
            </Box>

            <Row className="mb-4">
                <Col md={12}>
                    <FormikTextField
                        name="note"
                        label="Note"
                        as="textarea"
                        rows={3}
                        placeholder="Physical stock correction"
                    />
                </Col>
            </Row>

            <div className="p-3 bg-light mt-4 rounded d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={() => navigate('/inventory/warehouse')}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isUpdating}>
                    {isUpdating ? 'Updating...' : 'Update Inventory'}
                </Button>
            </div>
        </Form>
    );
};

export default ManualUpdateStock;
