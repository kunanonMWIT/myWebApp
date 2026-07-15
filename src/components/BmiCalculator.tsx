import { createSignal, Show, For, onMount } from "solid-js";
import StudyTable from "./BMITable";
import { Book, Hash, Clock, Calendar, Trash2 } from "lucide-solid";
import DatePicker from "@rnwonder/solid-date-picker";
import "@rnwonder/solid-date-picker/dist/style.css";

export default function BmiCalculator() {
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [subject, setSubject] = createSignal<string>("");
  const [chapters, setChapters] = createSignal<string>("");
  const [hours, setHours] = createSignal<string>("");
  const [minutes, setMinutes] = createSignal<string>("");
  const [date, setDate] = createSignal<Date>(new Date());
  const [speed, setSpeed] = createSignal<number | null>(null);
  const [status, setStatus] = createSignal<string>("");
  const [bgClass, setBgClass] = createSignal<string>("bg-kala-black");
  const [borderClass, setBorderClass] = createSignal<string>("border-space-convoy");
  const [showResult, setShowResult] = createSignal<boolean>(false);
  const [isSplit, setIsSplit] = createSignal<boolean>(false);
  const [history, setHistory] = createSignal<Array<[string, Date, number, number]>>([]);

  onMount(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("study_tracker_history") || "[]") as [string, string, number, number][];
      const formatted = raw.map((item): [string, Date, number, number] => [
        item[0],
        new Date(item[1]),
        item[2],
        item[3]
      ]);
      setHistory(formatted);
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
    }
  });

  const calculateBmi = () => {
    const ch = parseInt(chapters());
    const h = parseInt(hours()) || 0;
    const m = parseInt(minutes()) || 0;
    const totalMin = h * 60 + m;

    if (!subject().trim()) {
      alert("Please enter a subject.");
      return;
    }

    if (isNaN(ch) || ch <= 0) {
      alert("Please enter a valid number of chapters.");
      return;
    }

    if (totalMin <= 0) {
      alert("Please enter a valid time.");
      return;
    }

    if (!date()) {
      alert("Please select a date.");
      return;
    }

    const computedSpeed = totalMin / ch;
    setSpeed(computedSpeed);

    let currentStatus = "";
    let currentBg = "";
    let currentBorder = "";

    if (computedSpeed < 15) {
      currentStatus = "Fast";
      currentBg = "bg-kala-black";
      currentBorder = "border-parchment";
    } else if (computedSpeed >= 15 && computedSpeed < 30) {
      currentStatus = "Moderate";
      currentBg = "bg-kala-black";
      currentBorder = "border-vintage-charm";
    } else if (computedSpeed >= 30 && computedSpeed < 45) {
      currentStatus = "Slow";
      currentBg = "bg-kala-black";
      currentBorder = "border-space-convoy";
    } else {
      currentStatus = "Very Slow";
      currentBg = "bg-kala-black";
      currentBorder = "border-all-systems-red";
    }

    setStatus(currentStatus);
    setBgClass(currentBg);
    setBorderClass(currentBorder);
    setShowResult(true);

    setIsSplit(true);
  };

  const saveBmi = () => {
    const ch = parseInt(chapters());
    const h = parseInt(hours()) || 0;
    const m = parseInt(minutes()) || 0;
    const totalMin = h * 60 + m;
    if (isNaN(ch) || ch <= 0 || totalMin <= 0) return;
    try {
      const currentHistory = JSON.parse(localStorage.getItem("study_tracker_history") || "[]") as [string, string, number, number][];
      currentHistory.push([
        subject(),
        date().toISOString(),
        ch,
        totalMin
      ]);
      localStorage.setItem("study_tracker_history", JSON.stringify(currentHistory));
      
      const formatted = currentHistory.map((item): [string, Date, number, number] => [
        item[0],
        new Date(item[1]),
        item[2],
        item[3]
      ]);
      setHistory(formatted);
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
    setIsSplit(false);
  };

  const discardBmi = () => {
    setShowResult(false);
    setSpeed(null);
    setStatus("");
    setIsSplit(false);
  };

  const deleteRecord = (index: number) => {
    const currentHistory = [...history()];
    currentHistory.splice(index, 1);
    setHistory(currentHistory);
    const raw = currentHistory.map((item): [string, string, number, number] => [
      item[0],
      item[1].toISOString(),
      item[2],
      item[3]
    ]);
    localStorage.setItem("study_tracker_history", JSON.stringify(raw));
  };

  return (
    <div class="bg-cape-storm p-[30px] rounded-[15px] w-[1000px] h-[600px] box-border font-sans grid grid-cols-[2fr_1px_3fr] grid-rows-[auto_1fr] gap-x-6 gap-y-3">
      {/* Header title */}
      <h2 class="text-vintage-charm text-[24px] font-bold mt-0 col-span-3 text-center mb-[20px]">
        Reading Tracker
      </h2>

      {/* Left Column Wrapper - Form inputs & Action */}
      <div class="col-start-1 row-start-2 flex flex-col justify-between h-full text-left box-border">
          {/* Subject Field */}
          <div class="relative w-full text-left">
            <label class="absolute bottom-full left-0 mb-2 flex items-center gap-2 text-[14px] text-space-convoy font-bold">
              <Book size={16} class="text-all-systems-red" />
              Subject:
            </label>
            <input
              type="text"
              id="subject"
              placeholder="e.g. Mathematics"
              value={subject()}
              onInput={(e) => setSubject(e.currentTarget.value)}
              class="w-full p-[10px] border-none rounded-[8px] box-border text-[16px] outline-none bg-kala-black text-vintage-charm"
            />
          </div>
          {/* Chapters Field */}
          <div class="relative w-full text-left">
            <label class="absolute bottom-full left-0 mb-2 flex items-center gap-2 text-[14px] text-space-convoy font-bold">
              <Hash size={16} class="text-all-systems-red" />
              Chapters:
            </label>
            <input
              type="number"
              id="chapters"
              placeholder="e.g. 8"
              min="1"
              value={chapters()}
              onInput={(e) => setChapters(e.currentTarget.value)}
              class="w-full p-[10px] border-none rounded-[8px] box-border text-[16px] outline-none bg-kala-black text-vintage-charm"
            />
          </div>

          {/* Time Field */}
          <div class="relative w-full text-left">
            <label class="absolute bottom-full left-0 mb-2 flex items-center gap-2 text-[14px] text-space-convoy font-bold">
              <Clock size={16} class="text-all-systems-red" />
              Time:
            </label>
            <div class="flex gap-2 w-full">
              <input
                type="number"
                id="hours"
                placeholder="h"
                min="0"
                value={hours()}
                onInput={(e) => setHours(e.currentTarget.value)}
                class="w-full p-[10px] border-none rounded-[8px] box-border text-[16px] outline-none bg-kala-black text-vintage-charm"
              />
              <span class="flex items-center text-vintage-charm font-bold">:</span>
              <input
                type="number"
                id="minutes"
                placeholder="m"
                min="0"
                max="59"
                value={minutes()}
                onInput={(e) => setMinutes(e.currentTarget.value)}
                class="w-full p-[10px] border-none rounded-[8px] box-border text-[16px] outline-none bg-kala-black text-vintage-charm"
              />
            </div>
          </div>

          {/* Date Field with Custom Picker Popup */}
          <div class="relative w-full text-left">
            <label class="absolute bottom-full left-0 mb-2 flex items-center gap-2 text-[14px] text-space-convoy font-bold">
              <Calendar size={16} class="text-all-systems-red" />
              Date:
            </label>
            
              <DatePicker
                type="single"
                shouldCloseOnSelect={true}
                primaryColor="var(--color-all-systems-red)"
                primaryTextColor="var(--color-kala-black)"
                textColor="var(--color-vintage-charm)"
                backgroundColor="var(--color-cape-storm)"
                arrowsColor="var(--color-space-convoy)"
                weekDaysNameColor="var(--color-space-convoy)"
                weekEndDayTextColor="var(--color-vintage-charm)"
                weekEndDayBgColor="transparent"
                datePickerWrapperClass="border border-space-convoy/30 rounded-[8px] p-3 bg-cape-storm font-sans select-none"
                onChange={(data) => {
                  if (data.type === "single" && data.selectedDate) {
                    const { year, month, day } = data.selectedDate;
                    setDate(new Date(year ?? 0, month ?? 0, day ?? 1));
                  }
                }}
                renderInput={(pickerProps) => (
                  <div class="relative flex items-center w-full bg-kala-black rounded-[8px]">
                    <input
                      type="text"
                      placeholder="e.g. 2026-07-14"
                      value={`${date().getFullYear()}-${String(date().getMonth() + 1).padStart(2, "0")}-${String(date().getDate()).padStart(2, "0")}`}
                      onInput={(e) => {
                        const parts = e.currentTarget.value.split("-").map(Number);
                        if (parts.length === 3 && !parts.some(isNaN)) {
                          setDate(new Date(parts[0], parts[1] - 1, parts[2]));
                        }
                      }}
                      class="w-full p-[10px] pr-[40px] border-none rounded-[8px] box-border text-[16px] outline-none bg-transparent text-vintage-charm"
                    />
                    <Calendar 
                      size={16} 
                      class="absolute right-[12px] text-space-convoy cursor-pointer hover:text-all-systems-red shrink-0" 
                      onClick={(e) => {
                        e.stopPropagation();
                        pickerProps.showDate();
                      }}
                    />
                  </div>
                )}
              />
          </div>
        {/* Calculate button */}
        <div class="w-full flex flex-row gap-2 relative h-[48px] overflow-hidden shrink-0">
          {/* Calculate Button */}
          <button
            id="calcBtn"
            onClick={calculateBmi}
            class={`absolute inset-0 w-full h-full bg-all-systems-red text-vintage-charm border-none rounded-[8px] cursor-pointer font-bold transition-all duration-300 flex items-center justify-center hover:bg-space-convoy ${
              isSplit() ? "opacity-0 pointer-events-none scale-95" : "opacity-100 scale-100"
            }`}
          >
            Calculate
          </button>

          {/* Save & Discard Buttons */}
          <div 
            class={`w-full h-full flex flex-row gap-3 transition-all duration-300 ${
              isSplit() ? "opacity-100 scale-100" : "opacity-0 pointer-events-none scale-95"
            }`}
          >
            {/* Save Button (Green) */}
            <button
              type="button"
              onClick={saveBmi}
              class="flex-grow bg-parchment text-kala-black border-none rounded-[8px] cursor-pointer font-bold transition-colors duration-200 hover:bg-parchment/80 flex items-center justify-center h-[48px]"
            >
              Save
            </button>
            
            {/* Discard Button (Red, Square) */}
            <button
              type="button"
              onClick={discardBmi}
              class="w-[48px] h-[48px] bg-all-systems-red text-kala-black border-none rounded-[8px] cursor-pointer transition-colors duration-200 hover:bg-all-systems-red/80 flex items-center justify-center shrink-0"
              title="Discard"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Vertical Partition Line Element */}
      <div class="col-start-2 row-start-2 w-[1px] bg-space-convoy/30 h-full justify-self-center" />

      {/* Right Column - Results Box OR History Table */}
      <div class="col-start-3 row-start-2 h-full w-full flex flex-col justify-center items-center box-border px-6">
        <Show
          when={isSplit()}
          fallback={
            <StudyTable history={history()} onDelete={deleteRecord} />
          }
        >
          <div
            id="resultBox"
            class={`w-full p-[20px] rounded-[8px] border-l-[5px] text-left box-border ${bgClass()} ${borderClass()}`}
          >
            <p class="my-[8px] mx-0 text-vintage-charm text-sm">
              Subject: <span class="font-bold">{subject()}</span>
            </p>
            <p class="my-[8px] mx-0 text-vintage-charm text-sm">
              Date: <span class="font-bold">{date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </p>
            <hr class="border-t border-space-convoy/20 my-3" />
            <p class="my-[8px] mx-0 text-vintage-charm text-sm">
              Speed:{" "}
              <strong id="speedValue" class="text-[28px] text-all-systems-red font-bold block mt-1">
                {speed()?.toFixed(2)} <span class="text-base font-normal">min/ch</span>
              </strong>
            </p>
            <p class="my-[8px] mx-0 text-vintage-charm text-sm">
              Pace: <span id="speedStatus" class="font-bold text-[18px] block mt-1">{status()}</span>
            </p>
          </div>
        </Show>
      </div>
    </div>
  );
}
