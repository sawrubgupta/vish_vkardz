import * as admin from 'firebase-admin';

import * as serviceAccount  from "./google-services.json";

const credentialObject:object = serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert(credentialObject)
});

export default admin;

