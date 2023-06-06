import axios from "axios";
import axiosJWT, { genURL } from "./axiosConfig";
import { loginSuccess, logoutSuccess } from "./userSlice";
import { handleLoading, handleRemove } from "./middleSlice";
import { showToast } from "./toastSlice";

axios.defaults.withCredentials = true;
export const registerUser = async (user, navigate, dispatch, setErrorMsg) => {
  dispatch(handleLoading());
  try {
    await axios.post(`${genURL("/v1/auth/register")}`, user);
    navigate("/user/active");
  } catch (error) {
    setErrorMsg(error.response.data.msg);
    dispatch(showToast({ msg: error.response.data.msg, success: false }));
  }
  dispatch(handleRemove());
};
export const resetPassword = async (password, navigate, slug) => {
  try {
    await axios.put(`${genURL("/v1/auth/resetPassword")}`, password, {
      headers: { token: `Bearer ${slug}` },
    });
    navigate("/login");
  } catch (error) {}
};
export const LoginUser = async (user, dispatch) => {
  dispatch(handleLoading());
  try {
    const res = await axios.post(`${genURL("/v1/auth/login")}`, user);
    dispatch(loginSuccess(res.data));
    dispatch(handleRemove());
    dispatch(showToast({ msg: "Đăng nhập thành công", success: true }));
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
    return error.response.data;
  }
};
export const LoginGoogle = async (id_token, dispatch, navigate) => {
  dispatch(handleLoading());
  try {
    const res = await axios.post(`${genURL("/v1/auth/google_login")}`, {
      id_token,
    });
    dispatch(loginSuccess(res.data));
    dispatch(handleRemove());
    navigate("/");
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
export const LoginFacebook = async (
  access_token,
  userID,
  dispatch,
  navigate
) => {
  dispatch(handleLoading());
  try {
    const res = await axios.post(`${genURL("/v1/auth/facebook_login")}`, {
      access_token,
      userID,
    });
    dispatch(loginSuccess(res.data));
    dispatch(handleRemove());
    navigate("/");
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
export const ForgotPasswordAPI = async (user) => {
  try {
    const res = await axios.post(`${genURL("/v1/auth/forgotPassword")}`, user);
    return res.data;
  } catch (error) {}
};
export const LogoutUser = async (navigate, accessToken, dispatch) => {
  dispatch(handleLoading());
  try {
    localStorage.setItem("notification", null);
    const res = await axiosJWT.post(
      "/v1/auth/logout",
      {},
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    navigate("/");
    dispatch(handleRemove());
    dispatch(logoutSuccess());
    dispatch(showToast({ msg: "Bạn đã đăng xuất", success: true }));
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
    dispatch(logoutSuccess());
  }
};
export const AddCard = async (card, accessToken, dispatch) => {
  try {
    dispatch(handleLoading());
    const res = await axiosJWT.post(`${genURL("/v1/card/")}`, card, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(handleRemove());
    dispatch(showToast({ msg: "Tạo thành công", success: true }));
    return res.data;
  } catch (error) {}
};
export const getCardById = async (dispatch, card, page, limit) => {
  try {
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/${card}`, { page: page, limit: limit })}`
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
export const savedCard = async (dispatch, cardId, accessToken) => {
  try {
    const res = await axiosJWT.post(
      `${genURL(`/v1/card/${cardId}`)}`,
      {},
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(showToast({ msg: res.data.msg, success: false }));
    return res.data;
  } catch (error) {
    dispatch(showToast({ msg: error.response.data.msg, success: false }));
  }
};
export const GetTerm = async () => {
  try {
    const res = await axiosJWT.get(`${genURL("/v1/card/")}`);
    return res.data;
  } catch (error) {}
};
export const GetLibrary = async (accessToken, dispatch, limit) => {
  try {
    dispatch(handleLoading());
    const res = await axiosJWT.get(
      `${genURL("/v1/card/library", { limit: limit })}`,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetTranslate = async (translate) => {
  try {
    const res = await axiosJWT.get(
      `https://api.mymemory.translated.net/get?q=${translate}&langpair=en|vi`
    );

    return res.data;
  } catch (error) {}
};

export const UpdateCard = async (
  card,
  cardId,
  accessToken,
  userId,
  dispatch
) => {
  try {
    const res = await axiosJWT.patch(
      `${genURL(`/v1/card/${cardId}`)}`,
      { card, userId },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(showToast({ msg: "Update thành công", success: true }));
    return res.data;
  } catch (error) {
    dispatch(showToast(error.response.data.msg));
  }
};

export const DeleteCard = async (cardId, userId, accessToken, dispatch) => {
  try {
    dispatch(handleLoading());
    const res = await axiosJWT.delete(`${genURL(`/v1/card/${cardId}`)}`, {
      headers: { token: `Bearer ${accessToken}` },
      data: {
        userId: userId,
      },
    });
    dispatch(handleRemove());
    dispatch(showToast({ msg: "Xóa thành công", success: true }));

    return res.data;
  } catch (error) {
    dispatch(showToast({ msg: error.response.data.msg, success: false }));
    dispatch(handleRemove());
  }
};

export const GetQuestion = async (dispatch, cardId, limit) => {
  try {
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/question/${cardId}`, { limit: limit })}`
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
export const GetLearn = async (dispatch, cardId, user, limit) => {
  try {
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/learn/${cardId}`, { limit: limit })}`,
      { params: { user } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetMarkLearn = async (dispatch, cardId, ques, user) => {
  try {
    dispatch(handleLoading());
    const res = await axios.post(`${genURL(`/v1/card/learn/${cardId}`)}`, {
      ques,
      user,
    });
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetFlashCard = async (dispatch, cardId) => {
  try {
    dispatch(handleLoading());
    const res = await axios.get(`${genURL(`/v1/card/flashcard/${cardId}`)}`);
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetListen = async (dispatch, cardId, user, limit) => {
  try {
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/listen/${cardId}`, { limit: limit })}`,
      { params: { user } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetMarkListen = async (dispatch, cardId, ques, user) => {
  try {
    dispatch(handleLoading());
    const res = await axios.post(`${genURL(`/v1/card/listen/${cardId}`)}`, {
      ques,
      user,
    });
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
export const GetWrite = async (dispatch, cardId, user, limit) => {
  try {
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/write/${cardId}`, { limit: limit })}`,
      { params: { user } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetMarkWrite = async (dispatch, cardId, ques, user) => {
  try {
    dispatch(handleLoading());
    const res = await axios.post(`${genURL(`/v1/card/write/${cardId}`)}`, {
      ques,
      user,
    });
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetMatchCard = async (dispatch, cardId, user, limit) => {
  try {
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/match/${cardId}`, { limit: limit })}`,
      { params: { user } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const UpdateMardMatchCard = async (cardId, user, terms) => {
  try {
    const res = await axiosJWT.put(`${genURL(`/v1/card/match/${cardId}`)}`, {
      user,
      terms,
    });
    return res.data;
  } catch (error) {}
};
export const UpdateAndGetMatch = async (cardId, user, terms, limit) => {
  try {
    const res = await axios.post(
      `${genURL(`/v1/card/match/${cardId}`, { limit: limit })}`,
      { user, terms }
    );
    return res.data;
  } catch (error) {}
};

export const GetTest = async (dispatch, cardId, user, limit) => {
  try {
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/test/${cardId}`, { limit: limit })}`,
      { params: { user } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetMarkTest = async (dispatch, cardId, ques, user) => {
  try {
    dispatch(handleLoading());
    const res = await axios.post(`${genURL(`/v1/card/test/${cardId}`)}`, {
      ques,
      user,
    });
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

/* board api */

export const AddView = async (cardId) => {
  try {
    const res = await axios.put(`${genURL(`/v1/card/view/${cardId}`)}`);
    return res.data;
  } catch (error) {}
};

export const SearchCard = async (q) => {
  try {
    const res = await axios.get(`${genURL(`/v1/card/search/${q}`)}`);
    return res.data;
  } catch (error) {}
};

export const RateCard = async (cardId, rateNum, accessToken, dispatch) => {
  try {
    const res = await axiosJWT.post(
      `${genURL(`/v1/card/rate/${cardId}`)}`,
      { rateNum },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(showToast({ msg: "Cảm ơn bạn đã đánh giá", success: true }));
    return res.data;
  } catch (error) {}
};

export const GetListCard = async (
  dispatch,
  q,
  page = 1,
  limit = 8,
  userId = ""
) => {
  try {
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL("/v1/card", { q: q, page: page, limit: limit })}`,
      { params: { userId } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const getAllCard = async (accessToken) => {
  try {
    // dispatch(handleLoading())
    const res = await axios.get(`${genURL("/v1/card/adminall")}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    // dispatch(handleRemove())
    return res.data;
  } catch (error) {
    // dispatch(handleRemove())
  }
};
export const createCardAdmin = async (accessToken, data) => {
  try {
    const res = await axios.post(`${genURL("/v1/card/adminall")}`, data, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {}
};

export const GetHome = async (dispatch, limit, userId) => {
  try {
    dispatch(handleLoading());
    const res = await axios.get(`${genURL("/v1/card", { limit: limit })}`, {
      params: { userId },
    });
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetAllUser = async (accessToken) => {
  try {
    const res = await axiosJWT.get(`${genURL("/v1/auth")}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {}
};

export const GetUser = async (username) => {
  try {
    const res = await axios.get(`${genURL(`/v1/auth/${username}`)}`);
    return res.data;
  } catch (error) {}
};

export const UpdateUser = async (userId, type, data, accessToken, dispatch) => {
  try {
    const res = await axiosJWT.put(
      `${genURL(`/v1/auth/user/${userId}`)}`,
      { type, data },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(showToast({ msg: "Update thành công", success: true }));
    return res.data;
  } catch (error) {}
};

export const UpdateProfilePic = async (file, dispatch, accessToken) => {
  try {
    const res = await axiosJWT.put(`${genURL("/v1/auth/")}`, file, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(loginSuccess(res.data));
    dispatch(showToast({ msg: "Update thành công", success: true }));
  } catch (error) {}
};

export const ActiveAccount = async (data) => {
  try {
    const res = await axios.post(`${genURL("/v1/auth/active")}`, data);
    return res.data;
  } catch (error) {
    return error.response.data.success;
  }
};

export const ContactData = async (data, dispatch) => {
  try {
    const res = await axios.post(`${genURL("/v1/auth/contact")}`, data);
    dispatch(showToast({ msg: res.data.msg, success: true }));
    return res.data;
  } catch (error) {}
};

export const GetNotifi = async (accessToken) => {
  try {
    const res = await axiosJWT.get(`${genURL("/v1/notification")}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {}
};
export const CreateNotifi = async (userId, content, accessToken) => {
  try {
    const res = await axiosJWT.post(
      `${genURL("/v1/notification")}`,
      { userId, content },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {}
};
export const ReadNotifi = async (notifiId, accessToken) => {
  try {
    const res = await axiosJWT.patch(
      `${genURL("/v1/notification")}`,
      { notifiId },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {}
};
export const UpdateAchieve = async (target, accessToken) => {
  try {
    const res = await axiosJWT.patch(
      `${genURL("/v1/auth/achieve")}`,
      { target },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {}
};
export const GetContact = async (accessToken) => {
  try {
    const res = await axiosJWT.get(`${genURL("/v1/auth/contact")}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {}
};
export const GetSuggestWord = async (data) => {
  try {
    const res = await axios.get(`${genURL("/v1/card/write/suggest")}`, {
      params: data,
    });
    return res.data;
  } catch (error) {}
};
export const CreateMultipleNotifi = async (dispatch, accessToken, data) => {
  try {
    const res = await axiosJWT.post(
      `${genURL("/v1/notification/multiple")}`,
      data,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(showToast({ msg: "Tạo thông báo thành công", success: true }));
    return res.data;
  } catch (error) {
    dispatch(showToast({ msg: "Xảy ra lỗi", success: false }));
  }
};
export const GetUsage = async (prompt) => {
  try {
    const res = await axios.post(`${genURL("/v1/openai")}`, { prompt });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
