import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { getAllOrders } from '@/helpers/data'
import { useFetchData } from '@/hooks/useFetchData'
import { Card, CardFooter, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
const CategoryList = () => {
  const categoryData = useFetchData(getAllOrders)
  return (
    <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center gap-1">
            <CardTitle as={'h4'} className="flex-grow-1">
              All Product Varient List
            </CardTitle>
            <Link to="/productVarientRoutes/productvarient-add" className="btn btn-sm btn-primary">
              Add Product Varient
            </Link>
            <Dropdown>
              <DropdownToggle className="btn btn-sm btn-outline-light content-none icons-center" data-bs-toggle="dropdown" aria-expanded="false">
                This Month <IconifyIcon className="ms-1" width={16} height={16} icon="bx:chevron-down" />
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
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="customCheck1" />
                        <label className="form-check-label" htmlFor="customCheck1" />
                      </div>
                    </th>
                    <th>Product</th>
                    <th>Name</th>
                    <th>Sku</th>
                    <th>Barcode</th>
                    <th>Purchase Price</th>
                    <th>Sale Price</th>
                    <th>Pack Size</th>
                    <th>Net Weight</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  No Record Found
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
      </Col>
    </Row>
  )
}
export default CategoryList
