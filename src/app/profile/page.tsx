"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bell,
  Shield,
  ChevronRight,
  LogOut,
  Moon,
  Check,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Chip } from "@/components/ui/Chip";
import { MOCK_USER, getPhaseLabel } from "@/lib/mock-data";

const INTEGRATIONS = [
  {
    name: "Apple Health",
    status: "Connected",
    color: "card-mint",
    connected: true,
  },
  {
    name: "Google Maps",
    status: "Connected",
    color: "card-blue",
    connected: true,
  },
  {
    name: "Practo",
    status: "Unconnected",
    color: "card-dark",
    connected: false,
  },
  {
    name: "NoBroker",
    status: "Unconnected",
    color: "card-dark",
    connected: false,
  },
];

const SETTINGS = [
  { icon: Bell, label: "Notifications", sub: "Proactive check-ins on" },
  { icon: Shield, label: "Privacy", sub: "Data stays on device" },
  { icon: Moon, label: "Appearance", sub: "Dark mode" },
];

export default function ProfilePage() {
  const { name, city, dayNumber, totalDays, moveDate, phase } = MOCK_USER;

  return (
    <div className="min-h-full bg-bg">
      <PageHeader title="Settings" backHref="/" />

      <div className="px-5 pb-8">
        {/* Profile hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bento-card card-yellow mt-2 p-5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-text-dark text-2xl font-extrabold text-yellow">
              {name[0]}
            </div>
            <div>
              <h2 className="text-xl font-extrabold">{name}</h2>
              <p className="text-sm font-semibold opacity-70">{city}, India</p>
              <Chip className="mt-2 !bg-text-dark/10 !border-text-dark/20 !text-text-dark">
                Day {dayNumber} · {getPhaseLabel(phase)}
              </Chip>
            </div>
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            { label: "Day", value: dayNumber, color: "card-orange" },
            { label: "Phase", value: "3", color: "card-purple" },
            { label: "Left", value: totalDays - dayNumber, color: "card-mint" },
          ].map((stat) => (
            <div key={stat.label} className={`bento-card ${stat.color} p-4 text-center`}>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-wider opacity-60">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Integrations — reference style */}
        <div className="mt-6">
          <p className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-text-faint">
            Integrations
          </p>
          <div className="space-y-3">
            {INTEGRATIONS.map((item) => (
              <div
                key={item.name}
                className={`bento-card ${item.color} flex items-center justify-between p-4`}
              >
                <div>
                  <p className="text-sm font-extrabold">{item.name}</p>
                  <p className="mt-0.5 text-xs opacity-60">{item.status}</p>
                </div>
                {item.connected ? (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-text-dark/15">
                    <Check className="h-4 w-4" />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="rounded-full bg-orange px-3 py-1.5 text-[10px] font-extrabold uppercase text-text-dark"
                  >
                    Connect
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Settings list */}
        <div className="mt-6 space-y-2">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-text-faint">
            Preferences
          </p>
          {SETTINGS.map(({ icon: Icon, label, sub }) => (
            <button
              key={label}
              type="button"
              className="bento-card card-dark flex w-full items-center gap-3 p-4 text-left"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bg-elevated">
                <Icon className="h-4 w-4 text-text-muted" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-extrabold text-text">{label}</p>
                <p className="text-xs text-text-faint">{sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-text-faint" />
            </button>
          ))}
        </div>

        <div className="bento-card card-dark mt-4 p-4">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-text-faint">
            Journey started
          </p>
          <p className="mt-1 text-sm font-bold text-text">
            {new Date(moveDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-bg-elevated">
            <div
              className="h-full rounded-full bg-orange"
              style={{ width: `${(dayNumber / totalDays) * 100}%` }}
            />
          </div>
        </div>

        <Link
          href="/onboarding"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-[20px] border border-border py-3 text-xs font-extrabold uppercase tracking-wider text-text-muted"
        >
          <LogOut className="h-4 w-4" />
          Restart demo
        </Link>

        <p className="mt-5 text-center text-[10px] text-text-faint">
          Liminal v0.2 · Team VANTA
        </p>
      </div>
    </div>
  );
}
