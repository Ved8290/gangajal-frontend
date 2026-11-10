
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import WhatsAppFloat from '../components/common/WhatsAppFloat';

export default function PublicLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
