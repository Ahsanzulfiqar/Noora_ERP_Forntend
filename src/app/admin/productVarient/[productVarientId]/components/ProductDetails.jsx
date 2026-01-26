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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <p>
                <Link to="" className="fs-24 text-dark fw-medium">
                  {variant.name}
                </Link>
              </p>
              <h4 className="badge bg-success text-light fs-14 py-1 px-2">{variant.isActive ? 'Active' : 'Inactive'}</h4>

            </Box>

            <div className="table-responsive  ">
              <table className="table table-sm table-bordered align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-2">Price & Specifications</th>
                    <th className="py-2">Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-muted py-1" style={{ width: '180px' }}>Sale Price</td>
                    <td className="py-1">
                      <h3 className="text-primary fw-bold mb-0">{currency}{variant.salePrice}</h3>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted py-1">Purchase Price</td>
                    <td className="py-1">
                      <span className="text-muted  fs-18">{currency}{variant.purchasePrice}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted py-1">Net Weight</td>
                    <td className="py-1 fw-medium text-dark fs-16">{variant.netWeight || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="text-muted py-1">Pack Size</td>
                    <td className="py-1 fw-medium text-dark fs-16">{variant.packSize || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="table-responsive mt-3">
              <table className="table table-sm table-bordered align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th className="py-2">Attribute</th>
                    <th className="py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {variant.attributes?.map((attr, idx) => (
                    <tr key={idx}>
                      <td className="text-muted py-1" style={{ width: '140px' }}>{attr.name}</td>
                      <td className="py-1 fw-medium text-dark fs-16">{attr.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


            <ul className="d-flex flex-column gap-2 list-unstyled fs-15 my-3">
              <li>
                <IconifyIcon icon="bx:check" className="text-success" /> SKU: {variant.sku}
              </li>
              <li>
                <IconifyIcon icon="bx:check" className="text-success" /> Barcode: {variant.barcode}
              </li>

            </ul>
            {/* <h4 className="text-dark fw-medium">Description :</h4> */}
            {/* <p className="text-muted">
              This is a variant of product ID: {variant.product}.
              It has a sale price of {currency}{variant.salePrice} and is currently {variant.isActive ? 'active' : 'inactive'}.
            </p> */}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default ProductDetails;