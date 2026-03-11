import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Locate, MapPin, Navigation } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { type Venue, getDistanceKm, venues } from "../data/venues";

interface VenueSelectorProps {
  onSelectVenue: (venue: Venue) => void;
}

const venueImages: Record<string, string> = {
  "rooftop-lounge": "🌆",
  "garden-terrace": "🌿",
  "grand-ballroom": "✨",
  "concert-arena": "🎸",
  "sports-stadium": "🏟️",
  theater: "🎭",
};

type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "granted"; lat: number; lng: number; city?: string }
  | { status: "denied"; error: string };

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m away`;
  if (km < 10) return `${km.toFixed(1)} km away`;
  return `${Math.round(km)} km away`;
}

export default function VenueSelector({ onSelectVenue }: VenueSelectorProps) {
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const venueTypeLabels: Record<string, string> = {
    All: "All Venues",
    lounge: "Lounges",
    terrace: "Terraces",
    ballroom: "Ballrooms",
    concert: "Concerts",
    sports: "Sports",
    theater: "Theater",
  };

  const venueTypes = [
    "All",
    ...Array.from(new Set(venues.map((v) => v.venueType))),
  ];

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocation({
        status: "denied",
        error: "Geolocation is not supported by your browser.",
      });
      return;
    }
    setLocation({ status: "loading" });
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          status: "granted",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        setLocation({ status: "denied", error: "Location access was denied." });
      },
      { timeout: 10000 },
    );
  };

  // Auto-request on mount
  // biome-ignore lint/correctness/useExhaustiveDependencies: only run once
  useEffect(() => {
    requestLocation();
  }, []);

  const filteredVenues = venues.filter(
    (v) => activeFilter === "All" || v.venueType === activeFilter,
  );

  const sortedVenues =
    location.status === "granted"
      ? [...filteredVenues].sort((a, b) => {
          const da = getDistanceKm(
            location.lat,
            location.lng,
            a.coordinates.lat,
            a.coordinates.lng,
          );
          const db = getDistanceKm(
            location.lat,
            location.lng,
            b.coordinates.lat,
            b.coordinates.lng,
          );
          return da - db;
        })
      : filteredVenues;

  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-20 text-center">
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute inset-0 noise-overlay" />
        <motion.div
          className="relative z-10 mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
            Welcome to
          </p>
          <h1 className="font-display mb-4 text-5xl font-bold leading-tight text-warm-white sm:text-6xl">
            Event Order
          </h1>
          <p className="text-lg text-warm-white/70">
            Order food, drinks, and more at your venue — delivered right to your
            seat.
          </p>

          {/* Location status */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {location.status === "idle" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={requestLocation}
                data-ocid="hero.location.button"
              >
                <Locate className="h-4 w-4" />
                Use My Location
              </Button>
            )}
            {location.status === "loading" && (
              <span
                className="flex items-center gap-2 text-sm text-warm-white/60"
                data-ocid="hero.loading_state"
              >
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/80" />
                Detecting your location...
              </span>
            )}
            {location.status === "granted" && (
              <span
                className="flex items-center gap-2 text-sm text-emerald-300"
                data-ocid="hero.success_state"
              >
                <Navigation className="h-4 w-4" />
                Venues sorted by distance from you
              </span>
            )}
            {location.status === "denied" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={requestLocation}
                data-ocid="hero.retry_location.button"
              >
                <Locate className="h-4 w-4" />
                Retry Location
              </Button>
            )}
          </div>
        </motion.div>
      </section>

      {/* Venue Type Filters */}
      <section className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div
          className="container flex gap-2 overflow-x-auto py-3 scrollbar-none"
          data-ocid="venues.filter.tab"
        >
          {venueTypes.map((type) => (
            <button
              type="button"
              key={type}
              data-ocid="venues.tab"
              onClick={() => setActiveFilter(type)}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeFilter === type
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              }`}
            >
              {venueTypeLabels[type] ?? type}
            </button>
          ))}
        </div>
      </section>

      {/* Venue Cards */}
      <section className="container py-12" data-ocid="venues.section">
        <motion.div
          className="mb-8 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="font-display text-2xl font-semibold tracking-tight">
            {location.status === "granted"
              ? "Nearest Venues"
              : venueTypeLabels[activeFilter]}
          </h2>
          <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {sortedVenues.length}
          </span>
        </motion.div>

        {sortedVenues.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-muted-foreground"
            data-ocid="venues.empty_state"
          >
            <span className="mb-3 text-5xl">🔍</span>
            <p className="text-lg font-medium">No venues found</p>
            <p className="text-sm">Try selecting a different type</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedVenues.map((venue, i) => {
              const distKm =
                location.status === "granted"
                  ? getDistanceKm(
                      location.lat,
                      location.lng,
                      venue.coordinates.lat,
                      venue.coordinates.lng,
                    )
                  : null;

              return (
                <motion.button
                  key={venue.id}
                  data-ocid={`venues.item.${i + 1}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.2, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  onClick={() => onSelectVenue(venue)}
                >
                  {/* Card hero area */}
                  <div
                    className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${venue.bgGradient}`}
                  >
                    <span className="text-7xl drop-shadow-lg">
                      {venueImages[venue.id]}
                    </span>
                    <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity group-hover:opacity-100" />
                    {distKm !== null && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        <Navigation className="h-3 w-3" />
                        {formatDistance(distKm)}
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <h3 className="font-display text-xl font-bold tracking-tight">
                        {venue.name}
                      </h3>
                    </div>
                    <p className="mb-0.5 text-sm font-semibold text-warm-white leading-snug">
                      {venue.eventName}
                    </p>
                    <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {venue.eventDate}
                    </p>
                    <p
                      className="mb-1 text-sm font-medium"
                      style={{ color: venue.accentColor }}
                    >
                      {venue.tagline}
                    </p>
                    <p className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {venue.address}
                    </p>
                    <p className="flex-1 text-sm text-muted-foreground">
                      {venue.description}
                    </p>

                    <div className="mt-5 flex items-center justify-between">
                      <div className="flex gap-2">
                        {["Food", "Drinks", "Alcohol"].map((cat) => {
                          const count = venue.items.filter(
                            (item) => item.category === cat,
                          ).length;
                          return count > 0 ? (
                            <span
                              key={cat}
                              className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                            >
                              {count} {cat}
                            </span>
                          ) : null;
                        })}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
