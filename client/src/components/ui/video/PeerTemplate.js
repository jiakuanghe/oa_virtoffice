import React, {useCallback, useEffect, useRef, useState} from "react";
import Peer from 'simple-peer';
import {
    OFFER_SIGNAL,
    ANSWER_SIGNAL,
    CONSOLE_FORMAT_SERVER2CLIENT,
    CONSOLE_FORMAT_CLIENT2SERVER
} from '../../../constances/webRTCKeyConstances';
import VideoTemplate from "./VideoTemplate";

function PeerTemplate({sourceSocketId, targetSocketId, myMediaStream, webrtcSocket, isInitiator = true, offerSignal}) {
    const peerRef = useRef();
    const [stream, setStream] = useState(myMediaStream);
    const cb = useCallback((sourceSocketId, targetSocketId, stream, webrtcSocket, isInitiator, offerSignal) => {
        // https://github.com/feross/simple-peer?tab=readme-ov-file#api
        const peer = new Peer({
            initiator: isInitiator,//initiator - set to true if this is the initiating peer
            trickle: false,//trickle - set to false to disable trickle ICE and get a single 'signal' event (slower)
            stream: stream,//stream - if video/voice is desired, pass stream returned from getUserMedia
        });

        if (isInitiator) {
            // https://github.com/feross/simple-peer?tab=readme-ov-file#peeronsignal-data--
            peer.on('signal', data => {//Fired when the peer wants to send signaling data to the remote peer.
                console.log(CONSOLE_FORMAT_CLIENT2SERVER, `sendOfferSignal, sourceSocketId: ${sourceSocketId}, targetSocketId: ${targetSocketId}, data: ${data}`);
                webrtcSocket.emit(OFFER_SIGNAL, { sourceSocketId, targetSocketId, data })
            });
        } else {
            // https://github.com/feross/simple-peer?tab=readme-ov-file#peersignaldata
            peer.on('signal', data => {//Fired when the peer wants to send signaling data to the remote peer.
                console.log(CONSOLE_FORMAT_CLIENT2SERVER, `sendAnswerSignal, sourceSocketId: ${sourceSocketId}, targetSocketId: ${targetSocketId}, data: ${data}`);
                webrtcSocket.emit(ANSWER_SIGNAL, { sourceSocketId, targetSocketId, data })
            });
            peer.signal(offerSignal);
        }

        return peer;
    },[]);

    useEffect(() => {
        peerRef.current = cb(sourceSocketId, targetSocketId, myMediaStream, webrtcSocket, isInitiator, offerSignal);
        peerRef.current.on('stream', (stream) => {
            console.log(CONSOLE_FORMAT_SERVER2CLIENT, `receivedStream, sourceSocketId: ${sourceSocketId}, targetSocketId: ${targetSocketId}`);
            setStream(stream);
        });
        if (isInitiator) {
            webrtcSocket.on(ANSWER_SIGNAL, ({targetSocketId, data }) => {
                console.log(CONSOLE_FORMAT_SERVER2CLIENT, `receivedAnswerSignal, sourceSocketId: ${sourceSocketId}, targetSocketId: ${targetSocketId}, data: ${data}`);
                peerRef.current.signal(data);
            });
        }
    }, [sourceSocketId, targetSocketId, myMediaStream, webrtcSocket, isInitiator, offerSignal]);

    return <VideoTemplate mediaStream={stream}/>
}

export default PeerTemplate;
