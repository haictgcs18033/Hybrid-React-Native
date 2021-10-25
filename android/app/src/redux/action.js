import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const loggedIn = navigation => {
  return async dispatch => {
    dispatch({
      type: 'GET_USER_REQUEST',
    });
    try {
      let value = await AsyncStorage.getItem('USER_LOGIN');

      if (value) {
        navigation.goBack();
      }
      dispatch({
        type: 'END_USER_REQUEST',
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
export const signinAction = (data, navigate) => {
  return async dispatch => {
    dispatch({
      type: 'GET_USER_REQUEST',
    });
    try {
      let result = await axios({
        url: 'http://10.0.2.2:3000/user/signin',
        method: 'POST',
        data: data,
      });
      await AsyncStorage.setItem(
        'USER_LOGIN',
        JSON.stringify(result.data.user),
      );
      await AsyncStorage.setItem('TOKEN', result.data.token);
      alert('Signin successfull');
      //   let value = await AsyncStorage.getItem('USER_LOGIN');
      dispatch({
        type: 'END_USER_REQUEST',
      });

      navigate.push('TabHome');
    } catch (error) {
      alert(error.response?.data.message);
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
export const signupAction = data => {
  return async dispatch => {
    dispatch({
      type: 'GET_USER_REQUEST',
    });
    try {
      await axios({
        url: 'http://10.0.2.2:3000/user/signup',
        method: 'POST',
        data: data,
      });
      dispatch({
        type: 'END_USER_REQUEST',
      });
      alert('Signup successfull');
    } catch (error) {
      console.log(error.response?.data);
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
export const getAllRental = () => {
  return async dispatch => {
    dispatch({
      type: 'GET_USER_REQUEST',
    });
    try {
      let result = await axios({
        url: 'http://10.0.2.2:3000/rental/getAllRental',
        method: 'GET',
      });
      dispatch({
        type: 'GET_ALL_RENTAL',
        allRental: result.data,
      });
      dispatch({
        type: 'END_USER_REQUEST',
      });
    } catch (error) {
      console.log(error.response?.data);
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
// Rental
export const getUserRental = () => {
  return async dispatch => {
    dispatch({
      type: 'GET_USER_REQUEST',
    });
    let token = await AsyncStorage.getItem('TOKEN');
    if (token) {
      try {
        let result = await axios({
          url: 'http://10.0.2.2:3000/rental/getRental',
          method: 'GET',
          headers: {Authorization: 'Bearer ' + token},
        });
        dispatch({
          type: 'GET_USER_RENTAL',
          rental: result.data[0].rental,
        });
        dispatch({
          type: 'END_USER_REQUEST',
        });
      } catch (error) {
        console.log(error.response?.data.message);
        dispatch({
          type: 'END_USER_REQUEST',
        });
      }
    } else {
      dispatch({
        type: 'END_USER_REQUEST',
      });
      return;
    }
  };
};
export const getToken = () => {
  return async dispatch => {
    let token = await AsyncStorage.getItem('TOKEN');
    if (token) {
      dispatch({
        type: 'SET_TOKEN',
        token: true,
      });
    }
  };
};
export const getRentalDetail = id => {
  return async dispatch => {
    try {
      dispatch({
        type: 'GET_USER_REQUEST',
      });
      let token = await AsyncStorage.getItem('TOKEN');
      let result = await axios({
        url: `http://10.0.2.2:3000/rental/getRentalDetail/${id}`,
        method: 'GET',
        headers: {Authorization: 'Bearer ' + token},
      });
      console.log(result.data);
      dispatch({
        type: 'GET_RENTAL_DETAIL',
        rentalDetail: result.data,
      });
      dispatch({
        type: 'END_USER_REQUEST',
      });
    } catch (error) {
      console.log(error.response?.data);
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
// Add Rental
export const addRental = (data, image) => {
  let {propertyName, property, room, rent, reporter} = data;
  let {uri, name, type} = image[0];
  let formData = new FormData();
  formData.append('propertyName', propertyName);
  formData.append('property', property);
  formData.append('room', room);
  formData.append('rent', rent);
  formData.append('reporter', reporter);
  formData.append('image', {uri: uri, name: name, type: type});
  return async dispatch => {
    dispatch({
      type: 'GET_USER_REQUEST',
    });

    let token = await AsyncStorage.getItem('TOKEN');
    try {
      await axios({
        url: 'http://10.0.2.2:3000/rental/addRental',
        method: 'POST',
        data: formData,
        headers: {Authorization: 'Bearer ' + token},
      });
      alert('Add successfully');
      dispatch(getUserRental());
      dispatch(getAllRental());
      dispatch({
        type: 'END_USER_REQUEST',
      });
    } catch (error) {
      console.log(error.response?.data);
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
// Update Rental
export const updateRental = (value, navigation) => {
  return async dispatch => {
    let token = await AsyncStorage.getItem('TOKEN');
    try {
      await axios({
        url: 'http://10.0.2.2:3000/rental/updateRental',
        method: 'POST',
        data: value,
        headers: {Authorization: 'Bearer ' + token},
      });
      alert('Update successfully');
      dispatch(getUserDetail());
      navigation.push('Detail', {
        id: value.id,
      });
      dispatch({
        type: 'END_USER_REQUEST',
      });
    } catch (error) {
      console.log(error.response?.data);
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
// Delete Rental
export const deleteRental = (id, navigation) => {
  let data = {
    id: id,
  };

  return async dispatch => {
    dispatch({
      type: 'GET_USER_REQUEST',
    });
    let token = await AsyncStorage.getItem('TOKEN');
    try {
      await axios({
        url: 'http://10.0.2.2:3000/rental/deleteRental',
        method: 'POST',
        data: data,
        headers: {Authorization: 'Bearer ' + token},
      });
      alert('Delete successfully');
      navigation.push('TabHome');
      dispatch({
        type: 'END_USER_REQUEST',
      });
    } catch (error) {
      console.log(error.response?.data);
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
// Add note
export const addNote = (description, navigation) => {
  return async dispatch => {
    let token = await AsyncStorage.getItem('TOKEN');
    dispatch({
      type: 'GET_USER_REQUEST',
    });
    try {
      await axios({
        url: 'http://10.0.2.2:3000/rental/addNote',
        method: 'POST',
        data: description,
        headers: {Authorization: 'Bearer ' + token},
      });
      navigation.push('Detail', {
        id: description.id,
      });
      alert('Add note successfully');
      dispatch({
        type: 'END_USER_REQUEST',
      });
    } catch (error) {
      console.log(error.response?.data);
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
// Search Rental
export const searchRental = search => {
  return async dispatch => {
    dispatch({
      type: 'GET_USER_REQUEST',
    });
    try {
      let result = await axios({
        url: `http://10.0.2.2:3000/rental/searchRental?searchTerm=${
          search.searchName ? search.searchName : ''
        }${search.searchType ? `&searchType=${search.searchType}` : ''}
        ${search.searchPrice ? `&searchPrice=${search.searchPrice}` : ''}
        `,
        method: 'GET',
      });
      dispatch({
        type: 'GET_SEARCH_RESULT',
        searchResult: result.data,
      });
      dispatch({
        type: 'END_USER_REQUEST',
      });
    } catch (error) {
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
// Get user detail
export const getUserDetail = () => {
  return async dispatch => {
    dispatch({
      type: 'GET_USER_REQUEST',
    });
    let token = await AsyncStorage.getItem('TOKEN');
    try {
      let result = await axios({
        url: 'http://10.0.2.2:3000/user/getUserDetail',
        method: 'GET',
        headers: {Authorization: 'Bearer ' + token},
      });
      dispatch({
        type: 'GET_USER_DETAIL',
        userDetail: result.data,
      });
      dispatch({
        type: 'END_USER_REQUEST',
      });
    } catch (error) {
      console.log(error.response?.data);
      dispatch({
        type: 'END_USER_REQUEST',
      });
    }
  };
};
