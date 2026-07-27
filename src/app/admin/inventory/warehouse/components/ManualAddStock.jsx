import { useEffect, useMemo } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Button, Spinner } from 'react-bootstrap';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
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
    useAddOpeningStockMutation,
    useGetWarehouseStockByIdQuery,
    useUpdateInventoryMutation,
} from '@/services/authenticateendpoint/stock';
import StatusAlert from '@/components/StatusAlert';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const emptyBatch = { batchNo: '', expiryDate: '', quantity: 0, unitCost: 0 };

const toDateInputValue = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
};

const ManualAddStock = () => {
    const navigate = useNavigate();
    const { inventoryId } = useParams();
    const isEdit = Boolean(inventoryId);

    const [addOpeningStock, { isLoading: isCreating, error: createError, isSuccess: createSuccess }] =
        useAddOpeningStockMutation();
    const [updateInventory, { isLoading: isUpdating, error: updateError, isSuccess: updateSuccess }] =
        useUpdateInventoryMutation();

    const { data: warehouses, error: warehousesError } = useGetAllWarehousesQuery();
    const { data: products, error: productsError } = useGetAllProductsQuery();
    const { data: stockData, isLoading: isLoadingStock, error: stockError } = useGetWarehouseStockByIdQuery(
        inventoryId,
        { skip: !isEdit, refetchOnMountOrArgChange: true },
    );

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
        if (createError) toast.error(extractApiErrorMessage(createError));
    }, [createError]);
    useEffect(() => {
        if (updateError) toast.error(extractApiErrorMessage(updateError));
    }, [updateError]);

    const warehouseOptions = useMemo(
        () => warehouses?.map((w) => ({ label: w.name, value: w._id })) || [],
        [warehouses],
    );
    const productOptions = useMemo(
        () => products?.map((p) => ({ label: p.name, value: p._id })) || [],
        [products],
    );

    const initialValues = useMemo(() => {
        if (isEdit && stockData) {
            const batches = (stockData.batches || []).map((b) => ({
                batchNo: b.batchNo || '',
                expiryDate: toDateInputValue(b.expiryDate),
                quantity: Number(b.quantity ?? 0),
                unitCost: Number(b.unitCost ?? 0),
            }));
            return {
                warehouseId: stockData.warehouse || '',
                productId: stockData.product || '',
                variantId: stockData.variant || '',
                note: '',
                batches: batches.length ? batches : [{ ...emptyBatch }],
            };
        }
        return {
            warehouseId: '',
            productId: '',
            variantId: '',
            note: '',
            batches: [{ ...emptyBatch }],
        };
    }, [isEdit, stockData]);

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
                    quantity: Yup.number()
                        .min(isEdit ? 0 : 1, isEdit ? 'Must be 0 or more' : 'Must be at least 1')
                        .required('Required'),
                    unitCost: Yup.number().min(0, 'Must be 0 or more').required('Required'),
                }),
            )
            .min(1, 'At least one batch is required'),
    });

    if (isEdit && isLoadingStock) {
        return (
            <Col xl={12}>
                <Card>
                    <CardBody className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                    </CardBody>
                </Card>
            </Col>
        );
    }

    if (isEdit && !stockData) {
        return (
            <Col xl={12}>
                <Card>
                    <CardBody>
                        <p className="mb-0">Inventory not found.</p>
                    </CardBody>
                </Card>
            </Col>
        );
    }

    const successPath = isEdit ? `/inventory/warehouse-detail/${inventoryId}` : '/inventory/warehouse';

    return (
        <Col xl={12}>
            <StatusAlert
                isSuccess={isEdit ? updateSuccess : createSuccess}
                error={isEdit ? updateError : createError}
                message={isEdit ? 'Inventory updated successfully' : 'Inventory added successfully'}
                path={successPath}
                redirect={true}
            />
            <Card>
                <CardHeader>
                    <CardTitle as="h4">{isEdit ? 'Update Inventory' : 'Add Manual Inventory'}</CardTitle>
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
                                if (isEdit) {
                                    await updateInventory(data).unwrap();
                                } else {
                                    await addOpeningStock(data).unwrap();
                                }
                            } catch (err) {
                                console.error(
                                    isEdit ? 'Failed to update inventory:' : 'Failed to add inventory:',
                                    err,
                                );
                            }
                        }}
                    >
                        {({ values, setFieldValue }) => (
                            <ManualAddStockForm
                                values={values}
                                setFieldValue={setFieldValue}
                                warehouseOptions={warehouseOptions}
                                productOptions={productOptions}
                                isSubmitting={isEdit ? isUpdating : isCreating}
                                navigate={navigate}
                                isEdit={isEdit}
                                cancelPath={successPath}
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
    isSubmitting,
    navigate,
    isEdit,
    cancelPath,
}) => {
    const { data: variants } = useGetVariantsByProductQuery(values.productId, {
        skip: !values.productId
    });
    const variantOptions = variants?.map(v => ({ label: v.name, value: v._id })) || [];

    return (
        <Form>
            <Row className="mb-4">
                <Col md={4}>
                    <FormikSelectField
                        name="warehouseId"
                        label="Warehouse"
                        options={warehouseOptions}
                        disabled={isEdit}
                    />
                </Col>
                <Col md={4}>
                    <FormikSelectField
                        name="productId"
                        label="Product"
                        options={productOptions}
                        onChange={() => setFieldValue('variantId', '')}
                        disabled={isEdit}
                    />
                </Col>
                <Col md={4}>
                    <FormikSelectField
                        name="variantId"
                        label="Variant"
                        options={variantOptions}
                        disabled={isEdit || !values.productId}
                    />
                </Col>
            </Row>

            <Box sx={{ border: '1px solid #dfdfdfff', borderRadius: '10px', mb: 3 }}>
                <FieldArray name="batches">
                    {({ push, remove }) => (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '16px', paddingRight: '8px', paddingY: '8px' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Batches</Typography>
                                <IconButton
                                    type="button"
                                    onClick={() => push({ ...emptyBatch })}
                                    sx={{
                                        backgroundColor: '#5c7186', borderRadius: '7px',
                                        '&:hover': {
                                            backgroundColor: '#7b8792ff !important',
                                            '& svg': { stroke: '#ffffffff !important' }
                                        }
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
                                                placeholder={isEdit ? 'BATCH-001' : 'OPEN-001'}
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
                                                sx={{ backgroundColor: '#ffdcdcff', marginTop: '28px', marginLeft: '2px' }}
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
                        placeholder={isEdit ? 'Reason for update / stock correction...' : 'Enter any notes...'}
                    />
                </Col>
            </Row>

            <div className="p-3 bg-light mt-4 rounded d-flex justify-content-end gap-2">
                <Button variant="outline-secondary" onClick={() => navigate(cancelPath)}>
                    Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting
                        ? isEdit ? 'Updating...' : 'Adding...'
                        : isEdit ? 'Update Inventory' : 'Add Inventory'}
                </Button>
            </div>
        </Form>
    );
}

export default ManualAddStock;
