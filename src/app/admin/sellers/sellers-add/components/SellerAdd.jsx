import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardTitle, Col, Row, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Endpoints
import {
  useUpdateSellerMutation,
  useGetSellerByIdQuery
} from '@/services/authenticateendpoint/sellers';

// Reusable Components
import FormikTextField from '@/components/formikfield/FormikTextField';
import FormikTextArea from '@/components/formikfield/FormikTextArea';
import ChoicesSearchFormInput from '@/components/formikfield/ChoicesSearchFormInput';
import StatusAlert from '@/components/StatusAlert';

const SellerAdd = () => {
  const navigate = useNavigate();
  const { sellerId } = useParams();
  const [updateSeller, { isLoading: isUpdating, isSuccess: updateSuccess, error: updateError }] = useUpdateSellerMutation();

  const { data: sellerData, isLoading: isLoadingSeller } = useGetSellerByIdQuery(sellerId, { skip: !sellerId });

  const initialValues = {
    name: sellerData?.name || '',
    email: sellerData?.email || '',
    phone: sellerData?.phone || '',
    companyName: sellerData?.companyName || '',
    address: sellerData?.address || '',
    sellerType: sellerData?.sellerType || '',
    commissionType: sellerData?.commissionType || '',
    commissionValue: sellerData?.commissionValue || 0,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Phone is required'),
    companyName: Yup.string().required('Company name is required'),
    address: Yup.string().required('Address is required'),
    sellerType: Yup.string().required('Seller type is required'),
    commissionType: Yup.string().required('Commission type is required'),
    commissionValue: Yup.number().min(0, 'Must be at least 0').required('Commission value is required'),
  });

  const sellerTypeOptions = [
    { value: 'RESELLER', label: 'Reseller' },
    { value: 'AFFILIATE', label: 'Affiliate' },
    { value: 'INTERNAL', label: 'Internal' },
    { value: 'DISTRIBUTOR', label: 'Distributor' },
  ];

  const commissionTypeOptions = [
    { value: 'PERCENTAGE', label: 'Percentage' },
    { value: 'FIXED', label: 'Fixed Amount' },
    { value: 'NONE', label: 'None' },
  ];


  const handleSubmit = async (values) => {
    try {
      await updateSeller({ id: sellerId, data: values }).unwrap();
    } catch (err) {
      console.error('Failed to update seller:', err);
    }
  };

  if (sellerId && isLoadingSeller) {
    return <div>Loading seller details...</div>;
  }

  return (
    <Col xl={12} lg={12}>
      <StatusAlert
        isSuccess={updateSuccess}
        error={updateError}
        message="Seller updated successfully"
        path="/sellers/sellers-list"
        redirect={true}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ values, setFieldValue, errors }) => {
          console.log(errors);

          return (
            <Form>
              <Card>
                <CardHeader>
                  <CardTitle as={'h4'}>Edit Seller</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={4}>
                      <FormikTextField
                        label="Full Name"
                        name="name"
                        placeholder="Enter Seller Name"
                      />
                    </Col>
                    <Col lg={4}>
                      <FormikTextField
                        label="Email Address"
                        name="email"
                        type="email"
                        placeholder="Enter Email"
                      />
                    </Col>
                    <Col lg={4}>
                      <FormikTextField
                        label="Phone Number"
                        name="phone"
                        placeholder="Enter Phone Number"
                      />
                    </Col>
                    <Col lg={4}>
                      <FormikTextField
                        label="Company Name"
                        name="companyName"
                        placeholder="Enter Company Name"
                      />
                    </Col>
                    <Col lg={12}>
                      <FormikTextArea
                        label="Address"
                        name="address"
                        placeholder="Enter Full Address"
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle as={'h4'}>Seller Business Information</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col lg={4}>
                      <Field name="sellerType">
                        {({ field, form }) => (
                          <ChoicesSearchFormInput
                            label="Seller Type"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="sellerType"
                            {...field}
                            options={sellerTypeOptions}
                            onChange={(val) => form.setFieldValue('sellerType', val)}
                            placeholder="Select seller type"
                          />
                        )}
                      </Field>
                    </Col>
                    <Col lg={4}>
                      <Field name="commissionType">
                        {({ field, form }) => (
                          <ChoicesSearchFormInput
                            label="Commission Type"
                            labelClassName="form-label fw-bold"
                            className="form-control"
                            id="commissionType"
                            {...field}
                            options={commissionTypeOptions}
                            onChange={(val) => form.setFieldValue('commissionType', val)}
                            placeholder="Select commission type"
                          />
                        )}
                      </Field>
                    </Col>
                    <Col lg={4}>
                      <FormikTextField
                        label="Commission Value"
                        name="commissionValue"
                        type="number"
                        placeholder="0"
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              <div className="p-3 bg-light mb-3 rounded">
                <Row className="justify-content-end g-2">
                  <Col lg={2}>
                    <Button
                      variant="outline-secondary"
                      className="w-100"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                  </Col>
                  <Col lg={2}>
                    <Button
                      type="submit"
                      variant="primary"
                      className="w-100"
                      disabled={isUpdating}
                    >
                      {isUpdating ? 'Updating...' : 'Update Seller'}
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          )
        }}
      </Formik>
    </Col>
  );
};

export default SellerAdd;