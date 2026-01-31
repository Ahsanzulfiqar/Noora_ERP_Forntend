import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';

const ViewDetailModal = ({ show, onHide, title, data, fields }) => {
    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="g-3">
                    {fields.map((field, index) => (
                        <Col key={index} md={field.col || 6}>
                            <div className="mb-2">
                                <label className="form-label fw-bold text-muted mb-1">{field.label}</label>
                                <p className={`mb-0 ${field.className || ''}`}>
                                    {field.render ? field.render(data) : (data[field.key] || 'N/A')}
                                </p>
                            </div>
                        </Col>
                    ))}
                </Row>
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
