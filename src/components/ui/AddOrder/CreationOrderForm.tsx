import classes from "./CreationOrderForm.module.css";
import React, {useEffect, useState} from "react";
import DatePicker from "../DatePicker/DatePicker";
import api from "../../../http/api";
import {Provider} from "../../../interfaces/Provider";
import Button from "../Button/Button";
import {OrderItem} from "../../../interfaces/OrderItem";
interface CreationOrderFormProps {
    setActive: React.Dispatch<boolean>;
    refreshOrders: () => void;
}
const CreationOrderForm = ({setActive, refreshOrders}: CreationOrderFormProps) => {
    const [date, setDate] = useState(new Date());
    const [providers, setProviders] = useState<Provider[]>();
    useEffect(() => {
        api.get<Provider[]>('/provider')
            .then(response => {
                setProviders(response.data)
                setProvider(response.data[0].id)
            })
    }, [])

    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [orderNumber, setOrderNumber] = useState('');
    const [provider, setProvider] = useState(0);
    const [item, setItem] = useState<OrderItem>({
        name: "",
        quantity: 0,
        unit: ""
    });

    const [error, setError] = useState();
    const [validation, setValidation] = useState('');

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
        if (item.name && item.quantity > 0 && item.unit) {
            setOrderItems(orderItems => [...orderItems!, {name: item.name, quantity: item.quantity, unit: item.unit}]);
            setItem({
                name: "",
                quantity: 0,
                unit: ""
            });
            setValidation('');
        } else {
            if (!item.name) {
                setValidation("Название не может быть пустым")
            } else {
                if (!item.unit) {
                    setValidation("Unit не может быть пустым")
                } else {
                    setValidation("Количество должно быть больше 0")
                }
            }
        }
    }

    const deleteOrderItem = (item: OrderItem) => {
        setOrderItems(orderItems => orderItems.filter(orderItem => orderItem !== item))
    }

    const handleCreateOrder = () => {
        api.post('/order', {
            number: orderNumber,
            date: date.toISOString(),
            providerId: provider,
            orderItems: orderItems
        }).then(() => {
                setActive(false);
                refreshOrders();
            }).catch(error => setError(error.response.data.error))
    }

    return (
        <div className={classes.container} onClick={() => setActive(false)}>
            <div className={classes.content} onClick={e => e.stopPropagation()}>
                <div>
                    <h3>Создание заказа</h3>
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
                            orderItems?.map((item, index) =>
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.unit}</td>
                                    <td><Button text={"Удалить"} onClick={() => deleteOrderItem(item)}/></td>
                                </tr>)
                        }
                        <tr>
                            <td><input name="name" value={item.name} onChange={handleChangeItem}/></td>
                            <td><input type="number" name="quantity" value={item.quantity} onChange={handleChangeItem}/></td>
                            <td><input name="unit" value={item.unit} onChange={handleChangeItem}/></td>
                        </tr>
                        </tbody>
                    </table>
                    <div className={classes.error}>
                        {validation}
                    </div>
                    <div>
                        <Button text={"Добавить в заказ"} onClick={addOrderItem}/>
                    </div>
                </div>
                <div>
                    <Button text={"Отмена"} onClick={() => setActive(false)}/>
                    <Button text={"Создать заказ"} onClick={handleCreateOrder}/>
                </div>
                <div className={classes.error}>
                    {error}
                </div>
            </div>
        </div>
    )
}

export default CreationOrderForm;
