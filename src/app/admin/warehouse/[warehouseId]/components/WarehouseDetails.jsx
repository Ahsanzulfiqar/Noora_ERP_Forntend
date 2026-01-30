import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Card, CardBody, CardHeader, CardTitle, Col } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useGetWarehouseByIdQuery } from '../../../../../services/endpoints/warehouse';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Contact, MapPin } from 'lucide-react';
const WarehouseDetails = () => {
  const { warehouseId } = useParams();
  console.log(warehouseId);

  const { data, isLoading, error } = useGetWarehouseByIdQuery(warehouseId)
  console.log(data, isLoading, error);
  return <Col lg={12}>
    <Card>
      <CardHeader >
        <CardTitle >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
            <Typography variant='h6'>Warehouse Detail</Typography>
            <Link to={`/warehouses/warehouse-edit/${warehouseId}`} className="btn btn-sm btn-primary">
              Edit Ware House
            </Link>
          </Box>
        </CardTitle>

      </CardHeader>
      <CardBody>
        <Box>
          {!data?.ismain  && <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h5' fontWeight={'bold'} className='text-capitalize'>
              {data?.mainId}
            </Typography>
            {<span className="badge bg-success" style={{ fontSize: '12px', paddingX: '12px', paddingY: '5px' }}>Main</span>}
          </Box>}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant='h5' fontWeight={'bold'} className='text-capitalize'>
              {data?.name}
            </Typography>
            {data?.ismain ? <span className="badge bg-success" style={{ fontSize: '12px', paddingX: '12px', paddingY: '5px' }}>Main</span> : <span className="badge bg-danger" style={{ fontSize: '12px', paddingX: '10px', paddingY: '5px' }}>Not Main</span>}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5, flexDirection: 'column', mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Contact size={18} className='me-1' />
              <Typography variant='body2'>
                {data?.contact}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MapPin size={18} className='me-1' />
              <Typography variant='body2'>
                {data?.country} , {data?.city}
              </Typography>
            </Box>
          </Box>
        </Box>

      </CardBody>
    </Card>
  </Col>;
};
export default WarehouseDetails;