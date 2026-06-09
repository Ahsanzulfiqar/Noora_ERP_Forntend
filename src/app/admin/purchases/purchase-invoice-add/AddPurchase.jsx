// React form with Formik for Purchase
// Reusable FileInput component included

import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form, FieldArray, Field } from 'formik'
import * as Yup from 'yup'
import { Link, useParams } from 'react-router-dom'
import FormikTextField from '@/components/formikfield/FormikTextField'
import FormikDateField from '@/components/formikfield/FormikDateField'
import ChoicesSearchFormInput from '@/components/formikfield/ChoicesSearchFormInput'
import { Box, Divider, IconButton } from '@mui/material'
import { Trash2, Plus, X, Save, Edit } from 'lucide-react'
// import { useCreatePurchaseMutation } from '../../../../../services/endpoints/purchases'
// import { useGetAllWarehousesQuery } from '../../../../../services/authenticateendpoint/warehouse'
// import { useGetAllProductsQuery } from '../../../../../services/authenticateendpoint/product'
// import StatusAlert from '../../../../../components/StatusAlert'
import { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import { useCreatePurchaseMutation, useGetPurchaseByIdQuery, useUpdatePurchaseMutation } from '../../../../services/authenticateendpoint/purchases'
import { useGetAllProductsQuery } from '../../../../services/authenticateendpoint/product'
import { useGetAllWarehousesQuery } from '../../../../services/authenticateendpoint/warehouse'
import { useGetVariantsByProductQuery } from '../../../../services/authenticateendpoint/productvariant'
import StatusAlert from '../../../../components/StatusAlert'
import { toast } from 'react-toastify'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import FormikTextArea from '../../../../components/formikfield/FormikTextArea'
import FormikToggleSwitch from '@/components/formikfield/FormikToggleSwitch'

const AddPurchase = () => {
  const [createPurchase, { isLoading: isCreating, isSuccess: isCreateSuccess, error: createError }] = useCreatePurchaseMutation();
  const [updatePurchase, { isLoading: isUpdating, isSuccess: isUpdateSuccess, error: updateError }] = useUpdatePurchaseMutation();
  const { data: products, error: productsError } = useGetAllProductsQuery();
  const { data: warehouses, error: warehousesError } = useGetAllWarehousesQuery();
  const { purchaseId } = useParams();

  const { data: purchaseData, isLoading: isLoadingPurchase, error: purchaseError } = useGetPurchaseByIdQuery(purchaseId, {
    skip: !purchaseId,
    refetchOnMountOrArgChange: true
  });

  const productOptions = products?.map(p => ({ label: p.name, value: p._id })) || [];
  const warehouseOptions = warehouses?.map(w => ({ label: w.name, value: w._id })) || [];

  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [currentItem, setCurrentItem] = useState({
    product: '',
    variant: '',
    quantity: ''
  });

  // Fetch variants for the selected product
  const { data: productVariants } = useGetVariantsByProductQuery(currentItem.product, {
    skip: !currentItem.product,
  });

  const variantOptions = productVariants?.map(v => ({ label: v.name, value: v._id })) || [];

  useEffect(() => {
    if (currentItem.product && productVariants && productVariants.length === 0) {
      if (currentItem.variant !== null) {
        setCurrentItem(prev => ({ ...prev, variant: null }));
      }
    }
  }, [productVariants, currentItem]);

  useEffect(() => {
    if (productsError) toast.error(extractApiErrorMessage(productsError));
  }, [productsError]);
  useEffect(() => {
    if (warehousesError) toast.error(extractApiErrorMessage(warehousesError));
  }, [warehousesError]);
  useEffect(() => {
    if (purchaseError) toast.error(extractApiErrorMessage(purchaseError));
  }, [purchaseError]);
  useEffect(() => {
    if (createError) toast.error(extractApiErrorMessage(createError));
  }, [createError]);
  useEffect(() => {
    if (updateError) toast.error(extractApiErrorMessage(updateError));
  }, [updateError]);

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
              warehouseId: purchaseData?.warehouse?._id || purchaseData?.warehouse || '',
              purchaseDate: purchaseData?.purchaseDate
                ? new Date(purchaseData.purchaseDate).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0],
              items: purchaseData?.items?.map(item => ({
                product: item.product?._id || item.product || '',
                variant: item.variant || '',
                quantity: item.quantity || ''
              })) || [],
              notes: purchaseData?.notes || '',
            }}
            validationSchema={Yup.object({
              supplierName: Yup.string().required('Required'),
              invoiceNo: Yup.string().required('Required'),
              warehouseId: Yup.string().required('Required'),
              purchaseDate: Yup.string().required('Required'),

              items: Yup.array().of(
                Yup.object({
                  product: Yup.string().required('Required'),
                  quantity: Yup.number().required('Required'),
                }),
              ),
            })}
            onSubmit={async (values, { resetForm }) => {
              try {
                // Format items
                const formattedItems = values.items.map(item => ({
                  product: item.product,
                  variant: item.variant || null,
                  quantity: parseFloat(item.quantity) || 0,
                }));

                // Construct payload
                const payload = {
                  supplierName: values.supplierName,
                  invoiceNo: values.invoiceNo,
                  warehouseId: values.warehouseId,
                  purchaseDate: values.purchaseDate,
                  notes: values.notes || "",
                  items: formattedItems,
                };

                if (purchaseId) {
                  // For Update, explicitly include status
                  await updatePurchase({
                    id: purchaseId,
                    data: { ...payload }
                  }).unwrap();
                } else {
                  // For Create, omitted status (or defaults to draft)
                  await createPurchase(payload).unwrap();
                }
                resetForm();
              } catch (err) {
                console.error('Failed to save purchase:', err);
              }
            }}>
            {({ values, errors }) => {
              console.log('values', values);
              console.log('errors', errors);
              return (
                <Form>
                  <Row className="g-2">
                    <Col lg={3}>
                      <FormikTextField name="supplierName" label="Supplier Name" placeholder="Enter Supplier Name" />
                    </Col>

                    <Col lg={3}>
                      <FormikTextField name="invoiceNo" label="Invoice No" placeholder="Invoice No" />
                    </Col>

                    <Col lg={3}>
                      <Field name="warehouseId">
                        {({ field, form }) => (
                          <ChoicesSearchFormInput
                            label="Warehouse"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="warehouseId"
                            {...field}
                            options={warehouseOptions}
                            onChange={(val) => form.setFieldValue('warehouseId', val)}
                            placeholder="Select Warehouse"
                          />
                        )}
                      </Field>
                    </Col>



                    <Col lg={3}>
                      <FormikDateField name="purchaseDate" label="Purchase Date" />
                    </Col>


                  </Row>

                  {/* ----------------------- */}
                  {/*  ITEMS REPEATER         */}
                  {/* ----------------------- */}
                  <Box sx={{ border: '1px solid #dfdfdfff', borderRadius: '10px', mt: 3 }}>
                    <FieldArray name="items">
                      {({ push, remove, replace }) => (
                        <>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, px: 2, pt: 1 }}>
                            <h5 className="mb-0">Items</h5>
                            <IconButton type="button" onClick={() => setShowAddItemForm(!showAddItemForm)}
                              sx={{
                                backgroundColor: showAddItemForm ? '#ff4d4d' : '#5c7186',
                                borderRadius: '7px',
                                color: '#ffffff',
                                '&:hover': {
                                  backgroundColor: showAddItemForm ? '#ff3333' : '#7b8792ff !important',
                                }
                              }}>
                              {showAddItemForm ? <X size={20} /> : <Plus size={20} strokeWidth={2.50} />}
                            </IconButton>
                          </Box>

                          {showAddItemForm && (
                            <Box sx={{ p: 2, backgroundColor: '#f9f9f9', borderBottom: '1px solid #dfdfdfff' }}>
                              <Row className="g-2">
                                <Col lg={4}>
                                  <label className="form-label fw-bold">Product</label>
                                  <ChoicesSearchFormInput
                                    className="form-control"
                                    id="add-product"
                                    value={currentItem.product}
                                    options={productOptions}
                                    onChange={(val) => {
                                      setCurrentItem({
                                        ...currentItem,
                                        product: val,
                                      });
                                    }}
                                    placeholder="Select Product"
                                  />
                                </Col>
                                <Col lg={4}>
                                  <label className="form-label fw-bold">Variant</label>
                                  {!currentItem.product || (productVariants && productVariants.length > 0) ? (
                                    <ChoicesSearchFormInput
                                      className="form-control"
                                      id="add-variant"
                                      value={currentItem.variant}
                                      options={variantOptions}
                                      onChange={(val) => setCurrentItem({ ...currentItem, variant: val })}
                                      placeholder="Select Variant"
                                    />
                                  ) : (
                                    <input
                                      type="text"
                                      className="form-control"
                                      value="No variant available"
                                      readOnly
                                      disabled
                                    />
                                  )}
                                </Col>
                                <Col lg={4}>
                                  <label className="form-label fw-bold">Quantity</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Qty"
                                    value={currentItem.quantity}
                                    onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                                  />
                                </Col>
                                <Col lg={12} className="text-end mt-2">
                                  {editingIndex !== null && (
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      onClick={() => {
                                        setEditingIndex(null);
                                        setCurrentItem({
                                          product: '',
                                          variant: '',
                                          quantity: ''
                                        });
                                        setShowAddItemForm(false);
                                      }}
                                      sx={{ mr: 1, color: '#5c7186', borderColor: '#5c7186', '&:hover': { borderColor: '#4a5b6d', backgroundColor: '#f0f0f0' } }}
                                    >
                                      Cancel
                                    </Button>
                                  )}
                                  <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => {
                                      if (!currentItem.product || !currentItem.quantity) {
                                        alert("Please fill required fields (Product, Qty)");
                                        return;
                                      }
                                      const newItem = { ...currentItem };

                                      if (editingIndex !== null) {
                                        replace(editingIndex, newItem);
                                        setEditingIndex(null);
                                      } else {
                                        push(newItem);
                                      }

                                      setCurrentItem({
                                        product: '',
                                        variant: '',
                                        quantity: ''
                                      });
                                      setShowAddItemForm(false);
                                    }}
                                    sx={{ backgroundColor: '#5c7186', '&:hover': { backgroundColor: '#4a5b6d' } }}
                                  >
                                    {editingIndex !== null ? 'Update Item' : 'Add Item'}
                                  </Button>
                                </Col>
                              </Row>
                            </Box>
                          )}

                          <Divider />
                          <div className="table-responsive p-2">
                            <table className="table table-borderless align-middle mb-0">
                              <thead>
                                <tr className="bg-light">
                                  <th style={{ width: '40%' }} className="ps-2 py-2">Product</th>
                                  <th style={{ width: '30%' }} className="px-1 py-2">Variant</th>
                                  <th style={{ width: '20%' }} className="px-1 py-2">Qty</th>
                                  <th style={{ width: '10%' }} className="text-center px-2 py-2">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {values.items.length === 0 ? (
                                  <tr>
                                    <td colSpan="4" className="text-center py-4 text-muted">No items added yet.</td>
                                  </tr>
                                ) : (
                                  values.items.map((item, index) => {
                                    const productName = productOptions.find(p => p.value === item.product)?.label || 'Unknown';
                                    return (
                                      <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td className="ps-2 py-2">{productName}</td>
                                        <td className="px-1 py-2">{item.variant ? (variantOptions.find(v => v.value === item.variant)?.label || item.variant) : 'No variant'}</td>
                                        <td className="px-1 py-2">{item.quantity}</td>
                                        <td className="text-center px-1 py-2 d-flex align-items-center">
                                          <IconButton type="button" onClick={() => {
                                            setCurrentItem(item);
                                            setEditingIndex(index);
                                            setShowAddItemForm(true);
                                          }}
                                            sx={{ backgroundColor: '#eef2f6', mr: 1 }}>
                                            <Edit size={17} color="#5c7186" strokeWidth={2} />
                                          </IconButton>
                                          <IconButton type="button" onClick={() => remove(index)}
                                            sx={{ backgroundColor: '#ffdcdcff' }}>
                                            <Trash2 size={15} color="#ff3939ff" strokeWidth={2} />
                                          </IconButton>
                                        </td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </Box>

                  <Row className="mt-3">
                    <Col lg={12}>
                      <FormikTextArea name="notes" label="Notes" placeholder="Write Notes ..." />
                    </Col>
                  </Row>

                  <div className="p-3 bg-light mt-4 rounded">
                    <Row className="justify-content-end g-2">


                      <Col lg={2}>
                        <Link to="/purchases/purchase-list" className="btn btn-primary w-100">
                          Cancel
                        </Link>
                      </Col>
                      <Col lg={2}>
                        <Button type="submit" className="btn btn-outline-secondary w-100" disabled={isCreating || isUpdating}>
                          {isCreating || isUpdating ? 'Saving...' : 'Save'}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    </Col>
  )
}

export default AddPurchase
