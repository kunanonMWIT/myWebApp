import { createSignal } from "solid-js";
import { ChevronRight } from "lucide-solid";
import BmiCalculator from "./BmiCalculator";

export default function Carousel() {
  const [current, setCurrent] = createSignal(0);
  const total = 3;

  const next = () => setCurrent((c) => (c + 1) % total);

  return (
    <div class="relative flex items-center justify-center">
      <div class="relative w-[1000px]">
        <div class="overflow-hidden rounded-[15px]">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(${-current() * 1000}px)` }}
          >
            <div class="min-w-[1000px]"><BmiCalculator /></div>
            <div class="min-w-[1000px]"><BmiCalculator /></div>
            <div class="min-w-[1000px]"><BmiCalculator /></div>
          </div>
        </div>
        <button
          onClick={next}
          class="absolute right-[-15px] top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-all-systems-red text-kala-black flex items-center justify-center cursor-pointer hover:bg-space-convoy transition-colors shadow-md"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
