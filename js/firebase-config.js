/* Firebase settings for the shared photo wall (these values are meant to be public;
   the security rules in firestore.rules are what protect the data).
   Leave apiKey empty to run the site as a local demo (photos stay in each browser). */
window.PROLEAD_FIREBASE = {
  apiKey: "AIzaSyCxSmmSjyupePYD-x_aGKPNL-41hPzXZ7g",
  authDomain: "prolead-photo-wall-svf.firebaseapp.com",
  projectId: "prolead-photo-wall-svf",
  storageBucket: "prolead-photo-wall-svf.firebasestorage.app",
  messagingSenderId: "526620056016",
  appId: "1:526620056016:web:378eeffa083598c50381d5",
  // the two admins (must match the list in firestore.rules)
  adminEmails: ["iamazibsafwan@gmail.com", "adamridhwansafie12@gmail.com"]
};
