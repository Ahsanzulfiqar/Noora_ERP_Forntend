import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import clsx from 'clsx';
import { useState } from 'react';
import { Card, CardBody, CardFooter, Carousel, CarouselItem, Col, Row, CardHeader, CardTitle } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
const ProductDetails = ({ variant, productvarientId }) => {
  const images = variant?.images?.length ? variant.images.map(img => img.url) : [];
  const [activeIndex, setActiveIndex] = useState(0);
console.log('variant', variant);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  const handleThunkSelect = (index) => {
    setActiveIndex(index);
  };

  if (!variant) return null;

  return (
    <Row>
      <Col lg={12} >
        <Box sx={{ backgroundColor: '#fff', p: 2, mb: 2, borderRadius: 2 }}>
          <CardHeader >
            <CardTitle >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                <Typography variant='h6'>Product Detail</Typography>
                <Link to={`/products/product-edit/${productvarientId}`} className="btn btn-sm btn-primary">
                  Edit Product
                </Link>
              </Box>
            </CardTitle>
          </CardHeader>
        </Box>
      </Col>
      <Col lg={4}>
        <Card>

          <CardBody>
            <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel">
              <Carousel activeIndex={activeIndex} onSelect={handleSelect} indicators={false} className="carousel-inner" role="listbox">
                {images.length > 0 ? (
                  images.map((item, idx) => (
                    <CarouselItem key={idx}>
                      <img src={item} alt="productImg" className="img-fluid bg-light rounded" />
                    </CarouselItem>
                  ))
                ) : (
                  <CarouselItem>
                    <div className="bg-light rounded p-5 text-center">No Image Available</div>
                  </CarouselItem>
                )}
              </Carousel>
              <div className="carousel-indicators m-0 mt-2 d-lg-flex d-none position-static h-100">
                {images.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleThunkSelect(idx)}
                    className={clsx('w-auto h-auto rounded bg-light', {
                      active: activeIndex === idx,
                    })}
                  >
                    <img src={item} className="d-block avatar-xl" alt="indicator-img" />
                  </button>
                ))}
              </div>
            </div>
          </CardBody>

        </Card>
      </Col>
      <Col lg={8}>
        <Card>
          <CardBody>
            <h4 className="badge bg-success text-light fs-14 py-1 px-2">{variant.isActive ? 'Active' : 'Inactive'}</h4>
            <p className="mb-1">
              <Link to="" className="fs-24 text-dark fw-medium">
                {variant.name}
              </Link>
            </p>

            <h2 className="fw-medium my-3">
              {currency}{variant.salePrice} <span className="fs-16 text-decoration-line-through">{currency}{variant.purchasePrice}</span>
            </h2>

            <Row className="align-items-center g-2 mt-3">
              {variant.attributes?.map((attr, idx) => (
                <Col lg={3} key={idx}>
                  <div>
                    <h5 className="text-dark fw-medium">
                      {attr.name} &gt; <span className="text-muted">{attr.value}</span>
                    </h5>
                  </div>
                </Col>
              ))}
            </Row>

            <div className="quantity mt-4">
              <h4 className="text-dark fw-medium mt-3">Pack Size: {variant.packSize || 'N/A'}</h4>
              <h4 className="text-dark fw-medium mt-3">Net Weight: {variant.netWeight || 'N/A'}</h4>
            </div>

            <ul className="d-flex flex-column gap-2 list-unstyled fs-15 my-3">
              <li>
                <IconifyIcon icon="bx:check" className="text-success" /> SKU: {variant.sku}
              </li>
              <li>
                <IconifyIcon icon="bx:check" className="text-success" /> Barcode: {variant.barcode}
              </li>
              <li>
                <IconifyIcon icon="bx:check" className="text-success" /> {variant.isActive ? 'Available' : 'Currently Unavailable'}
              </li>
            </ul>
            <h4 className="text-dark fw-medium">Description :</h4>
            <p className="text-muted">
              This is a variant of product ID: {variant.product}.
              It has a sale price of {currency}{variant.salePrice} and is currently {variant.isActive ? 'active' : 'inactive'}.
            </p>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductDetails;