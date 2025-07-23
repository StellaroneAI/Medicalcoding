const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Cloud Function to set custom user roles
exports.setUserRole = functions.auth.user().onCreate(async (user) => {
  const roles = ['coder'];
  if (user.email && user.email.endsWith('@admin.medicalcoding.com')) {
    roles.push('admin');
  }
  await admin.auth().setCustomUserClaims(user.uid, { roles });
});

// Cloud Function to process uploaded medical documents
exports.processMedicalDocument = functions.storage
  .object()
  .onFinalize(async (object) => {
    if (!object.name.startsWith('uploads/') || !object.name.endsWith('.pdf')) {
      console.log('Not a PDF file to process.');
      return null;
    }

    const userId = object.name.split('/')[1];
    
    // Placeholder for PDF text extraction and ML model prediction
    // const text = await pdf.extractText(object.bucket, object.name);
    // const results = await medicalCodingModel.predict(text);
    const results = {
        diagnosisCode: "R51", // Example data
        procedureCode: "99213",
        patientName: "John Doe (Encrypted)",
        patientId: "P12345 (Encrypted)"
    };
    
    await admin.firestore()
      .collection(`users/${userId}/medicalCodingEntries`)
      .add({
        ...results,
        originalFile: object.name,
        processedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
    await admin.messaging().sendToTopic(userId, {
      notification: {
        title: 'New Coding Results',
        body: `Your document ${object.name.split('/').pop()} has been processed.`
      }
    });
    
    return true;
  });

// HIPAA Audit Trail Function
exports.createAuditLog = functions.firestore
  .document('{collection}/{docId}')
  .onWrite(async (change, context) => {
    // Avoid logging audit log's own creation
    if (context.params.collection === 'audit_logs') {
        return null;
    }

    const auditEntry = {
      user: context.auth ? context.auth.uid : 'SYSTEM',
      action: change.before.exists ? (change.after.exists ? 'updated' : 'deleted') : 'created',
      documentPath: `${context.params.collection}/${context.params.docId}`,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      before: change.before.data() || {},
      after: change.after.data() || {}
    };
    
    return admin.firestore().collection('audit_logs').add(auditEntry);
  });

// Automatic Data Encryption Function
exports.encryptPHI = functions.firestore
  .document('users/{userId}/medicalCodingEntries/{entryId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();

    // Placeholder for actual encryption logic
    const encrypt = (text) => `encrypted(${text})`;

    const encryptedData = {
      ...data,
      patientName: encrypt(data.patientName),
      patientId: encrypt(data.patientId),
      diagnosisDescription: encrypt(data.diagnosisDescription)
    };
    
    return snap.ref.update(encryptedData);
  });