import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { logout, update } from '../actions/userActions';
import { listMyOrders } from '../actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';

function ProfileScreen(props) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [surname, setSurname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const dispatch = useDispatch();

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const handleLogout = () => {
    dispatch(logout());
    props.history.push('/signin');
  };
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(update({ userId: userInfo.id, email, name, password, surname }));
  };
  const userUpdate = useSelector((state) => state.userUpdate);
  const { loading, success, error } = userUpdate;

  const myOrderList = useSelector((state) => state.myOrderList);
  const { loading: loadingOrders, orders, error: errorOrders } = myOrderList;
  useEffect(() => {
    if (userInfo) {
      setEmail(userInfo.email);
      setName(userInfo.name);
      setSurname(userInfo.surname);
      setPassword(userInfo.password);
      setBirthDate(userInfo.birthDate);
    }
    dispatch(listMyOrders());
    return () => {};
  }, [userInfo]);

  return (
    <div className='profile'>
      <div className='profile-info'>
        <div className='form'>
          <form onSubmit={submitHandler}>
            <ul className='form-container'>
              <li>
                <h2>User Profile</h2>
              </li>
              <li>
                {loading && <div>Loading...</div>}
                {error && <div>{error}</div>}
                {success && <div>Profile Saved Successfully.</div>}
              </li>
              <li>
                <label htmlFor='name'>Name</label>
                <input
                  value={name}
                  type='name'
                  name='name'
                  id='name'
                  onChange={(e) => setName(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor='surname'>Surname</label>
                <input
                  value={surname}
                  type='name'
                  name='surname'
                  id='surname'
                  onChange={(e) => setSurname(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor='email'>Email</label>
                <input
                  value={email}
                  type='email'
                  name='email'
                  id='email'
                  onChange={(e) => setEmail(e.target.value)}
                ></input>
              </li>
              <li>
                <label htmlFor='birthDate'>Birth {birthDate}</label>
              </li>
              <li>
                <label htmlFor='password'>Password</label>
                <input
                  value={password}
                  type='password'
                  id='password'
                  name='password'
                  onChange={(e) => setPassword(e.target.value)}
                ></input>
              </li>

              <li>
                <button type='submit' className='button primary'>
                  Update
                </button>
              </li>
              <li>
                <button
                  type='button'
                  onClick={handleLogout}
                  className='button secondary full-width'
                >
                  Logout
                </button>
              </li>
            </ul>
          </form>
        </div>
      </div>
      <div className='profile-orders content-margined'>
        {loadingOrders ? (
          <div>Loading...</div>
        ) : errorOrders ? (
          <div>{errorOrders} </div>
        ) : (
          <table className='table'>
            <thead>
              <tr>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
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
                  <td>{order.status.name}</td>
                  <td>
                    <Link
                      className='black-color button secondary'
                      to={'/order/' + order.id}
                    >
                      DETAILS
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ProfileScreen;
