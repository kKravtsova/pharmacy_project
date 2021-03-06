import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { detailsOrder } from '../actions/orderActions';

function OrderScreen(props) {
  const orderDetails = useSelector((state) => state.orderDetails);
  const { loading, order, error } = orderDetails;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(detailsOrder(props.match.params.id));

    return () => {
      //
    };
  }, []);

  return order?.orderPositions ? (
    <div>
      <div className='placeorder'>
        <div className='placeorder-info'>
          <div>
            <h3>Shipping</h3>
            <div>
              {order.address}, {order.city}, {order.postalCode}
            </div>
            <h3>Status</h3>
            <div>{order.status.name}</div>
          </div>
          <div>
            <ul className='cart-list-container'>
              <li>
                <h3>Shopping Cart</h3>
                <div>Price</div>
              </li>
              {order.orderPositions.length === 0 ? (
                <div>Cart is empty</div>
              ) : (
                order.orderPositions.map((item) => (
                  <li key={item.id}>
                    <div className='cart-image'>
                      <img src={item.product.imagePath} alt='product' />
                    </div>
                    <div className='cart-name'>
                      <div>
                        <Link to={'/product/' + item.productId}>
                          {item.product.title}
                        </Link>
                      </div>
                      <div>Qty: {item.qty}</div>
                    </div>
                    <div className='cart-price'>₴{item.product.price}</div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
        <div className='placeorder-action'>
          <ul>
            <li>
              <h3>Order Summary</h3>
            </li>
            <li>
              <div>Items</div>
              <div>₴{order.itemsPrice}</div>
            </li>
            <li>
              <div>Shipping</div>
              <div>₴{order.shippingPrice}</div>
            </li>
            <li>
              <div>Tax</div>
              <div>₴{order.taxPrice}</div>
            </li>
            <li>
              <div>Order Total</div>
              <div>₴{order.totalPrice}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  ) : error ? (
    <div>{error}</div>
  ) : (
    <div>Loading ...</div>
  );
}

export default OrderScreen;
