import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// Dashboard Routes

// Apps Routes

const Chat = lazy(() => import('@/app/(admin)/apps/chat/page'))
const Email = lazy(() => import('@/app/(admin)/apps/email/page'))
const Todo = lazy(() => import('@/app/(admin)/apps/todo/page'))
const Calendar = lazy(() => import('@/app/(admin)/apps/calendar/page'))

// Pages Routes
const ComingSoon = lazy(() => import('@/app/(other)/coming-soon/page'))
const Maintenance = lazy(() => import('@/app/(other)/maintenance/page'))
const NotFound = lazy(() => import('@/app/(other)/pages-404/page'))

// const Profile = lazy(() => import('@/app/(admin)/profile/page'))
// const Permissions = lazy(() => import('@/app/(admin)/permissions/page'))
const Review = lazy(() => import('@/app/(admin)/review/page'))

// Ware House  Routes
const WareHouseList = lazy(() => import('@/app/admin/warehouse/warehouse-list/page'))
const WareHouseBatchList = lazy(() => import('@/app/admin/warehouse/warehouse-batch-list/page'))
const WareHouses = lazy(() => import('@/app/admin/warehouse/[warehouseId]/page'))
const WareHouseAdd = lazy(() => import('@/app/admin/warehouse/warehouse-add/page'))
// Project Routes
const ProjectList = lazy(() => import('@/app/admin/project/project-list/page'))
const ProjectAdd = lazy(() => import('@/app/admin/project/project-add/page'))
const ProjectDetails = lazy(() => import('@/app/admin/project/[projectId]/page'))

// Courier Routes
const CourierList = lazy(() => import('@/app/admin/courier/courier-list/page'))
const CourierAdd = lazy(() => import('@/app/admin/courier/courier-add/page'))
const CourierDetails = lazy(() => import('@/app/admin/courier/[courierId]/page'))

// Product Routes
const ProductList = lazy(() => import('@/app/admin/products/product-list/page'))
const Products = lazy(() => import('@/app/admin/products/[productId]/page'))
const ProductAdd = lazy(() => import('@/app/admin/products/product-add/page'))
// productVarient Routes
const ProductVarientList = lazy(() => import('../app/admin/productVarient/productVarient-list/page'))
const ProductVarientAdd = lazy(() => import('../app/admin/productVarient/productVarient-add/page'))
const ProductVarientDetails = lazy(() => import('../app/admin/productVarient/[productVarientId]/page'))
// productVarient Routes
const PostToStock = lazy(() => import('../app/admin/stock/stock-add/page'))
const PostToStockList = lazy(() => import('../app/admin/stock/stock-list/page'))

// Category Routes
const CategoryList = lazy(() => import('@/app/admin/category/category-list/page'))
const CategoryAdd = lazy(() => import('@/app/admin/category/category-add/page'))
const SubCategoryList = lazy(() => import('@/app/admin/category/subcategory-list/page'))
const SubCategoryAdd = lazy(() => import('@/app/admin/category/subcategory-add/page'))

// inventory Routes
const Warehouse = lazy(() => import('@/app/admin/inventory/warehouse/page'))
const WarehouseAddManual = lazy(() => import('@/app/admin/inventory/warehouse-add/page'))
const ReceivedOrders = lazy(() => import('@/app/admin/inventory/received-orders/page'))
const WarehouseInventoryDetail = lazy(() => import('@/app/admin/inventory/warehouse-inventory-detail/page'))


// Purchases Routes

// Purchases Routes
const PurchaseList = lazy(() => import('@/app/admin/purchases/purchase-returns/page'))
const PurchaseOrder = lazy(() => import('@/app/admin/purchases/purchase-order/page'))
const PurchaseReturns = lazy(() => import('@/app/admin/purchases/purchase-returns/page'))
const PurchaseAdd = lazy(() => import('../app/admin/purchases/purchase-invoice-add/AddPurchase'))
const PurchaseDetail = lazy(() => import('../app/admin/purchases/purchaseDetail/page'))
// Sellers Routes
const SellersList = lazy(() => import('@/app/admin/sellers/sellers-list/page'))
const SellersAdd = lazy(() => import('../app/admin/sellers/sellers-add/page'))
const SellersDetail = lazy(() => import('../app/admin/sellers/sellerId/page'))

// Sales Routes
const SalesList = lazy(() => import('@/app/admin/sales/sales-list/page'))
const SalesAdd = lazy(() => import('../app/admin/sales/sale-add/page'))
const SalesDetail = lazy(() => import('../app/admin/sales/salesId/page'))
// Profile Routes
const Profile = lazy(() => import('../app/admin/profile/page'))
// Role Routes
const RoleList = lazy(() => import('../app/admin/role/role-list/page'))
const RoleAdd = lazy(() => import('../app/admin/role/role-add/page'))
const RoleView = lazy(() => import('../app/admin/role/role-view/page'))
// Permissions Routes
const Permissions = lazy(() => import('../app/admin/permissions/page'))



// Role Routes
// const RoleList = lazy(() => import('@/app/(admin)/role/role-list/page'))
// const RoleEdit = lazy(() => import('@/app/(admin)/role/role-edit/page'))
// const RoleAdd = lazy(() => import('@/app/(admin)/role/role-add/page'))

// Customer Routes
// const CustomerList = lazy(() => import('@/app/(admin)/customer/customer-list/page'))
// const CustomerDetails = lazy(() => import('@/app/(admin)/customer/customer-detail/page'))

// Seller Routes
const SellerList = lazy(() => import('@/app/(admin)/seller/seller-list/page'))
const SellerDetails = lazy(() => import('@/app/(admin)/seller/seller-details/page'))
const SellerEdit = lazy(() => import('@/app/(admin)/seller/seller-edit/page'))
const SellerAdd = lazy(() => import('@/app/(admin)/seller/seller-add/page'))



// Charts and Maps Routes


// // Form Routes
const BasicTable = lazy(() => import('@/app/(admin)/tables/basic/page'))
const GridjsTable = lazy(() => import('@/app/(admin)/tables/gridjs/page'))


// Auth Routes
const SignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'))
const SignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'))
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-pass/page'))
const LockScreen = lazy(() => import('@/app/(other)/auth/lock-screen/page'))
const initialRoutes = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/warehouses/warehouse-list" />,
  },
]
const generalRoutes = []
const appsRoutes = [
  {
    name: 'Chat',
    path: '/apps/chat',
    element: <Chat />,
  },
  {
    name: 'Email',
    path: '/apps/email',
    element: <Email />,
  },
  {
    name: 'Calendar',
    path: '/apps/calendar',
    element: <Calendar />,
  },
  {
    name: 'Todo',
    path: '/apps/todo',
    element: <Todo />,
  },
]
const customRoutes = [

  {
    name: 'Profile',
    path: '/profile',
    element: <Profile />,
  },
  {
    name: 'Permissions',
    path: '/permissions',
    element: <Permissions />,
  },
  {
    name: 'Review',
    path: '/review',
    element: <Review />,
  },
]
const tableRoutes = [
  {
    name: 'Basic Tables',
    path: '/tables/basic',
    element: <BasicTable />,
  },
  {
    name: 'Grid JS',
    path: '/tables/gridjs',
    element: <GridjsTable />,
  },
]

const productRoutes = [
  {
    name: 'product-list',
    path: '/products/product-list',
    element: <ProductList />,
  },
  {
    name: 'product-details',
    path: '/products/product-details/:productId',
    element: <Products />,
  },
  {
    name: 'product-edit',
    path: '/products/product-edit/:productId',
    element: <ProductAdd />,
  },
  {
    name: 'product-add',
    path: '/products/product-add',
    element: <ProductAdd />,
  },
  {
    name: 'product-list',
    path: '/products/product-varient-list',
    element: <ProductVarientList />,
  },
  {
    name: 'productvarient-add',
    path: '/products/product-varient-add',
    element: <ProductVarientAdd />,
  },
  {
    name: 'productvarient-edit',
    path: '/products/product-varient-edit/:productvarientId',
    element: <ProductVarientAdd />,
  },
  {
    name: 'productvarient-details',
    path: '/products/product-varient-details/:productvarientId',
    element: <ProductVarientDetails />,
  },
]
const productVarientRoutes = [
  {
    name: 'product-list',
    path: '/product-varient-list',
    element: <ProductVarientList />,
  },
  {
    name: 'productvarient-add',
    path: '/product-varient-add',
    element: <ProductVarientAdd />,
  },
  {
    name: 'productvarient-edit',
    path: '/product-varient-edit/:productvarientId',
    element: <ProductVarientAdd />,
  },
]
const postToStockRoutes = [
  {
    name: 'post-to-stock',
    path: '/post-to-stock/create',
    element: <PostToStock />,
  },
  {
    name: 'post-to-stock',
    path: '/post-to-stock/list',
    element: <PostToStockList />,
  },
]
const WareHouseRoutes = [
  {
    name: 'warehouse-list',
    path: '/warehouses/warehouse-list',
    element: <WareHouseList />,
  },
  {
    name: 'warehouse-batch-list',
    path: '/warehouses/warehouse-batch-list',
    element: <WareHouseBatchList />,
  },
  {
    name: 'warehouse-details',
    path: '/warehouses/:warehouseId',
    element: <WareHouses />,
  },
  {
    name: 'warehouse-edit',
    path: '/warehouses/warehouse-edit/:warehouseId',
    element: <WareHouseAdd />,
  },
  {
    name: 'warehouse-add',
    path: '/warehouses/warehouse-add',
    element: <WareHouseAdd />,
  },
]
const ProjectRoutes = [
  {
    name: 'project-list',
    path: '/projects/project-list',
    element: <ProjectList />,
  },
  {
    name: 'project-details',
    path: '/projects/project-details/:projectId',
    element: <ProjectDetails />,
  },
  {
    name: 'project-add',
    path: '/projects/project-add',
    element: <ProjectAdd />,
  },
  {
    name: 'project-edit',
    path: '/projects/project-edit/:projectId',
    element: <ProjectAdd />,
  },
]
const CourierRoutes = [
  {
    name: 'courier-list',
    path: '/admin/courier/courier-list',
    element: <CourierList />,
  },
  {
    name: 'courier-add',
    path: '/admin/courier/courier-add',
    element: <CourierAdd />,
  },
  {
    name: 'courier-details',
    path: '/admin/courier/:courierId',
    element: <CourierDetails />,
  },
]
const CategoryRoutes = [
  {
    name: 'category-list',
    path: '/admin/category/category-list',
    element: <CategoryList />,
  },
  {
    name: 'subcategory-list',
    path: '/admin/category/subcategory-list',
    element: <SubCategoryList />,
  },
  {
    name: 'category-edit',
    path: '/admin/category/category-edit/:id',
    element: <CategoryAdd />,
  },
  {
    name: 'category-add',
    path: '/admin/category/category-add',
    element: <CategoryAdd />,
  },
  {
    name: 'subcategory-edit',
    path: '/admin/category/subcategory-edit/:id',
    element: <SubCategoryAdd />,
  },
  {
    name: 'subcategory-add',
    path: '/admin/category/subcategory-add',
    element: <SubCategoryAdd />,
  },
]
const InventoryRoutes = [
  {
    name: 'Warehouse',
    path: '/inventory/warehouse',
    element: <Warehouse />,
  },
  {
    name: 'Warehouse Add',
    path: '/inventory/warehouse-add',
    element: <WarehouseAddManual />,
  },
  {
    name: 'Received Orders',
    path: '/inventory/received-orders',
    element: <ReceivedOrders />,
  },
  {
    name: 'Inventory Detail',
    path: '/inventory/warehouse-detail/:inventoryId',
    element: <WarehouseInventoryDetail />,
  },
]

const PurchaseRoutes = [
  {
    name: 'Purchase List',
    path: '/purchases/purchase-list',
    element: <PurchaseList />,
  },
  {
    name: 'Purchase Add',
    path: '/purchases/purchase-add',
    element: <PurchaseAdd />,
  },
  {
    name: 'Purchase Edit',
    path: '/purchases/purchase-edit/:purchaseId',
    element: <PurchaseAdd />,
  },
  {
    name: 'Purchase Detail',
    path: '/purchases/purchase-detail/:purchaseId',
    element: <PurchaseDetail />,
  },
  {
    name: 'Purchase Order',
    path: '/purchases/purchase-order',
    element: <PurchaseOrder />,
  },
  {
    name: 'Purchase Returns',
    path: '/purchases/purchase-returns',
    element: <PurchaseReturns />,
  },
]
const SellersRoutes = [
  {
    name: 'Seller List',
    path: '/sellers/sellers-list',
    element: <SellersList />,
  },
  {
    name: 'Sellers Add',
    path: '/sellers/sellers-add',
    element: <SellersAdd />,
  },
  {
    name: 'Sellers Edit',
    path: '/sellers/sellers-edit/:sellerId',
    element: <SellersAdd />,
  },
  {
    name: 'Sellers Detail',
    path: '/sellers/sellers-detail/:sellerId',
    element: <SellersDetail />,
  },
]
const SalesRoutes = [
  {
    name: 'Sales List',
    path: '/sales/sales-list',
    element: <SalesList />,
  },
  {
    name: 'Sales Add',
    path: '/sales/sales-add',
    element: <SalesAdd />,
  },
  {
    name: 'Sales Edit',
    path: '/sales/sales-edit/:salesId',
    element: <SalesAdd />,
  },
  {
    name: 'Sales Detail',
    path: '/sales/sales-detail/:salesId',
    element: <SalesDetail />,
  },
]
const RoleRoutes = [
  {
    name: 'Role List',
    path: '/role/role-list',
    element: <RoleList />,
  },
  {
    name: 'Role View',
    path: '/role/role-view/:roleId',
    element: <RoleView />,
  },
  {
    name: 'Role Edit',
    path: '/role/role-edit/:roleId',
    element: <RoleAdd />,
  },
  {
    name: 'Role Add',
    path: '/role/role-add',
    element: <RoleAdd />,
  },
]
const SellerRoutes = [
  {
    name: 'Seller List',
    path: '/seller/seller-list',
    element: <SellerList />,
  },
  {
    name: 'Seller Details',
    path: '/seller/seller-details',
    element: <SellerDetails />,
  },
  {
    name: 'Seller Edit',
    path: '/seller/seller-edit',
    element: <SellerEdit />,
  },
  {
    name: 'Seller Add',
    path: '/seller/seller-add',
    element: <SellerAdd />,
  },
]
export const authRoutes = [
  {
    name: 'Sign In',
    path: '/auth/sign-in',
    element: <SignIn />,
  },
  {
    name: 'Sign Up',
    path: '/auth/sign-up',
    element: <SignUp />,
  },
  {
    name: 'Reset Password',
    path: '/auth/reset-pass',
    element: <ResetPassword />,
  },
  {
    name: 'Lock Screen',
    path: '/auth/lock-screen',
    element: <LockScreen />,
  },
  {
    name: '404 Error',
    path: '/pages-404',
    element: <NotFound />,
  },
  //   {
  //     path: '*',
  //     name: 'not-found',
  //     element: <NotFound />,
  //   },
  {
    name: 'Maintenance',
    path: '/maintenance',
    element: <Maintenance />,
  },
  {
    name: 'Coming Soon',
    path: '/coming-soon',
    element: <ComingSoon />,
  },
]
export const appRoutes = [
  ...initialRoutes,
  ...generalRoutes,
  ...appsRoutes,
  ...customRoutes,
  ...tableRoutes,
  ...productRoutes,
  ...productVarientRoutes,
  ...postToStockRoutes,
  ...WareHouseRoutes,
  ...ProjectRoutes,
  ...CourierRoutes,
  ...CategoryRoutes,
  ...InventoryRoutes,
  ...PurchaseRoutes,
  ...RoleRoutes,
  ...SellerRoutes,
  ...SellersRoutes,
  ...SalesRoutes,
]
