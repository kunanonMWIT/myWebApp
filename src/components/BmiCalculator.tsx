import { createSignal, Show, For, onMount } from "solid-js";
import BMITable from "./BMITable";
import { User, Scale, Ruler, Calendar, Trash2 } from "lucide-solid";
import DatePicker from "@rnwonder/solid-date-picker";
import "@rnwonder/solid-date-picker/dist/style.css";

export default function BmiCalculator() {
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [name, setName] = createSignal<string>("");
  const [weight, setWeight] = createSignal<string>("");
  const [height, setHeight] = createSignal<string>("");
  const [date, setDate] = createSignal<Date>(new Date());
  const [bmi, setBmi] = createSignal<number | null>(null);
  const [status, setStatus] = createSignal<string>("");
  const [bgClass, setBgClass] = createSignal<string>("bg-kala-black");
  const [borderClass, setBorderClass] = createSignal<string>("border-space-convoy");
  const [showResult, setShowResult] = createSignal<boolean>(false);
  const [isSplit, setIsSplit] = createSignal<boolean>(false);
  const [history, setHistory] = createSignal<Array<[string, Date, number, number]>>([]);

  onMount(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("bmi_history") || "[]") as [string, string, number, number][];
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
    const w = parseFloat(weight());
    const h = parseFloat(height());

    if (!name().trim()) {
      alert("Please enter a name.");
      return;
    }

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      alert("Please enter valid weight and height values.");
      return;
    }

    if (!date()) {
      alert("Please select a date.");
      return;
    }

    const heightInMeters = h / 100;
    const computedBmi = w / (heightInMeters * heightInMeters);
    setBmi(computedBmi);

    let currentStatus = "";
    let currentBg = "";
    let currentBorder = "";

    if (computedBmi < 18.5) {
      currentStatus = "Underweight";
      currentBg = "bg-kala-black";
      currentBorder = "border-space-convoy";
    } else if (computedBmi >= 18.5 && computedBmi < 23) {
      currentStatus = "Normal Weight";
      currentBg = "bg-kala-black";
      currentBorder = "border-vintage-charm";
    } else if (computedBmi >= 23 && computedBmi < 25) {
      currentStatus = "Overweight";
      currentBg = "bg-kala-black";
      currentBorder = "border-all-systems-red";
    } else {
      currentStatus = "Obese";
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
    const w = parseFloat(weight());
    const h = parseFloat(height());
    if (isNaN(w) || isNaN(h)) return;
    try {
      const currentHistory = JSON.parse(localStorage.getItem("bmi_history") || "[]") as [string, string, number, number][];
      currentHistory.push([
        name(),
        date().toISOString(),
        w,
        h
      ]);
      localStorage.setItem("bmi_history", JSON.stringify(currentHistory));
      
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
    setBmi(null);
    setStatus("");
    setIsSplit(false);
  };

  return (
    <div class="bg-cape-storm p-[30px] rounded-[15px] w-[1000px] h-[600px] box-border font-sans grid grid-cols-[2fr_1px_3fr] grid-rows-[auto_1fr] gap-x-6 gap-y-3">
      {/* Header title */}
      <h2 class="text-vintage-charm text-[24px] font-bold mt-0 col-span-3 text-center mb-[20px]">
        BMI Calculator
      </h2>

      {/* Left Column Wrapper - Form inputs & Action */}
      <div class="col-start-1 row-start-2 flex flex-col justify-between h-full text-left box-border">
          {/* Name Field */}
          <div class="relative w-full text-left">
            <label class="absolute bottom-full left-0 mb-2 flex items-center gap-2 text-[14px] text-space-convoy font-bold">
              <User size={16} class="text-all-systems-red" />
              Name:
            </label>
            <input
              type="text"
              id="name"
              placeholder="e.g. Kunanon"
              value={name()}
              onInput={(e) => setName(e.currentTarget.value)}
              class="w-full p-[10px] border-none rounded-[8px] box-border text-[16px] outline-none bg-kala-black text-vintage-charm"
            />
          </div>
          {/* Weight Field */}
          <div class="relative w-full text-left">
            <label class="absolute bottom-full left-0 mb-2 flex items-center gap-2 text-[14px] text-space-convoy font-bold">
              <Scale size={16} class="text-all-systems-red" />
              Weight (kg):
            </label>
            <input
              type="number"
              id="weight"
              placeholder="e.g. 65"
              min="1"
              value={weight()}
              onInput={(e) => setWeight(e.currentTarget.value)}
              class="w-full p-[10px] border-none rounded-[8px] box-border text-[16px] outline-none bg-kala-black text-vintage-charm"
            />
          </div>

          <div class="relative w-full text-left">
            <label class="absolute bottom-full left-0 mb-2 flex items-center gap-2 text-[14px] text-space-convoy font-bold">
              <Ruler size={16} class="text-all-systems-red" />
              Height (cm):
            </label>
            <input
              type="number"
              id="height"
              placeholder="e.g. 170"
              min="1"
              value={height()}
              onInput={(e) => setHeight(e.currentTarget.value)}
              class="w-full p-[10px] border-none rounded-[8px] box-border text-[16px] outline-none bg-kala-black text-vintage-charm"
            />
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
            Calculate BMI
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
            <BMITable history={history()} />
          }
        >
          <div
            id="resultBox"
            class={`w-full p-[20px] rounded-[8px] border-l-[5px] text-left box-border ${bgClass()} ${borderClass()}`}
          >
            <p class="my-[8px] mx-0 text-vintage-charm text-sm">
              Name: <span class="font-bold">{name()}</span>
            </p>
            <p class="my-[8px] mx-0 text-vintage-charm text-sm">
              Date: <span class="font-bold">{date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </p>
            <hr class="border-t border-space-convoy/20 my-3" />
            <p class="my-[8px] mx-0 text-vintage-charm text-sm">
              Your BMI is:{" "}
              <strong id="bmiValue" class="text-[28px] text-all-systems-red font-bold block mt-1">
                {bmi()?.toFixed(2)}
              </strong>
            </p>
            <p class="my-[8px] mx-0 text-vintage-charm text-sm">
              Result: <span id="bmiStatus" class="font-bold text-[18px] block mt-1">{status()}</span>
            </p>
          </div>
        </Show>
      </div>
    </div>
  );
}
