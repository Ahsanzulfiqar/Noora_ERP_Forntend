import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../../../../services/authenticateendpoint/product';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import product1 from '@/assets/images/product/noimage.png';
import { currency } from '@/context/constants';
import { Col, Card, CardBody, Spinner, Alert, Row, CardHeader, CardTitle, Table, Badge } from 'react-bootstrap';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { categoryOptions } from '../../product-add/utils';

const ProductDetails = () => {
  const { productId } = useParams();
  const { data, isLoading, error } = useGetProductByIdQuery(productId);

  const [mainImage, setMainImage] = useState(product1);
  const scrollRef = useRef(null);

  // Safely access product object from GraphQL response
  const product = data?.data?.GetProductById || data?.GetProductById || data;
  console.log('productproductproduct', product);


  const {
    name,
    brand,
    sku,
    barcode,
    category,
    subCategory,
    purchasePrice,
    salePrice,
    images = [],
    attributes = [],
    description,
    isActive,
  } = product || {};

  useEffect(() => {
    if (images && images.length > 0) {
      setMainImage(images[0]?.url || product1);
    }
  }, [images]);

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading product: {error.message || 'Unknown error occurred'}
      </Alert>
    );
  }

  if (!product) {
    return <Alert variant="warning">Product not found</Alert>;
  }

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Try to find label, otherwise use value or default
  const categoryLabel = categoryOptions?.find(opt => opt.value === category)?.label || category || 'Category';

  return (
    <Col xl={12} lg={12}>
      <Card>
        <CardHeader >
          <CardTitle >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Typography variant='h6'>Product Detail</Typography>
              <Link to={`/products/product-edit/${productId}`} className="btn btn-sm btn-primary">
                Edit Product
              </Link>
            </Box>
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col xl={4} lg={4} md={4} sm={12} xs={12}>
              <img
                src={mainImage}
                alt={product?.images.find(img => img.url === mainImage)?.alt || "product"}
                className="img-fluid rounded bg-light"
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />

              {product?.images?.length > 2 && (
                <div className="d-flex align-items-center mt-2 position-relative">
                  <button
                    onClick={() => scroll('left')}
                    className="btn btn-sm btn-light border p-0 d-flex align-items-center justify-content-center me-1"
                    style={{ width: '25px', height: '50px', zIndex: 1, marginRight: '12px' }}
                  >
                    <IconifyIcon icon="material-symbols:chevron-left" width={20} />
                  </button>

                  <div
                    ref={scrollRef}
                    className="d-flex flex-nowrap gap-2 overflow-auto no-scrollbar"
                    style={{
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      WebkitOverflowScrolling: 'touch',
                    }}
                  >
                    <style>
                      {`
                  .no-scrollbar::-webkit-scrollbar {
                    display: none;
                  }
                `}
                    </style>
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        role="button"
                        onClick={() => setMainImage(img.url)}
                        className={`rounded border p-1 flex-shrink-0 ${mainImage === img.url ? 'border-primary' : 'border-light'}`}
                        style={{ cursor: 'pointer' }}
                      >
                        <img
                          src={img.url}
                          alt={img.alt || `product-${idx}`}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="rounded"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => scroll('right')}
                    className="btn btn-sm btn-light border p-0 d-flex align-items-center justify-content-center ms-1"
                    style={{ width: '25px', height: '50px', zIndex: 1, marginLeft: '12px' }}
                  >
                    <IconifyIcon icon="material-symbols:chevron-right" width={20} />
                  </button>
                </div>
              )}
            </Col>
            <Col xl={8} lg={8} md={8} sm={12} xs={12}>
              <div className="ps-lg-2">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h3 className="text-dark fw-bold mb-0 text-capitalize">{name || 'Product Name'}</h3>
                  <Badge bg={isActive ? 'success' : 'danger'} className="fs-13 px-3 py-2">
                    {isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="table-responsive mb-4">
                  <Table bordered className="mb-0">
                    <thead className="bg-light-subtle">
                      <tr>
                        <th className="text-muted fw-bold" style={{ width: '40%' }}>Price & Specifications</th>
                        <th className="text-muted fw-bold">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-muted py-2">Sale Price</td>
                        <td className="py-2">
                          {currency}{salePrice || '0.00'}
                        </td>
                      </tr>
                      <tr>
                        <td className="text-muted py-2">Purchase Price</td>
                        <td className="py-2 text-dark">{currency}{purchasePrice || '0.00'}</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-2">Net Weight</td>
                        <td className="py-2 text-dark">{product?.netWeight || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="text-muted py-2">Pack Size</td>
                        <td className="py-2 text-dark">{product?.packSize || 'N/A'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>

                {attributes.length > 0 && attributes[0].name !== '' && (
                  <div className="table-responsive mb-4">
                    <Table bordered className="mb-0">
                      <thead className="bg-light-subtle">
                        <tr>
                          <th className="text-muted fw-bold" style={{ width: '40%' }}>Attribute</th>
                          <th className="text-muted fw-bold">Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attributes.map((attr, idx) => (
                          <tr key={idx}>
                            <td className="text-muted py-2">{attr.name}</td>
                            <td className="py-2 text-dark">{attr.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}

                <div className="mt-3">
                  {sku && (
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <IconifyIcon icon="solar:check-circle-broken" className="text-success fs-18" />
                      <span className="text-muted">SKU: <span className="text-dark">{sku}</span></span>
                    </div>
                  )}
                  {barcode && (
                    <div className="d-flex align-items-center gap-2">
                      <IconifyIcon icon="solar:check-circle-broken" className="text-success fs-18" />
                      <span className="text-muted">Barcode: <span className="text-dark">{barcode}</span></span>
                    </div>
                  )}
                </div>

                {description && (
                  <div className="mt-4 border-top pt-3">
                    <h5 className="text-dark mb-2">Description :</h5>
                    <div className="text-muted">
                      {description}
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>



        </CardBody>
      </Card>
    </Col>
  );
};

export default ProductDetails;