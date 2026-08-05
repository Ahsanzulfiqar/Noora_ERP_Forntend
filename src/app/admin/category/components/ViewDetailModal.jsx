import React from 'react';
import { Modal, Button, Badge, Table } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const HERO_KEYS = new Set(['name', 'slug', 'isActive', 'description']);

const ViewDetailModal = ({ show, onHide, title, data, fields }) => {
    const infoFields = fields.filter((f) => !HERO_KEYS.has(f.key));
    const hasName = Boolean(data?.name);
    const hasSlug = Boolean(data?.slug);
    const hasDescription = Boolean(data?.description);
    const hasStatus = fields.some((f) => f.key === 'isActive');

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="border-bottom py-3">
                <Modal.Title className="fw-bold text-dark">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {(hasName || hasStatus) && (
                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-4">
                        <div>
                            {hasName && (
                                <h4 className="fw-bold text-dark mb-2 text-capitalize">{data.name}</h4>
                            )}
                            {hasSlug && (
                                <span className="badge bg-light text-dark border py-2 px-3 fs-13">
                                    <IconifyIcon icon="solar:hashtag-square-broken" className="me-1 text-primary" />
                                    Slug: <span className="fw-bold text-capitalize">{data.slug}</span>
                                </span>
                            )}
                        </div>
                        {hasStatus && (
                            <Badge
                                bg={data.isActive ? 'success-subtle' : 'danger-subtle'}
                                className={`text-${data.isActive ? 'success' : 'danger'} px-3 py-2 fs-12 border border-${data.isActive ? 'success' : 'danger'}`}
                            >
                                {data.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                        )}
                    </div>
                )}

                {hasDescription && (
                    <div className="mb-4">
                        <h5 className="fw-bold text-dark border-bottom pb-2 mb-2">Description</h5>
                        <p className="text-muted mb-0 text-capitalize" style={{ whiteSpace: 'pre-line' }}>
                            {data.description}
                        </p>
                    </div>
                )}

                {infoFields.length > 0 && (
                    <div>
                        <h5 className="fw-bold text-dark border-bottom pb-2 mb-3">General Information</h5>
                        <Table borderless size="sm" className="mb-0">
                            <tbody>
                                {infoFields.map((field, index) => (
                                    <tr key={index}>
                                        <td className="ps-0 py-2 text-muted" style={{ width: '180px' }}>
                                            {field.label}
                                        </td>
                                        <td className={`py-2 text-dark fw-semibold ${field.className || ''}`}>
                                            {field.render ? field.render(data) : (data[field.key] || '-')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ViewDetailModal;
