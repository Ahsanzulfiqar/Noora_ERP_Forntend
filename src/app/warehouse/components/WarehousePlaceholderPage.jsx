import { Card, CardBody } from 'react-bootstrap'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import PageTItle from '@/components/PageTItle'

const WarehousePlaceholderPage = ({ title, subtitle, icon = 'solar:box-bold-duotone' }) => {
  return (
    <>
      <PageTItle title={title} />

      <div className="mb-3">
        <h3 className="mb-0">{title}</h3>
        {subtitle ? <p className="text-muted mb-0">{subtitle}</p> : null}
      </div>

      <Card className="mb-0">
        <CardBody className="text-center py-5">
          <div
            className="rounded-circle bg-soft-primary flex-centered mx-auto mb-3"
            style={{ width: 64, height: 64 }}
          >
            <IconifyIcon icon={icon} className="fs-32 text-primary" />
          </div>
          <h5 className="mb-2">Coming soon</h5>
          <p className="text-muted mb-0">This page is scaffolded and will be wired up next.</p>
        </CardBody>
      </Card>
    </>
  )
}

export default WarehousePlaceholderPage
