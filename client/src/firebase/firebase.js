// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, child, get, onValue } from "firebase/database";
import {update as updateAllCharactersData} from '../components/slices/allCharactersSlice'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDauC5xywKpwLy_WBOj6aaIVr0tAa0z4Rs",
//   authDomain: "oa-virtoffice-project.firebaseapp.com",
//   projectId: "oa-virtoffice-project",
//   storageBucket: "oa-virtoffice-project.appspot.com",
//   messagingSenderId: "416890512159",
//   appId: "1:416890512159:web:59d7b08b2333270e6f062a",
//   measurementId: "G-JDJCEPS4YH"
// };
const firebaseConfig = {
    apiKey: process.env.REACT_APP_apiKey,
    authDomain: process.env.REACT_APP_authDomain,
    projectId: process.env.REACT_APP_projectId,
    storageBucket: process.env.REACT_APP_storageBucket,
    messagingSenderId: process.env.REACT_APP_messagingSenderId,
    appId: process.env.REACT_APP_appId,
    measurementId: process.env.REACT_APP_measurementId,
    databaseURL: "https://jiakuang-virtoffice-firebase-default-rtdb.firebaseio.com/",
  };

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getDatabase(firebaseApp);

// https://firebase.google.com/docs/database/web/read-and-write#basic_write
export const writeUserData = (data) => {
    console.debug('writeUserData, data:', data);
    set(ref(firebaseDatabase, `users/${data.id}`), data);
}

// https://firebase.google.com/docs/database/web/read-and-write#delete_data
export const deleteUserData = () => {
    set(ref(firebaseDatabase, 'users/'), null);
}

// https://firebase.google.com/docs/database/web/read-and-write#web_value_events
// TODO: This function have to be put inside the useEffect(), cannot call a function here???
export const onUserDataChange = () => {
    const dbRef = ref(getDatabase(), 'users/');
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        console.debug('onUserDataChange, before, data:', data);
        updateAllCharactersData(data)
        console.debug('onUserDataChange, after');
    });
}
