import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

// Dashboard Routes
const Dashboard = lazy(() => import('@/app/(admin)/dashboard/page'))

// Apps Routes

const Chat = lazy(() => import('@/app/(admin)/apps/chat/page'))
const Email = lazy(() => import('@/app/(admin)/apps/email/page'))
const Todo = lazy(() => import('@/app/(admin)/apps/todo/page'))
const Calendar = lazy(() => import('@/app/(admin)/apps/calendar/page'))

// Pages Routes
const Welcome = lazy(() => import('@/app/(admin)/pages/welcome/page'))
const ComingSoon = lazy(() => import('@/app/(other)/coming-soon/page'))
const TimelinePage = lazy(() => import('@/app/(admin)/pages/timeline/page'))
const Pricing = lazy(() => import('@/app/(admin)/pages/pricing/page'))
const Maintenance = lazy(() => import('@/app/(other)/maintenance/page'))
const Widgets = lazy(() => import('@/app/(admin)/widgets/page'))
const NotFound = lazy(() => import('@/app/(other)/pages-404/page'))
const Pages404Alt = lazy(() => import('@/app/(admin)/pages/pages-404-alt/page'))
const Settings = lazy(() => import('@/app/(admin)/settings/page'))
// const Profile = lazy(() => import('@/app/(admin)/profile/page'))
// const Permissions = lazy(() => import('@/app/(admin)/permissions/page'))
const Review = lazy(() => import('@/app/(admin)/review/page'))
const HelpCenter = lazy(() => import('@/app/(admin)/support/help-center/page'))
const Faqs = lazy(() => import('@/app/(admin)/support/faqs/page'))
const PrivacyPolicy = lazy(() => import('@/app/(admin)/support/privacy-policy/page'))

// Base UI Routes
const Accordions = lazy(() => import('@/app/(admin)/base-ui/accordion/page'))
const Alerts = lazy(() => import('@/app/(admin)/base-ui/alerts/page'))
const Avatars = lazy(() => import('@/app/(admin)/base-ui/avatar/page'))
const Badges = lazy(() => import('@/app/(admin)/base-ui/badge/page'))
const Breadcrumb = lazy(() => import('@/app/(admin)/base-ui/breadcrumb/page'))
const Buttons = lazy(() => import('@/app/(admin)/base-ui/buttons/page'))
const Cards = lazy(() => import('@/app/(admin)/base-ui/cards/page'))
const Carousel = lazy(() => import('@/app/(admin)/base-ui/carousel/page'))
const Collapse = lazy(() => import('@/app/(admin)/base-ui/collapse/page'))
const Dropdown = lazy(() => import('@/app/(admin)/base-ui/dropdown/page'))
const ListGroup = lazy(() => import('@/app/(admin)/base-ui/list-group/page'))
const Modals = lazy(() => import('@/app/(admin)/base-ui/modals/page'))
const Tabs = lazy(() => import('@/app/(admin)/base-ui/tabs/page'))
const Offcanvas = lazy(() => import('@/app/(admin)/base-ui/offcanvas/page'))
const Pagination = lazy(() => import('@/app/(admin)/base-ui/pagination/page'))
const Placeholders = lazy(() => import('@/app/(admin)/base-ui/placeholders/page'))
const Popovers = lazy(() => import('@/app/(admin)/base-ui/popovers/page'))
const Progress = lazy(() => import('@/app/(admin)/base-ui/progress/page'))
const Spinners = lazy(() => import('@/app/(admin)/base-ui/spinners/page'))
const Toasts = lazy(() => import('@/app/(admin)/base-ui/toasts/page'))
const Tooltips = lazy(() => import('@/app/(admin)/base-ui/tooltips/page'))

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


// Orders Routes
const OrdersList = lazy(() => import('@/app/(admin)/orders/orders-list/page'))
const OrdersDetail = lazy(() => import('@/app/(admin)/orders/order-detail/page'))
const OrdersCart = lazy(() => import('@/app/(admin)/orders/order-cart/page'))
const OrdersCheckout = lazy(() => import('@/app/(admin)/orders/order-checkout/page'))

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
// Customer Routes
const CustomerList = lazy(() => import('../app/admin/customer/customer-list/page'))
const CustomerDetails = lazy(() => import('../app/admin/customer/customer-detail/page'))

// Attributes Routes
const AttributeList = lazy(() => import('@/app/(admin)/attributes/attributes-list/page'))
const AttributeEdit = lazy(() => import('@/app/(admin)/attributes/attributes-edit/page'))
const AttributeAdd = lazy(() => import('@/app/(admin)/attributes/attributes-add/page'))

// Invoice Routes
const InvoiceList = lazy(() => import('@/app/(admin)/invoice/invoice-list/page'))
const InvoiceDetails = lazy(() => import('@/app/(admin)/invoice/invoice-details/page'))
const InvoiceAdd = lazy(() => import('@/app/(admin)/invoice/invoice-add/page'))

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

// Coupons Routes
const CouponsList = lazy(() => import('@/app/(admin)/coupons/coupons-list/page'))
const CouponsAdd = lazy(() => import('@/app/(admin)/coupons/coupons-add/page'))

// // Advanced UI Routes
const Ratings = lazy(() => import('@/app/(admin)/advanced-ul/rating/page'))
const SweetAlerts = lazy(() => import('@/app/(admin)/advanced-ul/sweet-alert/page'))
const Swiper = lazy(() => import('@/app/(admin)/advanced-ul/swiper-slider/page'))
const Scrollbar = lazy(() => import('@/app/(admin)/advanced-ul/scrollbar/page'))
const Toastify = lazy(() => import('@/app/(admin)/advanced-ul/toastify/page'))

// Charts and Maps Routes
const Area = lazy(() => import('@/app/(admin)/charts/area/page'))
const Bar = lazy(() => import('@/app/(admin)/charts/bar/page'))
const Bubble = lazy(() => import('@/app/(admin)/charts/bubble/page'))
const Candlestick = lazy(() => import('@/app/(admin)/charts/candlestick/page'))
const Column = lazy(() => import('@/app/(admin)/charts/column/page'))
const Heatmap = lazy(() => import('@/app/(admin)/charts/heatmap/page'))
const Line = lazy(() => import('@/app/(admin)/charts/line/page'))
const Mixed = lazy(() => import('@/app/(admin)/charts/mixed/page'))
const Timeline = lazy(() => import('@/app/(admin)/charts/timeline/page'))
const Boxplot = lazy(() => import('@/app/(admin)/charts/boxplot/page'))
const Treemap = lazy(() => import('@/app/(admin)/charts/treemap/page'))
const Pie = lazy(() => import('@/app/(admin)/charts/pie/page'))
const Radar = lazy(() => import('@/app/(admin)/charts/radar/page'))
const RadialBar = lazy(() => import('@/app/(admin)/charts/radialBar/page'))
const Scatter = lazy(() => import('@/app/(admin)/charts/scatter/page'))
const Polar = lazy(() => import('@/app/(admin)/charts/polar/page'))

// Forms Routes
const Basic = lazy(() => import('@/app/(admin)/forms/basic/page'))
const Checkbox = lazy(() => import('@/app/(admin)/forms/checkbox/page'))
const Select = lazy(() => import('@/app/(admin)/forms/select/page'))
const Clipboard = lazy(() => import('@/app/(admin)/forms/clipboard/page'))
const FlatPicker = lazy(() => import('@/app/(admin)/forms/flat-picker/page'))
const Validation = lazy(() => import('@/app/(admin)/forms/validation/page'))
const Wizard = lazy(() => import('@/app/(admin)/forms/wizard/page'))
const FileUploads = lazy(() => import('@/app/(admin)/forms/file-uploads/page'))
const Editors = lazy(() => import('@/app/(admin)/forms/editors/page'))
const InputMask = lazy(() => import('@/app/(admin)/forms/input-mask/page'))
const Slider = lazy(() => import('@/app/(admin)/forms/range-slider/page'))

// // Form Routes
const BasicTable = lazy(() => import('@/app/(admin)/tables/basic/page'))
const GridjsTable = lazy(() => import('@/app/(admin)/tables/gridjs/page'))

// Icon Routes
const BoxIcons = lazy(() => import('@/app/(admin)/icons/boxicons/page'))
const SolarIcons = lazy(() => import('@/app/(admin)/icons/solaricons/page'))

// Auth Routes
const SignIn = lazy(() => import('@/app/(other)/auth/sign-in/page'))
const SignUp = lazy(() => import('@/app/(other)/auth/sign-up/page'))
const ResetPassword = lazy(() => import('@/app/(other)/auth/reset-pass/page'))
const LockScreen = lazy(() => import('@/app/(other)/auth/lock-screen/page'))
const initialRoutes = [
  {
    path: '/',
    name: 'root',
    element: <Navigate to="/dashboard" />,
  },
]
const generalRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    element: <Dashboard />,
  },
]
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
    name: 'Welcome',
    path: '/pages/welcome',
    element: <Welcome />,
  },
  {
    name: 'Timeline',
    path: '/pages/timeline',
    element: <TimelinePage />,
  },
  {
    name: 'Pricing',
    path: '/pages/pricing',
    element: <Pricing />,
  },
  {
    name: 'Error 404 Alt',
    path: '/pages/pages-404-alt',
    element: <Pages404Alt />,
  },
  {
    name: 'Widgets',
    path: '/widgets',
    element: <Widgets />,
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <Settings />,
  },
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
  {
    name: 'Help Center',
    path: '/support/help-center',
    element: <HelpCenter />,
  },
  {
    name: 'Faqs',
    path: '/support/faqs',
    element: <Faqs />,
  },
  {
    name: 'Privacy Policy',
    path: '/support/privacy-policy',
    element: <PrivacyPolicy />,
  },
]
const baseUIRoutes = [
  {
    name: 'Accordions',
    path: '/base-ui/accordion',
    element: <Accordions />,
  },
  {
    name: 'Alerts',
    path: '/base-ui/alerts',
    element: <Alerts />,
  },
  {
    name: 'Avatars',
    path: '/base-ui/avatar',
    element: <Avatars />,
  },
  {
    name: 'Badges',
    path: '/base-ui/badge',
    element: <Badges />,
  },
  {
    name: 'Breadcrumb',
    path: '/base-ui/breadcrumb',
    element: <Breadcrumb />,
  },
  {
    name: 'Buttons',
    path: '/base-ui/buttons',
    element: <Buttons />,
  },
  {
    name: 'Cards',
    path: '/base-ui/cards',
    element: <Cards />,
  },
  {
    name: 'Carousel',
    path: '/base-ui/carousel',
    element: <Carousel />,
  },
  {
    name: 'Collapse',
    path: '/base-ui/collapse',
    element: <Collapse />,
  },
  {
    name: 'Dropdowns',
    path: '/base-ui/dropdown',
    element: <Dropdown />,
  },
  {
    name: 'List Group',
    path: '/base-ui/list-group',
    element: <ListGroup />,
  },
  {
    name: 'Modals',
    path: '/base-ui/modals',
    element: <Modals />,
  },
  {
    name: 'Tabs',
    path: '/base-ui/tabs',
    element: <Tabs />,
  },
  {
    name: 'Offcanvas',
    path: '/base-ui/offcanvas',
    element: <Offcanvas />,
  },
  {
    name: 'Pagination',
    path: '/base-ui/pagination',
    element: <Pagination />,
  },
  {
    name: 'Placeholders',
    path: '/base-ui/placeholders',
    element: <Placeholders />,
  },
  {
    name: 'Popovers',
    path: '/base-ui/popovers',
    element: <Popovers />,
  },
  {
    name: 'Progress',
    path: '/base-ui/progress',
    element: <Progress />,
  },
  {
    name: 'Spinners',
    path: '/base-ui/spinners',
    element: <Spinners />,
  },
  {
    name: 'Toasts',
    path: '/base-ui/toasts',
    element: <Toasts />,
  },
  {
    name: 'Tooltips',
    path: '/base-ui/tooltips',
    element: <Tooltips />,
  },
]
const advancedUIRoutes = [
  {
    name: 'Ratings',
    path: '/advanced-ul/rating',
    element: <Ratings />,
  },
  {
    name: 'Sweet Alert',
    path: '/advanced-ul/sweet-alert',
    element: <SweetAlerts />,
  },
  {
    name: 'Swiper Slider',
    path: '/advanced-ul/swiper-slider',
    element: <Swiper />,
  },
  {
    name: 'Scrollbar',
    path: '/advanced-ul/scrollbar',
    element: <Scrollbar />,
  },
  {
    name: 'Toastify',
    path: '/advanced-ul/toastify',
    element: <Toastify />,
  },
]
const chartsNMapsRoutes = [
  {
    name: 'Area',
    path: '/charts/area',
    element: <Area />,
  },
  {
    name: 'Bar',
    path: '/charts/bar',
    element: <Bar />,
  },
  {
    name: 'Bubble',
    path: '/charts/bubble',
    element: <Bubble />,
  },
  {
    name: 'Candle Stick',
    path: '/charts/candlestick',
    element: <Candlestick />,
  },
  {
    name: 'Column',
    path: '/charts/column',
    element: <Column />,
  },
  {
    name: 'Heatmap',
    path: '/charts/heatmap',
    element: <Heatmap />,
  },
  {
    name: 'Line',
    path: '/charts/line',
    element: <Line />,
  },
  {
    name: 'Mixed',
    path: '/charts/mixed',
    element: <Mixed />,
  },
  {
    name: 'Timeline',
    path: '/charts/timeline',
    element: <Timeline />,
  },
  {
    name: 'Boxplot',
    path: '/charts/boxplot',
    element: <Boxplot />,
  },
  {
    name: 'Treemap',
    path: '/charts/treemap',
    element: <Treemap />,
  },
  {
    name: 'Pie',
    path: '/charts/pie',
    element: <Pie />,
  },
  {
    name: 'Radar',
    path: '/charts/radar',
    element: <Radar />,
  },
  {
    name: 'Radial Bar',
    path: '/charts/radialBar',
    element: <RadialBar />,
  },
  {
    name: 'Scatter',
    path: '/charts/scatter',
    element: <Scatter />,
  },
  {
    name: 'Polar Area',
    path: '/charts/polar',
    element: <Polar />,
  },
]
const formsRoutes = [
  {
    name: 'Basic Elements',
    path: '/forms/basic',
    element: <Basic />,
  },
  {
    name: 'Checkbox & Radio',
    path: '/forms/checkbox',
    element: <Checkbox />,
  },
  {
    name: 'Choice Select',
    path: '/forms/select',
    element: <Select />,
  },
  {
    name: 'Clipboard',
    path: '/forms/clipboard',
    element: <Clipboard />,
  },
  {
    name: 'Flat Picker',
    path: '/forms/flat-picker',
    element: <FlatPicker />,
  },
  {
    name: 'Validation',
    path: '/forms/validation',
    element: <Validation />,
  },
  {
    name: 'Wizard',
    path: '/forms/wizard',
    element: <Wizard />,
  },
  {
    name: 'File Uploads',
    path: '/forms/file-uploads',
    element: <FileUploads />,
  },
  {
    name: 'Editors',
    path: '/forms/editors',
    element: <Editors />,
  },
  {
    name: 'Input Mask',
    path: '/forms/input-mask',
    element: <InputMask />,
  },
  {
    name: 'Slider',
    path: '/forms/range-slider',
    element: <Slider />,
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
const iconRoutes = [
  {
    name: 'Boxicons',
    path: '/icons/boxicons',
    element: <BoxIcons />,
  },
  {
    name: 'SolarIcon',
    path: '/icons/solaricons',
    element: <SolarIcons />,
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
const OrdersRoutes = [
  {
    name: 'List',
    path: '/orders/orders-list',
    element: <OrdersList />,
  },
  {
    name: 'Detail',
    path: '/orders/order-detail',
    element: <OrdersDetail />,
  },
  {
    name: 'Cart',
    path: '/orders/order-cart',
    element: <OrdersCart />,
  },
  {
    name: 'Checkout',
    path: '/orders/order-checkout',
    element: <OrdersCheckout />,
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
const AttributeRoutes = [
  {
    name: 'Attributes List',
    path: '/attributes/attributes-list',
    element: <AttributeList />,
  },
  {
    name: 'Attributes Edit',
    path: '/attributes/attributes-edit',
    element: <AttributeEdit />,
  },
  {
    name: 'Attributes Add',
    path: '/attributes/attributes-add',
    element: <AttributeAdd />,
  },
]
const InvoiceRoutes = [
  {
    name: 'Invoice List',
    path: '/invoice/invoice-list',
    element: <InvoiceList />,
  },
  {
    name: 'Invoice Details',
    path: '/invoice/invoice-details',
    element: <InvoiceDetails />,
  },
  {
    name: 'Invoice Add',
    path: '/invoice/invoice-add',
    element: <InvoiceAdd />,
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
const CustomerRoutes = [
  {
    name: 'Customer List',
    path: '/customer/customer-list',
    element: <CustomerList />,
  },
  {
    name: 'Customer Detail',
    path: '/customer/customer-detail',
    element: <CustomerDetails />,
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
const CouponRoutes = [
  {
    name: 'Coupons List',
    path: '/coupons/coupons-list',
    element: <CouponsList />,
  },
  {
    name: 'Coupons Add',
    path: '/coupons/coupons-add',
    element: <CouponsAdd />,
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
  ...baseUIRoutes,
  ...advancedUIRoutes,
  ...chartsNMapsRoutes,
  ...formsRoutes,
  ...tableRoutes,
  ...iconRoutes,
  ...productRoutes,
  ...productVarientRoutes,
  ...postToStockRoutes,
  ...WareHouseRoutes,
  ...ProjectRoutes,
  ...CourierRoutes,
  ...CategoryRoutes,
  ...InventoryRoutes,
  ...OrdersRoutes,
  ...AttributeRoutes,
  ...PurchaseRoutes,
  ...InvoiceRoutes,
  ...RoleRoutes,
  ...CustomerRoutes,
  ...SellerRoutes,
  ...CouponRoutes,
  ...SellersRoutes,
  ...SalesRoutes,
]
