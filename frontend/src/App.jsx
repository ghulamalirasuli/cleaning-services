import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Cities from './pages/Cities';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingWizard from './pages/BookingWizard';
import BookingConfirm from './pages/BookingConfirm';
import BookingStatus from './pages/BookingStatus';
import Account from './pages/account/Account';
import AccountBookings from './pages/account/AccountBookings';
import AccountBookingDetail from './pages/account/AccountBookingDetail';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBookings from './pages/admin/AdminBookings';
import AdminCleaners from './pages/admin/AdminCleaners';
import AdminQuotes from './pages/admin/AdminQuotes';
import AdminCities from './pages/admin/AdminCities';
import AdminServices from './pages/admin/AdminServices';
import AdminServiceExtras from './pages/admin/AdminServiceExtras';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminSettings from './pages/admin/AdminSettings';
import AdminPageContent from './pages/admin/AdminPageContent';
import AdminTrash from './pages/admin/AdminTrash';
import NotFound from './pages/NotFound';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AccountLayout = () => (
  <ProtectedRoute>
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  </ProtectedRoute>
);

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:slug" element={<ServiceDetail />} />
        <Route path="/cities" element={<Cities />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/book" element={<BookingWizard />} />
        <Route path="/book/confirm" element={<BookingConfirm />} />
        <Route path="/booking/:reference" element={<BookingStatus />} />
      </Route>

      <Route element={<AccountLayout />}>
        <Route path="/account" element={<Account />} />
        <Route path="/account/bookings" element={<AccountBookings />} />
        <Route path="/account/bookings/:reference" element={<AccountBookingDetail />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="page-content" element={<AdminPageContent />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="cleaners" element={<AdminCleaners />} />
        <Route path="quotes" element={<AdminQuotes />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="cities" element={<AdminCities />} />
        <Route path="service-extras" element={<AdminServiceExtras />} />
        <Route path="service_extras" element={<Navigate to="/admin/service-extras" replace />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="trash" element={<AdminTrash />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
