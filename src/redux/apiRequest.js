import axios from "axios";
import axiosJWT, { genURL } from "./axiosConfig";
import { loginSuccess, logoutSuccess } from "./userSlice";
import { handleLoading, handleRemove } from "./middleSlice";
import { showToast } from "./toastSlice";
import { play } from "./audioSlice";
import { syncUserToLocal } from "../util";

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
  } catch (error) { }
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

export const getCurrentUser = async (accessToken) => {
  const res = await axiosJWT.get(`${genURL('/v1/auth/user/me')}`, {
    headers: { token: `Bearer ${accessToken}` },
  });
  return res.data;
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
  } catch (error) { }
};
export const LogoutUser = async (navigate, accessToken, dispatch) => {
  dispatch(handleLoading());
  try {
    localStorage.setItem("notification", null);
    const res = await axiosJWT.post(`${genURL("/v1/auth/logout")}`, {},
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
  } catch (error) { }
};
export const AdminAddCard = async ({ data, accessToken }) => {
  try {
    const res = await axiosJWT.post(`${genURL("/v1/card/admin/all")}`, data, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    throw error
  }
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
export const savedCard = async (dispatch, slug, accessToken) => {
  try {
    const res = await axiosJWT.post(
      `${genURL(`/v1/card/${slug}`)}`,
      {},
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(showToast({ msg: res.data.msg, success: true }));
    return res.data;
  } catch (error) {
    dispatch(showToast({ msg: error.response.data.msg, success: false }));
  }
};
export const GetTerm = async () => {
  try {
    const res = await axiosJWT.get(`${genURL("/v1/card/")}`);
    return res.data;
  } catch (error) { }
};
export const DeleteTerm = async (accessToken, termId) => {
  try {
    const res = await axiosJWT.delete(
      `${genURL(`/v1/card/delet-term/${termId}`)}`,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) { }
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
  } catch (error) { }
};

export const UpdateCard = async (card, slug, accessToken, userId, dispatch) => {
  try {
    const res = await axiosJWT.patch(
      `${genURL(`/v1/card/${slug}`)}`,
      { card, userId },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    dispatch(showToast(error.response.data.msg));
  }
};
export const UpdateCardAdmin = async ({ data, accessToken }) => {
  try {
    const res = await axiosJWT.patch(
      `${genURL(`/v1/card/admin`)}`,
      { data },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    throw error
  }
};

export const DeleteCard = async (slug, userId, accessToken, dispatch) => {
  try {
    dispatch(handleLoading());
    const res = await axiosJWT.delete(`${genURL(`/v1/card/${slug}`)}`, {
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

export const GetQuestion = async (dispatch, slug, limit) => {
  try {
    dispatch(play());

    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/question/${slug}`, { limit: limit })}`
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
export const GetLearn = async (dispatch, slug, user, limit) => {
  try {
    dispatch(play());
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/learn/${slug}`, { limit: limit })}`,
      { params: { user } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetMarkLearn = async (dispatch, slug, ques, user) => {
  try {
    dispatch(handleLoading());
    dispatch(play());

    const res = await axios.post(`${genURL(`/v1/card/learn/${slug}`)}`, {
      ques,
      user,
    });
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetFlashCard = async (dispatch, slug) => {
  try {
    dispatch(play());
    dispatch(handleLoading());
    const res = await axios.get(`${genURL(`/v1/card/flashcard/${slug}`)}`);
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetListen = async (dispatch, slug, user, limit) => {
  try {
    dispatch(play());
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/listen/${slug}`, { limit: limit })}`,
      { params: { user } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetMarkListen = async (dispatch, slug, ques, user) => {
  try {
    dispatch(play());

    dispatch(handleLoading());
    const res = await axios.post(`${genURL(`/v1/card/listen/${slug}`)}`, {
      ques,
      user,
    });
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
export const GetWrite = async (dispatch, slug, user, limit) => {
  try {
    dispatch(play());
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/write/${slug}`, { limit: limit })}`,
      { params: { user } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetMarkWrite = async (dispatch, slug, ques, user) => {
  try {
    dispatch(handleLoading());
    dispatch(play());

    const res = await axios.post(`${genURL(`/v1/card/write/${slug}`)}`, {
      ques,
      user,
    });
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const GetMatchCard = async (dispatch, slug, user, limit) => {
  try {
    dispatch(play());
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/match/${slug}`, { limit: limit })}`,
      { params: { user } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};

export const UpdateMardMatchCard = async (slug, user, terms) => {
  try {
    const res = await axiosJWT.put(`${genURL(`/v1/card/match/${slug}`)}`, {
      user,
      terms,
    });
    return res.data;
  } catch (error) { }
};
export const UpdateAndGetMatch = async (slug, user, terms, limit) => {
  try {
    const res = await axios.post(
      `${genURL(`/v1/card/match/${slug}`, { limit: limit })}`,
      { user, terms }
    );
    return res.data;
  } catch (error) { }
};

export const GetTest = async (dispatch, slug, user, limit) => {
  try {
    dispatch(play());
    dispatch(handleLoading());
    const res = await axios.get(
      `${genURL(`/v1/card/test/${slug}`, { limit: limit })}`,
      { params: { user } }
    );
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
export const GetTestSpaceRep = async (dispatch, accessToken, limit) => {
  try {
    dispatch(play());
    dispatch(handleLoading());
    const res = await axiosJWT.get(
      `${genURL("/v1/card/test/repettion", { limit: limit })}`,
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

export const GetMarkTest = async (dispatch, ques, user) => {
  try {
    dispatch(handleLoading());
    dispatch(play());

    const res = await axios.post(`${genURL(`/v1/card/test/${ques[0].card}`)}`, {
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

export const AddView = async (slug) => {
  try {
    const res = await axios.put(`${genURL(`/v1/card/view/${slug}`)}`);
    return res.data;
  } catch (error) { }
};

export const SearchCard = async (q) => {
  try {
    const res = await axios.get(`${genURL(`/v1/card/search/${q}`)}`);
    return res.data;
  } catch (error) { }
};

export const RateCard = async (slug, rateNum, accessToken, dispatch) => {
  try {
    const res = await axiosJWT.post(
      `${genURL(`/v1/card/rate/${slug}`)}`,
      { rateNum },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(showToast({ msg: "Cảm ơn bạn đã đánh giá", success: true }));
    return res.data;
  } catch (error) { }
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

export const GetAllCard = async ({ page = 1, limit = 10, accessToken, search = "" }) => {
  try {
    const res = await axiosJWT.get(
      `${genURL(`/v1/card/admin/all`, { page: page, limit: limit, search })}`,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    return { cards: [], totalItems: 0, totalPages: 1 };
  }
};

export const GetHome = async (limit, userId) => {
  try {
    const res = await axios.get(`${genURL("/v1/card", { limit: limit })}`, {
      params: { userId },
    });

    return res.data;
  } catch (error) {
    console.log(error);

  }
};

export const GetAllUser = async ({ page = 1, limit = 10, search, accessToken }) => {
  try {
    const res = await axiosJWT.get(
      `${genURL(`/v1/auth`, { page: page, limit: limit, search })}`,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách user:", error);
    return { users: [], totalItems: 0, totalPages: 1 };
  }
};
export const AdminAddUser = async ({ data, accessToken }) => {
  try {
    const res = await axiosJWT.post(
      `${genURL(`/v1/auth/admin/add-user`)}`, data,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    throw error
  }
};
export const AdminUpdateUser = async ({ data, accessToken }) => {
  try {
    const res = await axiosJWT.put(
      `${genURL(`/v1/auth/admin/update-user`)}`, data,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    throw error
  }
};


export const GetUser = async (username) => {
  try {
    const res = await axios.get(`${genURL(`/v1/auth/${username}`)}`);
    return res.data;
  } catch (error) { }
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
  } catch (error) { }
};
export const ChangePassword = async (data, accessToken, dispatch) => {
  try {
    const res = await axiosJWT.put(
      `${genURL(`/v1/auth/changePassword`)}`,
      data,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    dispatch(showToast({ msg: "Update thành công", success: true }));
    return res.data;
  } catch (error) {
    dispatch(showToast({ msg: "Có lỗi xảy ra", success: false }));
  }
};

export const UpdateProfilePic = async (file, dispatch, accessToken) => {
  try {
    await axiosJWT.put(`${genURL("/v1/auth/")}`, file, {
      headers: { token: `Bearer ${accessToken}` },
    });
    syncUserToLocal(accessToken, dispatch)
    dispatch(showToast({ msg: "Update thành công", success: true }));
  } catch (error) { }
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
  } catch (error) { }
};

export const GetNotifi = async (accessToken) => {
  try {
    const res = await axiosJWT.get(`${genURL("/v1/notification")}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) { }
};
export const GetNotifis = async ({accessToken}) => {
  try {
    const res = await axiosJWT.get(`${genURL("/v1/notification/multiple")}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) { }
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
  } catch (error) { }
};
export const DeleteNotifi = async ({id, accessToken}) => {
  try {
    const res = await axiosJWT.delete(
      `${genURL(`/v1/notification/${id}`)}`,
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) { }
};
export const UpdateNotifi = async ({data, accessToken}) => {
  try {
    const res = await axiosJWT.put(
      `${genURL(`/v1/notification`)}`,
      { data },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) { }
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
  } catch (error) { }
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
  } catch (error) { }
};
export const GetContact = async (accessToken) => {
  try {
    const res = await axiosJWT.get(`${genURL("/v1/auth/contact")}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) { }
};
export const GetSuggestWord = async (data) => {
  try {
    const res = await axios.get(`${genURL("/v1/card/write/suggest")}`, {
      params: data,
    });
    return res.data;
  } catch (error) { }
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
export const GetActive = async (accessToken) => {
  try {
    const res = await axiosJWT.get(`${genURL("/v1/active")}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const GetRank = async (type, limit) => {
  try {
    const res = await axios.get(
      `${genURL(`/v1/active/${type}`, {
        limit: limit,
      })}`
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const GetProLearn = async (slug, accessToken) => {
  try {
    const res = await axiosJWT.get(`${genURL(`/v1/card/test/pro/${slug}`)}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const approvalCard = async (slug, accessToken) => {
  try {
    const res = await axiosJWT.post(
      `${genURL(`/v1/card/approval/${slug}`)}`,
      {},
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const handleUpgrade = async (slug, accessToken, decision) => {
  try {
    const res = await axiosJWT.put(
      `${genURL(`/v1/card/upgrade/${slug}`)}`,
      { decision },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getPendingPlus = async (accessToken) => {
  try {
    const res = await axiosJWT.get(`${genURL(`/v1/card/getPendingPlus`)}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
// pricing api
export const getPries = async () => {
  try {
    const res = await axios.get(`${genURL(`/v1/pricing`)}`);
    return res.data.data;
  } catch (error) {
    console.log(error);
  }
};

export const getPricingById = async (id) => {
  try {
    const response = await axiosJWT.get(`${genURL(`/v1/pricing`, {id})}`);
    return response.data.pricing
  } catch (error) {
    throw error;
  }
};

export const createPricing = async ({data: pricingData, accessToken}) => {
  try {
    const response = await axiosJWT.post(`${genURL(`/v1/pricing`)}`, pricingData, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return response.data.pricing

  } catch (error) {
    throw error;
  }
};

export const updatePricing = async ({id, data, accessToken}) => {

  try {
    const response = await axiosJWT.patch(`${genURL(`/v1/pricing/${id}`)}`, data, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return response.data
  } catch (error) {
    throw error;
  }
};

export const deletePricing = async ({id, accessToken}) => {
  try {
    await axiosJWT.delete(`${genURL(`/v1/pricing/${id}`)}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
  } catch (error) {
    throw error;
  }
};

// invoice api
export const updatePlan = async ({ accessToken }) => {
  try {
    const res = await axiosJWT.put(`${genURL(`/v1/auth/user/update-plan`)}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    // Ném lại lỗi có data từ response nếu có
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const createInvoice = async ({ planType, amount, accessToken }) => {
  try {
    const res = await axiosJWT.post(`${genURL(`/v1/invoice`)}`, { planType, amount }, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    // Ném lại lỗi có data từ response nếu có
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

export const getInvoice = async ({ invoiceId, accessToken }) => {
  try {
    const res = await axiosJWT.get(`${genURL(`/v1/invoice/${invoiceId}`)}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getInvoices = async ({ page, limit, skip = 0, accessToken }) => {
  try {
    const res = await axiosJWT.get(`${genURL(`/v1/invoice/admin`)}`, {
      params: {page, limit, skip},
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
// admin
export const statistical = async ({ accessToken, period }) => {
  try {
    const res = await axiosJWT.get(`${genURL(`/v1/admin`, { period: period })}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getInvoiceChart = async ({ accessToken }) => {
  try {
    const res = await axiosJWT.get(`${genURL(`/v1/admin/recentIncome`)}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const adminGetCards = async ({ accessToken, page, limit, sort }) => {
  try {
    const res = await axiosJWT.get(`${genURL(`/v1/admin/cards`, { page, limit, sort })}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// banner
export const getAllBanners = async () => {
  try {
    const response = await axios.get(`${genURL(`/v1/banner`)}`);
    return response.data.banners;
  } catch (error) {
    throw error;
  }
};

export const getBannerById = async (id) => {
  try {
    const response = await axiosJWT.get(`${genURL(`/v1/banner`, {id})}`);
    return response.data.banner;
  } catch (error) {
    throw error;
  }
};

export const createBanner = async (bannerData) => {
  try {
    const response = await axiosJWT.post(`${genURL(`/v1/banner`)}`, bannerData);
    return response.data.banner;

  } catch (error) {
    throw error;
  }
};

export const updateBanner = async (id, bannerData) => {

  try {
    const response = await axiosJWT.patch(`${genURL(`/v1/banner/${id}`)}`, bannerData);
    return response.data.banner;
  } catch (error) {
    throw error;
  }
};

export const deleteBanner = async ({id, accessToken}) => {
  try {
    await axiosJWT.delete(`${genURL(`/v1/banner/${id}`)}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
  } catch (error) {
    throw error;
  }
};

//
export const aiChat = async ({ accessToken, userMessage, context }) => {
  const URL =
    process.env.NODE_ENV === "production"
      ? "https://backend-kfnn.onrender.com"
      : "http://localhost:8000";

  const payload = {
    userMessage,
    context, // đảm bảo truyền context vào body
  };

  const res = await fetch(`${URL}/v1/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      token: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("API trả về lỗi");
  }

  return res.body;
};
export const genAiCard = async ({ accessToken, title, existingPrompts }) => {
  const URL =
    process.env.NODE_ENV === "production"
      ? "https://backend-kfnn.onrender.com"
      : "http://localhost:8000";

  const payload = {
    title,
    existingPrompts, // đảm bảo truyền context vào body
  };

  const res = await fetch(
        `${URL}/v1/ai/chat/generate-terms`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Token: `Bearer ${accessToken}`, // Sửa header "Token" thành "Authorization"
          },
          body: JSON.stringify(payload),
        }
      );

  if (!res.ok) {
    throw new Error("API trả về lỗi");
  }

  return res.body;
};


export const aiVoiceChat = async ({ accessToken, userMessage, audioFile }) => {
  const URL = process.env.NODE_ENV === 'production'
    ? 'https://backend-kfnn.onrender.com'
    : 'http://localhost:8000';

  try {
    let res;
    const headers = {
      'token': `Bearer ${accessToken}`,
    };

    if (audioFile) {
      // Voice input: Gửi file âm thanh
      const formData = new FormData();
      formData.append('audio', audioFile, 'recording.mp3');
      res = await fetch(`${URL}/v1/ai/chat`, {
        method: 'POST',
        headers,
        body: formData,
      });
    } else if (userMessage) {
      // Text input: Gửi userMessage
      res = await fetch(`${URL}/v1/ai/chat`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userMessage }),
      });
    } else {
      throw new Error('Hihi, bạn cần gửi tin nhắn hoặc file âm thanh nha! 😺');
    }

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(`Hihi, API trả về lỗi nè: ${errorData.msg || 'Không rõ lỗi'} 😿`);
    }

    return res.body;
  } catch (error) {
    console.error('AI Voice Chat error:', error);
    throw error;
  }
};