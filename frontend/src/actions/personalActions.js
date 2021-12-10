import Axios from 'axios';
import {
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
} from '../constants/userConstants';

const register = (options) => async (dispatch, getState) => {
  const {
    userSignin: { userInfo },
  } = getState();
  dispatch({
    type: USER_REGISTER_REQUEST,
    payload: options,
  });
  try {
    const { data } = await Axios.post('/api/users/addpersonal', options, {
      headers: {
        Authorization: 'Bearer ' + userInfo.token,
      },
    });
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_REGISTER_FAIL, payload: error.message });
  }
};

export { register };
