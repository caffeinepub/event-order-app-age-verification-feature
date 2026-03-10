import { Wine, Beer, Coffee, Cake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '../store/cartStore';
import { toast } from 'sonner';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  containsAlcohol: boolean;
  description: string;
  icon: React.ReactNode;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Premium Red Wine',
    category: 'Wine',
    price: 45.99,
    containsAlcohol: true,
    description: 'Full-bodied red wine with notes of dark berries and oak',
    icon: <Wine className="h-8 w-8" />,
  },
  {
    id: 2,
    name: 'Craft IPA',
    category: 'Beer',
    price: 8.99,
    containsAlcohol: true,
    description: 'Hoppy India Pale Ale with citrus undertones',
    icon: <Beer className="h-8 w-8" />,
  },
  {
    id: 3,
    name: 'Champagne',
    category: 'Wine',
    price: 89.99,
    containsAlcohol: true,
    description: 'Elegant sparkling wine for special celebrations',
    icon: <Wine className="h-8 w-8" />,
  },
  {
    id: 4,
    name: 'Artisan Coffee',
    category: 'Beverages',
    price: 12.99,
    containsAlcohol: false,
    description: 'Premium single-origin coffee beans',
    icon: <Coffee className="h-8 w-8" />,
  },
  {
    id: 5,
    name: 'Gourmet Cake',
    category: 'Desserts',
    price: 34.99,
    containsAlcohol: false,
    description: 'Handcrafted chocolate layer cake',
    icon: <Cake className="h-8 w-8" />,
  },
  {
    id: 6,
    name: 'Whiskey Selection',
    category: 'Spirits',
    price: 125.99,
    containsAlcohol: true,
    description: 'Premium aged whiskey collection',
    icon: <Wine className="h-8 w-8" />,
  },
];

export default function ProductCatalog() {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      containsAlcohol: product.containsAlcohol,
      quantity: 1,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <section className="container py-12">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold tracking-tight">Event Menu</h2>
        <p className="text-muted-foreground">Select from our premium collection of beverages and treats</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {product.icon}
                </div>
                {product.containsAlcohol && (
                  <Badge variant="destructive" className="text-xs">
                    21+
                  </Badge>
                )}
              </div>
              <CardTitle>{product.name}</CardTitle>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">${product.price}</span>
                <span className="text-sm text-muted-foreground">per item</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
