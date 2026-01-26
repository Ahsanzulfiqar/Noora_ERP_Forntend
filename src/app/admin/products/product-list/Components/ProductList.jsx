import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { currency } from '@/context/constants'
import { Card, CardFooter, CardHeader, CardTitle, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useDeleteProductMutation, useGetAllProductsQuery } from '../../../../../services/endpoints/product'
import IconButton from '@mui/material/IconButton'
const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [deleteProduct] = useDeleteProductMutation();

  const { _id, name, brand, sku, category, subCategory, purchasePrice, salePrice, isActive, attributes, images } = product || {}
  return (
    
    <tr>
      <td>
        <div className="form-check ms-1">
          <input type="checkbox" className="form-check-input" id={`customCheck-${product._id}`} />
          <label className="form-check-label" htmlFor={`customCheck-${product._id}`}>
            &nbsp;
          </label>
        </div>
      </td>
      <td>
        <div className="d-flex align-items-center gap-2">
          {/* <div className="rounded bg-light avatar-md d-flex align-items-center justify-content-center" style={{ width: '30px', height: '30px' }}>
            <img src={images?.[0]?.url || ''} alt={images?.[0]?.alt || 'product'} className="avatar-md" />
          </div> */}
          <div>
            <Link to="" className="text-dark fw-medium fs-15">
              {name}
            </Link>
          </div>
        </div>
      </td>
      <td>{brand}</td>
      <td>{sku}</td>
      <td>{category}</td>
      <td>{subCategory}</td>
      <td>
        {currency}
        {purchasePrice}
      </td>
      <td>
        {currency}
        {salePrice}
      </td>
      <td>
        {attributes?.map((attr, index) => (
          <span key={index} className="badge bg-light text-dark me-1">
            {attr.name}: {attr.value}
          </span>
        ))}
      </td>
      <td>{isActive ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span>}</td>
      <td>
        <div className="d-flex gap-2">
          <IconButton
            size="small"
            className="btn btn-light btn-sm"
            aria-label="view"
            onClick={() => navigate(`/products/product-details/${_id}`)}
          >
            <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
          </IconButton>
          <IconButton
            size="small"
            className="btn btn-soft-primary btn-sm"
            aria-label="edit"
            onClick={() => navigate(`/products/product-edit/${_id}`)}
          >
            <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
          </IconButton>
          <IconButton
            size="small"
            className="btn btn-soft-danger btn-sm"
            aria-label="delete"
            onClick={() => deleteProduct(_id)}
          >
            <IconifyIcon
              icon="solar:trash-bin-minimalistic-2-broken"
              className="align-middle fs-18"
            />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
const ProductList = () => {
  const { data: productData, isLoading, error } = useGetAllProductsQuery()

  console.log(productData)
  return (
    <Card>
      <CardHeader className="d-flex justify-content-between align-items-center gap-1">
        <CardTitle as={'h4'} className="flex-grow-1">
          All Products Lists
        </CardTitle>
        <Link to="/products/product-add" className="btn btn-sm btn-primary">
          Add Product
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
                <th
                  style={{
                    width: 20,
                  }}>
                  <div className="form-check ms-1">
                    <input type="checkbox" className="form-check-input" id="customCheck1" />
                    <label className="form-check-label" htmlFor="customCheck1" />
                  </div>
                </th>
                <th>Name</th>
                <th>Brand</th>
                <th>Sku</th>
                <th>Category</th>
                <th>Sub Category</th>
                <th>Purchase Price</th>
                <th>Sale Price</th>
                <th>Attributes</th>
                <th>Status</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan="11" className="text-center">
                    Loading...
                  </td>
                </tr>
              )}
              {error && (
                <tr>
                  <td colSpan="11" className="text-center text-danger">
                    Error loading products
                  </td>
                </tr>
              )}
              {productData?.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
              {!isLoading && !error && productData?.length === 0 && (
                <tr>
                  <td colSpan="11" className="text-center">
                    No Record Found
                  </td>
                </tr>
              )}
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
    </Card>
  )
}
export default ProductList
