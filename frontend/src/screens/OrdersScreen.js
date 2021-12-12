import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { listOrders, deleteOrder } from '../actions/orderActions';

function OrdersScreen(props) {
  const [statusList, setStatusList] = useState([]);
  const orderList = useSelector((state) => state.orderList);
  const { loading, orders, error } = orderList;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const orderDelete = useSelector((state) => state.orderDelete);
  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = orderDelete;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(listOrders());
    return () => {
      //
    };
  }, [successDelete]);

  useEffect(() => {
    axios
      .get(`/api/orders/status`, {
        headers: {
          Authorization: 'Bearer ' + userInfo.token,
        },
      })
      .then((res) => {
        setStatusList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      //
    };
  }, []);

  const deleteHandler = (order) => {
    dispatch(deleteOrder(order.id));
  };

  const setStatus = (order, target) => {
    order.status.id = target.value;
    console.log(target.parentNode);
  };

  const updateHandler = (order) => {
    axios
      .put(
        `/api/orders/status`,
        { id: order.id, status: order.status.id },
        {
          headers: {
            Authorization: 'Bearer ' + userInfo.token,
          },
        }
      )
      .then(() => {
        dispatch(listOrders());
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return orders ? (
    <div className='content content-margined'>
      <div className='order-header'>
        <h3>Orders</h3>
      </div>
      <div className='order-list'>
        <table className='table'>
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>USER</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                  })}
                </td>
                <td>{order.totalPrice}</td>
                <td>{order.user.email}</td>
                <td>
                  <span>{order.status?.name}</span>
                  <br />
                  <select onChange={(e) => setStatus(order, e.target)}>
                    {statusList.map((x) => (
                      <option value={x.id}>{x.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <Link to={'/order/' + order.id} className='button secondary'>
                    Details
                  </Link>{' '}
                  <button
                    type='button'
                    onClick={() => updateHandler(order)}
                    className='button secondary'
                  >
                    Update
                  </button>
                  {userInfo && userInfo.role === 'admin' && (
                    <button
                      type='button'
                      onClick={() => deleteHandler(order)}
                      className='button secondary'
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}
export default OrdersScreen;
