import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { useMarkSalePaidMutation } from '@/services/authenticateendpoint/sales'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'

const MarkPaidModal = ({ show, onHide, sale }) => {
  const [markSalePaid, { isLoading }] = useMarkSalePaidMutation()
  const [mode, setMode] = useState('COD')
  const [bankAccount, setBankAccount] = useState('')
  const [error, setError] = useState('')

  const reset = () => {
    setMode('COD')
    setBankAccount('')
    setError('')
  }

  const handleClose = () => {
    reset()
    onHide()
  }

  const handleSubmit = async () => {
    setError('')
    if (mode === 'ONLINE' && !bankAccount.trim()) {
      setError('Bank account is required for online payment.')
      return
    }
    try {
      const payment = mode === 'ONLINE' ? { mode, bankAccount: bankAccount.trim() } : { mode }
      await markSalePaid({ saleId: sale._id, payment }).unwrap()
      handleClose()
    } catch (err) {
      setError(extractApiErrorMessage(err) || 'Failed to mark sale as paid.')
    }
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Mark Sale Paid {sale?.invoiceNo ? `(${sale.invoiceNo})` : ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Payment Mode</Form.Label>
          <div className="d-flex gap-3">
            <Form.Check
              type="radio"
              id="pay-mode-cod"
              name="payment-mode"
              label="COD (Cash on Delivery)"
              checked={mode === 'COD'}
              onChange={() => setMode('COD')}
            />
            <Form.Check
              type="radio"
              id="pay-mode-online"
              name="payment-mode"
              label="Online"
              checked={mode === 'ONLINE'}
              onChange={() => setMode('ONLINE')}
            />
          </div>
        </Form.Group>

        {mode === 'ONLINE' && (
          <Form.Group className="mb-2">
            <Form.Label>Bank Account</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g. HBL-001"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
            />
          </Form.Group>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Mark as Paid'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default MarkPaidModal
