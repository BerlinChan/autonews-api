/**
 * Created by berlin on 2017/3/8.
 * Crawler Constructor
 */

const admin = require("firebase-admin");
const serviceAccount = require("../utils/fiery-heat-7406-firebase-adminsdk-kpbna-ed5b591529.json");

// Initialize the app with a custom auth variable, limiting the server's access
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fiery-heat-7406.firebaseio.com/",
    databaseAuthVariableOverride: {
        uid: "crawler-worker",
    },
});

// Get a database reference to our blog
module.exports = admin.database();
