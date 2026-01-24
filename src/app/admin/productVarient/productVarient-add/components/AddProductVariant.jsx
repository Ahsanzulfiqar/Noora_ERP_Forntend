import { Card, CardBody, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap'
import { Formik, Form, Field, FieldArray } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate, useParams } from 'react-router-dom' // Added useNavigate
import FormikTextField from '@/components/formikfield/FormikTextField'
import FormikSelectField from '@/components/formikfield/FormikSelectField'
import FormikFileInput from '@/components/formikfield/FormikFileInput'
import FormikToggleSwitch from '@/components/formikfield/FormikToggleSwitch'
import { useCreateVariantMutation, useGetVariantByIdQuery, useUpdateVariantMutation } from '@/services/endpoints/productvariant'
import { useGetAllProductsQuery } from '@/services/endpoints/product'
import { toast } from 'react-toastify';
import ChoicesSearchFormInput from '@/components/formikfield/ChoicesSearchFormInput'
import StatusAlert from '../../../../../components/StatusAlert'
import { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import ProductDetails from './ProductDetails'
import FileUpload from './FileUpload';
import { Plus, Trash2 } from 'lucide-react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'


// Checking previous file content, it used `alert`. I will stick to `alert` or standard UI feedback if toast isn't clearly available, 
// but usually these templates have toast. I'll stick to alert for now as per previous code, or better, just console.
// Actually, I'll use the existing pattern.

const AddProductVariant = () => {
  const navigate = useNavigate()
  const { productvarientId } = useParams()
  const [createVariant, { isLoading: isCreating, isSuccess: createSuccess, error: createError }] = useCreateVariantMutation()
  const [updateVariant, { isLoading: isUpdating, isSuccess: updateSuccess, error: updateError }] = useUpdateVariantMutation()
  const { data: productsData } = useGetAllProductsQuery()

  // Fetch variant data if existing (Edit Mode)
  const { data: variantData, isLoading: isFetching } = useGetVariantByIdQuery(productvarientId, {
    skip: !productvarientId,
  })

  const isLoading = isCreating || isUpdating

  const productOptions = productsData?.map((product) => ({
    label: product.name,
    value: product._id,
  })) || []

  // Simplify attributes for formik (ensure string values)
  const getInitialAttributes = () => {
    if (variantData?.attributes && variantData.attributes.length > 0) {
      return variantData.attributes.map(attr => ({ name: attr.name, value: attr.value }))
    }
    return [{ name: '', value: '' }]
  }

  return (
    <Col xl={12} lg={12}>
      <StatusAlert
        isSuccess={createSuccess || updateSuccess}
        error={createError || updateError}
        message={productvarientId ? 'Product updated successfully' : 'Product created successfully'}
        path="/products/product-varient-list"
        redirect={true}
      />
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>{productvarientId ? 'Edit Product Variant' : 'Create Product Variant'}</CardTitle>
        </CardHeader>

        <CardBody>
          {isFetching ? (
            <div className="text-center py-5">Loading...</div>
          ) : (
            <Formik
              enableReinitialize
              initialValues={{
                product: variantData?.product || '',
                name: variantData?.name || '',
                sku: variantData?.sku || '',
                barcode: variantData?.barcode || '',
                purchasePrice: variantData?.purchasePrice || '',
                salePrice: variantData?.salePrice || '',
                packSize: variantData?.packSize || '',
                netWeight: variantData?.netWeight || '',
                isActive: variantData?.isActive !== undefined ? !!variantData.isActive : true,
                attributes: getInitialAttributes(),
                images: [], // Images usually handled specifically for edit/new uploads
              }}
              validationSchema={Yup.object({
                product: Yup.string().required('Product is required'),
                name: Yup.string().required('Required'),
                sku: Yup.string().required('Required'),
                barcode: Yup.string().required('Required'),
                purchasePrice: Yup.number().required('Required'),
                salePrice: Yup.number().required('Required'),
                packSize: Yup.string().required('Required'),
                netWeight: Yup.string().required('Required'),
                isActive: Yup.string().required('Required'),
              })}
              onSubmit={async (values, { resetForm }) => {
                try {
                  const payload = {
                    productId: values.product, // Map 'product' to 'productId'
                    name: values.name,
                    sku: values.sku,
                    barcode: values.barcode,
                    purchasePrice: Number(values.purchasePrice),
                    salePrice: Number(values.salePrice),
                    packSize: Number(values.packSize),
                    netWeight: values.netWeight,
                    isActive: values.isActive,
                    attributes: values.attributes.filter(attr => attr.name && attr.value),
                    images: values.images,
                  }

                  if (productvarientId) {
                    await updateVariant({ id: productvarientId, data: payload }).unwrap()
                  } else {
                    await createVariant(payload).unwrap()
                  }

                  resetForm()
                } catch (error) {
                  console.error('Failed to save variant:', error)
                }
              }}>
              {({ values, setFieldValue }) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4, xl: 4 }}

                      sx={{ background: '#ffffffff', border: '1px solid #dcdcdcff', borderRadius: '10px', p: 0, height: '100%' }}
                    >
                      <ProductDetails values={values} />

                    </Grid>
                    <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8, xl: 8 }}
                      sx={{ background: '#ffffffff', border: '1px solid #dcdcdcff', borderRadius: '10px', px: 3, pb: 2 }}

                    >
                      <Row>
                        <Col lg={12}>
                          <FileUpload
                            title="Add Product Variant Photo"
                            onFileUpload={(files) => {
                              const imageArray = files.map(file => ({
                                url: file.preview || '',
                                alt: file.name || 'Product Image'
                              }));
                              setFieldValue('images', imageArray);
                            }}
                          />
                        </Col>
                        <Col lg={4}>
                          <Field name="product">
                            {({ field, form }) => (
                              <ChoicesSearchFormInput
                                label="Product"
                                labelClassName="form-label fw-bold"
                                className="form-control"
                                id="product"
                                {...field}
                                options={productOptions}
                                onChange={(val) => form.setFieldValue('product', val)}
                                placeholder="Select Product"
                              />
                            )}
                          </Field>
                        </Col>

                        <Col lg={4}>
                          <FormikTextField name="name" label="Variant Name" placeholder="Variant Name" />
                        </Col>

                        <Col lg={4}>
                          <FormikTextField name="sku" label="SKU" placeholder="SKU" />
                        </Col>

                        <Col lg={4}>
                          <FormikTextField name="barcode" label="Barcode" placeholder="Barcode" />
                        </Col>

                        <Col lg={4}>
                          <FormikTextField name="purchasePrice" type="number" label="Purchase Price" placeholder="Purchase Price" />
                        </Col>

                        <Col lg={4}>
                          <FormikTextField name="salePrice" type="number" label="Sale Price" placeholder="Sale Price" />
                        </Col>

                        <Col lg={4}>
                          <FormikTextField name="packSize" type="string" label="Pack Size" placeholder="e.g. 500" />
                        </Col>

                        <Col lg={4}>
                          <FormikTextField name="netWeight" type="string" label="Net Weight" placeholder="e.g. 0.5" />
                        </Col>

                        <Col lg={4}>
                          <FormikToggleSwitch
                            name="isActive"
                            label="Is Active"
                          />
                        </Col>

                        {/* Dynamic Attributes */}
                        <Box
                          sx={{ border: '1px solid #dfdfdfff', borderRadius: '10px', }}
                        >
                          <FieldArray name="attributes">
                            {({ push, remove }) => (
                              <>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: '16px', paddingRight: '8px', paddingY: '8px' }}>
                                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Product Attributes</Typography>
                                  <IconButton type="button" className="btn btn-secondary" onClick={() => push({ name: '', value: '' })}
                                    sx={{
                                      backgroundColor: '#5c7186', borderRadius: '7px',
                                      '&:hover': {
                                        backgroundColor: '#7b8792ff !important',
                                        '& svg': {
                                          stroke: '#ffffffff !important'
                                        }
                                      }
                                    }}>
                                    <Plus size={20} color="#ffffff" strokeWidth={2.50} />
                                  </IconButton>

                                </Box>
                                <Divider />
                                <Box sx={{ paddingX: '16px', paddingY: '12px' }}>
                                  {values.attributes.map((item, index) => (
                                    <Grid key={index} container spacing={2}>
                                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5 }}>
                                        <FormikTextField name={`attributes[${index}].name`} label="Attribute Name" placeholder="Color / Size" />
                                      </Grid>

                                      <Grid size={{ xs: 12, sm: 12, md: 12, lg: 5 }}>
                                        <FormikTextField name={`attributes[${index}].value`} label="Attribute Value" placeholder="Red / XL" />
                                      </Grid>

                                      <Grid size={{ xs: 1, sm: 1, md: 1, lg: 1 }}>
                                        <IconButton type="button" onClick={() => remove(index)}
                                         sx={{ backgroundColor: '#ffdcdcff', marginTop: '28px', marginLeft: '2px' }}>
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


                      </Row>
                    </Grid>
                  </Grid>

                  <div className="p-3 bg-light mt-4 rounded">
                    <Row className="justify-content-end g-2">
                      {/* dfdsf */}

                      <Col lg={2}>
                        <Link to="/products/product-varient-list" className="btn btn-primary w-100">
                          Cancel
                        </Link>
                      </Col>
                      <Col lg={2}>
                        <button type="submit" className="btn btn-outline-secondary w-100" disabled={isLoading}>
                          {isLoading ? (productvarientId ? 'Updating...' : 'Creating...') : (productvarientId ? 'Update' : 'Create')}
                        </button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </CardBody>
      </Card>
    </Col>
  )
}

export default AddProductVariant

// -----------------------------
// Reusable Formik File Input
// -----------------------------
