import { Card, CardBody, CardHeader, CardTitle, Table, Form, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useGetAllWarehousesQuery } from '../../../../../services/authenticateendpoint/warehouse';
import { useGetAllProductsQuery } from '../../../../../services/authenticateendpoint/product';
import { useGetWarehouseProductBatchesQuery } from '../../../../../services/authenticateendpoint/stock';
import GlobalSpinner from '@/components/loaders/GlobalSpinner';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const WareHouseBatchList = () => {
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');

    const { data: warehouses, isLoading: isLoadingWarehouses, error: warehousesError, refetch: refetchWarehouses } = useGetAllWarehousesQuery();
    const { data: products, isLoading: isLoadingProducts, error: productsError, refetch: refetchProducts } = useGetAllProductsQuery();

    const { data: batchData, isLoading: isLoadingBatches, error: batchesError, refetch: refetchBatches } = useGetWarehouseProductBatchesQuery(
        {
            warehouseId: selectedWarehouse,
            productId: selectedProduct
        },
        {
            skip: !selectedWarehouse || !selectedProduct
        }
    );

    const batches = batchData?.GetWarehouseProductBatches || [];

    useEffect(() => {
        if (warehousesError) toast.error(extractApiErrorMessage(warehousesError));
    }, [warehousesError]);
    useEffect(() => {
        if (productsError) toast.error(extractApiErrorMessage(productsError));
    }, [productsError]);
    useEffect(() => {
        if (batchesError) toast.error(extractApiErrorMessage(batchesError));
    }, [batchesError]);

    if (isLoadingWarehouses || isLoadingProducts) return <GlobalSpinner />;

    return (
        <Card>
            <CardHeader>
                <CardTitle as="h4">Warehouse Batch List</CardTitle>
            </CardHeader>
            <CardBody>
                <Row className="mb-4">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Select Warehouse</Form.Label>
                            <Form.Select
                                value={selectedWarehouse}
                                onChange={(e) => setSelectedWarehouse(e.target.value)}
                            >
                                <option value="">Select Warehouse</option>
                                {warehouses?.map((warehouse) => (
                                    <option key={warehouse._id} value={warehouse._id}>
                                        {warehouse.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Select Product</Form.Label>
                            <Form.Select
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                            >
                                <option value="">Select Product</option>
                                {products?.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

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
                            {isLoadingBatches ? (
                                <tr>
                                    <td colSpan="3" className="text-center">Loading batches...</td>
                                </tr>
                            ) : !selectedWarehouse || !selectedProduct ? (
                                <tr>
                                    <td colSpan="3" className="text-center">Please select both Warehouse and Product to view batches</td>
                                </tr>
                            ) : batches.length > 0 ? (
                                batches.map((batch, index) => (
                                    <tr key={index}>
                                        <td>{batch.batchNo}</td>
                                        <td>{new Date(batch.expiryDate).toLocaleDateString()}</td>
                                        <td>{batch.quantity}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center">No batches found for this selection</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>
            </CardBody>
        </Card>
    );
};
export default WareHouseBatchList;