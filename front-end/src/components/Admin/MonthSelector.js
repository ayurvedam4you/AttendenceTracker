import React, { useState } from 'react';

const MonthSelector = ({ setMonth, setYear }) => {
  const orderedMonths = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2021 }, (_, index) => 2022 + index);

  const [monthIndex, setMonthIndex] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const decreaseMonth = () => {
    setMonthIndex((prevIndex) => (prevIndex === 1 ? 12 : prevIndex - 1));
    setMonth((prevMonth) => (prevMonth === 1 ? 12 : prevMonth - 1));
  };

  const increaseMonth = () => {
    setMonthIndex((prevIndex) => (prevIndex === 12 ? 1 : prevIndex + 1));
    setMonth((prevMonth) => (prevMonth === 12 ? 1 : prevMonth + 1));
  };

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    setYear(year);
  };

  return (
    <div className="month-selector">
      <button onClick={decreaseMonth} className='month-btn'>&lt;</button>
      <input type="text" className='month-viewer' value={orderedMonths[monthIndex - 1].label} readOnly />
      <button onClick={increaseMonth}  className='month-btn'>&gt;</button>
      <select value={selectedYear} onChange={handleYearChange} className='year-selector' >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MonthSelector;
