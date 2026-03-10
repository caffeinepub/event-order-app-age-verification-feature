import { Button } from "@/components/ui/button";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import type { Venue } from "../data/venues";
import { useCartStore } from "../store/cartStore";

interface HeaderProps {
  onCartClick: () => void;
  venue?: Venue | null;
  onBackToVenues?: () => void;
}

export default function Header({
  onCartClick,
  venue,
  onBackToVenues,
}: HeaderProps) {
  const items = useCartStore((state) => state.items);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {venue && onBackToVenues ? (
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              onClick={onBackToVenues}
              data-ocid="header.secondary_button"
            >
              <ChevronLeft className="h-4 w-4" />
              Venues
            </Button>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="font-display text-base font-bold text-primary-foreground">
                E
              </span>
            </div>
          )}

          <div>
            {venue ? (
              <>
                <h1 className="font-display text-lg font-bold leading-none tracking-tight">
                  {venue.name}
                </h1>
                <p className="text-xs text-muted-foreground">{venue.tagline}</p>
              </>
            ) : (
              <>
                <h1 className="font-display text-lg font-bold leading-none tracking-tight">
                  Event Order
                </h1>
                <p className="text-xs text-muted-foreground">
                  Premium Venue Dining
                </p>
              </>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          size="default"
          className="relative"
          onClick={onCartClick}
          data-ocid="header.open_modal_button"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </div>
    </header>
  );
}
