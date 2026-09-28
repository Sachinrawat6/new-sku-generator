import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from './context/SidebarContext';
import MainLayout from './layouts/MainLayout';
import StyleNumbers from './components/StyleNumbers';
import CreateSimpleProducts from './pages/CreateSimpleProducts';
import CreateComboProducts from './pages/CreateComboProducts';

const App = () => {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Navigate to="/style-numbers" replace />} />
            <Route path="/style-numbers" element={<StyleNumbers />} />
            <Route path="/simple-products" element={<CreateSimpleProducts />} />
            <Route path="/combo-products" element={<CreateComboProducts />} />
            <Route path="*" element={<Navigate to="/style-numbers" replace />} />
          </Route>
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  );
};

export default App;
