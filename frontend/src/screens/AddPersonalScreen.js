import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { register } from '../actions/personalActions';
import axios from 'axios';

function AddPersonalScreen(props) {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [roleList, setRoleList] = useState([{ id: 0, role: 'client' }]);
  const [role, setRole] = useState(0);
  const personalCreater = useSelector((state) => state.personalCreater);
  const { loading, userInfo, error } = personalCreater;
  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo: admin } = userSignin;
  const dispatch = useDispatch();
  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  const validNameRegex = RegExp(/^[A-Za-z]{2,}/i);

  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

  useEffect(() => {
    if (!admin.role === 'admin') {
      props.history.push(redirect);
    }
    axios
      .get(`/api/roles`, {
        headers: {
          Authorization: 'Bearer ' + admin.token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setRoleList(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    return () => {
      //
    };
  }, []);

  useEffect(() => {
    if (userInfo) {
      alert(`New personal created\nEmail: ${userInfo.email}`);
      setName('');
      setSurname('');
      setEmail('');
      setBirthDate('');
      setPassword('');
      setRePassword('');
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
      case 'rePassword':
        errors.rePassword =
          value === password ? '' : 'Repassword must be similar to password!';
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
      default:
        break;
    }
    setErrors(errors);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (Object.values(errors).every((er) => !er)) {
      dispatch(register({ name, email, password, surname, birthDate, role }));
    }
  };

  return (
    <div className='form'>
      <form onSubmit={submitHandler} onChange={handleChange}>
        <ul className='form-container'>
          <li>
            <h2>Create new user</h2>
            <span>*Remember the password</span>
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
              value={name}
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
              value={surname}
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
              value={email}
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
              value={birthDate}
              required
            ></input>
          </li>
          <li>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              name='password'
              onChange={(e) => setPassword(e.target.value)}
              value={password}
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
              value={rePassword}
              required
            ></input>
            {errors.rePassword && (
              <span className='form-error'>{errors.rePassword}</span>
            )}
          </li>
          <li>
            <label htmlFor='role'>Role</label>
            <select onChange={(e) => setRole(e.target.value)}>
              {roleList.map((x) => (
                <option value={x.id}>{x.name}</option>
              ))}
            </select>
          </li>
          <li>
            <button type='submit' className='button primary'>
              Add personal
            </button>
          </li>
        </ul>
      </form>
    </div>
  );
}
export default AddPersonalScreen;
