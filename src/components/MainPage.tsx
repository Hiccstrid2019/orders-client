import React, {useEffect, useRef, useState} from 'react';
import classes from "./MainPage.module.css";
import Button from "./ui/Button/Button";
import DatePicker from "./ui/DatePicker/DatePicker";
import {Order} from "../interfaces/Order";
import Table from "./ui/Table/Table";
import CreationOrderForm from "./ui/AddOrder/CreationOrderForm";
import api from "../http/api";
import {Provider} from "../interfaces/Provider";

export interface FilterValue {
    name: string;
    value: string;
    id: number;
}

const MainPage = () => {

    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(new Date(endDate.getFullYear(), endDate.getMonth() - 1, endDate.getDate(), endDate.getHours()));
    const filtersRef = useRef<HTMLSelectElement>(null);
    const [activeFormCreation, setActiveFormCreation] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        api.get<Order[]>(`/order?from=${startDate.toISOString()}&to=${endDate.toISOString()}`)
            .then(response => setOrders(response.data))
    }, []);
    const [orderFilters, setOrderFilters] = useState([]);
    const [itemsFilters, setItemsFilters] = useState([]);
    const [providerFilters, setProviderFilters] = useState<Provider[]>([]);


    const startDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(new Date(e.target.value));
    }

    const endDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(new Date(e.target.value));
    }

    const handleFilter = () => {
        console.log(Array.from(filtersRef.current!.options).filter(o => o.selected).map(o => o.value))
        api.get<Order[]>(`/order?from=${startDate.toISOString()}&to=${endDate.toISOString()}`)
            .then(response => setOrders(response.data))
    }

    const refreshOrders = () => {
        api.get<Order[]>(`/order?from=${startDate.toISOString()}&to=${endDate.toISOString()}`)
            .then(response => setOrders(response.data))
    }

    return (
        <div className={classes.container}>
            <div>
                <span>Показать заказы за период:</span>
                <span>с</span>
                <DatePicker date={startDate} dateOnChange={startDateChange}/>
                <span>до</span>
                <DatePicker date={endDate} dateOnChange={endDateChange}/>
            </div>
            <div>
                <span>Фильтр по заказам</span>
                <select multiple size={orderFilters.length} ref={filtersRef}>
                    {
                        orderFilters.map(o => <option>{o}</option>)
                    }
                </select>
                <span>Фильтр по элементам</span>
                <select multiple size={itemsFilters.length} ref={filtersRef}>
                    {
                        itemsFilters.map(i => <option>{i}</option>)
                    }
                </select>
                <span>Фильтр по поставщикам</span>
                <select multiple size={providerFilters.length} ref={filtersRef}>
                    {
                        providerFilters.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                    }
                </select>
                <Button text={"Применить фильтрацию"} onClick={handleFilter}/>
            </div>
            <div className={classes.table}>
                <Table data={orders} refreshOrders={refreshOrders}/>
            </div>
            {activeFormCreation && <CreationOrderForm setActive={setActiveFormCreation} refreshOrders={refreshOrders}/>}
            <div>
                <Button text={"Добавить заказ"} onClick={() => setActiveFormCreation(true)}/>
            </div>
        </div>
    );
};

export default MainPage;
