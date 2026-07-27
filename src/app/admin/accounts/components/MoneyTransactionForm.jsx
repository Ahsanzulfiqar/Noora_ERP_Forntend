import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Card, Col, Form, Row, Badge, Spinner } from 'react-bootstrap'
import Select from 'react-select'
import { toast } from 'react-toastify'
import { extractApiErrorMessage } from '@/components/ApiErrorAlert'
import {
  useCreateMoneyInMutation,
  useCreateMoneyOutMutation,
  useGetAccountsQuery,
} from '@/services/authenticateendpoint/account'

const todayAsInputValue = () => {
  const now = new Date()
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

const currencyFormatter = new Intl.NumberFormat('en-PK', {
  style: 'currency',
  currency: 'AED',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const MODE_CONFIG = {
  in: {
    title: 'Create Money In',
    sectionLabel: 'Income Details',
    accent: 'success',
    summaryBg: 'rgba(25, 135, 84, 0.06)',
    summaryTitle: 'You will receive',
    buttonLabel: 'Save Money In',
    sourceLabel: 'Received To (Cash/Bank)',
    sourceField: 'receivedToAccountId',
    counterpartLabel: 'Income Type (Account)',
    counterpartField: 'incomeAccountId',
    counterpartType: 'INCOME',
    drLabel: 'Dr',
    crLabel: 'Cr',
    successMessage: 'Money In created successfully',
  },
  out: {
    title: 'Create Money Out',
    sectionLabel: 'Expense Details',
    accent: 'danger',
    summaryBg: 'rgba(220, 53, 69, 0.06)',
    summaryTitle: 'You will pay',
    buttonLabel: 'Save Money Out',
    sourceLabel: 'Paid From (Cash/Bank)',
    sourceField: 'paidFromAccountId',
    counterpartLabel: 'Expense Type (Account)',
    counterpartField: 'expenseAccountId',
    counterpartType: 'EXPENSE',
    drLabel: 'Dr',
    crLabel: 'Cr',
    successMessage: 'Money Out created successfully',
  },
}

const moneyTransactionStyles = {
  control: (base, state) => ({
    ...base,
    fontFamily: 'var(--bs-font-sans-serif)',
    minHeight: 42,
    borderColor: state.isFocused ? '#6c757d' : base.borderColor,
    boxShadow: state.isFocused ? '0 0 0 0.15rem rgba(108, 117, 125, 0.15)' : base.boxShadow,
    '&:hover': {
      borderColor: state.isFocused ? '#6c757d' : base.borderColor,
    },
  }),
  valueContainer: (base) => ({
    ...base,
    paddingTop: 4,
    paddingBottom: 4,
  }),
  singleValue: (base) => ({
    ...base,
    fontFamily: 'var(--bs-font-sans-serif)',
  }),
  input: (base) => ({
    ...base,
    fontFamily: 'var(--bs-font-sans-serif)',
  }),
  option: (base) => ({
    ...base,
    fontFamily: 'var(--bs-font-sans-serif)',
  }),
  menu: (base) => ({
    ...base,
    fontFamily: 'var(--bs-font-sans-serif)',
  }),
}

const MoneyTransactionForm = ({ mode }) => {
  const navigate = useNavigate()
  const config = MODE_CONFIG[mode]

  const [date, setDate] = useState(todayAsInputValue())
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [sourceAccountId, setSourceAccountId] = useState('')
  const [counterpartAccountId, setCounterpartAccountId] = useState('')

  const {
    data: accounts = [],
    isLoading: isLoadingAccounts,
    isFetching: isFetchingAccounts,
  } = useGetAccountsQuery({ isActive: true })

  const [createMoneyIn, { isLoading: isCreatingMoneyIn }] = useCreateMoneyInMutation()
  const [createMoneyOut, { isLoading: isCreatingMoneyOut }] = useCreateMoneyOutMutation()

  const accountOptions = useMemo(
    () =>
      [...accounts]
        .sort((a, b) => String(a.code || '').localeCompare(String(b.code || '')))
        .map((account) => ({
          value: account._id,
          label: `${account.code ? `${account.code} - ` : ''}${account.name}${account.type ? ` (${account.type})` : ''}`,
          account,
        })),
    [accounts],
  )

  const childAccountOptions = useMemo(
    () =>
      accountOptions.filter(
        (option) => Boolean(option.account?.parentId) && option.account?.isActive !== false,
      ),
    [accountOptions],
  )

  const sourceAccountOptions = useMemo(
    () => childAccountOptions.filter((option) => String(option.account?.type || '').toUpperCase() === 'ASSET'),
    [childAccountOptions],
  )

  const counterpartAccountOptions = useMemo(
    () =>
      childAccountOptions.filter(
        (option) => String(option.account?.type || '').toUpperCase() === config.counterpartType,
      ),
    [childAccountOptions, config.counterpartType],
  )

  const accountById = useMemo(() => {
    const map = new Map()
    accountOptions.forEach((option) => map.set(option.value, option.account))
    return map
  }, [accountOptions])

  const formatAccountName = (account) => {
    if (!account) return 'Select an account'
    return `${account.code ? `${account.code} - ` : ''}${account.name}`
  }

  const sourceAccount = accountById.get(sourceAccountId)
  const counterpartAccount = accountById.get(counterpartAccountId)
  const numericAmount = Number(amount || 0)
  const formattedAmount = currencyFormatter.format(numericAmount || 0)

  const isSubmitting = isCreatingMoneyIn || isCreatingMoneyOut
  const isValid = Boolean(date && sourceAccountId && counterpartAccountId && numericAmount > 0 && memo.trim())
  const sameAccountSelected = sourceAccountId && counterpartAccountId && sourceAccountId === counterpartAccountId

  const handleReset = () => {
    setDate(todayAsInputValue())
    setAmount('')
    setMemo('')
    setSourceAccountId('')
    setCounterpartAccountId('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isValid) {
      toast.error('Please fill all required fields')
      return
    }

    if (sameAccountSelected) {
      toast.error('Please select two different accounts')
      return
    }

    const payload = {
      date,
      [config.sourceField]: sourceAccountId,
      [config.counterpartField]: counterpartAccountId,
      amount: numericAmount,
      memo: memo.trim(),
    }

    try {
      const result =
        mode === 'in'
          ? await createMoneyIn(payload).unwrap()
          : await createMoneyOut(payload).unwrap()

      toast.success(`${config.successMessage}${result?.voucherNo ? ` #${result.voucherNo}` : ''}`)
      handleReset()
    } catch (error) {
      toast.error(extractApiErrorMessage(error))
    }
  }

  const handleCancel = () => {
    navigate('/accounts/vouchers')
  }

  const sourceAccountName = formatAccountName(sourceAccount)
  const counterpartAccountName = formatAccountName(counterpartAccount)

  return (
    <Row className="g-3" style={{ fontFamily: 'var(--bs-font-sans-serif)' }}>
      <Col xl={8}>
        <Card className="shadow-sm h-100">
          <Card.Header className="bg-white border-bottom d-flex justify-content-between align-items-start gap-3">
            <div>
              <Badge bg={`${config.accent}`} className="mb-2">
                {config.sectionLabel}
              </Badge>
              <Card.Title as="h4" className="mb-1">
                {config.title}
              </Card.Title>
              <div className="text-muted small">Fill the form and save the transaction voucher.</div>
            </div>
            <Badge bg="light" text="dark" className="border">
              * Required Fields
            </Badge>
          </Card.Header>

          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Date <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      {config.sourceLabel} <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      styles={moneyTransactionStyles}
                      classNamePrefix="react-select"
                      isLoading={isLoadingAccounts || isFetchingAccounts}
                      options={sourceAccountOptions}
                      value={sourceAccountOptions.find((option) => option.value === sourceAccountId) || null}
                      onChange={(option) => setSourceAccountId(option?.value || '')}
                      placeholder="Select account"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      {config.counterpartLabel} <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      styles={moneyTransactionStyles}
                      classNamePrefix="react-select"
                      isLoading={isLoadingAccounts || isFetchingAccounts}
                      options={counterpartAccountOptions}
                      value={counterpartAccountOptions.find((option) => option.value === counterpartAccountId) || null}
                      onChange={(option) => setCounterpartAccountId(option?.value || '')}
                      placeholder="Select account"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>
                      Amount (AED) <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </Form.Group>
                </Col>

                <Col md={8}>
                  <Form.Group>
                    <Form.Label>
                      Memo / Description <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="Add a short note for this voucher"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                <Button variant="outline-secondary" type="button" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button variant={config.accent} type="submit" disabled={isSubmitting || !isValid || sameAccountSelected}>
                  {isSubmitting && <Spinner animation="border" size="sm" className="me-2" />}
                  {config.buttonLabel}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Col xl={4}>
        <Card
          className="shadow-sm h-100 border-0"
          style={{ backgroundColor: config.summaryBg }}
        >
          <Card.Body>
            <Card.Title as="h5" className="mb-4">
              Summary
            </Card.Title>

            <div className="border-top border-bottom py-3">
              <div className="text-muted mb-1">{config.summaryTitle}</div>
              <div className={`fs-3 fw-bold text-${config.accent}`}>{formattedAmount}</div>
            </div>

            <div className="mt-4">
              <div className="fw-semibold mb-3">Accounting Entry (Auto)</div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-success fw-semibold">{config.drLabel}</span>
                <span className="flex-grow-1 px-3 text-truncate">{sourceAccountName}</span>
                <span className="fw-semibold">{formattedAmount}</span>
              </div>

              <div className="d-flex justify-content-between align-items-center">
                <span className="text-danger fw-semibold">{config.crLabel}</span>
                <span className="flex-grow-1 px-3 text-truncate">{counterpartAccountName}</span>
                <span className="fw-semibold">{formattedAmount}</span>
              </div>
            </div>

            <div className="mt-4 text-muted small">
              A voucher will be created automatically when you save this entry.
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  )
}

export default MoneyTransactionForm
