import React, { useState, useRef } from 'react';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollectionData } from 'react-firebase-hooks/firestore';

// tell firebase where our app is and access important configurations.
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyBxddKj0L94ic_v4Ik5JzGwDqNQLmrOG4A",
    authDomain: "homeroomchat.firebaseapp.com",
    projectId: "homeroomchat",
    storageBucket: "homeroomchat.appspot.com",
    messagingSenderId: "809727774652",
    appId: "1:809727774652:web:d7bf9c755a854f663265b9",
    measurementId: "G-12VKJ2MMS0"
  })
}else {
  firebase.app(); // if already initialized, use that one
}


const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth); //this handles authentication. use conditional rendering on user to determine user access.

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>
      {/* Display the chatroom if signed in. */}
      <section>
        { user ? <HomeChat/> : <SignIn/> }
      </section>
    </div>
  ); 
}

/**
 * Component SignIn: signs in a user using GoogleAuthProvider.
 * props: None
 * state: None
 */
function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    auth.signInWithPopup(provider);
  }

  return (
    <button className="sign-in" onClick={signInWithGoogle}>Sign in </button>
  )
}


/**
 * Component SignOut: displays a button which signs out the user.
 * props: None
 * state: None
 */
function SignOut() {
  return auth.currentUser &&  (<button className="sign-out" onClick={() => auth.signOut()}>Sign out</button>)
}

/**
 * Component HomeChat: main chat room.
 * props: None
 * state: messages
 *  messages: reference to data from 'messages' collection, listens to database by query via useCollectionData() react-firebase hook.
 */
function HomeChat() {
  const messagesRef = firestore.collection('messages'); //references a firestore collection
  console.log("Check enter.");
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField: 'id'}); //listen to data with a hook. changes to messages cause the app to re-render in real time.

  const [formVal, setFormVal] = useState('');

  const scrollRef = useRef();

  const submitMessage = async(e) => {
    e.preventDefault(); //avoid refresh
    const { uid, photoURL } = auth.currentUser;  //destructure user

    // POST to messages collection
    await messagesRef.add({
      text: formVal,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormVal(''); //reset form value to empty string
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }


  return (
    <>
      <div>
        {messages && messages.map(msg => <Chat key={msg.id} message={msg}/>)}
      </div>
      <div ref={scrollRef}></div>
      <form onSubmit ={submitMessage}>
        <input value={formVal} onChange={(event) => setFormVal(event.target.value)} placeholder="abhi is so cool"></input>
        <button type="submit">💩</button>
      </form>
    </>
  )
}


/**
 * Component Chat: main chat room.
 * props: text, uid
 *  text: the document, or message, to be posted
 *  uid: the user id
 * state: None
 */
function Chat(props){
  const { text, uid, photoURL } = props.message;

  const messageClass = (uid === auth.currentUser.uid) ? 'sent' : 'received';

  //  dynamic classnames for different styles for sent and received messages
  return (
    <div className = {`message ${messageClass}`}>
      <img src={photoURL}/>
      <p>{text}</p>
    </div>
  )
}

export default App;
