let initialState = {
  loading: false,
  isLogin: false,
  allRental: [],
  rentalList: [],
  rentalDetail: {},
  searchData: [],
  userDetail: {},
  token: false,
};
export const rentalReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'GET_USER_REQUEST': {
      return {...state, loading: true};
    }
    case 'END_USER_REQUEST': {
      return {...state, loading: false};
    }
    case 'GET_USER_RENTAL': {
      return {...state, rentalList: action.rental};
    }
    case 'GET_RENTAL_DETAIL': {
      return {...state, rentalDetail: action.rentalDetail};
    }
    case 'GET_SEARCH_RESULT': {
      return {...state, searchData: action.searchResult};
    }
    case 'GET_USER_DETAIL': {
      return {...state, userDetail: action.userDetail};
    }
    case 'EMPTY_ARRAY': {
      let updateArray = [...state.rentalList];
      updateArray.length = 0;
      return {...state, rentalList: updateArray};
    }
    case 'CLEAR_SEARCH': {
      state.searchData.length = 0;
      return {...state};
    }
    case 'SET_TOKEN': {
      return {...state, token: action.token};
    }
    case 'GET_ALL_RENTAL': {
      return {...state, allRental: action.allRental};
    }
    default:
      return {...state};
  }
};
