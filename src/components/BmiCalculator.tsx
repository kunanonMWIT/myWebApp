import { createSignal, Show, For } from "solid-js";
import { User, Scale, Ruler, Calendar, Trash2 } from "lucide-solid";
import DatePicker from "@rnwonder/solid-date-picker";
import "@rnwonder/solid-date-picker/dist/style.css";

export default function BmiCalculator() {
  const today = new Date();
  const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [name, setName] = createSignal<string>("");
  const [weight, setWeight] = createSignal<string>("");
  const [height, setHeight] = createSignal<string>("");
  const [date, setDate] = createSignal<string>(defaultDate);
  const [bmi, setBmi] = createSignal<number | null>(null);
  const [status, setStatus] = createSignal<string>("");
  const [bgClass, setBgClass] = createSignal<string>("bg-kala-black");
  const [borderClass, setBorderClass] = createSignal<string>("border-space-convoy");
  const [showResult, setShowResult] = createSignal<boolean>(false);
  const [isSplit, setIsSplit] = createSignal<boolean>(false);

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
    const computedBmi = bmi();
    if (computedBmi === null) return;
    try {
      const history = JSON.parse(localStorage.getItem("bmi_history") || "[]");
      const tuple = [
        name(),
        date(),
        parseFloat(computedBmi.toFixed(2)),
        status()
      ];
      history.push(tuple);
      localStorage.setItem("bmi_history", JSON.stringify(history));
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
                    const formattedMonth = String((month ?? 0) + 1).padStart(2, "0");
                    const formattedDay = String(day ?? 1).padStart(2, "0");
                    setDate(`${year}-${formattedMonth}-${formattedDay}`);
                  }
                }}
                renderInput={(pickerProps) => (
                  <div class="relative flex items-center w-full bg-kala-black rounded-[8px]">
                    <input
                      type="text"
                      placeholder="e.g. 2026-07-14"
                      value={date()}
                      onInput={(e) => setDate(e.currentTarget.value)}
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

      {/* Results Box */}
      <Show when={showResult()}>
        <div
          id="resultBox"
          class={`col-start-3 row-start-2 p-[20px] rounded-[8px] border-l-[5px] text-left self-center w-full box-border ${bgClass()} ${borderClass()}`}
        >
          <p class="my-[8px] mx-0 text-vintage-charm text-sm">
            Name: <span class="font-bold">{name()}</span>
          </p>
          <p class="my-[8px] mx-0 text-vintage-charm text-sm">
            Date: <span class="font-bold">{date()}</span>
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
  );
}
