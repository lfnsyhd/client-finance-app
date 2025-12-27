import { useState } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { id } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

// Register Indonesian locale
registerLocale('id', id);

const SingleDatePicker = ({ selectedDate, onDateChange, placeholder = 'Pilih tanggal' }) => {
    const [date, setDate] = useState(selectedDate ? new Date(selectedDate) : new Date());

    const handleChange = (newDate) => {
        setDate(newDate);
        if (onDateChange && newDate) {
            // Format to YYYY-MM-DD
            const year = newDate.getFullYear();
            const month = String(newDate.getMonth() + 1).padStart(2, '0');
            const day = String(newDate.getDate()).padStart(2, '0');
            onDateChange(`${year}-${month}-${day}`);
        }
    };

    return (
        <div className="input-group">
            <span className="input-group-text text-secondary">
                <i className="bi bi-calendar"></i>
            </span>
            <DatePicker
                selected={date}
                onChange={handleChange}
                dateFormat="dd/MM/yyyy"
                locale="id"
                placeholderText={placeholder}
                className="form-control"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
            />
        </div>
    );
};

export default SingleDatePicker;
