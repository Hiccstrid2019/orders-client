import classes from "./ViewOrder.module.css";
import React, {useEffect, useState} from "react";
import api from "../../../http/api";
import {Order} from "../../../interfaces/Order";
import Button from "../Button/Button";
import EditOrderForm from "../EditOrder/EditOrderForm";
interface ViewOrderProps {
    setActive: React.Dispatch<boolean>;
    orderId: number;
    refreshOrders: () => void;
}
const ViewOrder = ({setActive, orderId, refreshOrders}: ViewOrderProps) => {
    const [order, setOrder] = useState<Order>();
    const [edit, setEdit] = useState(false);
    useEffect(() => {
        getOrder()
    },[])

    const getOrder = () => {
        api.get<Order>(`/order/${orderId}`)
            .then(response => setOrder(response.data))
    }

    const handleDelete = () => {
        api.delete(`/order/${orderId}`)
            .then(() => {
                setActive(false);
                refreshOrders();
            });
    }

    return (
        <div className={classes.container} onClick={() => setActive(false)}>
            <div className={classes.content} onClick={e => e.stopPropagation()}>
                <div>
                    <h3>Просмотр заказа</h3>
                </div>
                <div>
                    <span>Номер заказа:</span>
                    {order?.number}
                </div>
                <div>
                    <span>Поставщик:</span>
                    {order?.providerName}
                </div>
                <div>
                    <span>Дата:</span>
                    {order?.date.toISOString().slice(0, 10)}
                </div>
                <div>
                    {order?.orderItems.length
                        ?
                        <table>
                            <tbody>
                            <tr>
                                <th>Название</th>
                                <th>Количество</th>
                                <th>Unit</th>
                            </tr>
                            {
                                order?.orderItems?.map(item =>
                                    <tr key={item.id}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.unit}</td>
                                    </tr>)
                            }
                            </tbody>
                        </table>
                            :
                        <span>В заказе нет элементов</span>
                    }
                </div>
                <div>
                    <Button text={"Редактировать"} onClick={() => setEdit(true)}/>
                    <Button text={"Удалить"} onClick={handleDelete}/>
                </div>
            </div>
            {edit && <EditOrderForm setActive={setEdit} refreshOrder={getOrder} order={order!}/>}
        </div>
    )
}

export default ViewOrder;
