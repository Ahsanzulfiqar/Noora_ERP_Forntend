import PageTItle from '@/components/PageTItle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAllPurchasesQuery, useDeletePurchaseMutation } from '@/services/authenticateendpoint/purchases'
import { Card, CardBody, CardFooter, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import StatusAlert from '@/components/StatusAlert'
import { formatDate } from '../../../../helpers/format'

const PurchaseListPage = () => {

  const { data: purchases, isLoading, isError } = useGetAllPurchasesQuery()
  const [deletePurchase, { isLoading: isDeleting, isSuccess: isDeleteSuccess, error: deleteError }] = useDeletePurchaseMutation()

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this purchase?")) {
      await deletePurchase(id)
    }
  }

  return (
    <>
      <StatusAlert isSuccess={isDeleteSuccess} message="Purchase deleted successfully" error={deleteError} />
      <PageTItle title="Purchase List" />
      <Row>
        <Col xl={12}>
          <Card>
            <div className="d-flex card-header justify-content-between align-items-center">
              <div>
                <CardTitle as={'h4'}>All Purchase Items</CardTitle>
              </div>
              <Dropdown>
                <DropdownToggle
                  as={'a'}
                  href="#"
                  className="btn btn-sm btn-outline-light rounded content-none icons-center"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  This Month <IconifyIcon className="ms-1" width={16} height={16} icon="bx:chevron-down" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem>Download</DropdownItem>
                  <DropdownItem>Export</DropdownItem>
                  <DropdownItem>Import</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <CardBody className="p-0">
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
                      <th>Supplier Name</th>
                      <th>Invoice No</th>
                      <th>Warehouse</th>
                      <th>Purchase Date</th>
                      <th>Status</th>
                      <th>Sub Total</th>
                      <th>Tax Amount</th>
                      <th>Total Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td colSpan="10" className="text-center">Loading...</td>
                      </tr>
                    )}
                    {isError && (
                      <tr>
                        <td colSpan="10" className="text-center text-danger">Error loading purchases</td>
                      </tr>
                    )}
                    {!isLoading && !isError && purchases?.length === 0 && (
                      <tr>
                        <td colSpan="10" className="text-center">No Record Found</td>
                      </tr>
                    )}

                    {purchases?.map((purchase, index) => (
                      <tr key={purchase._id || index}>
                        <td>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id={`customCheck${index}`} />
                            <label className="form-check-label" htmlFor={`customCheck${index}`} />
                          </div>
                        </td>
                        <td>{purchase.supplierName}</td>
                        <td>{purchase.invoiceNo}</td>
                        <td>{purchase.warehouse}</td>
                        <td>{formatDate(purchase.purchaseDate)}</td>
                        <td>{purchase.status}</td>
                        <td>{purchase.subTotal}</td>
                        <td>{purchase.taxAmount}</td>
                        <td>{purchase.totalAmount}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Link to={`/purchases/purchase-edit/${purchase._id}`} className="btn btn-light btn-sm"
                            >
                              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />

                            </Link>
                            <Link to={`/purchases/purchase-invoice/${purchase._id}`} className="btn btn-light btn-sm">
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </Link>
                            <Button className="btn btn-light btn-sm" onClick={() => handleDelete(purchase._id)} disabled={isDeleting}>
                              <IconifyIcon
                                icon="solar:trash-bin-minimalistic-2-broken"
                                className="align-middle fs-18"
                              />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
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
    </>
  )
}
export default PurchaseListPage
