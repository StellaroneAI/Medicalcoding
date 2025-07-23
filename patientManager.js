import React, { useState } from 'react';

// Reusable Input Field
const InputField = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input {...props} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
    </div>
);

// Patient Card to display patient info
const PatientCard = ({ patient }) => (
    <div className="bg-gray-100 p-4 rounded-lg mb-2">
        <h4 className="font-bold">{patient.name}</h4>
        <p className="text-sm">DOB: {patient.dob}</p>
        <p className="text-sm">Insurance ID: {patient.insuranceId}</p>
    </div>
);


const PatientManager = () => {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: '',
    dob: '',
    insuranceId: '',
    primaryCare: ''
  });

  const handleAddPatient = (e) => {
    e.preventDefault();
    setPatients([...patients, {
      id: Date.now(),
      ...newPatient,
    }]);
    setNewPatient({ name: '', dob: '', insuranceId: '', primaryCare: '' }); // Reset form
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Patient Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Patient</h3>
          <form onSubmit={handleAddPatient} className="space-y-4">
            <InputField 
              label="Full Name"
              value={newPatient.name}
              onChange={e => setNewPatient({...newPatient, name: e.target.value})}
              required
            />
            <InputField 
              label="Date of Birth"
              type="date"
              value={newPatient.dob}
              onChange={e => setNewPatient({...newPatient, dob: e.target.value})}
              required
            />
            <InputField 
              label="Insurance ID"
              value={newPatient.insuranceId}
              onChange={e => setNewPatient({...newPatient, insuranceId: e.target.value})}
            />
            <InputField 
              label="Primary Care Physician"
              value={newPatient.primaryCare}
              onChange={e => setNewPatient({...newPatient, primaryCare: e.target.value})}
            />
            <button 
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
            >
              Add Patient
            </button>
          </form>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Patient Directory</h3>
          <div className="overflow-y-auto max-h-96 border p-2 rounded-md">
            {patients.length > 0 ? patients.map(patient => (
              <PatientCard key={patient.id} patient={patient} />
            )) : <p>No patients added yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManager;