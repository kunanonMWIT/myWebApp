import { createSignal, onMount } from "solid-js";
import StudyTable from "./BMITable";
import { Book, Hash, Clock, Calendar } from "lucide-solid";
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

    setSubject("");
    setChapters("");
    setHours("");
    setMinutes("");
    setDate(new Date());
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
    <div class="bg-cape-storm p-[30px] rounded-[15px] w-[calc(100vw-80px)] h-[calc(100vh-130px)] box-border font-sans grid grid-cols-[2fr_1px_3fr] grid-rows-[auto_1fr] gap-x-6 gap-y-3">
      <h2 class="text-vintage-charm text-[24px] font-bold mt-0 col-span-3 text-center mb-[20px]">
        Reading Tracker
      </h2>

      <div class="col-start-1 row-start-2 flex flex-col justify-between h-full text-left box-border">
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
        <div class="w-full h-[48px] shrink-0">
          <button
            id="calcBtn"
            onClick={calculateBmi}
            class="w-full h-full bg-all-systems-red text-vintage-charm border-none rounded-[8px] cursor-pointer font-bold transition-all duration-300 flex items-center justify-center hover:bg-space-convoy"
          >
            Calculate
          </button>
        </div>
      </div>

      <div class="col-start-2 row-start-2 w-[1px] bg-space-convoy/30 h-full justify-self-center" />

      <div class="col-start-3 row-start-2 h-full w-full flex flex-col justify-center items-center box-border px-6">
        <StudyTable history={history()} onDelete={deleteRecord} />
      </div>
    </div>
  );
}
