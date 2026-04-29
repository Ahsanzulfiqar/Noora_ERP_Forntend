import PageTItle from '@/components/PageTItle'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useGetAllPurchasesQuery, useDeletePurchaseMutation, usePostToStockMutation } from '@/services/authenticateendpoint/purchases'
import { useGetAllWarehousesQuery } from '@/services/authenticateendpoint/warehouse'
import { Card, CardBody, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CustomTablePaginations from '@/components/table/CustomTablePaginations'
import StatusAlert from '@/components/StatusAlert'
import { useState } from 'react'
import DeleteConfirmModal from '../../../../components/DeleteConfirmModal'
import { formatDate } from '../../../../helpers/format'

const PurchaseListPage = () => {

  const { data: purchases, isLoading, isError } = useGetAllPurchasesQuery()
  const { data: warehousesData } = useGetAllWarehousesQuery()
  const warehouseMap = (warehousesData || []).reduce((acc, w) => {
    acc[w._id] = w.name
    return acc
  }, {})
  const [deletePurchase, { isLoading: isDeleting, isSuccess: isDeleteSuccess, error: deleteError }] = useDeletePurchaseMutation()
  const [postToStock, { isLoading: isPosting, isSuccess: isPostSuccess, error: postError }] = usePostToStockMutation()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const totalPages = Math.ceil((purchases?.length || 0) / limit)
  const paginatedPurchases = purchases?.slice((page - 1) * limit, page * limit) || []

  const [showConfirm, setShowConfirm] = useState(false)
  const [showPostConfirm, setShowPostConfirm] = useState(false)
  const [showEditConfirm, setShowEditConfirm] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  // const handleDelete = async (id) => {
  //   if (window.confirm("Are you sure you want to delete this purchase?")) {
  //     await deletePurchase(id)
  //   }
  // }
  const handleDeleteClick = (id) => {
    setSelectedId(id)
    setShowConfirm(true)
  }
  const handleConfirmDelete = async () => {
    await deletePurchase(selectedId)
    setShowConfirm(false)
    setSelectedId(null)
  }

  const handleCancelDelete = () => {
    setShowConfirm(false)
    setSelectedId(null)
  }

  const handlePostToStockClick = (id) => {
    setSelectedId(id)
    setShowPostConfirm(true)
  }

  const handleConfirmPostToStock = async () => {
    try {
      await postToStock(selectedId).unwrap()
      setShowPostConfirm(false)
      setSelectedId(null)
    } catch (err) {
      console.error('Failed to post to stock:', err)
    }
  }

  const handleCancelPostToStock = () => {
    setShowPostConfirm(false)
    setSelectedId(null)
  }

  const navigate = useNavigate()

  const handleEditClick = (purchase) => {
    if (purchase.status === 'received' || purchase.status === 'confirmed') {
      setSelectedId(purchase._id)
      setShowEditConfirm(true)
    } else {
      navigate(`/purchases/purchase-edit/${purchase._id}`)
    }
  }

  const handleConfirmEdit = () => {
    setShowEditConfirm(false)
    setSelectedId(null)
  }

  const handleCancelEdit = () => {
    setShowEditConfirm(false)
    setSelectedId(null)
  }


  return (
    <>
      <DeleteConfirmModal
        show={showConfirm}
        title="Delete Purchase"
        message="Are you sure you want to delete this purchase?"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        confirmVariant="danger"
        loading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      <DeleteConfirmModal
        show={showPostConfirm}
        title="Post to Stock"
        message="Are you sure you want to post this purchase to stock?"
        confirmText="Yes, Post"
        cancelText="Cancel"
        confirmVariant="primary"
        loading={isPosting}
        onConfirm={handleConfirmPostToStock}
        onCancel={handleCancelPostToStock}
      />


      <DeleteConfirmModal
        show={showEditConfirm}
        title="Cannot Edit Purchase"
        message="This purchase is already received and cannot be edited."
        confirmText="OK"
        cancelText="Close"
        confirmVariant="secondary"
        onConfirm={handleConfirmEdit}
        onCancel={handleCancelEdit}
      />

      <StatusAlert isSuccess={isDeleteSuccess} message="Purchase deleted successfully" error={deleteError} />
      <StatusAlert isSuccess={isPostSuccess} message="Purchase posted to stock successfully" error={postError} />
      <PageTItle title="Purchase List" />
      <Row>
        <Col xl={12}>
          <Card>
            <div className="d-flex card-header justify-content-between align-items-center">
              <div>
                <CardTitle as={'h4'}>All Purchase Items</CardTitle>
              </div>
              <div className="d-flex gap-2">
                <Link to="/purchases/purchase-add" className="btn btn-sm btn-primary">
                  <IconifyIcon icon="bx:plus" className="me-1" /> Add New Purchase
                </Link>
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
                        <td colSpan="10" className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
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

                    {paginatedPurchases.map((purchase, index) => (
                      <tr key={purchase._id || index}>
                        <td>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id={`customCheck${index}`} />
                            <label className="form-check-label" htmlFor={`customCheck${index}`} />
                          </div>
                        </td>
                        <td>{purchase.supplierName}</td>
                        <td>{purchase.invoiceNo}</td>
                        <td>{warehouseMap[purchase.warehouse] || purchase.warehouse}</td>
                        <td>{formatDate(purchase.purchaseDate)}</td>
                        <td>{purchase.status}</td>
                        <td>{purchase.subTotal}</td>
                        <td>{purchase.taxAmount}</td>
                        <td>{purchase.totalAmount}</td>
                        <td>
                          <div className="d-flex gap-2">

                            <Button className="btn btn-light btn-sm" onClick={() => handleEditClick(purchase)}>
                              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                            </Button>

                            <Link to={`/purchases/purchase-detail/${purchase._id}`} className="btn btn-light btn-sm">
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </Link>
                            <Button className="btn btn-light btn-sm" onClick={() => handleDeleteClick(purchase._id)} disabled={isDeleting}>
                              <IconifyIcon
                                icon="solar:trash-bin-minimalistic-2-broken"
                                className="align-middle fs-18"
                              />
                            </Button>
                            {/* {!purchase.postedToStock && (
                              <Button
                                className="btn btn-soft-primary btn-sm"
                                onClick={() => handlePostToStockClick(purchase._id)}
                                disabled={isPosting}
                                title="Post to Stock"
                              >
                                <IconifyIcon icon="solar:send-square-bold-duotone" className="align-middle fs-18" />
                              </Button>
                            )} */}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
            <CustomTablePaginations
              limit={limit}
              setLimit={setLimit}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
export default PurchaseListPage
