import { For } from "solid-js";
import {
  Dumbbell,
  Flame,
  Heart,
  Timer,
  Zap,
  Trophy,
  Bike,
  Wind,
  Activity,
  Scale,
} from "lucide-solid";

const items = [
  "Track your BMI daily",
  "Stay hydrated — 2L of water a day",
  "30 minutes of cardio goes a long way",
  "Strength training builds lasting health",
  "Rest days are part of the plan",
  "Consistency beats intensity",
  "Fuel your body with whole foods",
  "Sleep is your best recovery tool",
  "Small steps, big results",
  "Know your numbers, own your health",
];

const icons = [
  Dumbbell,
  Flame,
  Heart,
  Timer,
  Zap,
  Trophy,
  Bike,
  Wind,
  Activity,
  Scale,
];

export default function Marquee() {
  // Duplicate the list so the seam is invisible during the loop
  const doubled = [...items, ...items];

  return (
    <div class="w-full bg-kala-black overflow-hidden py-3">
      <div class="flex w-max animate-marquee">
        <For each={doubled}>
          {(text, i) => {
            const Icon = icons[i() % icons.length];
            // Alternating lime (parchment) and carrot (space-convoy) pill backgrounds
            const pillBgClass = i() % 2 === 0 ? "bg-parchment/80" : "bg-space-convoy/80";

            return (
              <span class={`flex items-center gap-2 px-4 py-1.5 rounded-full mx-2 cursor-default transition-all duration-300 hover:px-8 text-kala-black shrink-0 ${pillBgClass}`}>
                <Icon size={14} class="text-kala-black shrink-0" />
                <span class="text-sm whitespace-nowrap">{text}</span>
              </span>
            );
          }}
        </For>
      </div>
    </div>
  );
}
