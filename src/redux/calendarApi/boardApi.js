import axiosJWT, { genURL } from "../axiosConfig";
import { handleLoading, handleRemove } from "../middleSlice";

export const GetBoard = async (accessToken, dispatch) => {
  dispatch(handleLoading());
  try {
    const res = await axiosJWT.get(`${genURL("/v1/board/")}`, {
      headers: { token: `Bearer ${accessToken}` },
    });
    dispatch(handleRemove());
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
export const CreateBoard = async (data, accessToken, dispatch) => {
  try {
    dispatch(handleLoading());
    const res = await axiosJWT.post(
      `${genURL("/v1/board/")}`,
      { data },
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

export const UpdateBoard = async (title, boardId, accessToken) => {
  try {
    const res = await axiosJWT.put(
      `${genURL(`/v1/board/${boardId}`)}`,
      { title },
      {
        headers: { token: `Bearer ${accessToken}` },
      }
    );
    return res.data;
  } catch (error) {}
};
