import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import { Loader } from './components/common/Bits';

const L = (f) => lazy(f);
const Home = L(() => import('./pages/Home'));
const Products = L(() => import('./pages/Products'));
const ProductDetails = L(() => import('./pages/ProductDetails'));
const Cart = L(() => import('./pages/Cart'));
const Checkout = L(() => import('./pages/Checkout'));
const OrderSuccess = L(() => import('./pages/OrderSuccess'));
const TrackOrder = L(() => import('./pages/TrackOrder'));
const Static = L(() => import('./pages/StaticPages'));
const NotFound = L(() => import('./pages/NotFound'));
const Login = L(() => import('./pages/admin/Login'));
const Dashboard = L(() => import('./pages/admin/Dashboard'));
const Orders = L(() => import('./pages/admin/Orders'));
const OrderView = L(() => import('./pages/admin/OrderView'));
const AdminProducts = L(() => import('./pages/admin/Products'));
const Customers = L(() => import('./pages/admin/Customers'));
const Inventory = L(() => import('./pages/admin/Inventory'));
const Settings = L(() => import('./pages/admin/Settings'));
const POS = L(() => import('./pages/admin/POS'));

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="product/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-success/:orderId" element={<OrderSuccess />} />
          <Route path="track-order" element={<TrackOrder />} />
          {['about', 'contact', 'faq', 'shipping-policy', 'privacy-policy', 'terms', 'refund-policy'].map((p) => <Route key={p} path={p} element={<Static page={p} />} />)}
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/login" element={<Login />} />
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderView />} />
          <Route path="pos" element={<POS />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="customers" element={<Customers />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
