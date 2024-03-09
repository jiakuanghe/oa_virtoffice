import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import CanvasContext from './CanvasContext';

import {MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE} from '../constances/mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from '../constances/characterConstants';
import {checkMapCollision} from '../utils/utils';
import {update as updateAllCharactersData} from './slices/allCharactersSlice'
import {writeUserData, onUserDataChange} from '../firebase/firebase';

import {
    Text,
    Button,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from '@chakra-ui/react'
import {getDatabase, onValue, ref} from "firebase/database";

const GameLoop = ({children, allCharactersData, updateAllCharactersData}) => {
    useEffect(() => {
        // TODO: Why cannot call the onUserDataChange function here
        const dbRef = ref(getDatabase(), 'users/');
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            // console.debug('onUserDataChange, before, data:', data);
            updateAllCharactersData(data)
            // console.debug('onUserDataChange, after');
        });
    },[])

    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    useEffect(() => {
        // frameCount used for re-rendering child components
        // TODO: Why when we initialize, this will be printed twice? Why we need to do that?
        console.log("initial setContext");
        setContext({canvas: canvasRef.current.getContext('2d'), frameCount: 0});
    }, [setContext]);

    // keeps the reference to the main rendering loop
    const loopRef = useRef();
    const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];

    const OverlayOne = () => (
        <ModalOverlay
            backdropFilter='blur(10px)'
        />
    )

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [overlay, setOverlay] = React.useState(<OverlayOne />)

    const moveMyCharacter = useCallback((e) => {
        var currentPosition = mycharacterData.position;
        const key = e.key;
        if (MOVE_DIRECTIONS[key]) {
            // ***********************************************
            // TODO: Add your move logic here
            // Make the character move with WASD
            console.log('');// leave blank to separate the logs
            console.log('*********moveMyCharacter start*********');
            console.log(`key pressed: ${key}`);
            console.log('currentPosition', currentPosition);
            const currentPositionX = currentPosition.x;
            const currentPositionY = currentPosition.y;

            const [x, y] = MOVE_DIRECTIONS[key];
            const newPositionX = currentPositionX + x;
            const newPositionY = currentPositionY + y;
            const newPosition = {
                x: newPositionX,
                y: newPositionY,
            };
            console.log('newPosition', newPosition);
            // TODO: The collision function have problems: cannot reach the farthest grid, and can move outside the grey broad
            // NOTE: If we use `if (!checkMapCollision(currentPositionX, currentPositionY)) {` here, we can move to the last grid, but cannot go up or down
            if (!checkMapCollision(newPositionX, newPositionY)) {
                console.log('collision not detected');

                const cloneMyCharacterData = { ...mycharacterData };
                cloneMyCharacterData.position = newPosition;
                console.log('cloneMyCharacterData', cloneMyCharacterData);
                const cloneAllCharacterData = { ...allCharactersData };
                cloneAllCharacterData[cloneMyCharacterData.id] = cloneMyCharacterData;
                updateAllCharactersData(cloneAllCharacterData);
                writeUserData(cloneMyCharacterData);
            } else {
                console.warn('collision detected');
                setOverlay(<OverlayOne />)
                onOpen()
            }

            console.log('*********moveMyCharacter end*********');
        }
    }, [mycharacterData]);

    const tick = useCallback(() => {
        if (context != null) {
            setContext({canvas: context.canvas, frameCount: (context.frameCount + 1) % 60});
        }
        loopRef.current = requestAnimationFrame(tick);
    }, [context]);

    useEffect(() => {
        loopRef.current = requestAnimationFrame(tick);
        return () => {
            loopRef.current && cancelAnimationFrame(loopRef.current);
        }
    }, [loopRef, tick])

    useEffect(() => {
        document.addEventListener('keypress', moveMyCharacter);
        return () => {
            document.removeEventListener('keypress', moveMyCharacter);
        }
    }, [moveMyCharacter]);

    return (
        <>
            <CanvasContext.Provider value={context}>
                <canvas
                    ref={canvasRef}
                    width={TILE_SIZE * MAP_DIMENSIONS.COLS}
                    height={TILE_SIZE * MAP_DIMENSIONS.ROWS}
                    className="main-canvas"
                />
                {children}
            </CanvasContext.Provider>
            <Modal isCentered isOpen={isOpen} onClose={onClose}>
                {overlay}
                <ModalContent>
                    <ModalHeader>Collision</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Text>You cannot go to the lava floor!</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

export default connect(mapStateToProps, {updateAllCharactersData})(GameLoop);
