import React, { useState } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const UploaderSection = () => {
  const { user, db } = useAuth();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file || !user) return;

    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(pct);
      },
      (error) => {
        console.error('Upload failed', error);
        setStatus('Upload failed');
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        try {
          await addDoc(collection(db, `users/${user.uid}/uploads`), {
            name: file.name,
            url,
            createdAt: new Date().toISOString(),
          });
          setStatus('Upload complete');
        } catch (err) {
          console.error('Failed to save file info', err);
          setStatus('Upload complete but metadata save failed');
        }
        setFile(null);
        setProgress(0);
      }
    );
  };

  return (
    <section className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">File Uploader</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <div>
        <button
          onClick={handleUpload}
          disabled={!file}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded"
        >
          Upload
        </button>
      </div>
      {progress > 0 && (
        <p className="mt-2">Progress: {Math.round(progress)}%</p>
      )}
      {status && <p className="mt-2">{status}</p>}
import React from 'react';

const UploaderSection = () => {
  return (
    <section className="p-4 border rounded-md">
      <h2 className="text-xl font-bold mb-4">File Uploader</h2>
      {/* TODO: Implement file upload functionality */}
      <p>Upload functionality coming soon.</p>
    </section>
  );
};

export default UploaderSection;
