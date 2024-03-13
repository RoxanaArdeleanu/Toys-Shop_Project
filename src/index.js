import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";


const userContainer = document.querySelector('.userContainer');

const firebaseConfig = {
  apiKey: "AIzaSyA0ciiceUsWD6jkXPJgX_sktljdlXyji_U",
  authDomain: "roxanawebapp.firebaseapp.com",
  projectId: "roxanawebapp",
  storageBucket: "roxanawebapp.appspot.com",
  messagingSenderId: "583615180884",
  appId: "1:583615180884:web:770a23a63eb158bf577dc1",
  measurementId: "G-CLVPN87PWH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
auth.languageCode = 'en';
const user = auth.currentUser;



function updateUserProfile (user) {
  const userName = user.displayName;
  const userEmail = user.email;
  const userProfilePicture = user.photoURL;
  // const [firstName, lastName] = userName.split(' ');

  // document.getElementById('firstName').value = firstName;
  // document.getElementById('lastName').value = lastName;
  document.getElementById('userName').textContent = userName;
  document.getElementById('userEmail').textContent = userEmail;
  document.getElementById('userProfilePicture').src = userProfilePicture;
}

//Function that split the full name into first and last names
    function updateCheckoutUserProfile(user) {
      const userName = user.displayName;
      const [firstName, lastName] = userName.split(' ');
  
      document.getElementById('firstName').value = firstName;
      document.getElementById('lastName').value = lastName;
  
    }


const userSignOut = document.getElementById('signOut');
  userSignOut.addEventListener('click', () => {
    signOut(auth)
      .then(() => {
        alert('You are now logged out!');
        console.log('User logged out!');
        window.location.href = "/index.html";
      })
      .catch((error) => {
        console.error('Error during sign out:', error.message);
      });
  });

onAuthStateChanged (auth, user => {
  if (user) {
    // User is logged in
    console.log('User is logged in!');

    // Hide the Google login button
    document.getElementById('google-login-btn').style.display = 'none';

    // Show the user profile and sign out button
    const accountLoginElements = document.getElementsByClassName('account-login');
    for (let i = 0; i < accountLoginElements.length; i++) {
      accountLoginElements[i].style.display = 'none';
    }

    // Show the elements with the 'userProfile' class
    const userProfileElements = document.getElementsByClassName('userProfile');
    for (let i = 0; i < userProfileElements.length; i++) {
      userProfileElements[i].style.display = 'block';
    }

    // Show the sign out button
    document.getElementById('signOut').style.display = 'block';

    // Update user profile information
    updateUserProfile(user);
    const uid = user.uid;
    return uid;

  } else {
    // No user is logged in
    console.log('No user');

    // Show the Google login button
    document.getElementById('google-login-btn').style.display = 'block';

    // Show the elements with the 'account-login' class
    const accountLoginElements = document.getElementsByClassName('account-login');
    for (let i = 0; i < accountLoginElements.length; i++) {
      accountLoginElements[i].style.display = 'block';
    }

    // Hide the elements with the 'userProfile' class
    const userProfileElements = document.getElementsByClassName('userProfile');
    for (let i = 0; i < userProfileElements.length; i++) {
      userProfileElements[i].style.display = 'none';
    }

    // Hide the sign out button
    document.getElementById('signOut').style.display = 'none';
    userContainer.style.display = 'none';
    }

    });

const googleLogin = document.getElementById("google-login-btn");
googleLogin.addEventListener('click', function(){
  signInWithPopup(auth, provider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    console.log(user);
    window.location.href = "../../pages/account/logged.html";
  }).catch((errorCode) => {
   
    if (errorCode === 'auth/popup-closed-by-user') {
      console.log('User closed the Google sign-in popup');
      
    } else if (errorCode === 'auth/cancelled-popup-request') {
      console.log('Google sign-in popup request cancelled');
      
    } else {
      console.error('Error during Google sign-in:', errorMessage);
      alert ('You need to have a Google account to be logged in');
    }
  
  });


});


