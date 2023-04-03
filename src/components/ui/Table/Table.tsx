import React, {useState} from 'react';
import {Order} from "../../../interfaces/Order";
import classes from "./Table.module.css";
import ViewOrder from "../ViewOrder/ViewOrder";
interface TableProps {
    data: Order[];
    refreshOrders: () => void;
}

const Table = ({data, refreshOrders}: TableProps) => {
    const [active, setActive] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number>();
    const handleClick = (orderId: number) => {
        setSelectedOrderId(orderId);
        setActive(!active);
    }
    return (
        <div>
            <table className={classes.table}>
                <tbody>
                <tr>
                    <th>№</th>
                    <th>Дата</th>
                    <th>Id поставщика</th>
                    <th>Поставищик</th>
                    <th>Элементов в заказе</th>
                </tr>
                {
                    data.map(order =>
                        <tr key={order.id} onClick={() => handleClick(order.id)}>
                            <td>{order.number}</td>
                            <td>{order.date.toISOString().slice(0, 10)}</td>
                            <td>{order.providerId}</td>
                            <td>{order.providerName}</td>
                            <td>{order.orderItems.length}</td>
                        </tr>)
                }
                </tbody>
            </table>
            {active && <ViewOrder setActive={setActive} orderId={selectedOrderId!} refreshOrders={refreshOrders}/>}
        </div>
    );
};

export default Table;
