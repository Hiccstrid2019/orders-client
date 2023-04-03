import React, {useEffect, useState} from 'react';
import classes from "../AddOrder/CreationOrderForm.module.css";
import DatePicker from "../DatePicker/DatePicker";
import Button from "../Button/Button";
import {Order} from "../../../interfaces/Order";
import {Provider} from "../../../interfaces/Provider";
import api from "../../../http/api";
import {OrderItem} from "../../../interfaces/OrderItem";

interface EditOrderFormProps {
    setActive: React.Dispatch<boolean>;
    refreshOrder: () => void;
    order: Order;
}

const EditOrderForm = ({setActive, order, refreshOrder}: EditOrderFormProps) => {
    const [providers, setProviders] = useState<Provider[]>();
    useEffect(() => {
        api.get<Provider[]>('/provider')
            .then(response => {
                setProviders(response.data)
            })
    }, [])

    const [provider, setProvider] = useState(order.providerId);
    const [orderNumber, setOrderNumber] = useState(order.number);
    const [date, setDate] = useState(order.date);
    const [orderItems, setOrderItems] = useState<OrderItem[]>(order.orderItems);
    const [item, setItem] = useState<OrderItem>({
        name: "",
        quantity: 0,
        unit: ""
    });

    const handleChangeItem = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value
        })
    }

    const dateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(new Date(e.target.value));
    }

    const addOrderItem = () => {
        if (item.name && item.quantity >= 1 && item.unit) {
            api.post<OrderItem>('/order/item', {
                orderId: order.id,
                name: item.name,
                quantity: item.quantity,
                unit: item.unit
            }).then(response => response.data)
                .then(data => setOrderItems(orderItems =>
                    [...orderItems!,
                        {
                            id: data.id,
                            name: data.name,
                            quantity: data.quantity,
                            unit: data.unit
                        }]));

            setItem({
                name: "",
                quantity: 0,
                unit: ""
            });
        }
    }

    const deleteOrderItem = (id: number) => {
        api.delete<number>(`/order/item/${id}`)
            .then((response) => {
                setOrderItems(orderItems => orderItems.filter(orderItem => orderItem.id !== response.data))
            })
    }

    const saveChanges = () => {
        api.put<Order>(`/order/${order.id}`, {
            number: orderNumber,
            date: date.toISOString(),
            providerId: provider,
            orderItems: orderItems
        }).then(() => {
            setActive(false);
            refreshOrder();
        });
    }

    const editUnit = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const items = orderItems.slice();
        items.find(i => i.id === id)![e.target.name] = e.target.value
        console.log(e.target.name)
        setOrderItems(items);
    }

    return (
        <div className={classes.container} onClick={() => setActive(false)}>
            <div className={classes.content} onClick={e => e.stopPropagation()}>
                <div>
                    <h3>Изменение заказа</h3>
                </div>
                <div>
                    <span>Номер заказа</span>
                    <input value={orderNumber} onChange={e => setOrderNumber(e.target.value)}/>
                </div>
                <div>
                    <span>Поставщик</span>
                    <select value={provider} onChange={e => setProvider(+e.target.value)}>
                        {
                            providers?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                        }
                    </select>
                </div>
                <div>
                    <span>Дата</span>
                    <DatePicker date={date} dateOnChange={dateChange}/>
                </div>
                <div>
                    <table>
                        <tbody>
                        <tr>
                            <th>Название</th>
                            <th>Количество</th>
                            <th>Unit</th>
                        </tr>
                        {
                            orderItems?.map(item =>
                                <tr key={item.id}>
                                    <td><input name="name" value={item.name} onChange={e => editUnit(item.id!, e)}/></td>
                                    <td><input name="quantity" type='number' value={item.quantity} onChange={e => editUnit(item.id!, e)}/></td>
                                    <td><input name="unit" value={item.unit} onChange={e => editUnit(item.id!, e)}/></td>
                                    <td><Button text={"Удалить"} onClick={() => deleteOrderItem(item.id!)}/></td>
                                </tr>)
                        }
                        <tr>
                            <td><input name="name" value={item.name} onChange={handleChangeItem}/></td>
                            <td><input type="number" name="quantity" value={item.quantity == 0 ? '' : item.quantity} onChange={handleChangeItem}/></td>
                            <td><input name="unit" value={item.unit} onChange={handleChangeItem}/></td>
                        </tr>
                        </tbody>
                    </table>
                    <div>
                        <Button text={"Добавить в заказ"} onClick={addOrderItem}/>
                    </div>
                </div>
                <div>
                    <Button text={"Отмена"} onClick={() => setActive(false)}/>
                    <Button text={"Сохранить"} onClick={saveChanges}/>
                </div>
            </div>
        </div>
    );
};

export default EditOrderForm;
