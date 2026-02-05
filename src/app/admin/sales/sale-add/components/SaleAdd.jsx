import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Button, Table } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, FieldArray, Field } from 'formik';
import { Icon } from '@iconify/react';
import { useAuth } from '@/hooks/useAuth';

// Endpoints
import { useGetSaleByIdQuery, useCreateSaleMutation, useUpdateSaleMutation } from '../../../../../services/authenticateendpoint/sales';
import { useGetSellersQuery } from '../../../../../services/authenticateendpoint/sellers';
import { useGetAllWarehousesQuery } from '../../../../../services/authenticateendpoint/warehouse';
import { useGetAllProductsQuery } from '../../../../../services/authenticateendpoint/product';
import { useGetVariantsByProductQuery } from '../../../../../services/authenticateendpoint/productvariant';
import { useGetAllCouriersQuery } from '../../../../../services/authenticateendpoint/courier';
import { Country, City } from 'country-state-city';

// Reusable Components
import FormikTextField from '@/components/formikfield/FormikTextField';
import FormikTextArea from '@/components/formikfield/FormikTextArea';
import ChoicesSearchFormInput from '@/components/formikfield/ChoicesSearchFormInput';
import StatusAlert from '@/components/StatusAlert';
import { SalesValidationSchema } from '../../utils/utils';
import { Plus, Trash2, X, Edit } from 'lucide-react';
import { IconButton, Tooltip } from '@mui/material';

const SaleAdd = () => {
  const navigate = useNavigate();
  const { salesId } = useParams();
  const { role } = useAuth();
  const [createSale, { isLoading: isCreating, isSuccess: createSuccess, error: createError }] = useCreateSaleMutation();
  const [updateSale, { isLoading: isUpdating, isSuccess: updateSuccess, error: updateError }] = useUpdateSaleMutation();

  const { data: saleData, isLoading: isLoadingSale } = useGetSaleByIdQuery(salesId, { skip: !salesId });
  const { data: sellersData } = useGetSellersQuery({ limit: 100 });
  const { data: warehousesData } = useGetAllWarehousesQuery();
  const { data: productsData } = useGetAllProductsQuery();
  const { data: couriersData } = useGetAllCouriersQuery();

  const [newItem, setNewItem] = useState({
    product: '',
    variant: '',
    productName: '',
    variantName: '',
    sku: '',
    quantity: 1,
    salePrice: 0,
    batchNo: '',
  });

  const { data: variantsData } = useGetVariantsByProductQuery(newItem.product, { skip: !newItem.product });

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const sellerOptions = sellersData?.data?.map(s => ({ value: s._id, label: s.name })) || [];
  const warehouseOptions = warehousesData?.map(w => ({ value: w._id, label: w.name })) || [];
  const productOptions = productsData?.map(p => ({ value: p._id, label: p.name, sku: p.sku, salePrice: p.salePrice })) || [];
  const courierOptions = couriersData?.map(c => ({ value: c._id, label: c.name })) || [];

  // Get all countries from country-state-city package
  const countryOptions = Country.getAllCountries().map(country => ({
    value: country.name,
    label: country.name,
    isoCode: country.isoCode
  }));

  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCountryIsoCode, setSelectedCountryIsoCode] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Auto-set variant to null when product has no variants
  useEffect(() => {
    if (newItem.product && variantsData && variantsData.length === 0) {
      if (newItem.variant !== null) {
        setNewItem(prev => ({ ...prev, variant: null, variantName: null }));
      }
    }
  }, [variantsData, newItem.product, newItem.variant]);

  const initialValues = {
    seller: saleData?.seller || '',
    warehouse: saleData?.warehouse || '',
    invoiceNo: saleData?.invoiceNo || '',
    customerName: saleData?.customerName || '',
    customerPhone: saleData?.customerPhone || '',
    country: saleData?.country || '',
    city: saleData?.city || '',
    address: saleData?.address || '',
    status: saleData?.status || 'draft',
    courier: saleData?.courier || '',
    courierName: saleData?.courierName || '',
    trackingNo: saleData?.trackingNo || '',
    trackingUrl: saleData?.trackingUrl || '',
    deliveryNotes: saleData?.deliveryNotes || '',
    notes: saleData?.notes || '',
    items: saleData?.items?.map(item => ({
      product: item.product || '',
      variant: item.variant || '',
      productName: item.productName || '',
      variantName: item.variantName || '',
      sku: item.sku || '',
      quantity: item.quantity || 1,
      salePrice: item.salePrice || 0,
      lineTotal: item.lineTotal || 0,
    })) || [],
    subTotal: saleData?.subTotal || 0,
    taxAmount: saleData?.taxAmount || 0,
    totalAmount: saleData?.totalAmount || 0,
  };

  // Initialize cities when editing existing sale with country
  useEffect(() => {
    if (saleData?.country) {
      setSelectedCountry(saleData.country);
      // Find the country's ISO code
      const country = Country.getAllCountries().find(c => c.name === saleData.country);
      if (country) {
        setSelectedCountryIsoCode(country.isoCode);
        const cities = City.getCitiesOfCountry(country.isoCode);
        setCityOptions(cities?.map(city => ({ value: city.name, label: city.name })) || []);
      }
    }
  }, [saleData]);




  const calculateTotals = (items, taxAmount, setFieldValue) => {
    const subTotal = items.reduce((sum, item) => sum + (item.quantity * item.salePrice), 0);
    const totalAmount = subTotal + (Number(taxAmount) || 0);
    setFieldValue('subTotal', subTotal);
    setFieldValue('totalAmount', totalAmount);

    items.forEach((item, index) => {
      const lineTotal = item.quantity * item.salePrice;
      if (item.lineTotal !== lineTotal) {
        setFieldValue(`items[${index}].lineTotal`, lineTotal);
      }
    });
  };

  const handleProductChange = (productId, index, setFieldValue) => {
    const product = productOptions.find(p => p.value === productId);
    if (product) {
      setFieldValue(`items[${index}].product`, productId);
      setFieldValue(`items[${index}].productName`, product.label);
      setFieldValue(`items[${index}].variant`, ''); // Reset variant
      setFieldValue(`items[${index}].variantName`, '');
      setFieldValue(`items[${index}].sku`, product.sku || '');
      setFieldValue(`items[${index}].salePrice`, product.salePrice || 0);
    }
  };

  const handleVariantChange = (variantId, index, setFieldValue) => {
    const variant = variantsData?.find(v => v._id === variantId);
    if (variant) {
      setFieldValue(`items[${index}].variant`, variantId);
      setFieldValue(`items[${index}].variantName`, variant.name);
      setFieldValue(`items[${index}].sku`, variant.sku || '');
      setFieldValue(`items[${index}].salePrice`, variant.salePrice || 0);
    }
  };


  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = {
        sellerId: values.seller,           // maps Formik field to mutation
        warehouseId: values.warehouse,
        invoiceNo: values.invoiceNo,
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        country: values.country,
        city: values.city,
        address: values.address,
        items: values.items.map(item => ({
          productId: item.product,        // maps product field
          variantId: item.variant || null,
          productName: item.productName,
          variantName: item.variantName || null,
          sku: item.sku,
          quantity: Number(item.quantity),
          salePrice: Number(item.salePrice),
        })),
        taxAmount: Number(values.taxAmount) || 0,
        notes: values.notes,
      };

      if (salesId) {
        const updatePayload = {
          ...payload,
          status: values.status,
          courierName: values.courierName || '',
          trackingNo: values.trackingNo || '',
          trackingUrl: values.trackingUrl || '',
          deliveryNotes: values.deliveryNotes || '',
        };
        await updateSale({ id: salesId, data: updatePayload }).unwrap();
      } else {
        await createSale(payload).unwrap();
        resetForm();
        setShowItemForm(false);
      }
    } catch (err) {
      console.error('Failed to save sale:', err);
    }
  };

  if (salesId && isLoadingSale) {
    return <div>Loading sale details...</div>;
  }

  return (
    <Col xl={12} lg={12}>
      <StatusAlert
        isSuccess={createSuccess || updateSuccess}
        error={createError || updateError}
        message={salesId ? 'Sale updated successfully' : 'Sale created successfully'}
        path="/sales/sales-list"
        redirect={true}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={SalesValidationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, errors }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          console.log('values', values);
          console.log('errors', errors);

          useEffect(() => {
            calculateTotals(values.items, values.taxAmount, setFieldValue);
          }, [values.items, values.taxAmount, setFieldValue]);

          return (
            <Form>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle as={'h4'}>
                    {salesId ? 'Edit Sale' : 'Sale Information'}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={4}>
                      <Field name="seller">
                        {({ field }) => (
                          <ChoicesSearchFormInput
                            label="Seller"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="seller"
                            {...field}
                            options={sellerOptions}
                            onChange={(value) => setFieldValue('seller', value)}
                            placeholder="Select Seller"
                          />
                        )}
                      </Field>
                    </Col>
                    <Col lg={4}>
                      <Field name="warehouse">
                        {({ field }) => (
                          <ChoicesSearchFormInput
                            label="Warehouse"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="warehouse"
                            {...field}
                            options={warehouseOptions}
                            onChange={(value) => setFieldValue('warehouse', value)}
                            placeholder="Select Warehouse"
                          />
                        )}
                      </Field>
                    </Col>
                    <Col lg={4}>
                      <FormikTextField
                        label="Invoice No / Order Number"
                        name="invoiceNo"
                        placeholder="Enter Invoice Number"
                      />
                    </Col>
                    <Col lg={4}>
                      <FormikTextField
                        label="Customer Name"
                        name="customerName"
                        placeholder="Enter Customer Name"
                      />
                    </Col>
                    <Col lg={4}>
                      <FormikTextField
                        label="Customer Phone"
                        name="customerPhone"
                        placeholder="Enter Customer Phone"
                      />
                    </Col>
                    <Col lg={4}>
                      <Field name="country">
                        {({ field }) => (
                          <ChoicesSearchFormInput
                            label="Country"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="country"
                            {...field}
                            options={countryOptions}
                            onChange={(value) => {
                              setFieldValue('country', value);
                              setFieldValue('city', ''); // Reset city when country changes
                              setSelectedCountry(value);

                              // Find the selected country's ISO code
                              const country = countryOptions.find(c => c.value === value);
                              if (country) {
                                setSelectedCountryIsoCode(country.isoCode);
                                // Get cities for this country using ISO code
                                const cities = City.getCitiesOfCountry(country.isoCode);
                                setCityOptions(cities?.map(city => ({ value: city.name, label: city.name })) || []);
                              }
                            }}
                            placeholder="Select Country"
                          />
                        )}
                      </Field>
                    </Col>
                    <Col lg={4}>
                      <Field name="city">
                        {({ field }) => (
                          <ChoicesSearchFormInput
                            label="City"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="city"
                            {...field}
                            options={cityOptions}
                            onChange={(value) => setFieldValue('city', value)}
                            placeholder={selectedCountry ? "Select City" : "Select Country First"}
                            disabled={!selectedCountry}
                          />
                        )}
                      </Field>
                    </Col>

                    {(role === 'Admin' || role === 'ADMIN') && (
                      <>
                        <Col lg={4}>
                          <Field name="courierName">
                            {({ field }) => (
                              <ChoicesSearchFormInput
                                label="Courier Name"
                                labelClassName="form-label fw-bold"
                                className="form-control"
                                id="courierName"
                                {...field}
                                options={courierOptions}
                                onChange={(value) => setFieldValue('courierName', value)}
                                placeholder="Select Courier"
                              />
                            )}
                          </Field>
                        </Col>
                        <Col lg={4}>
                          <FormikTextField
                            label="Tracking No"
                            name="trackingNo"
                            placeholder="Enter Tracking Number"
                          />
                        </Col>
                        <Col lg={4}>
                          <FormikTextField
                            label="Tracking URL"
                            name="trackingUrl"
                            placeholder="Enter Tracking URL"
                          />
                        </Col>
                      </>
                    )}

                    <Col lg={12}>
                      <FormikTextArea
                        label="Address"
                        name="address"
                        placeholder="Enter Full Address"
                      />
                    </Col>

                    {(role === 'Admin' || role === 'ADMIN') && (
                      <Col lg={12}>
                        <FormikTextArea
                          label="Delivery Notes"
                          name="deliveryNotes"
                          placeholder="Enter Delivery Notes"
                          rows={3}
                        />
                      </Col>
                    )}
                  </Row>
                </CardBody>
              </Card>

              <Card className="mb-4">
                <FieldArray name="items">
                  {({ push, remove, replace }) => (
                    <>
                      <CardHeader className="d-flex justify-content-between align-items-center">
                        <CardTitle as={'h4'}>Items</CardTitle>
                        <IconButton
                          variant="outline-primary"
                          size="sm"
                          onClick={() => setShowItemForm(!showItemForm)}
                          sx={{
                            backgroundColor: showItemForm ? '#ff4d4d' : '#5c7186',
                            borderRadius: '7px',
                            '&:hover': {
                              backgroundColor: showItemForm ? '#ff3333' : '#7b8792ff !important',
                              '& svg': {
                                stroke: '#ffffffff !important'
                              }
                            }
                          }}
                        >
                          {showItemForm ? <X color="white" size={20} strokeWidth={2} /> : <Plus color="white" size={20} strokeWidth={2} />}
                        </IconButton>
                      </CardHeader>
                      <CardBody>
                        {showItemForm && (
                          <div className="p-3 border rounded mb-4 bg-light bg-opacity-10">
                            <Row className="g-3">
                              <Col md={4}>
                                <div className="form-group">
                                  <label className="form-label fw-bold">Product</label>
                                  <ChoicesSearchFormInput
                                    label=""
                                    placeholder="Select Product"
                                    options={productOptions}
                                    value={newItem.product}
                                    onChange={(val) => {
                                      const product = productOptions.find(p => p.value === val);
                                      setNewItem({
                                        ...newItem,
                                        product: val,
                                        productName: product?.label || '',
                                        variant: '',
                                        variantName: '',
                                        sku: product?.sku || '',
                                        salePrice: product?.salePrice || 0,
                                      });
                                    }}
                                  />
                                </div>
                              </Col>
                              <Col md={4}>
                                <div className="form-group">
                                  <label className="form-label fw-bold">Variant</label>
                                  {!newItem.product || (variantsData && variantsData.length > 0) ? (
                                    <ChoicesSearchFormInput
                                      label=""
                                      placeholder="Select Variant"
                                      options={variantsData?.map(v => ({ value: v._id, label: v.name })) || []}
                                      value={newItem.variant}
                                      onChange={(val) => {
                                        const variant = variantsData?.find(v => v._id === val);
                                        setNewItem({
                                          ...newItem,
                                          variant: val,
                                          variantName: variant?.name || '',
                                          sku: variant?.sku || newItem.sku,
                                          salePrice: variant?.salePrice || newItem.salePrice,
                                        });
                                      }}
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
                                </div>
                              </Col>
                              <Col md={4}>
                                <div className="form-group">
                                  <label className="form-label fw-bold">SKU</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="SKU"
                                    value={newItem.sku}
                                    readOnly
                                  />
                                </div>
                              </Col>
                              <Col md={3}>
                                <div className="form-group">
                                  <label className="form-label fw-bold">Quantity</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Qty"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                                  />
                                </div>
                              </Col>
                              <Col md={3}>
                                <div className="form-group">
                                  <label className="form-label fw-bold">Price</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    placeholder="Price"
                                    value={newItem.salePrice}
                                    onChange={(e) => setNewItem({ ...newItem, salePrice: Number(e.target.value) })}
                                  />
                                </div>
                              </Col>
                              {/* <Col md={3}>
                                <div className="form-group">
                                  <label className="form-label fw-bold">Batch No</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Batch No"
                                    value={newItem.batchNo}
                                    onChange={(e) => setNewItem({ ...newItem, batchNo: e.target.value })}
                                  />
                                </div>
                              </Col> */}
                              {/* <Col md={3}>
                                <div className="form-group">
                                  <label className="form-label fw-bold">Expiry Date</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={newItem.expiryDate}
                                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                                  />
                                </div>
                              </Col> */}
                              <Col md={12} className="d-flex justify-content-end gap-2">
                                {editingIndex !== null && (
                                  <Button
                                    variant="outline-secondary"
                                    className="mt-2"
                                    onClick={() => {
                                      setEditingIndex(null);
                                      setNewItem({
                                        product: '',
                                        variant: '',
                                        productName: '',
                                        variantName: '',
                                        sku: '',
                                        quantity: 1,
                                        salePrice: 0,
                                        batchNo: '',
                                      });
                                      setShowItemForm(false);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                )}
                                <Button
                                  variant="primary"
                                  className="mt-2"
                                  style={{ backgroundColor: '#5c7186', borderColor: '#5c7186' }}
                                  disabled={!newItem.product}
                                  onClick={() => {
                                    const itemData = { ...newItem, lineTotal: newItem.quantity * newItem.salePrice };
                                    if (editingIndex !== null) {
                                      replace(editingIndex, itemData);
                                      setEditingIndex(null);
                                    } else {
                                      push(itemData);
                                    }
                                    setNewItem({
                                      product: '',
                                      variant: '',
                                      productName: '',
                                      variantName: '',
                                      sku: '',
                                      quantity: 1,
                                      salePrice: 0,
                                      batchNo: '',
                                      // expiryDate: '',
                                    });
                                    if (editingIndex !== null) setShowItemForm(false);
                                  }}
                                >
                                  {editingIndex !== null ? 'UPDATE ITEM' : 'ADD ITEM'}
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        )}

                        <div className="table-responsive">
                          <Table bordered hover>
                            <thead className="bg-light">
                              <tr>
                                <th>Product</th>
                                <th>Variant</th>
                                <th>SKU</th>
                                <th>Qty</th>
                                <th>Price</th>
                                {/* <th>Batch No</th> */}
                                {/* <th>Expiry date</th> */}
                                <th style={{ width: '50px' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.items.length > 0 ? (
                                values.items.map((item, index) => (
                                  <tr key={index}>
                                    <td>{item.productName}</td>
                                    <td>{item.variantName || 'No variant'}</td>
                                    <td>{item.sku}</td>
                                    <td>{item.quantity}</td>
                                    <td>${item.salePrice?.toFixed(2)}</td>
                                    {/* <td>{item.batchNo || '-'}</td> */}
                                    {/* <td>{item.expiryDate || '-'}</td> */}
                                    <td className="text-center d-flex">
                                      <IconButton
                                        type="button"
                                        onClick={() => {
                                          setNewItem(item);
                                          setEditingIndex(index);
                                          setShowItemForm(true);
                                        }}
                                        sx={{ backgroundColor: '#eef2f6', mr: 1 }}
                                      >
                                        <Edit size={17} color="#5c7186" strokeWidth={2} />
                                      </IconButton>
                                      <IconButton
                                        type="button"
                                        onClick={() => remove(index)}
                                        sx={{ backgroundColor: '#ffdcdcff' }}
                                      >
                                        <Trash2 size={17} color="#ff3939ff" strokeWidth={2} />
                                      </IconButton>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="8" className="text-center py-4 text-muted">
                                    No items added yet.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                        </div>
                      </CardBody>
                    </>
                  )}
                </FieldArray>
              </Card>

              <Row>
                <Col lg={8}>
                  <Card>
                    <CardHeader>
                      <CardTitle as={'h4'}>Notes</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FormikTextArea
                        name="notes"
                        placeholder="Enter any additional notes..."
                        rows={4}
                      />
                    </CardBody>
                  </Card>
                </Col>
                <Col lg={4}>
                  <Card>
                    <CardHeader>
                      <CardTitle as={'h4'}>Summary</CardTitle>
                    </CardHeader>
                    <CardBody>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Sub Total:</span>
                        <span className="fw-bold">${values.subTotal.toFixed(2)}</span>
                      </div>
                      <div className="mb-3">
                        <FormikTextField
                          label="Tax Amount"
                          name="taxAmount"
                          type="number"
                          placeholder="0.00"
                        />
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between mt-2">
                        <span className="h5">Total Amount:</span>
                        <span className="h5 fw-bold text-primary">${values.totalAmount.toFixed(2)}</span>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <div className="p-3 bg-light mt-4 mb-3 rounded d-flex justify-content-end gap-2">
                <Button
                  variant="primary"

                  onClick={() => navigate(-1)}
                  style={{ width: '150px' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="outline-secondary"

                  type="submit"
                  disabled={isCreating || isUpdating}
                  style={{ width: '150px' }}
                >
                  {isCreating || isUpdating
                    ? (salesId ? 'Updating...' : 'Creating...')
                    : (salesId ? 'Update Sale' : 'Create Sale')}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </Col>
  );
};

export default SaleAdd;
