import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import { Card, CardFooter, CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useGetVariantsByProductQuery } from '../../../../../services/authenticateendpoint/productvariant';
import { useGetAllProductsQuery } from '../../../../../services/authenticateendpoint/product';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ChoicesSearchFormInput from '@/components/formikfield/ChoicesSearchFormInput';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
const ProductCard = ({
  item, image,

  _id
}) => {
  return <tr>
    <td>
      <div className="form-check ms-1">
        <input type="checkbox" className="form-check-input" id="customCheck2" />
        <label className="form-check-label" htmlFor="customCheck2">
          &nbsp;
        </label>
      </div>
    </td>
    {/* <td>
      <div className="d-flex align-items-center gap-2">
        <div className="rounded bg-light avatar-md d-flex align-items-center justify-content-center">
          <img src={image} alt="product" className="avatar-md" />
        </div>
        <div>
          <Link to="" className="text-dark fw-medium fs-15">
            {item?.name}
          </Link>
        </div>
      </div>
    </td> */}

    <td>{item?.name}</td>
    <td>{item?.salePrice}</td>
    <td>{item?.purchasePrice}</td>
    <td>{item?.sku}</td>
    <td><span className={item?.isActive ? 'badge bg-success' : 'badge bg-danger'}>{item?.isActive ? 'Active' : 'Inactive'}</span></td>
    <td>
      <div className="d-flex gap-2">
        <Link to={`/products/product-varient-details/${_id}`} className="btn btn-light btn-sm">
          <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
        </Link>
        <Link to={`/products/product-varient-edit/${_id}`} className="btn btn-soft-primary btn-sm">
          <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
        </Link>
        <Link to="" className="btn btn-soft-danger btn-sm">
          <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
        </Link>
      </div>
    </td>
  </tr>;
};
const ProductList = () => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const { data: productsData, error: productsError, refetch: refetchProducts } = useGetAllProductsQuery();
  const { data: variantData, isLoading, error, refetch: refetchVariants } = useGetVariantsByProductQuery(selectedProductId, {
    skip: !selectedProductId
  });

  useEffect(() => {
    if (productsError) toast.error(extractApiErrorMessage(productsError));
  }, [productsError]);
  useEffect(() => {
    if (error) toast.error(extractApiErrorMessage(error));
  }, [error]);

  const productOptions = productsData?.map(p => ({ value: p._id, label: p.name })) || [];
  return <Card>
    <CardHeader className="d-flex justify-content-between align-items-center gap-1">
      <CardTitle as={'h4'} className="flex-grow-1 mb-0">
        All Variants
      </CardTitle>

      <div style={{ width: '300px', marginTop: '20px' }} className="me-2">
        <ChoicesSearchFormInput
          label=""
          placeholder="Select Product to see Variants"
          options={productOptions}
          value={selectedProductId}
          onChange={(val) => setSelectedProductId(val)}
        />
      </div>

      <Link to="/products/product-varient-add" className="btn btn-sm btn-primary">
        Add Variant
      </Link>
      <Dropdown>
        <DropdownToggle as={'a'} href="#" className="btn btn-sm btn-outline-light content-none" data-bs-toggle="dropdown" aria-expanded="false">
          This Month
          <IconifyIcon width={16} height={16} className="ms-1" icon="bx:chevron-down" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <DropdownItem>Download</DropdownItem>
          <DropdownItem>Export</DropdownItem>
          <DropdownItem>Import</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </CardHeader>
    <div>
      <div className="table-responsive">
        <table className="table align-middle mb-0 table-hover table-centered">
          <thead className="bg-light-subtle">
            <tr>
              <th style={{
                width: 20
              }}>
                <div className="form-check ms-1">
                  <input type="checkbox" className="form-check-input" id="customCheck1" />
                  <label className="form-check-label" htmlFor="customCheck1" />
                </div>
              </th>
              <th>Product Name</th>
              <th>Sale Price</th>
              <th>Purchase Price</th>
              <th>SKU</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan="7" className="text-center">Loading variants...</td>
              </tr>
            )}
            {!selectedProductId && !isLoading && (
              <tr>
                <td colSpan="7" className="text-center">Please select a product to view variants</td>
              </tr>
            )}
            {selectedProductId && variantData?.length === 0 && !isLoading && (
              <tr>
                <td colSpan="7" className="text-center">No variants found for this product</td>
              </tr>
            )}
            {variantData?.map((item, idx) => (
              <ProductCard
                key={idx}
                {...item}
                item={item}
                image={item.images?.[0]?.url}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <CardFooter className="border-top">
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-end mb-0">
          <li className="page-item">
            <Link className="page-link" to="">
              Previous
            </Link>
          </li>
          <li className="page-item active">
            <Link className="page-link" to="">
              1
            </Link>
          </li>
          <li className="page-item">
            <Link className="page-link" to="">
              2
            </Link>
          </li>
          <li className="page-item">
            <Link className="page-link" to="">
              3
            </Link>
          </li>
          <li className="page-item">
            <Link className="page-link" to="">
              Next
            </Link>
          </li>
        </ul>
      </nav>
    </CardFooter>
  </Card>;
};
export default ProductList;