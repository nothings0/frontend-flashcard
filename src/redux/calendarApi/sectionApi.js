import axiosJWT, {genURL} from "../axiosConfig";


export const GetSection = async (sectionId, accessToken) => {
    try {
        
        const res = await axiosJWT.get(`${genURL(`/v1/section/${sectionId}`)}`, {
            headers: {token: `Bearer ${accessToken}`}
        })
        return res.data
    } catch (error) {
    }
}
export const CreateSection = async (title, boardId, accessToken) => {
    try {
        
        const res = await axiosJWT.post(`${genURL('/v1/section/')}`, {title, boardId}, {
            headers: {token: `Bearer ${accessToken}`}
        })
        return res.data
    } catch (error) {
    }
}

export const UpdateSection = async (title, accessToken) => {
    try {
        const res = await axiosJWT.put(`${genURL('/v1/section')}`, {title}, {
            headers: {token: `Bearer ${accessToken}`}
        })
        return res.data
    } catch (error) {
    }
}

export const DeleteSection = async (sectionId, accessToken) => {
    try {
        const res = await axiosJWT.delete(`${genURL(`/v1/section/${sectionId}`)}`, {
            headers: {token: `Bearer ${accessToken}`},
            data: {
                sectionId
            }
        })
        return res.data
    } catch (error) {
    }
}
export const UpdatePositionSection = async (cardOrder, accessToken) => {
    try {
        const res = await axiosJWT.put(`${genURL('/v1/section/')}`,{cardOrder}, {
            headers: {token: `Bearer ${accessToken}`}
        })
        return res.data
    } catch (error) {
    }
}
