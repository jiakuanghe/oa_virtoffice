import React, {useCallback, useEffect, useRef, useState} from 'react';
import {connect} from 'react-redux';
import CanvasContext from './CanvasContext';

import {MOVE_DIRECTIONS, MAP_DIMENSIONS, TILE_SIZE} from './mapConstants';
import { MY_CHARACTER_INIT_CONFIG } from './characterConstants';
import {checkMapCollision} from './utils';
import {update as updateAllCharactersData} from './slices/allCharactersSlice'

const GameLoop = ({children, allCharactersData, updateAllCharactersData}) => {
    const canvasRef = useRef(null);
    const [context, setContext] = useState(null);
    useEffect(() => {
        // frameCount used for re-rendering child components
        console.log("initial setContext");
        setContext({canvas: canvasRef.current.getContext('2d'), frameCount: 0});
    }, [setContext]);

    // keeps the reference to the main rendering loop
    const loopRef = useRef();
    const mycharacterData = allCharactersData[MY_CHARACTER_INIT_CONFIG.id];

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
            if (!checkMapCollision(newPositionX, newPositionY)) {
                console.log('collision not detected');

                const cloneMyCharacterData = { ...mycharacterData };
                cloneMyCharacterData.position = newPosition;
                console.log('cloneMyCharacterData', cloneMyCharacterData);
                const cloneAllCharacterData = { ...allCharactersData };
                cloneAllCharacterData[cloneMyCharacterData.id] = cloneMyCharacterData;
                updateAllCharactersData(cloneAllCharacterData);
            } else {
                console.warn('collision detected');
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
        <CanvasContext.Provider value={context}>
            <canvas
                ref={canvasRef}
                width={TILE_SIZE * MAP_DIMENSIONS.COLS}
                height={TILE_SIZE * MAP_DIMENSIONS.ROWS}
                className="main-canvas"
            />
            {children}
        </CanvasContext.Provider>
    );
};

const mapStateToProps = (state) => {
    return {allCharactersData: state.allCharacters.users};
};

export default connect(mapStateToProps, {updateAllCharactersData})(GameLoop);
