import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Category, Venue } from "../data/venues";
import { useCartStore } from "../store/cartStore";

type FilterTab = "All" | Category;

interface ProductCatalogProps {
  venue: Venue;
}

export default function ProductCatalog({ venue }: ProductCatalogProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const addItem = useCartStore((state) => state.addItem);

  const filtered =
    activeTab === "All"
      ? venue.items
      : venue.items.filter((item) => item.category === activeTab);

  const handleAddToCart = (item: (typeof venue.items)[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      containsAlcohol: item.containsAlcohol,
      quantity: 1,
    });
    toast.success(`${item.name} added to cart`);
  };

  return (
    <section className="container py-10">
      <div className="mb-8">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FilterTab)}
        >
          <TabsList
            className="h-11 gap-1 rounded-xl p-1"
            data-ocid="catalog.filter.tab"
          >
            {(["All", "Food", "Drinks", "Alcohol"] as FilterTab[]).map(
              (tab) => {
                const count =
                  tab === "All"
                    ? venue.items.length
                    : venue.items.filter((i) => i.category === tab).length;
                return (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-lg px-4 font-medium"
                    data-ocid="catalog.tab"
                  >
                    {tab}
                    <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                      {count}
                    </span>
                  </TabsTrigger>
                );
              },
            )}
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          data-ocid="catalog.list"
        >
          {filtered.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              data-ocid={`catalog.item.${idx + 1}`}
            >
              <Card className="group flex h-full flex-col transition-shadow hover:shadow-lg">
                <CardHeader className="pb-3">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="text-4xl">{item.emoji}</span>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant="secondary"
                        className="text-xs font-medium"
                        style={{
                          background:
                            item.category === "Food"
                              ? "oklch(0.92 0.06 140)"
                              : item.category === "Drinks"
                                ? "oklch(0.90 0.06 200)"
                                : "oklch(0.90 0.06 30)",
                          color:
                            item.category === "Food"
                              ? "oklch(0.30 0.10 140)"
                              : item.category === "Drinks"
                                ? "oklch(0.25 0.10 200)"
                                : "oklch(0.30 0.10 30)",
                        }}
                      >
                        {item.category}
                      </Badge>
                      {item.containsAlcohol && (
                        <Badge variant="destructive" className="text-xs">
                          21+
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardTitle className="font-display text-lg leading-snug">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                  <span className="text-2xl font-bold text-foreground">
                    ${item.price}
                  </span>
                  <span className="ml-1 text-sm text-muted-foreground">
                    per item
                  </span>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(item)}
                    data-ocid={`catalog.primary_button.${idx + 1}`}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
