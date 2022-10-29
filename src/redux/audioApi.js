import axios from "axios";
import { handleLoading, handleRemove } from "./middleSlice";

const URL = "https://flash-card-v2.herokuapp.com/v1/zing"

export const GetPlayList = async (index, dispatch) => {
    try {
        dispatch(handleLoading())
        const res = await axios.get(`${URL}/detailplaylist?id=${index}`)
        dispatch(handleRemove())
        return res.data.data
    } catch (error) {
        dispatch(handleRemove())
    }
}
export const GetInfoSong = async (index) => {
    try {
        const res = await axios.get(`${URL}/infosong?id=${index}`)
        return res.data.data
    } catch (error) {
    }
}
export const SearchSong = async (keyword, dispatch) => {
    try {
        dispatch(handleLoading())
        const res = await axios.get(`${URL}/search?keyword=${keyword}`)
        dispatch(handleRemove())
        return res.data.data
    } catch (error) {
        dispatch(handleRemove())
    }
}