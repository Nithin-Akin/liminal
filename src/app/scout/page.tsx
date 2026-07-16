"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Landmark,
  Stethoscope,
  UtensilsCrossed,
  TrainFront,
  Star,
  MapPin,
  Search,
  Mic,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { ScoutIllustration } from "@/components/ui/Illustrations";
import { SCOUT_RESOURCES, MOCK_USER } from "@/lib/mock-data";
import type { ScoutResource } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "bank", label: "Bank" },
  { id: "doctor", label: "Doctor" },
  { id: "food", label: "Food" },
  { id: "housing", label: "Housing" },
  { id: "transport", label: "Transit" },
] as const;

const categoryIcons: Record<ScoutResource["category"], typeof Landmark> = {
  bank: Landmark,
  doctor: Stethoscope,
  food: UtensilsCrossed,
  housing: Building2,
  transport: TrainFront,
};

const CARD_COLORS = ["card-dark", "card-yellow", "card-blue", "card-mint", "card-purple"];

export default function ScoutPage() {
  const [category, setCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = SCOUT_RESOURCES.filter((r) => {
    const matchCat = category === "all" || r.category === category;
    const matchQuery =
      !query ||
      r.title.toLowerCase().includes(query.toLowerCase()) ||
      r.subtitle.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <div className="min-h-full bg-bg">
      <PageHeader
        title="Scout"
        subtitle={`Resources near ${MOCK_USER.city}`}
        dropdown="all categories"
      />

      <div className="px-5 pb-6">
        <ScoutIllustration className="mx-auto mb-3 h-24 w-32" />

        {/* Search — reference dark pill */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-faint" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Zero balance bank near me..."
            className="input-dark w-full py-3.5 pl-11 pr-12 text-sm"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-text-faint">
          Scout Agent · filtered by budget & location
        </p>

        {/* Category chips */}
        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-xs font-bold transition",
                category === id
                  ? "bg-orange text-text-dark"
                  : "border border-border bg-bg-card text-text-muted"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Integration-style cards like reference */}
        <div className="mt-5 space-y-3">
          {filtered.map((resource, i) => {
            const Icon = categoryIcons[resource.category];
            const colorClass = CARD_COLORS[i % CARD_COLORS.length];
            const isColored = colorClass !== "card-dark";

            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bento-card ${colorClass} flex items-center gap-4 p-4 transition active:scale-[0.99]`}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                    isColored ? "bg-text-dark/10" : "bg-bg-elevated"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-extrabold">{resource.title}</h3>
                    {resource.badge && (
                      <Chip
                        variant="orange"
                        className="!py-0.5 !text-[9px]"
                      >
                        {resource.badge}
                      </Chip>
                    )}
                  </div>
                  <p
                    className={cn(
                      "mt-0.5 text-xs",
                      isColored ? "opacity-70" : "text-text-muted"
                    )}
                  >
                    {resource.subtitle}
                  </p>
                  <div
                    className={cn(
                      "mt-2 flex items-center gap-3 text-[10px] font-bold",
                      isColored ? "opacity-60" : "text-text-faint"
                    )}
                  >
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-yellow text-yellow" />
                      {resource.rating}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MapPin className="h-3 w-3" />
                      {resource.distance}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-text-faint">
            No results. Try a different search.
          </p>
        )}
      </div>
    </div>
  );
}
