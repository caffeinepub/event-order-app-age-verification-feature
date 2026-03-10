import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import AgeVerificationModal from "./components/AgeVerificationModal";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PaymentModal from "./components/PaymentModal";
import ProductCatalog from "./components/ProductCatalog";
import VenueSelector from "./components/VenueSelector";
import type { Venue } from "./data/venues";
import { useCartStore } from "./store/cartStore";

const queryClient = new QueryClient();

function AppContent() {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAgeVerificationOpen, setIsAgeVerificationOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const { items, clearCart } = useCartStore();

  const hasAlcohol = items.some((item) => item.containsAlcohol);

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (hasAlcohol) {
      setIsAgeVerificationOpen(true);
    } else {
      setIsPaymentOpen(true);
    }
  };

  const handleAgeVerified = () => {
    setIsAgeVerificationOpen(false);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    clearCart();
    toast.success("Order placed successfully! Enjoy your event!");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        onCartClick={() => setIsCartOpen(true)}
        venue={selectedVenue}
        onBackToVenues={
          selectedVenue ? () => setSelectedVenue(null) : undefined
        }
      />
      <main className="flex-1">
        {selectedVenue ? (
          <ProductCatalog venue={selectedVenue} />
        ) : (
          <VenueSelector onSelectVenue={setSelectedVenue} />
        )}
      </main>
      <Footer />
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCheckout}
      />
      <AgeVerificationModal
        isOpen={isAgeVerificationOpen}
        onClose={() => setIsAgeVerificationOpen(false)}
        onAgeVerified={handleAgeVerified}
      />
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <AppContent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
