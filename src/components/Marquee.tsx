import { For } from "solid-js";
import {
  Book,
  BookOpen,
  GraduationCap,
  Pen,
  Clock,
  Brain,
  Target,
  Library,
  Star,
  Lightbulb,
} from "lucide-solid";

const items = [
  "Read daily — even 10 pages a day adds up",
  "Active recall beats passive reading",
  "Summarize each chapter in your own words",
  "Take short breaks every 25 minutes",
  "Review notes within 24 hours",
  "Teach someone to cement your learning",
  "Space your reviews across days",
  "Set a timer for focused study sessions",
  "Highlight key concepts, not entire pages",
  "Consistency matters more than cramming",
];

const icons = [
  Book,
  BookOpen,
  GraduationCap,
  Pen,
  Clock,
  Brain,
  Target,
  Library,
  Star,
  Lightbulb,
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
