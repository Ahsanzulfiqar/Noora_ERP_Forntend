// React form with Formik for Purchase
// Reusable FileInput component included

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form, FieldArray, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { Link, useParams } from 'react-router-dom'
import FormikTextField from '@/components/formikfield/FormikTextField'
import FormikSelectField from '@/components/formikfield/FormikSelectField'
import FormikDateField from '@/components/formikfield/FormikDateField'
// import { useCreatePurchaseMutation } from '../../../../../services/endpoints/purchases'
// import { useGetAllWarehousesQuery } from '../../../../../services/authenticateendpoint/warehouse'
// import { useGetAllProductsQuery } from '../../../../../services/authenticateendpoint/product'
// import StatusAlert from '../../../../../components/StatusAlert'
import { useEffect } from 'react'
import Button from '@mui/material/Button'
import { useCreatePurchaseMutation, useGetPurchaseByIdQuery, useUpdatePurchaseMutation } from '../../../../services/authenticateendpoint/purchases'
import { useGetAllWarehousesQuery } from '../../../../services/authenticateendpoint/warehouse'
import { useGetAllProductsQuery } from '../../../../services/authenticateendpoint/product'
import StatusAlert from '../../../../components/StatusAlert'

const PurchaseCalculations = () => {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    const items = values.items || [];

    // Calculate SubTotal
    const calculatedSubTotal = items.reduce((acc, item) => {
      return acc + ((parseFloat(item.quantity) || 0) * (parseFloat(item.purchasePrice) || 0));
    }, 0);

    const taxAmount = parseFloat(values.taxAmount) || 0;
    const totalAmount = calculatedSubTotal + taxAmount;

    if (values.subTotal !== calculatedSubTotal) {
      setFieldValue('subTotal', calculatedSubTotal);
    }
    if (values.totalAmount !== totalAmount) {
      setFieldValue('totalAmount', totalAmount);
    }

  }, [values.items, values.taxAmount, setFieldValue, values.subTotal, values.totalAmount]);

  return null;
};

const AddPurchase = () => {
  const [createPurchase, { isLoading: isCreating, isSuccess: isCreateSuccess, error: createError }] = useCreatePurchaseMutation();
  const [updatePurchase, { isLoading: isUpdating, isSuccess: isUpdateSuccess, error: updateError }] = useUpdatePurchaseMutation();
  const { data: warehouses } = useGetAllWarehousesQuery();
  const { data: products } = useGetAllProductsQuery();
  const { purchaseId } = useParams();

  const { data: purchaseData, isLoading: isLoadingPurchase } = useGetPurchaseByIdQuery(purchaseId, {
    skip: !purchaseId,
    refetchOnMountOrArgChange: true
  });

  const warehouseOptions = warehouses?.map(w => ({ label: w.name, value: w._id })) || [];
  const productOptions = products?.map(p => ({ label: p.name, value: p._id })) || [];

  return (
    <Col xl={12} lg={12}>
      <StatusAlert
        isSuccess={isCreateSuccess || isUpdateSuccess}
        error={createError || updateError}
        message={isCreateSuccess ? "Purchase created successfully" : "Purchase updated successfully"}
        path="/purchases/purchase-list"
        redirect={true}
      />
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Purchase Information</CardTitle>
        </CardHeader>

        <CardBody>
          <Formik
            enableReinitialize={true}
            initialValues={{
              supplierName: purchaseData?.supplierName || '',
              invoiceNo: purchaseData?.invoiceNo || '',
              warehouse: purchaseData?.warehouse?._id || purchaseData?.warehouse || '',
              purchaseDate: purchaseData?.purchaseDate ? new Date(purchaseData.purchaseDate).toISOString().split('T')[0] : '',
              status: purchaseData?.status || '',
              items: purchaseData?.items?.map(item => ({
                product: item.product?._id || item.product || '',
                quantity: item.quantity || '',
                purchasePrice: item.purchasePrice || '',
                lineTotal: item.lineTotal || 0,
                batchNo: item.batchNo || '',
                expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : '',
                sku: item.sku || '',
                variant: item.variant || ''
              })) || [
                  {
                    product: '',
                    quantity: '',
                    purchasePrice: '',
                    lineTotal: 0,
                    batchNo: '',
                    expiryDate: '',
                    sku: '',
                    variant: ''
                  },
                ],
              subTotal: purchaseData?.subTotal || 0,
              taxAmount: purchaseData?.taxAmount || 0,
              totalAmount: purchaseData?.totalAmount || 0,
              notes: purchaseData?.notes || '',
              postedToStock: purchaseData?.postedToStock || 'no',
            }}
            validationSchema={Yup.object({
              supplierName: Yup.string().required('Required'),
              invoiceNo: Yup.string().required('Required'),
              warehouse: Yup.string().required('Required'),
              purchaseDate: Yup.string().required('Required'),
              status: Yup.string().required('Required'),

              items: Yup.array().of(
                Yup.object({
                  product: Yup.string().required('Required'),
                  quantity: Yup.number().required('Required'),
                  purchasePrice: Yup.number().required('Required'),
                }),
              ),

              subTotal: Yup.number(),
              taxAmount: Yup.number().required('Required'),
              totalAmount: Yup.number(),
              postedToStock: Yup.string().required('Required'),
            })}
            onSubmit={async (values, { resetForm }) => {
              try {
                // Create a map of products for easy lookup
                const productMap = (products || []).reduce((acc, p) => {
                  acc[p._id] = p;
                  return acc;
                }, {});

                // Format items
                const formattedItems = values.items.map(item => {
                  const productDetails = productMap[item.product] || {};
                  return {
                    product: item.product,
                    productName: productDetails.name || "Unknown Product",
                    variant: item.variant || "Default",
                    variantName: item.variant || "Default",
                    sku: item.sku || productDetails.sku || "N/A",
                    quantity: parseFloat(item.quantity) || 0,
                    purchasePrice: parseFloat(item.purchasePrice) || 0,
                    batchNo: item.batchNo || "",
                    expiryDate: item.expiryDate || "",
                  };
                });

                // Construct strict payload based on errors
                const payload = {
                  supplierName: values.supplierName,
                  invoiceNo: values.invoiceNo,
                  warehouseId: values.warehouse,
                  purchaseDate: values.purchaseDate,
                  taxAmount: parseFloat(values.taxAmount) || 0,
                  notes: values.notes || "",
                  items: formattedItems
                };

                if (purchaseId) {
                  await updatePurchase({ id: purchaseId, data: payload }).unwrap();
                } else {
                  await createPurchase(payload).unwrap();
                }
                resetForm();
              } catch (err) {
                console.error('Failed to create purchase:', err);
              }
            }}>
            {({ values }) => (
              <Form>
                <PurchaseCalculations />
                <Row>
                  <Col lg={6}>
                    <FormikTextField name="supplierName" label="Supplier Name" placeholder="Enter Supplier Name" />
                  </Col>

                  <Col lg={6}>
                    <FormikTextField name="invoiceNo" label="Invoice No" placeholder="Invoice No" />
                  </Col>

                  <Col lg={6}>
                    <FormikSelectField name="warehouse" label="Warehouse" options={warehouseOptions} />
                  </Col>

                  <Col lg={6}>
                    <FormikDateField name="purchaseDate" label="Purchase Date" />
                  </Col>

                  <Col lg={6}>
                    <FormikSelectField
                      name="status"
                      label="Status"
                      options={[
                        { label: 'Pending', value: 'Pending' },
                        { label: 'Ordered', value: 'Ordered' },
                        { label: 'Received', value: 'Received' },
                      ]}
                    />
                  </Col>
                </Row>

                {/* ----------------------- */}
                {/*  ITEMS REPEATER         */}
                {/* ----------------------- */}
                <div className="mt-4 p-3 bg-light rounded">
                  <h5>Items</h5>

                  <FieldArray name="items">
                    {({ push, remove }) => (
                      <>
                        {values.items.map((item, index) => (
                          <Row key={index} className="g-3 mt-1 align-items-end">
                            <Col lg={3}>
                              <FormikSelectField name={`items[${index}].product`} label="Product" options={productOptions} />
                            </Col>

                            <Col lg={3}>
                              <FormikTextField type="text" name={`items[${index}].variant`} label="Variant" placeholder="Variant" />
                            </Col>

                            <Col lg={2}>
                              <FormikTextField type="text" name={`items[${index}].sku`} label="SKU" placeholder="SKU" />
                            </Col>

                            <Col lg={2}>
                              <FormikTextField type="number" name={`items[${index}].quantity`} label="Quantity" placeholder="Qty" />
                            </Col>

                            <Col lg={2}>
                              <FormikTextField type="number" name={`items[${index}].purchasePrice`} label="Purchase Price" placeholder="Price" />
                            </Col>

                            <Col lg={3}>
                              <FormikTextField type="text" name={`items[${index}].batchNo`} label="Batch NO." placeholder="Batch No" />
                            </Col>

                            <Col lg={3}>
                              <FormikTextField type="date" name={`items[${index}].expiryDate`} label="Expiry date" placeholder="Enter Expiry date" />
                            </Col>

                            <Col lg={1}>
                              <label className="d-block">&nbsp;</label>
                              <button type="button" className="btn btn-danger btn-sm w-100" onClick={() => remove(index)}>
                                X
                              </button>
                            </Col>
                          </Row>
                        ))}

                        <button
                          type="button"
                          className="btn btn-secondary mt-3"
                          onClick={() => push({ product: '', quantity: '', purchasePrice: '', lineTotal: 0, batchNo: '', expiryDate: '', sku: '', variant: '' })}>
                          + Add Item
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>

                <Row className="mt-3">
                  <Col lg={4}>
                    <FormikTextField type="number" name="taxAmount" label="Tax Amount" />
                  </Col>

                  <Col lg={4}>
                    <FormikTextField type="number" name="subTotal" label="Sub Total" disabled />
                  </Col>

                  <Col lg={4}>
                    <FormikTextField type="number" name="totalAmount" label="Total Amount" disabled />
                  </Col>

                  <Col lg={12}>
                    <FormikTextField type="text" name="notes" label="Notes" />
                  </Col>


                  <Col lg={6}>
                    <FormikSelectField
                      name="postedToStock"
                      label="Posted to Stock"
                      options={[
                        { label: 'Yes', value: 'yes' },
                        { label: 'No', value: 'no' },
                      ]}
                    />
                  </Col>
                </Row>

                <div className="p-3 bg-light mt-4 rounded">
                  <Row className="justify-content-end g-2">
                    <Col lg={2}>
                      <Button type="submit" className="btn btn-outline-secondary w-100" disabled={isCreating || isUpdating}>
                        {isCreating || isUpdating ? 'Saving...' : 'Save'}
                      </Button>
                    </Col>

                    <Col lg={2}>
                      <Link to="/purchases/purchase-list" className="btn btn-primary w-100">
                        Cancel
                      </Link>
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

export default AddPurchase
