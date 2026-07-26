import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllOrders } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import { useState, useMemo } from 'react';
import { Button, Card, CardBody, CardTitle, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomTablePaginations from '@/components/table/CustomTablePaginations';
const Orders = () => {
  const orderData = useFetchData(getAllOrders);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const totalItems = orderData?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const pagedOrders = useMemo(
    () => (orderData || []).slice((page - 1) * limit, page * limit),
    [orderData, page, limit]
  );
  return <Col>
      <Card>
        <CardBody>
          <div className="d-flex align-items-center justify-content-between">
            <CardTitle as={'h4'}>Recent Orders</CardTitle>
            <Button variant="soft-primary" size="sm">
              <IconifyIcon icon="bx:plus" className="me-1" />
              Create Order
            </Button>
          </div>
        </CardBody>
        <div className="table-responsive table-centered">
          <table className="table mb-0">
            <thead className="bg-light bg-opacity-50">
              <tr>
                <th className="ps-3">Order ID.</th>
                <th>Date</th>
                <th>Product</th>
                <th>Customer Name</th>
                <th>Email ID</th>
                <th>Phone No.</th>
                <th>Address</th>
                <th>Payment Type</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pagedOrders.map((item, idx) => <tr key={idx}>
                  <td className="ps-3">
                    <Link to="/orders/order-detail">#{item.id}</Link>
                  </td>
                  <td>29 April 2024</td>
                  <td>{item.product?.image && <img src={item.product?.image} alt="product-1(1)" className="img-fluid avatar-sm" />}</td>
                  <td>
                    <Link to="#!">{item.customer?.name}</Link>
                  </td>
                  <td>{item.customer?.email}</td>
                  <td>{item.customer?.phone}</td>
                  <td>{item.customer?.address}</td>
                  <td>{item.paymentMethod}</td>
                  <td>
                    <IconifyIcon icon="bxs:circle" className={`text-${item.status == 'Completed' ? 'success' : item.status == 'Processing' ? 'warning' : 'primary'} me-1`} />
                    {item.status}
                  </td>
                </tr>)}
            </tbody>
          </table>
        </div>
        <CustomTablePaginations
          limit={limit}
          setLimit={setLimit}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          options={[5, 10, 20, 50]}
        />
      </Card>
    </Col>;
};
export default Orders;