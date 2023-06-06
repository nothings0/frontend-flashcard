import React, { useEffect } from 'react';
function GoogleAds({type}){
    useEffect(() => {
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
    }, [])
    if(type === "ngang"){
        return (
        <ins className="adsbygoogle"
                style={{ display: 'block'}}
                data-ad-client="ca-pub-9865892191945103"
                data-ad-slot="7637761025"
                data-ad-format="auto"
                data-full-width-responsive="true">
            </ins>
        );
    }
    if(type === "doc"){
        return(
        <ins className="adsbygoogle"
        style={{ display: 'block',width:"300px",height:"600px"}}
            data-ad-client="ca-pub-9865892191945103"
            data-ad-slot="9445666713"
            data-ad-format="auto"
            data-full-width-responsive="true">
        </ins>
        )
    }
}
export default GoogleAds;