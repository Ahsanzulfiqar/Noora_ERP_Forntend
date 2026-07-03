import { Card, CardBody, CardHeader, CardTitle, Table, Pagination, Form, Row, Col } from 'react-bootstrap';
import { useGetWarehouseStockQuery } from '../../../../../services/authenticateendpoint/warehouse';
import { useGetAllWarehousesQuery } from '../../../../../services/authenticateendpoint/warehouse';
import { useGetAllProductsQuery } from '../../../../../services/authenticateendpoint/product';
import { useGetVariantsByProductQuery } from '../../../../../services/authenticateendpoint/productvariant';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import GlobalSpinner from '../../../../../components/loaders/GlobalSpinner';
import { extractApiErrorMessage } from '@/components/ApiErrorAlert';

const StockList = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);

    // Filter states
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedVariant, setSelectedVariant] = useState('');

    // Fetch dropdown data
    const { data: warehousesData, error: warehousesError } = useGetAllWarehousesQuery();
    const { data: productsData, error: productsError } = useGetAllProductsQuery();
    const { data: variantsData, error: variantsError } = useGetVariantsByProductQuery(selectedProduct, {
        skip: !selectedProduct
    });

    // Build filter object dynamically
    const filter = {};
    if (selectedWarehouse) filter.warehouseId = selectedWarehouse;
    if (selectedProduct) filter.productId = selectedProduct;
    if (selectedVariant) filter.variantId = selectedVariant;

    const { data, isLoading, isError, error: stockError, refetch } = useGetWarehouseStockQuery({
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        page,
        limit
    });

    const stockData = data?.data || [];
    const pagination = data || {};

    useEffect(() => {
        if (stockError) toast.error(extractApiErrorMessage(stockError));
    }, [stockError]);
    useEffect(() => {
        if (warehousesError) toast.error(extractApiErrorMessage(warehousesError));
    }, [warehousesError]);
    useEffect(() => {
        if (productsError) toast.error(extractApiErrorMessage(productsError));
    }, [productsError]);
    useEffect(() => {
        if (variantsError) toast.error(extractApiErrorMessage(variantsError));
    }, [variantsError]);

    // Handle product change - reset variant when product changes
    const handleProductChange = (e) => {
        setSelectedProduct(e.target.value);
        setSelectedVariant(''); // Reset variant when product changes
    };

    if (isLoading) return <GlobalSpinner />;

    return (
        <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
                <CardTitle>Stock List</CardTitle>
            </CardHeader>
            <CardBody>
                {/* Filter Section */}
                <Row className="mb-4">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Warehouse</Form.Label>
                            <Form.Select
                                value={selectedWarehouse}
                                onChange={(e) => setSelectedWarehouse(e.target.value)}
                            >
                                <option value="">All Warehouses</option>
                                {warehousesData?.map((warehouse) => (
                                    <option key={warehouse._id} value={warehouse._id}>
                                        {warehouse.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Product</Form.Label>
                            <Form.Select
                                value={selectedProduct}
                                onChange={handleProductChange}
                            >
                                <option value="">All Products</option>
                                {productsData?.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Variant</Form.Label>
                            <Form.Select
                                value={selectedVariant}
                                onChange={(e) => setSelectedVariant(e.target.value)}
                                disabled={!selectedProduct}
                            >
                                <option value="">All Variants</option>
                                {variantsData?.map((variant) => (
                                    <option key={variant._id} value={variant._id}>
                                        {variant.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                {/* Table Section */}
                <div className="table-responsive">
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th>Warehouse</th>
                                <th>Product</th>
                                <th>Variant</th>
                                <th>Quantity</th>
                                <th>Reserved</th>
                                <th>Reorder Level</th>
                                <th>Last Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockData.length > 0 ? (
                                stockData.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.warehouseName || 'N/A'}</td>
                                        <td>{item.productName || 'N/A'}</td>
                                        <td>{item.variantName || 'N/A'}</td>
                                        <td>{item.quantity ?? 0}</td>
                                        <td>{item.reserved ?? 0}</td>
                                        <td>{item.reorderLevel ?? 0}</td>
                                        <td>{item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center">No stock data found</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {/* Pagination Section */}
                {pagination.totalPages > 1 && (
                    <div className="d-flex justify-content-end mt-3">
                        <Pagination>
                            <Pagination.Prev
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            />
                            {[...Array(pagination.totalPages)].map((_, idx) => (
                                <Pagination.Item
                                    key={idx + 1}
                                    active={idx + 1 === page}
                                    onClick={() => setPage(idx + 1)}
                                >
                                    {idx + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages}
                            />
                        </Pagination>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};
export default StockList;