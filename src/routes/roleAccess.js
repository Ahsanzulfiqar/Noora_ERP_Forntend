import { matchPath } from 'react-router-dom';
import { ROLES } from '@/assets/data/roles';

export const ROLE_ALLOWED_PATHS = {
  [ROLES.WAREHOUSE]: [
    '/profile',
    '/warehouse/dashboard',
    '/warehouse/inventory/stock',
    '/warehouse/inventory/ledger',
    '/warehouse/inventory/low-stock',
    '/warehouse/inventory/expiry',
    '/warehouse/purchases/receive',
    '/warehouse/sales/dispatch',
    '/warehouse/sales/delivery',
    '/warehouse/transfers',
    '/warehouse/reports/stock',
    '/inventory/transfer-stock/add',
    '/inventory/transfer-stock/detail/:transferId',
    '/sales/sales-detail/:salesId',
  ],
  [ROLES.SELLER]: [
    '/',
    '/profile',
    '/seller/dashboard',
    '/seller/performance',
    '/seller/orders',
    '/seller/customers',
    '/seller/products',
    '/seller/stock',
    '/seller/commissions',
    '/sales/sales-add',
    '/sales/sales-edit/:salesId',
    '/sales/sales-detail/:salesId',
  ],
};

export const isPathAllowedForRole = (role, pathname) => {
  const allowed = ROLE_ALLOWED_PATHS[role];
  if (!allowed) return true;
  return allowed.some((pattern) => matchPath(pattern, pathname));
};
