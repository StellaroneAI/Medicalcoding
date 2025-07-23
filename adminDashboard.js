import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext'; // Assuming db is available via context

// Helper Card component
const DashboardCard = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
        <div className="text-4xl mr-4">{icon}</div>
        <div>
            <h4 className="text-gray-500">{title}</h4>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const AdminDashboard = () => {
  const { db } = useAuth(); // Get firestore instance from auth context
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ entries: 0, coders: 0 });

  useEffect(() => {
    if (!db) return;
    
    const fetchData = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const userList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      
      let totalEntries = 0;
      for (const user of userList) {
        const entries = await getDocs(collection(db, `users/${user.id}/medicalCodingEntries`));
        totalEntries += entries.size;
      }
      
      setStats({
        entries: totalEntries,
        coders: userList.length
      });
    };
    
    fetchData();
  }, [db]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Total Coders" value={stats.coders} icon="👨‍⚕️" />
        <DashboardCard title="Coding Entries" value={stats.entries} icon="📋" />
        <DashboardCard title="Avg. Per Coder" value={stats.coders ? (stats.entries / stats.coders).toFixed(1) : 0} icon="📊" />
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Coding Team</h3>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Coder Email</th>
              <th className="px-6 py-3 text-left">User ID</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;