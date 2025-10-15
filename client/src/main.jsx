import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '@ant-design/v5-patch-for-react-19';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import AuthContextProvider from './contexts/AuthContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={{components:{Button:{colorPrimary:"#1d3557"}}}}>
    <BrowserRouter>
    <AuthContextProvider>
    <App />
    </AuthContextProvider>
    </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
)
