import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import AgeVerificationModal from './components/AgeVerificationModal';

const queryClient = new QueryClient();

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAgeVerificationOpen, setIsAgeVerificationOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <Header onCartClick={() => setIsCartOpen(true)} />
        <main className="flex-1">
          <ProductCatalog />
        </main>
        <Footer />
        <Cart 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsAgeVerificationOpen(true);
          }}
        />
        <AgeVerificationModal 
          isOpen={isAgeVerificationOpen}
          onClose={() => setIsAgeVerificationOpen(false)}
        />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
