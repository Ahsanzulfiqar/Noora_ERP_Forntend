import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductByIdQuery } from '../../../../../services/endpoints/product';
import { Col, Card, CardBody, Spinner, Alert, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import product1 from '@/assets/images/product/noimage.png';
import { currency } from '@/context/constants';

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
              <div className="mt-3">
                <div className="d-flex justify-content-between gap-2">
                  <h4 className="text-capitalize  badge bg-success text-light fs-14 py-1 px-2">{product?.brand}</h4>
                  {product?.isActive ? <h4 className="text-capitalize  badge  text-success  fs-14 py-1 px-2 border">Active</h4> : <h4 className="text-capitalize  badge  text-danger  fs-14 py-1 px-2 border">Inactive</h4>}

                </div>
                <h4 className='text-capitalize'>
                  {product?.name || 'Product Name'} <span className="fs-14 text-muted ms-1">({categoryLabel})</span>
                </h4>
                {(product?.subCategory || product?.sku) && (
                  <div className="fs-16 mt-1 d-flex gap-1 flex-column">
                    {product?.subCategory && <span className='fw-bold text-dark'>Sub Category: {product?.subCategory}</span>}
                    {product?.sku && <span className='fw-bold text-dark'>SKU: {product?.sku}</span>}
                  </div>
                )}
                <h4 className="fw-semibold text-dark mt-2 d-flex align-items-center gap-1">
                  <span >Purchase Price:</span>
                  <span className='badge bg-secondary text-light fs-14 py-1 px-2'>{currency}{product?.purchasePrice || '0.00'}</span>
                </h4>
                <h4 className="fw-semibold text-dark mt-2 d-flex align-items-center gap-1">
                  <span>Sale Price:</span>
                  <span className='badge bg-secondary text-light fs-14 py-1 px-2'>{currency}{product?.salePrice || '0.00'}</span>
                </h4>

                {attributes.length > 0 && attributes[0].name !== '' && (
                  <div className="mt-3">
                    <h5 className="text-dark ">Attributes :</h5>
                    <div className="d-flex flex-wrap gap-2 text-capitalize">
                      {attributes.map((attr, idx) => (
                        <div key={idx} className="badge bg-light text-dark p-2 border">
                          <strong>{attr.name}:</strong> {attr.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {product.description && (
                  <div className="mt-3">
                    <h5 className="text-dark ">Description :</h5>
                    <div className="d-flex flex-wrap text-capitalize">
                      {product.description}
                    </div>
                  </div>
                )}

                {!attributes.length && (
                  <>
                    <div className="mt-3">
                      <h5 className="text-dark fw-medium">Size :</h5>
                      <div className="d-flex flex-wrap gap-2" role="group" aria-label="Basic checkbox toggle button group">
                        <input type="checkbox" className="btn-check" id="size-s" />
                        <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="size-s">
                          S
                        </label>
                        <input type="checkbox" className="btn-check" id="size-m" defaultChecked />
                        <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="size-m">
                          M
                        </label>
                        <input type="checkbox" className="btn-check" id="size-xl" />
                        <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="size-xl">
                          Xl
                        </label>
                        <input type="checkbox" className="btn-check" id="size-xxl" />
                        <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="size-xxl">
                          XXL
                        </label>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h5 className="text-dark fw-medium">Colors :</h5>
                      <div className="d-flex flex-wrap gap-2" role="group" aria-label="Basic checkbox toggle button group">
                        <input type="checkbox" className="btn-check" id="color-dark" />
                        <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-dark">
                          {' '}
                          <span>
                            {' '}
                            <IconifyIcon icon="bxs:circle" height={18} width={18} className="fs-18 text-dark" />
                          </span>
                        </label>
                        <input type="checkbox" className="btn-check" id="color-yellow" />
                        <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-yellow">
                          {' '}
                          <span>
                            {' '}
                            <IconifyIcon icon="bxs:circle" height={18} width={18} className="fs-18 text-warning" />
                          </span>
                        </label>
                        <input type="checkbox" className="btn-check" id="color-white" />
                        <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-white">
                          {' '}
                          <span>
                            {' '}
                            <IconifyIcon icon="bxs:circle" height={18} width={18} className="fs-18 text-white" />
                          </span>
                        </label>
                        <input type="checkbox" className="btn-check" id="color-red" />
                        <label className="btn btn-light avatar-sm rounded d-flex justify-content-center align-items-center" htmlFor="color-red">
                          {' '}
                          <span>
                            {' '}
                            <IconifyIcon icon="bxs:circle" height={18} width={18} className="fs-18 text-danger" />
                          </span>
                        </label>
                      </div>
                    </div>
                  </>
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