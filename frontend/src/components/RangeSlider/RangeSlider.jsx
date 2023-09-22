import { useState } from "react";
import "./RangeSlider.css";
import numeral from "numeral";
function RangeSlider({ onChange }) {
  const [value, setValue] = useState("");
  const handleChange = (event) => {
    const newValue = event.target.value;
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="range-slider">
      <input
        type="range"
        min={0}
        max={100000000}
        value={value}
        onChange={handleChange}
      />
      <span className="range-slider__value">
        {numeral(value).format("0,0")} đ
      </span>
    </div>
  );
}

export default RangeSlider;
