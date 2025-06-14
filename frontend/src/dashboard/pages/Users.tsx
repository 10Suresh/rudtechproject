import React, { useEffect, useState } from 'react';
import API from '../../api';

interface User {
  id: string;
  name: string;
  email: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await API.get<User[]>('/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
      } catch (err: any) {
        console.error('Failed to fetch users:', err.response?.status, err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">👥 User Management</h2>
      {loading ? (
        <div className="text-gray-500 animate-pulse">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border shadow-md rounded-lg">
            <thead className="bg-blue-50 text-blue-700 text-sm uppercase">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-blue-50 transition-colors"
                >
                  <td className="py-3 px-4">{idx + 1}</td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
