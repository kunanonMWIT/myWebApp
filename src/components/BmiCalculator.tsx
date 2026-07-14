import { createSignal, Show } from "solid-js";

export default function BmiCalculator() {
  const [weight, setWeight] = createSignal<string>("");
  const [height, setHeight] = createSignal<string>("");
  const [bmi, setBmi] = createSignal<number | null>(null);
  const [status, setStatus] = createSignal<string>("");
  const [bgClass, setBgClass] = createSignal<string>("bg-kala-black");
  const [borderClass, setBorderClass] = createSignal<string>("border-space-convoy");
  const [showResult, setShowResult] = createSignal<boolean>(false);

  const calculateBmi = () => {
    const w = parseFloat(weight());
    const h = parseFloat(height());

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      alert("กรุณากรอกน้ำหนักและส่วนสูงให้ถูกต้องก่อนนะครับ");
      return;
    }

    const heightInMeters = h / 100;
    const computedBmi = w / (heightInMeters * heightInMeters);
    setBmi(computedBmi);

    let currentStatus = "";
    let currentBg = "";
    let currentBorder = "";

    if (computedBmi < 18.5) {
      currentStatus = "น้ำหนักน้อย / ผอมไปหน่อยนะ";
      currentBg = "bg-kala-black";
      currentBorder = "border-space-convoy";
    } else if (computedBmi >= 18.5 && computedBmi < 23) {
      currentStatus = "น้ำหนักปกติ / หุ่นดีสุขภาพดี";
      currentBg = "bg-kala-black";
      currentBorder = "border-vintage-charm";
    } else if (computedBmi >= 23 && computedBmi < 25) {
      currentStatus = "น้ำหนักเกิน / เริ่มอวบแล้วนะ";
      currentBg = "bg-kala-black";
      currentBorder = "border-all-systems-red";
    } else {
      currentStatus = "อ้วน / ต้องเริ่มออกกำลังกายแล้วนะ";
      currentBg = "bg-cape-storm";
      currentBorder = "border-all-systems-red";
    }

    setStatus(currentStatus);
    setBgClass(currentBg);
    setBorderClass(currentBorder);
    setShowResult(true);
  };

  return (
    <div class="bg-cape-storm p-[30px] rounded-[15px] w-[320px] text-center font-sans">
      <h2 class="text-vintage-charm mb-[25px] text-[24px] font-bold mt-0">
        เครื่องคำนวณ BMI
      </h2>

      {/* ช่องกรอกน้ำหนัก */}
      <div class="text-left mb-[15px]">
        <label class="block text-[14px] text-space-convoy mb-[5px] font-bold">
          น้ำหนัก (กิโลกรัม):
        </label>
        <input
          type="number"
          id="weight"
          placeholder="เช่น 65"
          min="1"
          value={weight()}
          onInput={(e) => setWeight(e.currentTarget.value)}
          class="w-full p-[10px] border border-space-convoy rounded-[8px] box-border text-[16px] outline-none bg-kala-black text-vintage-charm"
        />
      </div>

      {/* ช่องกรอกส่วนสูง */}
      <div class="text-left mb-[15px]">
        <label class="block text-[14px] text-space-convoy mb-[5px] font-bold">
          ส่วนสูง (เซนติเมตร):
        </label>
        <input
          type="number"
          id="height"
          placeholder="เช่น 170"
          min="1"
          value={height()}
          onInput={(e) => setHeight(e.currentTarget.value)}
          class="w-full p-[10px] border border-space-convoy rounded-[8px] box-border text-[16px] outline-none bg-kala-black text-vintage-charm"
        />
      </div>

      {/* ปุ่มกดคำนวณ */}
      <button
        id="calcBtn"
        onClick={calculateBmi}
        class="w-full bg-all-systems-red text-vintage-charm border-none p-[12px] text-[16px] rounded-[8px] cursor-pointer font-bold mt-[10px] transition-colors duration-200 hover:bg-space-convoy"
      >
        คำนวณค่า BMI
      </button>

      {/* พื้นที่แสดงผลลัพธ์ */}
      <Show when={showResult()}>
        <div
          id="resultBox"
          class={`mt-[20px] p-[15px] rounded-[8px] border-l-[5px] text-left ${bgClass()} ${borderClass()}`}
        >
          <p class="my-[5px] mx-0 text-vintage-charm">
            ค่า BMI ของคุณคือ:{" "}
            <strong id="bmiValue" class="text-[24px] text-all-systems-red font-bold">
              {bmi()?.toFixed(2)}
            </strong>
          </p>
          <p class="my-[5px] mx-0 text-vintage-charm">
            แปลผล: <span id="bmiStatus" class="font-bold text-[18px]">{status()}</span>
          </p>
        </div>
      </Show>
    </div>
  );
}
