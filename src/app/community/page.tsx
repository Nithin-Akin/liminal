"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Users, Calendar, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { CommunityIllustration } from "@/components/ui/Illustrations";
import { DAY_FEED, CITY_CIRCLES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Tab = "feed" | "circles";

const CIRCLE_COLORS = ["card-yellow", "card-mint", "card-blue"];

export default function CommunityPage() {
  const [tab, setTab] = useState<Tab>("feed");
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-full bg-bg">
      <PageHeader
        title="Community"
        subtitle="Bengaluru · Day 19 peers"
        dropdown="this week"
      />

      <CommunityIllustration className="mx-auto -mt-2 mb-2 h-24 w-32" />

      {/* Tabs — reference pill style */}
      <div className="mx-5 mb-4 flex rounded-[20px] border border-border bg-bg-card p-1">
        {(["feed", "circles"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "flex-1 rounded-2xl py-2.5 text-xs font-extrabold uppercase tracking-wider transition",
              tab === id ? "bg-orange text-text-dark" : "text-text-muted"
            )}
          >
            {id === "feed" ? "Day Feed" : "Circles"}
          </button>
        ))}
      </div>

      {tab === "feed" ? (
        <div className="space-y-3 px-5 pb-6">
          {DAY_FEED.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bento-card card-dark p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-yellow text-sm font-extrabold text-text-dark">
                  {post.author[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-text">{post.author}</p>
                  <p className="text-[10px] text-text-faint">
                    Day {post.dayNumber} · {post.timeAgo}
                  </p>
                </div>
                {post.tag && <Chip variant="purple">{post.tag}</Chip>}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                {post.content}
              </p>
              <button
                type="button"
                onClick={() => toggleLike(post.id)}
                className={cn(
                  "mt-3 flex items-center gap-1.5 text-sm font-bold transition",
                  liked.has(post.id) ? "text-orange" : "text-text-faint"
                )}
              >
                <Heart className={cn("h-4 w-4", liked.has(post.id) && "fill-current")} />
                {post.likes + (liked.has(post.id) ? 1 : 0)}
              </button>
            </motion.article>
          ))}
        </div>
      ) : (
        <div className="space-y-3 px-5 pb-6">
          {CITY_CIRCLES.map((circle, i) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`bento-card ${CIRCLE_COLORS[i % 3]} p-4`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-extrabold">{circle.name}</h3>
                  <p className="mt-1 text-xs opacity-70">{circle.description}</p>
                </div>
                <Users className="h-5 w-5 opacity-50" />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip className="!bg-text-dark/10 !border-text-dark/20 !text-text-dark">
                  {circle.members} members
                </Chip>
                {circle.nextEvent && (
                  <Chip className="!bg-text-dark/10 !border-text-dark/20 !text-text-dark">
                    <Calendar className="mr-1 inline h-3 w-3" />
                    {circle.nextEvent}
                  </Chip>
                )}
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded-[16px] bg-text-dark/15 py-2.5 text-xs font-extrabold uppercase tracking-wider"
              >
                Join circle
              </button>
            </motion.div>
          ))}

          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-[28px] border-2 border-dashed border-border py-4 text-xs font-extrabold uppercase tracking-wider text-text-muted"
          >
            <Plus className="h-4 w-4" />
            Start new circle
          </button>
        </div>
      )}
    </div>
  );
}
