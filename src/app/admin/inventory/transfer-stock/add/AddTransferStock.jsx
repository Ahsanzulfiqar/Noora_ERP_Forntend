import { Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap'
import { Formik, Form, FieldArray, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Link } from 'react-router-dom'
import { Box, Divider, IconButton } from '@mui/material'
import { Trash2, Plus, X, Edit } from 'lucide-react'
import { useState } from 'react'
import Button from '@mui/material/Button'
import FormikTextArea from '@/components/formikfield/FormikTextArea'
import ChoicesSearchFormInput from '@/components/formikfield/ChoicesSearchFormInput'
import StatusAlert from '@/components/StatusAlert'
import { useGetAllWarehousesQuery } from '@/services/authenticateendpoint/warehouse'
import { useGetAllProductsQuery } from '@/services/authenticateendpoint/product'
import { useGetVariantsByProductQuery } from '@/services/authenticateendpoint/productvariant'
import { useCreateStockTransferMutation } from '@/services/authenticateendpoint/stockTransfer'

const AddTransferStock = () => {
  const { data: warehouses } = useGetAllWarehousesQuery()
  const { data: products } = useGetAllProductsQuery()
  const [createStockTransfer, { isLoading: isSaving, isSuccess, error: createError }] =
    useCreateStockTransferMutation()

  const warehouseOptions = warehouses?.map(w => ({ label: w.name, value: w._id })) || []
  const productOptions = products?.map(p => ({ label: p.name, value: p._id })) || []

  const [showAddItemForm, setShowAddItemForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null)
  const [currentItem, setCurrentItem] = useState({
    product: '',
    variant: '',
    quantity: '',
    batchNo: '',
    expiryDate: '',
  })

  const { data: productVariants } = useGetVariantsByProductQuery(currentItem.product, {
    skip: !currentItem.product,
  })
  const variantOptions = productVariants?.map(v => ({ label: v.name, value: v._id })) || []

  return (
    <Col xl={12} lg={12}>
      <StatusAlert
        isSuccess={isSuccess}
        message="Stock transfer created successfully"
        error={createError}
        redirect
        path="/inventory/transfer-stock"
      />
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Transfer Stock</CardTitle>
        </CardHeader>

        <CardBody>
          <Formik
            initialValues={{
              fromWarehouse: '',
              toWarehouse: '',
              items: [],
              note: '',
            }}
            validationSchema={Yup.object({
              fromWarehouse: Yup.string().required('Required'),
              toWarehouse: Yup.string()
                .required('Required')
                .test('not-same', 'Source and destination must differ', function (value) {
                  return value !== this.parent.fromWarehouse
                }),
              items: Yup.array()
                .of(
                  Yup.object({
                    product: Yup.string().required('Required'),
                    quantity: Yup.number().required('Required').min(1, 'Min 1'),
                  })
                )
                .min(1, 'Add at least one item'),
            })}
            onSubmit={async (values) => {
              const payload = {
                fromWarehouse: values.fromWarehouse,
                toWarehouse: values.toWarehouse,
                note: values.note || '',
                items: values.items.map(item => ({
                  product: item.product,
                  variant: item.variant || null,
                  quantity: parseInt(item.quantity, 10) || 0,
                  batchNo: item.batchNo || '',
                  expiryDate: item.expiryDate || null,
                })),
              }
              try {
                await createStockTransfer(payload).unwrap()
              } catch (err) {
                console.error('Failed to create stock transfer:', err)
              }
            }}
          >
            {({ values }) => (
              <Form>
                <Row className="g-2">
                  <Col lg={4}>
                    <Field name="fromWarehouse">
                      {({ field, form }) => (
                        <ChoicesSearchFormInput
                          label="From Warehouse"
                          labelClassName="form-label fw-bold"
                          className="form-control"
                          id="fromWarehouse"
                          {...field}
                          options={warehouseOptions}
                          onChange={(val) => {
                            form.setFieldValue('fromWarehouse', val)
                            form.setFieldTouched('fromWarehouse', true, false)
                          }}
                          placeholder="Select From Warehouse"
                        />
                      )}
                    </Field>
                    <ErrorMessage name="fromWarehouse" component="div" className="text-danger small mt-1" />
                  </Col>

                  <Col lg={4}>
                    <Field name="toWarehouse">
                      {({ field, form }) => (
                        <ChoicesSearchFormInput
                          label="To Warehouse"
                          labelClassName="form-label fw-bold"
                          className="form-control"
                          id="toWarehouse"
                          {...field}
                          options={warehouseOptions}
                          onChange={(val) => {
                            form.setFieldValue('toWarehouse', val)
                            form.setFieldTouched('toWarehouse', true, false)
                          }}
                          placeholder="Select To Warehouse"
                        />
                      )}
                    </Field>
                    <ErrorMessage name="toWarehouse" component="div" className="text-danger small mt-1" />
                  </Col>

                  <Col lg={4}>
                    <label className="form-label fw-bold">Status</label>
                    <input type="text" className="form-control" value="Draft" readOnly disabled />
                  </Col>
                </Row>

                {/* ITEMS */}
                <ErrorMessage
                  name="items"
                  render={(msg) =>
                    typeof msg === 'string' ? (
                      <div className="text-danger small mt-2">{msg}</div>
                    ) : null
                  }
                />
                <Box sx={{ border: '1px solid #dfdfdfff', borderRadius: '10px', mt: 3 }}>
                  <FieldArray name="items">
                    {({ push, remove, replace }) => (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, px: 2, pt: 1 }}>
                          <h5 className="mb-0">Items</h5>
                          <IconButton
                            type="button"
                            onClick={() => setShowAddItemForm(!showAddItemForm)}
                            sx={{
                              backgroundColor: showAddItemForm ? '#ff4d4d' : '#5c7186',
                              borderRadius: '7px',
                              color: '#ffffff',
                              '&:hover': {
                                backgroundColor: showAddItemForm ? '#ff3333' : '#7b8792ff !important',
                              },
                            }}
                          >
                            {showAddItemForm ? <X size={20} /> : <Plus size={20} strokeWidth={2.5} />}
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
                                  onChange={(val) => setCurrentItem({ ...currentItem, product: val, variant: '' })}
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
                                  <input type="text" className="form-control" value="No variant available" readOnly disabled />
                                )}
                              </Col>
                              <Col lg={4}>
                                <label className="form-label fw-bold">Quantity</label>
                                <input
                                  type="number"
                                  min={1}
                                  className="form-control"
                                  placeholder="Qty"
                                  value={currentItem.quantity}
                                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                                />
                              </Col>
                              <Col lg={6}>
                                <label className="form-label fw-bold">Batch No</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Batch No"
                                  value={currentItem.batchNo}
                                  onChange={(e) => setCurrentItem({ ...currentItem, batchNo: e.target.value })}
                                />
                              </Col>
                              <Col lg={6}>
                                <label className="form-label fw-bold">Expiry Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  value={currentItem.expiryDate}
                                  onChange={(e) => setCurrentItem({ ...currentItem, expiryDate: e.target.value })}
                                />
                              </Col>
                              <Col lg={12} className="text-end mt-2">
                                {editingIndex !== null && (
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => {
                                      setEditingIndex(null)
                                      setCurrentItem({ product: '', variant: '', quantity: '', batchNo: '', expiryDate: '' })
                                      setShowAddItemForm(false)
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
                                    if (!currentItem.product || !currentItem.quantity || parseInt(currentItem.quantity, 10) < 1) {
                                      alert('Please fill required fields (Product, Qty ≥ 1)')
                                      return
                                    }
                                    const newItem = { ...currentItem }
                                    if (editingIndex !== null) {
                                      replace(editingIndex, newItem)
                                      setEditingIndex(null)
                                    } else {
                                      push(newItem)
                                    }
                                    setCurrentItem({ product: '', variant: '', quantity: '', batchNo: '', expiryDate: '' })
                                    setShowAddItemForm(false)
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
                                <th style={{ width: '25%' }} className="ps-2 py-2">Product</th>
                                <th style={{ width: '20%' }} className="px-1 py-2">Variant</th>
                                <th style={{ width: '12%' }} className="px-1 py-2">Qty</th>
                                <th style={{ width: '18%' }} className="px-1 py-2">Batch No</th>
                                <th style={{ width: '15%' }} className="px-1 py-2">Expiry Date</th>
                                <th style={{ width: '10%' }} className="text-center px-2 py-2">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.items.length === 0 ? (
                                <tr>
                                  <td colSpan="6" className="text-center py-4 text-muted">No items added yet.</td>
                                </tr>
                              ) : (
                                values.items.map((item, index) => {
                                  const productName = productOptions.find(p => p.value === item.product)?.label || 'Unknown'
                                  return (
                                    <tr key={index} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                      <td className="ps-2 py-2">{productName}</td>
                                      <td className="px-1 py-2">{item.variant ? item.variant : 'No variant'}</td>
                                      <td className="px-1 py-2">{item.quantity}</td>
                                      <td className="px-1 py-2">{item.batchNo || '-'}</td>
                                      <td className="px-1 py-2">{item.expiryDate || '-'}</td>
                                      <td className="text-center px-1 py-2 d-flex align-items-center">
                                        <IconButton
                                          type="button"
                                          onClick={() => {
                                            setCurrentItem(item)
                                            setEditingIndex(index)
                                            setShowAddItemForm(true)
                                          }}
                                          sx={{ backgroundColor: '#eef2f6', mr: 1 }}
                                        >
                                          <Edit size={17} color="#5c7186" strokeWidth={2} />
                                        </IconButton>
                                        <IconButton type="button" onClick={() => remove(index)} sx={{ backgroundColor: '#ffdcdcff' }}>
                                          <Trash2 size={15} color="#ff3939ff" strokeWidth={2} />
                                        </IconButton>
                                      </td>
                                    </tr>
                                  )
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
                    <FormikTextArea name="note" label="Note" placeholder="Write Note ..." />
                  </Col>
                </Row>

                <div className="p-3 bg-light mt-4 rounded">
                  <Row className="justify-content-end g-2">
                    <Col lg={2}>
                      <Link to="/inventory/transfer-stock" className="btn btn-primary w-100">
                        Cancel
                      </Link>
                    </Col>
                    <Col lg={2}>
                      <button type="submit" className="btn btn-outline-secondary w-100" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
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

export default AddTransferStock
