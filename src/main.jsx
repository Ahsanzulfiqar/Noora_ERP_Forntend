import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { basePath } from './context/constants'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app/store'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={basePath}>
      <App store={store} />
    </BrowserRouter>
  </StrictMode>,
)
