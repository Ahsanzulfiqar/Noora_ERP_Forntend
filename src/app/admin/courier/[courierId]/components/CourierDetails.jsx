import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, CardHeader, CardTitle, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useGetCourierByIdQuery } from '../../../../../services/authenticateendpoint/courier';
import LoaderSpinner from '@/components/loaders/LoaderSpinner';

const CourierDetails = () => {
    const { courierId } = useParams();

    const { data, isLoading, error } = useGetCourierByIdQuery(courierId, { skip: !courierId })

    if (isLoading) return <LoaderSpinner />
    if (error) return <div>Error loading courier details</div>

    return <Col lg={12}>
        <Card>
            <CardHeader>
                <CardTitle as={'h4'}>Courier Details</CardTitle>
            </CardHeader>
            <CardBody>
                <div>
                    <ul className="d-flex flex-column gap-2 list-unstyled fs-14 text-muted mb-0">
                        <li>
                            <span className="fw-medium text-dark">Name</span>
                            <span className="mx-2">:</span>{data?.name}
                        </li>
                        <li>
                            <span className="fw-medium text-dark">Status</span>
                            <span className="mx-2">:</span>
                            {data?.isActive ? (
                                <span className="badge bg-success">Active</span>
                            ) : (
                                <span className="badge bg-danger">Inactive</span>
                            )}
                        </li>
                    </ul>
                </div>
            </CardBody>
        </Card>
    </Col>;
};
export default CourierDetails;
