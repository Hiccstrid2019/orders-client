import React from 'react';
import {FilterValue} from "../../MainPage";

interface SelectProps {
    values: FilterValue[];
}

const Select = ({values}: SelectProps) => {
    return (
        <select multiple size={values.length}>
            {
                values.map(value => <option key={value.id} value={value.value}>{value.name}</option>)
            }
        </select>
    );
};

export default Select;
