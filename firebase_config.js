// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCcaat9ekOpu0m7qZTJ6gblV65DIBeWEbQ",
    authDomain: "saq-fb.firebaseapp.com",
    databaseURL: "https://saq-fb.firebaseio.com",
    projectId: "saq-fb",
    storageBucket: "saq-fb.appspot.com",
    messagingSenderId: "351007329675",
    appId: "1:351007329675:web:241d7fd4d85e789830b38e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const the_db = firebase.firestore();
// Initialize Authentication
var uiConfig = {
    signInSuccessUrl: 'main.html',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>'
};


const ui = new firebaseui.auth.AuthUI(firebase.auth());

// store user from authentication
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        localStorage.setItem('userName', JSON.stringify(user.displayName));
    }
});

ui.start('#firebaseui-auth-container', uiConfig);


