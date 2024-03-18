import React, {useEffect, useState} from "react";
import { connect } from "react-redux";
import SimplePeerTemplate from "./SimplePeerTemplate";
import MyVideo from "./MyVideo";
import {MY_CHARACTER_INIT_CONFIG} from "../../../constances/characterConstants";
import {
    OFFER_SIGNAL,
    CONSOLE_FORMAT_SERVER2CLIENT,
} from '../../../constances/webRTCKeyConstances';

function VideoManager({myCharacter, otherCharacters, webrtcSocket}) {
    const [myMediaStream, setMyMediaStream] = useState();

    // console.log('otherCharacters:', otherCharacters);

    useEffect(() => {
        const constraints = {video: true}

        navigator.mediaDevices.getUserMedia(constraints)
            .then((mediaStream) => {
                    console.log('Got MediaStream:', mediaStream);
                    setMyMediaStream(mediaStream);
                })
            .catch((err) => {
                console.error('Error accessing media devices:', err);
            });
    }, []);

    useEffect(() => {
        const receiveOfferSignalHandler = ({ sourceSocketId, data }) => {
            console.log(CONSOLE_FORMAT_SERVER2CLIENT, 'Received offer from:', sourceSocketId, ', Offer signal:', data);
        }
        webrtcSocket?.on(OFFER_SIGNAL, receiveOfferSignalHandler);
        return () => {
            webrtcSocket?.off(OFFER_SIGNAL, receiveOfferSignalHandler);
        };
    }, [webrtcSocket]);

    // https://github.com/feross/simple-peer?tab=readme-ov-file#connecting-more-than-2-peers
    return <>{
        myCharacter && <div className="videos">
            <MyVideo myMediaStream={myMediaStream}/>
            {Object.keys(otherCharacters).map(id => {
                return <SimplePeerTemplate
                    key = {otherCharacters[id]}
                    sourceSocketId={myCharacter.socketId}
                    myMediaStream={myMediaStream}
                    targetSocketId={otherCharacters[id].socketId}
                    webrtcSocket={webrtcSocket}
                />
            })}
        </div>
    }</>
}

const mapStateToProps = (state) => {
    const allCharacters = state.allCharacters.users;// get all characters data from redux store (allCharactersSlice.js)
    const myCharacterId = MY_CHARACTER_INIT_CONFIG.id;
    const myCharacter = allCharacters[myCharacterId];
    const otherCharacters = Object.keys(allCharacters)
        .filter(id => id !== myCharacterId)
        .reduce((filterObj, key) => {
            filterObj[key] = allCharacters[key];
            return filterObj;
        }, {});
    return {myCharacter, otherCharacters};
}

export default connect(mapStateToProps, {})(VideoManager);
