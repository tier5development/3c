import * as AuthActions from './auth.actions';

export interface State {
  token: string;
  registered: boolean;
  resetForgotPasswordForm: boolean;
  isAuthenticated: boolean;
}

const initialState: State = {
  token: null,
  registered: false,
  resetForgotPasswordForm: false,
  isAuthenticated: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case (AuthActions.SIGNUP_SUCCESS):
      return {
        ...state,
        registered: action.payload
      };
    case (AuthActions.FORGOT_PASSWORD_SUCCESS):
      return {
        ...state,
        resetForgotPasswordForm: action.payload
      };
    case (AuthActions.SIGNIN_SUCCESS):
      localStorage.setItem('token', action.payload);
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload
      };
    case (AuthActions.SIGNOUT_SUCCESS):
      return {
        ...state,
        token: null,
        isAuthenticated: false
      };
    case (AuthActions.CHECK_TOKEN):
      if(localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined) {
        return {
          ...state,
          isAuthenticated: true,
          token: localStorage.getItem('token')
        }
      } else {
        return state;
      }
    default:
      return state;
  }
}