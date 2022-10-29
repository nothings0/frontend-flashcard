import jwt_decode from "jwt-decode";

export const checkTokenExp = async (token) => {
    const decoded = jwt_decode(token)
    let str = ''
    if(decoded.exp >= Date.now() / 1000) return;
    else str = 'Het han'
    return str
}