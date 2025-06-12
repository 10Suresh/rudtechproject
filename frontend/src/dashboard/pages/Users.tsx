import React, { useEffect, useState } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')

                const res = await fetch('http://localhost:4000/api/users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }

                const data = await res.json();
                console.log(data, "fetched users");
                setUsers(data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">👥 Manage Users</h2>

            {loading ? (
                <p className="text-gray-500">Loading users...</p>
            ) : users.length === 0 ? (
                <p className="text-gray-500">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border shadow rounded-xl">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left">#</th>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, idx) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50">
                                    <td className="py-2 px-4">{idx + 1}</td>
                                    <td className="py-2 px-4">{user.name}</td>
                                    <td className="py-2 px-4">{user.email}</td>
                                    <td className="py-2 px-4 capitalize">{user.role}</td>
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
