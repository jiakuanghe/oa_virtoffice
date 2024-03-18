import React, {useEffect, useRef} from 'react';

function MyVideo({myMediaStream}) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (!myMediaStream || !videoRef.current) return;
        videoRef.current.srcObject = myMediaStream;
    }, [myMediaStream]);

    return <video width="200px" height="200px" ref={videoRef} autoPlay playsInline />
}

export default MyVideo;
