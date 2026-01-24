import * as Yup from 'yup';


export const SalesValidationSchema = Yup.object().shape({
  seller: Yup.string().required('Seller is required'),
  warehouse: Yup.string().required('Warehouse is required'),
  invoiceNo: Yup.string().required('Invoice number is required'),
  customerName: Yup.string().required('Customer name is required'),
  customerPhone: Yup.string().required('Customer phone is required'),
  address: Yup.string().required('Address is required'),
  status: Yup.string().oneOf(['draft', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled', 'returned']),
  // subCategory: Yup.string().required('Sub category is required'),
  // items: Yup.array().of(
  //   Yup.object().shape({
  //     product: Yup.string().required('Product is required'),
  //     quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Required'),
  //     salePrice: Yup.number().min(0, 'Price must be at least 0').required('Required'),
  //   })
  // ).min(1, 'At least one item is required'),
  subTotal: Yup.number().required(),
  totalAmount: Yup.number().required(),
});