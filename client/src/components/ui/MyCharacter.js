import React, {useEffect} from 'react';
import {connect} from 'react-redux';

import { MY_CHARACTER_INIT_CONFIG } from '../../constances/characterConstants';
import {update as updateAllCharactersData} from '../slices/allCharactersSlice'
import {writeUserData} from '../../firebase/firebase';

import CharacterTemplate from "./CharacterTemplate";

function MyCharacter({ myCharactersData, updateAllCharactersData, webrtcSocket }) {
    useEffect(() => {
        const myInitData = {
            ...MY_CHARACTER_INIT_CONFIG,
            socketId: webrtcSocket.id,
        };

        const users = {};
        const myId = MY_CHARACTER_INIT_CONFIG.id;
        users[myId] = myInitData;

        writeUserData(myInitData)

        updateAllCharactersData(users);
    }, [webrtcSocket]);

    return <CharacterTemplate charactersData={myCharactersData}/>
}

const mapStateToProps = (state) => {
    return {myCharactersData: state.allCharacters.users[MY_CHARACTER_INIT_CONFIG.id]};
};

export default connect(mapStateToProps, {updateAllCharactersData})(MyCharacter);
