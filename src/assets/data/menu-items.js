export const WAREHOUSE_MENU_ITEMS = [
  {
    key: 'main',
    label: 'MAIN',
    isTitle: true,
  },
  {
    key: 'warehouse-dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-2-bold-duotone',
    url: '/warehouse/dashboard',
  },
  {
    key: 'inventory-section',
    label: 'INVENTORY',
    isTitle: true,
  },
  {
    key: 'warehouse-inventory',
    label: 'Inventory',
    icon: 'solar:box-bold-duotone',
    children: [
      {
        key: 'warehouse-inventory-stock',
        label: 'Stock',
        url: '/warehouse/inventory/stock',
        parentKey: 'warehouse-inventory',
      },
      {
        key: 'warehouse-inventory-ledger',
        label: 'Stock Ledger',
        url: '/warehouse/inventory/ledger',
        parentKey: 'warehouse-inventory',
      },
      {
        key: 'warehouse-inventory-low-stock',
        label: 'Low Stock',
        url: '/warehouse/inventory/low-stock',
        parentKey: 'warehouse-inventory',
      },
      {
        key: 'warehouse-inventory-expiry',
        label: 'Expiry Alert',
        url: '/warehouse/inventory/expiry',
        parentKey: 'warehouse-inventory',
      },
    ],
  },
  {
    key: 'operations-section',
    label: 'OPERATIONS',
    isTitle: true,
  },
  {
    key: 'warehouse-purchases',
    label: 'Purchases',
    icon: 'solar:card-send-bold-duotone',
    children: [
      {
        key: 'warehouse-purchases-receive',
        label: 'Receive Stock',
        url: '/warehouse/purchases/receive',
        parentKey: 'warehouse-purchases',
      },
    ],
  },
  {
    key: 'warehouse-sales',
    label: 'Sales',
    icon: 'solar:cart-3-bold-duotone',
    children: [
      {
        key: 'warehouse-sales-dispatch',
        label: 'Dispatch Orders',
        url: '/warehouse/sales/dispatch',
        parentKey: 'warehouse-sales',
      },
      {
        key: 'warehouse-sales-delivery',
        label: 'Delivery Orders',
        url: '/warehouse/sales/delivery',
        parentKey: 'warehouse-sales',
      },
    ],
  },
  {
    key: 'warehouse-transfers',
    label: 'Transfers',
    icon: 'solar:transfer-horizontal-bold-duotone',
    children: [
      {
        key: 'warehouse-transfers-list',
        label: 'Stock Transfers',
        url: '/warehouse/transfers',
        parentKey: 'warehouse-transfers',
      },
    ],
  },
  {
    key: 'reports-section',
    label: 'REPORTS',
    isTitle: true,
  },
  {
    key: 'warehouse-reports',
    label: 'Reports',
    icon: 'solar:chart-2-bold-duotone',
    children: [
      {
        key: 'warehouse-reports-stock',
        label: 'Stock Reports',
        url: '/warehouse/reports/stock',
        parentKey: 'warehouse-reports',
      },
    ],
  },
  {
    key: 'profile-section',
    label: 'PROFILE',
    isTitle: true,
  },
  {
    key: 'warehouse-profile',
    label: 'My Profile',
    icon: 'solar:user-bold-duotone',
    url: '/profile',
  },
]

export const SELLER_MENU_ITEMS = [
  {
    key: 'main',
    label: 'MAIN',
    isTitle: true,
  },
  {
    key: 'seller-dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-2-bold-duotone',
    url: '/seller/dashboard',
  },
  {
    key: 'sales-section',
    label: 'SALES',
    isTitle: true,
  },
  {
    key: 'seller-new-sale',
    label: 'New Sale',
    icon: 'solar:cart-plus-bold-duotone',
    url: '/sales/sales-add',
  },
  {
    key: 'seller-orders',
    label: 'Orders',
    icon: 'solar:clipboard-list-bold-duotone',
    url: '/seller/orders',
  },
  {
    key: 'seller-customers',
    label: 'Customers',
    icon: 'solar:users-group-rounded-bold-duotone',
    url: '/seller/customers',
  },
  {
    key: 'products-section',
    label: 'PRODUCTS',
    isTitle: true,
  },
  {
    key: 'seller-products',
    label: 'Products',
    icon: 'solar:t-shirt-bold-duotone',
    url: '/seller/products',
    isDisabled: true,
  },
  {
    key: 'seller-stock',
    label: 'Stock',
    icon: 'solar:box-bold-duotone',
    url: '/seller/stock',
  },
  {
    key: 'reports-section',
    label: 'REPORTS',
    isTitle: true,
  },
  {
    key: 'seller-performance',
    label: 'My Performance',
    icon: 'solar:chart-2-bold-duotone',
    url: '/seller/performance',
  },
  {
    key: 'seller-commissions',
    label: 'My Commissions',
    icon: 'solar:dollar-bold-duotone',
    url: '/seller/commissions',
  },
  {
    key: 'profile-section',
    label: 'PROFILE',
    isTitle: true,
  },
  {
    key: 'seller-profile',
    label: 'My Profile',
    icon: 'solar:user-bold-duotone',
    url: '/profile',
  },
]

export const SALES_MENU_ITEMS = [
  {
    key: 'main',
    label: 'MAIN',
    isTitle: true,
  },
  {
    key: 'sales-agent-dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-2-bold-duotone',
    url: '/sales-agent/dashboard',
  },
  {
    key: 'sales-section',
    label: 'SALES',
    isTitle: true,
  },
  {
    key: 'sales-agent-sales',
    label: 'Sales',
    icon: 'solar:cart-3-bold-duotone',
    children: [
      {
        key: 'sales-agent-new-sale',
        label: 'New Sale',
        url: '/sales/sales-add',
        parentKey: 'sales-agent-sales',
      },
      {
        key: 'sales-agent-orders',
        label: 'Orders',
        url: '/sales-agent/orders',
        parentKey: 'sales-agent-sales',
      },
      {
        key: 'sales-agent-customers',
        label: 'Customers',
        url: '/sales-agent/customers',
        parentKey: 'sales-agent-sales',
      },
    ],
  },
  {
    key: 'products-section',
    label: 'PRODUCTS',
    isTitle: true,
  },
  {
    key: 'sales-agent-products-group',
    label: 'Products',
    icon: 'solar:t-shirt-bold-duotone',
    children: [
      {
        key: 'sales-agent-products',
        label: 'Products',
        url: '/sales-agent/products',
        parentKey: 'sales-agent-products-group',
      },
      {
        key: 'sales-agent-stock',
        label: 'Stock Availability',
        url: '/sales-agent/stock',
        parentKey: 'sales-agent-products-group',
      },
    ],
  },
  {
    key: 'reports-section',
    label: 'REPORTS',
    isTitle: true,
  },
  {
    key: 'sales-agent-reports',
    label: 'Reports',
    icon: 'solar:chart-2-bold-duotone',
    children: [
      {
        key: 'sales-agent-performance',
        label: 'My Performance',
        url: '/sales-agent/performance',
        parentKey: 'sales-agent-reports',
      },
      {
        key: 'sales-agent-my-sales',
        label: 'My Sales',
        url: '/sales-agent/my-sales',
        parentKey: 'sales-agent-reports',
      },
    ],
  },
  {
    key: 'profile-section',
    label: 'PROFILE',
    isTitle: true,
  },
  {
    key: 'sales-agent-profile',
    label: 'My Profile',
    icon: 'solar:user-bold-duotone',
    url: '/profile',
  },
]

export const MENU_ITEMS = [
  {
    key: 'general',
    label: 'GENERAL',
    isTitle: true,
  },
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-2-bold-duotone',
    url: '/dashboard',
  },
  {
    key: 'warehouses',
    label: 'warehouses',
    icon: 'solar:buildings-2-bold-duotone',
    children: [
      {
        key: 'warehouse-list',
        label: 'List',
        url: '/warehouses/warehouse-list',
        parentKey: 'warehouses',
      },
      {
        key: 'warehouse-batch-list',
        label: 'Batch List',
        url: '/warehouses/warehouse-batch-list',
        parentKey: 'warehouses',
      },
      {
        key: 'warehouse-add',
        label: 'Create',
        url: '/warehouses/warehouse-add',
        parentKey: 'warehouses',
      },
    ],
  },
  {
    key: 'products',
    label: 'Products',
    icon: 'solar:t-shirt-bold-duotone',
    children: [
      {
        key: 'product-list',
        label: 'List',
        url: '/products/product-list',
        parentKey: 'products',
      },
      // {
      //   key: 'product-grid',
      //   label: 'Grid',
      //   url: '/products/product-grid',
      //   parentKey: 'products',
      // },
      // {
      //   key: 'product-details',
      //   label: 'Details',
      //   url: '/products/1',
      //   parentKey: 'products',
      // },
      // {
      //   key: 'product-edit',
      //   label: 'Edit',
      //   url: '/products/product-edit',
      //   parentKey: 'products',
      // },
      {
        key: 'product-add',
        label: 'Create',
        url: '/products/product-add',
        parentKey: 'products',
      },
      {
        key: 'product-variant-list',
        label: 'Product Variant',
        url: '/product-varient-list',
        parentKey: 'products',
      },
    ],
  },

  {
    key: 'category',
    icon: 'solar:clipboard-list-bold-duotone',
    label: 'Categories',
    children: [
      {
        key: 'category-list',
        label: 'Category List',
        url: '/admin/category/category-list',
        parentKey: 'category',
      },
      {
        key: 'subcategory-list',
        label: 'Sub-Category List',
        url: '/admin/category/subcategory-list',
        parentKey: 'category',
      },
      {
        key: 'category-add',
        label: 'Create',
        url: '/admin/category/category-add',
        parentKey: 'category',
      },
    ],
  },


  {
    key: 'inventory',
    label: 'Inventory',
    icon: 'solar:box-bold-duotone',
    children: [
      {
        key: 'Stock list',
        label: 'Stock list',
        url: '/inventory/warehouse',
        parentKey: 'inventory',
      },
      {
        key: 'transfer-stock',
        label: 'Transfer Stock',
        url: '/inventory/transfer-stock',
        parentKey: 'inventory',
      },
    ],
  },
  // {
  //   key: 'orders',
  //   label: 'Orders',
  //   icon: 'solar:bag-smile-bold-duotone',
  //   children: [
  //     {
  //       key: 'orders-list',
  //       label: 'List',
  //       url: '/orders/orders-list',
  //       parentKey: 'orders',
  //     },
  //     {
  //       key: 'order-detail',
  //       label: 'Detail',
  //       url: '/orders/order-detail',
  //       parentKey: 'orders',
  //     },
  //     {
  //       key: 'order-cart',
  //       label: 'Cart',
  //       url: '/orders/order-cart',
  //       parentKey: 'orders',
  //     },
  //     {
  //       key: 'order-checkout',
  //       label: 'Checkout',
  //       url: '/orders/order-checkout',
  //       parentKey: 'orders',
  //     },
  //   ],
  // },
  {
    key: 'purchases',
    label: 'Purchases',
    icon: 'solar:card-send-bold-duotone',
    children: [
      {
        key: 'purchase-list',
        label: 'List',
        url: '/purchases/purchase-list',
        parentKey: 'purchases',
      },
      {
        key: 'purchase-create',
        label: 'Create',
        url: '/purchases/purchase-add',
        parentKey: 'purchases',
      },
      // {
      //   key: 'purchase-order',
      //   label: 'Order',
      //   url: '/purchases/purchase-order',
      //   parentKey: 'purchases',
      // },
      // {
      //   key: 'purchase-returns',
      //   label: 'Returns',
      //   url: '/purchases/purchase-returns',
      //   parentKey: 'purchases',
      // },
    ],
  },
  // {
  //   key: 'postToStock',
  //   icon: 'solar:send-square-bold-duotone',
  //   label: 'Post To Stock',
  //   children: [
  //     {
  //       key: 'postToStock-list',
  //       label: 'List',
  //       url: '/post-to-stock/list',
  //       parentKey: 'postToStock',
  //     },
  //     {
  //       key: 'postToStock-create',
  //       label: 'Create',
  //       url: '/post-to-stock/create',
  //       parentKey: 'postToStock',
  //     },

  //   ],
  // },

  // {
  //   key: 'sellers',
  //   icon: 'solar:users-group-rounded-bold-duotone',
  //   label: 'Sellers',
  //   children: [
  //     {
  //       key: 'sellers-list',
  //       label: 'List',
  //       url: '/sellers/sellers-list',
  //       parentKey: 'sellers',
  //     },
  //   ],
  // },
  {
    key: 'sales',
    icon: 'solar:cart-3-bold-duotone',
    label: 'Sales',
    children: [
      {
        key: 'sales-list',
        label: 'List',
        url: '/sales/sales-list',
        parentKey: 'sales',
      },
      {
        key: 'sales-create',
        label: 'Create',
        url: '/sales/sales-add',
        parentKey: 'sales',
      },

    ],
  },
  {
    key: 'courier',
    label: 'Courier',
    icon: 'solar:box-minimalistic-bold-duotone',
    children: [
      {
        key: 'courier-list',
        label: 'List',
        url: '/admin/courier/courier-list',
        parentKey: 'courier',
      },
      {
        key: 'courier-add',
        label: 'Create',
        url: '/admin/courier/courier-add',
        parentKey: 'courier',
      },
    ],
  },
  {
    key: 'projects',
    label: 'Projects',
    icon: 'solar:folder-with-files-bold-duotone',
    children: [
      {
        key: 'project-list',
        label: 'List',
        url: '/projects/project-list',
        parentKey: 'projects',
      },
      {
        key: 'project-add',
        label: 'Create',
        url: '/projects/project-add',
        parentKey: 'projects',
      },
    ],
  },
  {
    key: 'accounts',
    label: 'Accounts',
    icon: 'solar:bill-list-bold-duotone',
    children: [
      {
        key: 'chart-of-accounts',
        label: 'Chart of Accounts',
        url: '/accounts',
        parentKey: 'accounts',
      },
      {
        key: 'journal-entry',
        label: 'Journal Entry',
        url: '/accounts/journal/new',
        parentKey: 'accounts',
      },
      {
        key: 'money-in',
        label: 'Money In',
        url: '/accounts/money-in',
        parentKey: 'accounts',
      },
      {
        key: 'money-out',
        label: 'Money Out',
        url: '/accounts/money-out',
        parentKey: 'accounts',
      },
      {
        key: 'vouchers',
        label: 'Vouchers',
        url: '/accounts/vouchers',
        parentKey: 'accounts',
      },
      {
        key: 'ledger',
        label: 'Ledger',
        url: '/accounts/ledger',
        parentKey: 'accounts',
      },
      {
        key: 'trial-balance',
        label: 'Trial Balance',
        url: '/accounts/trial-balance',
        parentKey: 'accounts',
      },
    ],
  },
  {
    key: 'users',
    label: 'USERS',
    isTitle: true,
  },
  // {
  //   key: 'profile',
  //   label: 'Profile',
  //   icon: 'solar:chat-square-like-bold-duotone',
  //   url: '/profile',
  // },
  // {
  //   key: 'report',
  //   label: 'Report',
  //   icon: 'solar:chat-square-like-bold-duotone',
  //   url: '/profile',
  // },
  {
    key: 'role',
    label: 'Users',
    icon: 'solar:user-speak-rounded-bold-duotone',
    children: [
      {
        key: 'role-list',
        label: 'List',
        url: '/role/role-list',
        parentKey: 'role',
      },
      // {
      //   key: 'role-edit',
      //   label: 'Edit',
      //   url: '/role/role-edit',
      //   parentKey: 'role',
      // },
      {
        key: 'role-add',
        label: 'Create',
        url: '/role/role-add',
        parentKey: 'role',
      },
    ],
  },
  // {
  //   key: 'permissions',
  //   label: 'Permissions',
  //   icon: 'solar:checklist-minimalistic-bold-duotone',
  //   url: '/permissions',
  // },

  // {
  //   key: 'seller',
  //   label: 'Sellers',
  //   icon: 'solar:shop-bold-duotone',
  //   children: [
  //     {
  //       key: 'seller-list',
  //       label: 'List',
  //       url: '/seller/seller-list',
  //       parentKey: 'seller',
  //     },
  //     {
  //       key: 'seller-details',
  //       label: 'Details',
  //       url: '/seller/seller-details',
  //       parentKey: 'seller',
  //     },
  //     {
  //       key: 'seller-edit',
  //       label: 'Edit',
  //       url: '/seller/seller-edit',
  //       parentKey: 'seller',
  //     },
  //     {
  //       key: 'seller-add',
  //       label: 'Create',
  //       url: '/seller/seller-add',
  //       parentKey: 'seller',
  //     },
  //   ],
  // },
  // {
  //   key: 'OTHER',
  //   label: 'OTHER',
  //   isTitle: true,
  // },
  // {
  //   key: 'review',
  //   label: 'Review',
  //   icon: 'solar:chat-square-like-bold-duotone',
  //   url: '/review',
  // },
  // {
  //   key: 'Other-apps',
  //   label: 'OTHER APPS',
  //   isTitle: true,
  // },
  // {
  //   key: 'apps-chat',
  //   label: 'Chat',
  //   icon: 'solar:chat-round-bold-duotone',
  //   url: '/apps/chat',
  // },
  // {
  //   key: 'email',
  //   label: 'Email',
  //   icon: 'solar:mailbox-bold-duotone',
  //   url: '/apps/email',
  // },
  // {
  //   key: 'calendar',
  //   label: 'Calendar',
  //   icon: 'solar:calendar-bold-duotone',
  //   url: '/apps/calendar',
  // },
  // {
  //   key: 'todo',
  //   label: 'Todo',
  //   icon: 'solar:checklist-bold-duotone',
  //   url: '/apps/todo',
  // },
  // {
  //   key: 'custom',
  //   label: 'CUSTOM',
  //   isTitle: true,
  // },
  // {
  //   key: 'pages',
  //   label: 'Pages',
  //   icon: 'solar:gift-bold-duotone',
  //   children: [
  //     {
  //       key: 'welcome',
  //       label: 'Welcome',
  //       url: '/pages/welcome',
  //       parentKey: 'pages',
  //     },
  //     {
  //       key: 'coming-soon',
  //       label: 'Coming Soon',
  //       url: '/coming-soon',
  //       parentKey: 'pages',
  //     },
  //     {
  //       key: 'timeline',
  //       label: 'Timeline',
  //       url: '/pages/timeline',
  //       parentKey: 'pages',
  //     },
  //     {
  //       key: 'pricing',
  //       label: 'Pricing',
  //       url: '/pages/pricing',
  //       parentKey: 'pages',
  //     },
  //     {
  //       key: 'maintenance',
  //       label: 'Maintenance',
  //       url: '/maintenance',
  //       parentKey: 'pages',
  //     },
  //     {
  //       key: 'pages-404',
  //       label: '404 Error',
  //       url: '/pages-404',
  //       parentKey: 'pages',
  //     },
  //     {
  //       key: 'pages-404-alt',
  //       label: '404 Error(alt)',
  //       url: '/pages/pages-404-alt',
  //       parentKey: 'pages',
  //     },
  //   ],
  // },
  // {
  //   key: 'auth',
  //   label: 'Authentication',
  //   icon: 'solar:lock-keyhole-bold-duotone',
  //   children: [
  //     {
  //       key: 'sign-in',
  //       label: 'Sign In',
  //       url: '/auth/sign-in',
  //       parentKey: 'auth',
  //     },
  //     {
  //       key: 'sign-up',
  //       label: 'Sign Up',
  //       url: '/auth/sign-up',
  //       parentKey: 'auth',
  //     },
  //     {
  //       key: 'password',
  //       label: 'Reset Password',
  //       url: '/auth/reset-pass',
  //       parentKey: 'auth',
  //     },
  //     {
  //       key: 'lock-screen',
  //       label: 'Lock Screen',
  //       url: '/auth/lock-screen',
  //       parentKey: 'auth',
  //     },
  //   ],
  // },
  // {
  //   key: 'components',
  //   label: 'COMPONENTS',
  //   isTitle: true,
  // },
  // {
  //   key: 'base-ui',
  //   label: 'Base UI',
  //   icon: 'solar:bookmark-square-bold-duotone',
  //   children: [
  //     {
  //       key: 'accordion',
  //       label: 'Accordion',
  //       url: '/base-ui/accordion',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'alerts',
  //       label: 'Alerts',
  //       url: '/base-ui/alerts',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'avatar',
  //       label: 'Avatar',
  //       url: '/base-ui/avatar',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'badge',
  //       label: 'Badge',
  //       url: '/base-ui/badge',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'breadcrumb',
  //       label: 'Breadcrumb',
  //       url: '/base-ui/breadcrumb',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'buttons',
  //       label: 'Buttons',
  //       url: '/base-ui/buttons',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'cards',
  //       label: 'Cards',
  //       url: '/base-ui/cards',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'carousel',
  //       label: 'Carousel',
  //       url: '/base-ui/carousel',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'collapse',
  //       label: 'Collapse',
  //       url: '/base-ui/collapse',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'dropdown',
  //       label: 'Dropdown',
  //       url: '/base-ui/dropdown',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'list-group',
  //       label: 'List Group',
  //       url: '/base-ui/list-group',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'modals',
  //       label: 'Modals',
  //       url: '/base-ui/modals',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'tabs',
  //       label: 'Tabs',
  //       url: '/base-ui/tabs',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'offcanvas',
  //       label: 'Offcanvas',
  //       url: '/base-ui/offcanvas',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'pagination',
  //       label: 'Pagination',
  //       url: '/base-ui/pagination',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'placeholders',
  //       label: 'Placeholders',
  //       url: '/base-ui/placeholders',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'popovers',
  //       label: 'Popovers',
  //       url: '/base-ui/popovers',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'progress',
  //       label: 'Progress',
  //       url: '/base-ui/progress',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'spinners',
  //       label: 'spinners',
  //       url: '/base-ui/spinners',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'toasts',
  //       label: 'Toasts',
  //       url: '/base-ui/toasts',
  //       parentKey: 'base-ui',
  //     },
  //     {
  //       key: 'tooltips',
  //       label: 'Tooltips',
  //       url: '/base-ui/tooltips',
  //       parentKey: 'base-ui',
  //     },
  //   ],
  // },
  // {
  //   key: 'advanced-ul',
  //   label: 'Advanced Ul',
  //   icon: 'solar:case-round-bold-duotone',
  //   children: [
  //     {
  //       key: 'ratings',
  //       label: 'Ratings',
  //       url: '/advanced-ul/rating',
  //       parentKey: 'advanced-ul',
  //     },
  //     {
  //       key: 'sweet-alert',
  //       label: 'Sweet Alert',
  //       url: '/advanced-ul/sweet-alert',
  //       parentKey: 'advanced-ul',
  //     },
  //     {
  //       key: 'swiper-slider',
  //       label: 'Swiper Slider',
  //       url: '/advanced-ul/swiper-slider',
  //       parentKey: 'advanced-ul',
  //     },
  //     {
  //       key: 'scrollbar',
  //       label: 'Scrollbar',
  //       url: '/advanced-ul/scrollbar',
  //       parentKey: 'advanced-ul',
  //     },
  //     {
  //       key: 'toastify',
  //       label: 'Toastify',
  //       url: '/advanced-ul/toastify',
  //       parentKey: 'advanced-ul',
  //     },
  //   ],
  // },
  // {
  //   key: 'tables',
  //   label: 'Tables',
  //   icon: 'solar:tuning-2-bold-duotone',
  //   children: [
  //     {
  //       key: 'basic',
  //       label: 'Basic Tables',
  //       url: '/tables/basic',
  //       parentKey: 'tables',
  //     },
  //     {
  //       key: 'gridjs',
  //       label: 'Grid Js',
  //       url: '/tables/gridjs',
  //       parentKey: 'tables',
  //     },
  //   ],
  // },
  // {
  //   key: 'icons',
  //   label: 'Icons',
  //   icon: 'solar:ufo-2-bold-duotone',
  //   children: [
  //     {
  //       key: 'boxicons',
  //       label: 'Box Icons',
  //       url: '/icons/boxicons',
  //       parentKey: 'icons',
  //     },
  //     {
  //       key: 'solaricons',
  //       label: 'Solar Icons',
  //       url: '/icons/solaricons',
  //       parentKey: 'icons',
  //     },
  //   ],
  // },
  // {
  //   key: 'badge-menu',
  //   label: 'Badge Menu',
  //   badge: {
  //     text: '1',
  //     variant: 'danger',
  //   },
  //   icon: 'solar:volleyball-bold-duotone',
  // },
  // {
  //   key: 'menu-items',
  //   label: 'Menu Item',
  //   icon: 'solar:share-circle-bold-duotone',
  //   children: [
  //     {
  //       key: 'menu-items-1',
  //       label: 'Menu Items 1',
  //       parentKey: 'menu-items-1',
  //     },
  //     {
  //       key: 'menu-items-2',
  //       label: 'Menu Items 2',
  //       parentKey: 'menu-items-2',
  //       children: [
  //         {
  //           key: 'menu sub item',
  //           label: 'Menu Sub Item',
  //           parentKey: 'menu-items-2',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   key: ' Disable Item',
  //   label: ' Disable Item',
  //   icon: 'solar:user-block-rounded-bold-duotone',
  // },
]
