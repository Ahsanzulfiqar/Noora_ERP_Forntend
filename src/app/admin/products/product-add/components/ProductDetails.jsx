import { useState, useEffect, useRef } from 'react';
import product1 from '@/assets/images/product/noimage.png';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import { Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { categoryOptions } from '../utils';

const ProductDetails = ({ values }) => {
  const {
    name,
    category,
    purchasePrice,
    salePrice,
    images = [],
    attributes = []
  } = values || {};
  console.log('product values', values);

  const [mainImage, setMainImage] = useState(images[0]?.url || product1);
  const scrollRef = useRef(null);

  useEffect(() => {
    setMainImage(images[0]?.url || product1);
  }, [images]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const categoryLabel = categoryOptions.find(opt => opt.value === category)?.label || 'Category';

  return <Col xl={12} lg={12}>
    <Card>
      <CardBody>
        <img
          src={mainImage}
          alt={images.find(img => img.url === mainImage)?.alt || "product"}
          className="img-fluid rounded bg-light"
          style={{ width: '100%', height: '300px', objectFit: 'cover' }}
        />

        {images.length > 2 && (
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

        <div className="mt-3">
          <div className="d-flex justify-content-between gap-2">
            <h4 className="text-capitalize  badge bg-success text-light fs-14 py-1 px-2">{values?.brand}</h4>
            {values?.isActive ? <h4 className="text-capitalize  badge  text-success  fs-14 py-1 px-2 border">Active</h4> : <h4 className="text-capitalize  badge  text-danger  fs-14 py-1 px-2 border">Inactive</h4>}

          </div>
          <h4 className='text-capitalize'>
            {name || 'Product Name'} <span className="fs-14 text-muted ms-1">({categoryLabel})</span>
          </h4>
          {(values?.subCategory || values?.sku) && (
            <div className="fs-16 mt-1 d-flex gap-1 flex-column">
              {values?.subCategory && <span className='fw-bold text-dark'>Sub Category: {values?.subCategory}</span>}
              {values?.sku && <span className='fw-bold text-dark'>SKU: {values?.sku}</span>}
            </div>
          )}
          <h4 className="fw-semibold text-dark mt-2 d-flex align-items-center gap-1">
            <span >Purchase Price:</span>
            <span className='badge bg-secondary text-light fs-14 py-1 px-2'>{currency}{purchasePrice || '0.00'}</span>
          </h4>
          <h4 className="fw-semibold text-dark mt-2 d-flex align-items-center gap-1">
            <span>Sale Price:</span>
            <span className='badge bg-secondary text-light fs-14 py-1 px-2'>{currency}{salePrice || '0.00'}</span>
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

          {values.description && (
            <div className="mt-3">
              <h5 className="text-dark ">Description :</h5>
              <div className="d-flex flex-wrap text-capitalize">
                {values.description}
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
      </CardBody>
    </Card>
  </Col>;
};
export default ProductDetails;