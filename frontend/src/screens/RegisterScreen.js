import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../actions/userActions';

function RegisterScreen(props) {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const userRegister = useSelector((state) => state.userRegister);
  const { loading, userInfo, error } = userRegister;
  const dispatch = useDispatch();
  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  const validNameRegex = RegExp(/^[A-Za-z]{2,}/i);

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
      case 'name':
        errors.name = validNameRegex.test(value)
          ? ''
          : 'Name must be at least 2 chars length!';
        break;
      case 'surname':
        errors.surname = validNameRegex.test(value)
          ? ''
          : 'Surname must be at least 2 chars length!';
        break;
      case 'password':
        errors.password =
          value.length > 7 ? '' : 'Password must be 8 characters long!';
        break;
      case 'rePassword':
        errors.rePassword =
          value === password ? '' : 'Repassword must be similar to password!';
        break;
      case 'birthDate':
        errors.birthDate = underAgeValidate(value)
          ? ''
          : 'Sorry, you need to be older than 18';
        break;
      default:
        break;
    }
    setErrors(errors);
  };

  const underAgeValidate = (birthday) => {
    // it will accept two types of format yyyy-mm-dd and yyyy/mm/dd
    const optimizedBirthday = birthday.replace(/-/g, '/');

    //set date based on birthday at 01:00:00 hours GMT+0100 (CET)
    const myBirthday = new Date(optimizedBirthday);

    // set current day on 01:00:00 hours GMT+0100 (CET)
    const currentDate = new Date().toJSON().slice(0, 10) + ' 01:00:00';

    // calculate age comparing current date and borthday
    const myAge = ~~((Date.now(currentDate) - myBirthday) / 31557600000);

    return myAge > 18;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (Object.values(errors).every((er) => !er)) {
      dispatch(register({ name, email, password, surname, birthDate }));
    }
  };
  return (
    <div className='form'>
      <form onSubmit={submitHandler} onChange={handleChange}>
        <ul className='form-container'>
          <li>
            <h2>Create Account</h2>
          </li>
          <li>
            {loading && <div>Loading...</div>}
            {error && <div>{error}</div>}
          </li>
          <li>
            <label htmlFor='name'>Name</label>
            <input
              type='name'
              name='name'
              id='name'
              onChange={(e) => setName(e.target.value)}
              required
            ></input>
            {errors.name && <span className='form-error'>{errors.name}</span>}
          </li>
          <li>
            <label htmlFor='surname'>Surname</label>
            <input
              type='name'
              name='surname'
              id='surname'
              onChange={(e) => setSurname(e.target.value)}
              required
            ></input>
            {errors.surname && (
              <span className='form-error'>{errors.surname}</span>
            )}
          </li>
          <li>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              onChange={(e) => setEmail(e.target.value)}
              required
            ></input>
            {errors.email && <span className='form-error'>{errors.email}</span>}
          </li>
          <li>
            <label htmlFor='birthDate'>Birth date</label>
            <input
              type='date'
              name='birthDate'
              id='birthDate'
              onChange={(e) => setBirthDate(e.target.value)}
              required
            ></input>
            {errors.birthDate && (
              <span className='form-error'>{errors.birthDate}</span>
            )}
          </li>
          <li>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
            {errors.password && (
              <span className='form-error'>{errors.password}</span>
            )}
          </li>
          <li>
            <label htmlFor='rePassword'>Re-Enter Password</label>
            <input
              type='password'
              id='rePassword'
              name='rePassword'
              onChange={(e) => setRePassword(e.target.value)}
              required
            ></input>
            {errors.rePassword && (
              <span className='form-error'>{errors.rePassword}</span>
            )}
          </li>
          <li>
            <button type='submit' className='button primary'>
              Register
            </button>
          </li>
          <li>
            Already have an account?
            <Link
              to={redirect === '/' ? 'signin' : 'signin?redirect=' + redirect}
              className='button secondary text-center'
            >
              Log in your Pharmacy account
            </Link>
          </li>
        </ul>
      </form>
    </div>
  );
}
export default RegisterScreen;
