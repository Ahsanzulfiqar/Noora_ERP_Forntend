import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { useEffect } from 'react';
import { useGetWarehouseStockByIdQuery } from '@/services/authenticateendpoint/stock';
import { Card, CardBody, CardTitle, Col, Row, Table } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';
import { useAuth } from '@/hooks/useAuth';
import { ROLES } from '@/assets/data/roles';
import { formatCurrency } from '@/helpers/currency';

const WarehouseInventoryDetails = () => {
    const { inventoryId } = useParams();
    const { role } = useAuth();
    const isAdmin = role === ROLES.ADMIN;
    const { data: stockData, isLoading, error, refetch } = useGetWarehouseStockByIdQuery(inventoryId);

    useEffect(() => {
        if (error) toast.error(extractApiErrorMessage(error));
    }, [error]);

    if (isLoading) {
        return (
            <Card>
                <CardBody>
                    <p>Loading...</p>
                </CardBody>
            </Card>
        );
    }

    if (error) {
        return null;
    }

    if (!stockData) {
        return (
            <Card>
                <CardBody>
                    <p>Inventory not found</p>
                </CardBody>
            </Card>
        );
    }

    return (
        <Row>
            <Col lg={12}>
                <Card>
                    <CardBody>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <CardTitle as="h4">Stock Information</CardTitle>
                            <div className="d-flex gap-2">
                                {isAdmin && (
                                    <Link
                                        to={`/inventory/warehouse-edit/${inventoryId}`}
                                        className="btn btn-sm btn-primary"
                                    >
                                        <IconifyIcon icon="solar:pen-2-broken" className="me-1 align-middle" />
                                        Update Inventory
                                    </Link>
                                )}
                                <Link to="/inventory/warehouse" className="btn btn-sm btn-outline-secondary">
                                    <IconifyIcon icon="solar:arrow-left-broken" className="me-1 align-middle" />
                                    Back to List
                                </Link>
                            </div>
                        </div>
                        <Row className="g-3">
                            <Col md={6}>
                                <div className="border p-3 rounded">
                                    <h6 className="text-muted mb-1">Product Details</h6>
                                    <h5 className="mb-1">{stockData.productName}</h5>
                                    <p className="mb-0 text-muted">Variant: {stockData.variantName || '-'}</p>
                                </div>
                            </Col>
                            <Col md={6}>
                                <div className="border p-3 rounded">
                                    <h6 className="text-muted mb-1">Warehouse Details</h6>
                                    <h5 className="mb-0">{stockData.warehouseName}</h5>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="border p-3 rounded">
                                    <h6 className="text-muted mb-1">Total Quantity</h6>
                                    <h4 className="mb-0 text-dark">{stockData.quantity}</h4>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="border p-3 rounded">
                                    <h6 className="text-muted mb-1">Reserved</h6>
                                    <h4 className="mb-0 text-dark">{stockData.reserved}</h4>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="border p-3 rounded">
                                    <h6 className="text-muted mb-1">Available</h6>
                                    <h4 className="mb-0 text-dark">{stockData.quantity - stockData.reserved}</h4>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="border p-3 rounded">
                                    <h6 className="text-muted mb-1">Reorder Level</h6>
                                    <h4 className="mb-0 text-dark">{stockData.reorderLevel}</h4>
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="border p-3 rounded">
                                    <h6 className="text-muted mb-1">Avg Price</h6>
                                    <h4 className="mb-0 text-dark">{formatCurrency(stockData.avgCost)}</h4>
                                </div>
                            </Col>
                        </Row>

                        <hr className="my-4" />

                        <CardTitle as="h4" className="mb-3">Batches</CardTitle>
                        {stockData.batches && stockData.batches.length > 0 ? (
                            <div className="table-responsive">
                                <Table bordered hover>
                                    <thead className="bg-light">
                                        <tr>
                                            <th>Batch No</th>
                                            <th>Expiry Date</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stockData.batches.map((batch, index) => (
                                            <tr key={index}>
                                                <td>{batch.batchNo}</td>
                                                <td>{batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : '-'}</td>
                                                <td>{batch.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        ) : (
                            <p className="text-muted">No batch information available.</p>
                        )}
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default WarehouseInventoryDetails;
