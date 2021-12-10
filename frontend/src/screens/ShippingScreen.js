import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { saveShipping } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';
import axios from 'axios';

function ShippingScreen(props) {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [delivery, setDelivery] = useState({ id: 1, name: 'Justin' });
  const [deliveryList, setDeliveryList] = useState([]);

  const dispatch = useDispatch();

  const setDeliveryHandler = (target) => {
    setDelivery({ name: target.key, id: target.value });
  };

  useEffect(() => {
    axios
      .get(`/api/deliveries`)
      .then((res) => {
        setDeliveryList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      //
    };
  }, []);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShipping({ address, city, postalCode, delivery }));
    props.history.push('placeorder');
  };
  return (
    <div>
      <CheckoutSteps step1 step2></CheckoutSteps>
      <div className='form'>
        <form onSubmit={submitHandler}>
          <ul className='form-container'>
            <li>
              <h2>Shipping</h2>
            </li>

            <li>
              <label htmlFor='address'>Address</label>
              <input
                type='text'
                name='address'
                id='address'
                onChange={(e) => setAddress(e.target.value)}
              ></input>
            </li>
            <li>
              <label htmlFor='city'>City</label>
              <input
                type='text'
                name='city'
                id='city'
                onChange={(e) => setCity(e.target.value)}
              ></input>
            </li>
            <li>
              <label htmlFor='postalCode'>Postal Code</label>
              <input
                type='text'
                name='postalCode'
                id='postalCode'
                onChange={(e) => setPostalCode(e.target.value)}
              ></input>
            </li>
            <li>
              <label htmlFor='delivery'>Delivery</label>
              <select onChange={(e) => setDeliveryHandler(e.target)}>
                {deliveryList.map((x) => (
                  <option value={x.id} key={x.name}>
                    {x.name}
                  </option>
                ))}
              </select>
            </li>

            <li>
              <button type='submit' className='button primary'>
                Continue
              </button>
            </li>
          </ul>
        </form>
      </div>
    </div>
  );
}
export default ShippingScreen;
