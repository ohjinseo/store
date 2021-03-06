import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { baseURL } from "../../../utils/baseURL";
import { registerCartAction } from "../carts/cartSlice";

//함수 반환 값은 payload로
export const loginUserAction = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      //make http call
      const { data } = await axios.post(`${baseURL}/auth/login`, payload);

      localStorage.setItem("userInfo", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const registerUserAction = createAsyncThunk(
  "user/register",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const { data } = await axios.post(`${baseURL}/auth/register`, payload);
      console.log(data);
      dispatch(registerCartAction({ token: data.token }));
    } catch (error) {
      return rejectWithValue(error?.response?.data);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      localStorage.removeItem("userInfo");
    } catch (error) {
      if (!error?.response) {
        throw error;
      }
      return rejectWithValue(error?.response?.data);
    }
  }
);

//로컬스토리지로부터 userinfo init
const userLoginFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : undefined;

const usersSlices = createSlice({
  name: "users",
  initialState: {
    userAuth: userLoginFromStorage,
  },
  extraReducers: (builder) => {
    // 로그인
    builder.addCase(loginUserAction.pending, (state, action) => {
      state.userLoading = true;
      state.userAppErr = undefined;
      state.userServerErr = undefined;
    });

    builder.addCase(loginUserAction.fulfilled, (state, action) => {
      state.userAuth = action?.payload;
      state.userLoading = false;
      state.userAppErr = undefined;
      state.userServerErr = undefined;
    });

    builder.addCase(loginUserAction.rejected, (state, action) => {
      state.userLoading = false;
      state.userAppErr = action?.payload?.message;
      state.userServerErr = action?.error?.message;
    });

    //회원가입
    builder.addCase(registerUserAction.pending, (state, action) => {
      state.userLoading = true;
      state.userAppErr = undefined;
      state.userServerErr = undefined;
    });

    builder.addCase(registerUserAction.fulfilled, (state, action) => {
      state.userLoading = false;
      state.isRegistered = true;
      state.userAppErr = undefined;
      state.userServerErr = undefined;
    });

    builder.addCase(registerUserAction.rejected, (state, action) => {
      state.userLoading = false;
      state.userAppErr = action?.payload?.message;
      state.userServerErr = action?.payload?.error?.message;
    });

    //로그아웃
    builder.addCase(logout.fulfilled, (state, action) => {
      state.userLoading = false;
      state.userAuth = undefined;
    });
  },
});

export default usersSlices.reducer;
