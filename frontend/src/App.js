import React, { useState } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { useSelector } from 'react-redux';
import RegisterScreen from './screens/RegisterScreen';
import ProductsScreen from './screens/ProductsScreen';
import ShippingScreen from './screens/ShippingScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import DeliveryScreen from './screens/DeliveryScreen';
import OrdersScreen from './screens/OrdersScreen';
import PaymentInfoScreen from './screens/PaymentInfoScreen';
import DiscountScreen from './screens/DiscountScreen';
import AddPersonalScreen from './screens/AddPersonalScreen';

function App() {
  const [categoryList, setCategoryList] = useState([]);
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;

  const openMenu = () => {
    console.log(userInfo);
    axios
      .get('/api/categories')
      .then((response) => {
        setCategoryList(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    document.querySelector('.sidebar').classList.add('open');
  };
  const closeMenu = () => {
    document.querySelector('.sidebar').classList.remove('open');
  };
  return (
    <BrowserRouter>
      <div className='grid-container'>
        <header className='header'>
          <div className='brand'>
            <button onClick={openMenu}>&#9776;</button>
            <Link class='logo' to='/'>
              Pharmacy
            </Link>
            <Link class='plus' to='/'>
              +
            </Link>
          </div>

          <div className='header-links'>
            <span>
              <a href='tel:+380671112233'>+38-067-111-22-33</a>
            </span>
            <a href='/cart'>Cart</a>
            {userInfo ? (
              <Link to='/profile'>{userInfo.name}</Link>
            ) : (
              <Link to='/signin'>Sign In</Link>
            )}
            {userInfo && userInfo.role === 'admin' && (
              <div className='dropdown'>
                <a href='#'>Admin</a>
                <ul className='dropdown-content'>
                  <li>
                    <Link to='/orders'>Orders</Link>
                  </li>
                  <li>
                    <Link to='/products'>Products</Link>
                  </li>
                  <li>
                    <Link to='/addpersonal'>Add-Personal</Link>
                  </li>
                </ul>
              </div>
            )}
            {userInfo && userInfo.role === 'packeger' && (
              <Link to='/orders'>Orders</Link>
            )}
          </div>
        </header>
        <aside className='sidebar'>
          <h2>Menu</h2>
          <h3>Categories</h3>
          <button className='sidebar-close-button' onClick={closeMenu}>
            ❌
          </button>
          <ul className='categories'>
            {categoryList.map((x) => (
              <li>
                <Link to={`/category/${x.name}`}>{x.name}</Link>
              </li>
            ))}
            <h3>Information</h3>
            <li>
              <Link to='/Discount'>Discount</Link>
            </li>
            <li>
              <Link to='/PaymentInfo'>Payment</Link>
            </li>
            <li>
              <Link to='/delivery'>Delivery</Link>
            </li>
          </ul>
        </aside>
        <main className='main'>
          <div className='content'>
            <Route path='/orders' component={OrdersScreen} />
            <Route path='/addpersonal' component={AddPersonalScreen} />
            <Route path='/profile' component={ProfileScreen} />
            <Route path='/delivery' component={DeliveryScreen} />
            <Route path='/order/:id' component={OrderScreen} />
            <Route path='/products' component={ProductsScreen} />
            <Route path='/shipping' component={ShippingScreen} />
            <Route path='/paymentinfo' component={PaymentInfoScreen} />
            <Route path='/discount' component={DiscountScreen} />
            <Route path='/placeorder' component={PlaceOrderScreen} />
            <Route path='/signin' component={SigninScreen} />
            <Route path='/register' component={RegisterScreen} />
            <Route path='/product/:id' component={ProductScreen} />
            <Route path='/cart/:id?' component={CartScreen} />
            <Route path='/category/:id' component={HomeScreen} />
            <Route path='/' exact={true} component={HomeScreen} />
          </div>
        </main>
        <footer className='footer'>
          <div className='footer-category'>
            <ul>
              <li>
                <Link to='/category/Medicine'>Medicine</Link>
              </li>
              <li>
                <Link to='/category/Devices'>Devices </Link>
              </li>
            </ul>
          </div>
          <div className='footer-category'>
            <ul>
              <li>
                <Link to='/category/Pills'>Pills</Link>
              </li>
              <li>
                <Link to='/Discount'>Discount</Link>
              </li>
            </ul>
          </div>
          <div className='footer-category'>
            <ul>
              <li>
                <Link to='/PaymentInfo'>Payment</Link>
              </li>
              <li>
                <Link to='/delivery'>Delivery</Link>
              </li>
            </ul>
          </div>
          <div className='footer-category'>
            <ul>
              <li>
                <span>
                  <a href='tel:+380671112233'>+38-067-111-22-33</a>
                </span>
              </li>
              <li>
                <a href='mailto:aaa@gmail.com'>aaa@gmail.com</a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
