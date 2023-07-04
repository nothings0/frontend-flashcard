import { genURL } from "./axiosConfig";
import axios from "axios";
import { handleLoading, handleRemove } from "./middleSlice";

export const GetTedTranslation = async (videoId, dispatch) => {
  dispatch(handleLoading());
  try {
    const res = await axios.get(`${genURL("/v1/card/ted/translation")}`, {
      params: { videoId },
    });
    dispatch(handleRemove());
    // console.log(res);
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
export const GetListTed = async () => {
  try {
    const res = await axios.get(`${genURL("/v1/card/ted/list")}`);
    return res.data;
  } catch (error) {}
};
export const GetVideoTed = async (videoId, dispatch) => {
  dispatch(handleLoading());
  try {
    const res = await axios.get(`${genURL("/v1/card/ted/video")}`, {
      params: { videoId },
    });
    dispatch(handleRemove());
    // console.log(res);
    return res.data;
  } catch (error) {
    dispatch(handleRemove());
  }
};
