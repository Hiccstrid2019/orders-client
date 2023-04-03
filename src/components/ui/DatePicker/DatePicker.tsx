import React from 'react';

interface DatePickerProps {
    date: Date;
    dateOnChange: React.ChangeEventHandler<HTMLInputElement>;
}

const DatePicker = ({date, dateOnChange}: DatePickerProps) => {
    return (
        <input type="date" value={date.toISOString().slice(0, 10)} onChange={dateOnChange}/>
    );
};

export default DatePicker;
