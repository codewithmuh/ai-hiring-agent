"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAvailableSlots, type InterviewSlot } from "@/lib/api";

interface TimeSlotPickerProps {
  selected: InterviewSlot | null;
  onSelect: (slot: InterviewSlot) => void;
}

function getNextBusinessDays(count: number): Date[] {
  const days: Date[] = [];
  const now = new Date();
  let offset = 1;
  while (days.length < count) {
    const d = new Date(now);
    d.setDate(now.getDate() + offset);
    offset++;
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(d);
  }
  return days;
}

function formatDateKey(d: Date) {
  return d.toISOString().split("T")[0];
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

export default function TimeSlotPicker({ selected, onSelect }: TimeSlotPickerProps) {
  const businessDays = getNextBusinessDays(5);
  const [activeDate, setActiveDate] = useState<string>(formatDateKey(businessDays[0]));
  const [slots, setSlots] = useState<InterviewSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAvailableSlots(activeDate)
      .then(setSlots)
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [activeDate]);

  return (
    <div className="space-y-5">
      {/* Date pills */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-semibold">Select a Date</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {businessDays.map((day) => {
            const key = formatDateKey(day);
            const isActive = activeDate === key;
            return (
              <button
                key={key}
                onClick={() => setActiveDate(key)}
                className={cn(
                  "flex flex-col items-center rounded-xl px-4 py-2.5 text-center transition-all shrink-0 border",
                  isActive
                    ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                    : "bg-white text-foreground border-gray-200 hover:border-violet-300 hover:bg-violet-50"
                )}
              >
                <span className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
                  {day.toLocaleDateString("en-US", { weekday: "short" })}
                </span>
                <span className="text-lg font-bold leading-tight mt-0.5">
                  {day.getDate()}
                </span>
                <span className={cn("text-[10px]", isActive ? "text-violet-200" : "text-muted-foreground")}>
                  {day.toLocaleDateString("en-US", { month: "short" })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-semibold">Available Time Slots</span>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </motion.div>
          ) : slots.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-dashed bg-gray-50 p-8 text-center"
            >
              <p className="text-sm font-medium text-muted-foreground">No slots available for this date</p>
              <p className="text-xs text-muted-foreground mt-1">Try selecting a different day</p>
            </motion.div>
          ) : (
            <motion.div
              key={activeDate}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-2"
            >
              {slots.map((slot, i) => {
                const isSelected = selected?.id === slot.id;
                return (
                  <motion.button
                    key={slot.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03, duration: 0.2 }}
                    onClick={() => onSelect(slot)}
                    className={cn(
                      "relative flex flex-col items-center justify-center rounded-xl border px-3 py-3.5 transition-all",
                      isSelected
                        ? "border-violet-500 bg-violet-50 ring-2 ring-violet-500/20 shadow-sm"
                        : "border-gray-200 bg-white hover:border-violet-300 hover:bg-violet-50/50"
                    )}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="slot-check"
                        className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-600"
                      >
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </motion.div>
                    )}
                    <span className={cn("text-sm font-semibold", isSelected ? "text-violet-700" : "text-foreground")}>
                      {formatTime(slot.start_time)}
                    </span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">30 min</span>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
