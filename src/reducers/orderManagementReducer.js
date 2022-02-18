export const initialState = {
  selectedCity: null,
  authenticatedUser: null,
  selectedClient: null,
  products: null,
  loading: false,
  orders : null,
  billDetails: null,
  orderDetails: []
}

export default function orderManagementReducer(state = initialState, action) {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: action.payload
      }
    case "UPDATE_SELECTED_CITY":
      return {
        ...state,
        selectedCity: action.payload
      }
    case "AUTHENTICATED_USER":
      return {
        ...state,
        authenticatedUser: action.payload
      }
    case "VIEW_BILL":
      return {
        ...state,
        billDetails: action.payload
      }
    case "SET_SELECTED_CLIENT":
      return {
        ...state,
        selectedClient: action.payload
      }
    case "SET_PRODUCTS":
      return {
        ...state,
        products: action.payload
      }
      case "SET_ORDERS":
        return {
          ...state,
          orders: action.payload
        }
    case "UPDATE_ORDER_DETAILS":
      return {
        ...state,
        orderDetails: [...state.orderDetails, action.payload]
      }
    case "DELETE_PRODUCT_FROM_ORDER":
      state.orderDetails = state.orderDetails.filter(item => item.id !== action.payload);
      return {
        ...state
      }
    case "CLEAR_OLD_ORDER":
      return {
        ...state,
        orderDetails: []
      }
    case "LOGOUT": {
      state = initialState;
      return state;
    }
    default:
      return state
  }
}