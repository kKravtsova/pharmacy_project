import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signin } from '../actions/userActions';

function SigninScreen(props) {
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const userSignin = useSelector((state) => state.userSignin);
  const { loading, userInfo, error } = userSignin;
  const dispatch = useDispatch();
  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );

  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
    return () => {
      //
    };
  }, [userInfo]);

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;

    switch (name) {
      case 'email':
        errors.email = validEmailRegex.test(value) ? '' : 'Email is not valid!';
        break;
      case 'password':
        errors.password =
          value.length > 7 ? '' : 'Password must be 8 characters long!';
        break;
      default:
        break;
    }
    setErrors(errors);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (Object.values(errors).every((er) => !er)) {
      dispatch(signin(email, password));
    }
  };
  return (
    <div className='form'>
      <form onSubmit={submitHandler} onChange={handleChange}>
        <ul className='form-container'>
          <li>
            <h2>Sign-In</h2>
          </li>
          <li>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
          </li>
          <li>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            {errors.email && <span className='form-error'>{errors.email}</span>}
          </li>
          <li>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            {errors.password && (
              <span className='form-error'>{errors.password}</span>
            )}
          </li>
          <li>
            <button type='submit' className='button primary'>
              Signin
            </button>
          </li>
          <li>New to Pharmacy?</li>
          <li>
            <Link
              to={
                redirect === '/' ? 'register' : 'register?redirect=' + redirect
              }
              className='button secondary text-center'
            >
              Create your Pharmacy account
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}
export default SigninScreen;
