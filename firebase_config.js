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

var the_db = firebase.firestore();
console.log(firebase);

// Initialize Authentication
const uiConfig = {
    signInSuccessUrl: 'user_information.html',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
    tosUrl: '<your-tos-url>',
    privacyPolicyUrl: '<your-privacy-policy-url>'
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', uiConfig);

    // store user from authentication
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user)
        localStorage.setItem('userName', JSON.stringify(user.displayName));
        localStorage.setItem('userEmail', JSON.stringify(user.email));
        console.log(user.email);
    } else {
        console.log("user auth error");
        console.log(user);
    }
});

// display user information on information page
function userInfo(){
    let yourName = JSON.parse(localStorage.getItem('userName'));
    let yourEmail = JSON.parse(localStorage.getItem('userEmail'));
    document.getElementById('currentName').innerHTML = 'Username: ' + yourName;
    document.getElementById('currentEmail').innerHTML = 'Email: ' + yourEmail;
}

function displayCart() {
    let multipleItems = 1;
    for (let i = 0; i < cart_items.length; i++) {
        multipleItems = 1;
        for (let j = 0; j < cart_items.length; j++) { // loop to check for multiples
            if ((cart_items[i] === cart_items[j])) {
                console.log(multipleItems);
                console.log(cart_items[i]);
                chairsInCart(cart_items[i], multipleItems);
            }
        }
    }
}




//
// firebase.auth().signOut().then(function() {
//
//         localStorage.removeItem('userName', JSON.stringify(user.displayName));
//         localStorage.removeItem('userEmail', JSON.stringify(user.email));
//         console.log(localStorage);
//     }).catch(function(error) {
//
//         console.log("Error Logging User out");
//     });


