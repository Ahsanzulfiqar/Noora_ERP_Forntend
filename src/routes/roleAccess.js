import { matchPath } from 'react-router-dom';
import { ROLES } from '@/assets/data/roles';

export const ROLE_ALLOWED_PATHS = {
  [ROLES.WAREHOUSE]: [
    '/dashboard',
    '/profile',
    '/inventory/warehouse',
    '/inventory/warehouse-detail/:inventoryId',
    '/inventory/warehouse-add',
    '/inventory/received-orders',
    '/warehouses/warehouse-batch-list',
    '/purchases/purchase-list',
    '/purchases/purchase-add',
    '/purchases/purchase-edit/:purchaseId',
    '/purchases/purchase-detail/:purchaseId',
    '/sales/sales-list',
    '/sales/sales-detail/:salesId',
  ],
};

export const isPathAllowedForRole = (role, pathname) => {
  const allowed = ROLE_ALLOWED_PATHS[role];
  if (!allowed) return true;
  return allowed.some((pattern) => matchPath(pattern, pathname));
};
