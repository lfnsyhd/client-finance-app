import { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { id } from 'date-fns/locale';
import {
    subDays,
    startOfMonth,
    endOfMonth,
    subMonths,
    startOfDay,
    endOfDay
} from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

// Register Indonesian locale
registerLocale('id', id);

const DateRangePicker = ({ startDate, endDate, onDateChange }) => {
    const [dateRange, setDateRange] = useState([
        startDate ? new Date(startDate) : new Date(),
        endDate ? new Date(endDate) : new Date()
    ]);
    const [start, end] = dateRange;

    const handleChange = (update) => {
        setDateRange(update);
        if (onDateChange && update[0] && update[1]) {
            // Format dates to YYYY-MM-DD
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            onDateChange(formatDate(update[0]), formatDate(update[1]));
        }
    };

    // Predefined ranges
    const ranges = [
        {
            label: 'Hari Ini',
            getValue: () => [startOfDay(new Date()), endOfDay(new Date())]
        },
        {
            label: 'Kemarin',
            getValue: () => [startOfDay(subDays(new Date(), 1)), endOfDay(subDays(new Date(), 1))]
        },
        {
            label: '7 Hari Terakhir',
            getValue: () => [startOfDay(subDays(new Date(), 6)), endOfDay(new Date())]
        },
        {
            label: '30 Hari Terakhir',
            getValue: () => [startOfDay(subDays(new Date(), 29)), endOfDay(new Date())]
        },
        {
            label: 'Bulan Ini',
            getValue: () => [startOfMonth(new Date()), endOfMonth(new Date())]
        },
        {
            label: 'Bulan Lalu',
            getValue: () => [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))]
        }
    ];

    return (
        <div>
            <div className="input-group mb-2">
                <span className="input-group-text text-secondary">
                    <i className="bi bi-calendar-range"></i>
                </span>
                <DatePicker
                    selectsRange={true}
                    startDate={start}
                    endDate={end}
                    onChange={handleChange}
                    dateFormat="dd/MM/yyyy"
                    locale="id"
                    placeholderText="Pilih rentang tanggal"
                    className="form-control"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    isClearable={true}
                    monthsShown={2}
                />
            </div>

            {/* Quick range buttons */}
            <div className="d-flex flex-wrap gap-1 mt-2">
                {ranges.map((range, idx) => (
                    <button
                        key={idx}
                        className="btn btn-sm btn-outline-theme"
                        onClick={() => handleChange(range.getValue())}
                        type="button"
                    >
                        {range.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DateRangePicker;
