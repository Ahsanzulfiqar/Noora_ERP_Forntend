import PageTItle from '@/components/PageTItle'
import AddProduct from './components/AddProduct'
import Box from '@mui/material/Box'

const ProductAddPage = () => {
  return (
    <Box
    >
      <PageTItle title="Create Product" />

      <AddProduct />
    </Box>
  )
}
export default ProductAddPage
