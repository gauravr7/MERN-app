import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

import { GET_ERRORS, SET_CURRENT_USER } from './types';


// Register User
export const registerUser = (userData, history) => dispatch => {
   axios.post('api/users/register', userData)
      .then(result => history.push('/login'))
      .catch(err =>
         dispatch({
            type: GET_ERRORS,
            payload: err.response.data
         })
      );
};

// Login get user toekn
export const loginUser = userData => dispatch => {
   axios.post('/api/users/login', userData)
      .then(res => {
         //save to local storage
         const { token } = res.data;

         //Set token to local storage
         localStorage.setItem('jwtToken', token);

         //Set token to auth header
         setAuthToken(token);

         // decode token to get user data
         const decoded = jwt_decode(token);

         //set current user;
         dispatch(setCurrentUser(decoded));

      }).catch(err => dispatch({
         type: GET_ERRORS,
         payload: err.response.data
      }))
};

//Set Logged in user

export const setCurrentUser = (decoded) => {
   return {
      type: SET_CURRENT_USER,
      payload: decoded
   }
}

// Log user out
export const logoutUser = () => dispatch => {
   // remove toekn from local storage
   localStorage.removeItem('jwtToken');
   // remove auth header for future request
   setAuthToken(false);
   //set current user to {} which will also set isAuthenticate to false
   dispatch(setCurrentUser({}));
}