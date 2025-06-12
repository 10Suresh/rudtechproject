import React, { useEffect, useState } from 'react';
import API from '../../api';
interface User {
    id?: string;
    email?: string;
    name?: string;
}
const Home: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState('');
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('No token found');
            return;
        }
        API.get<{ user: User }>('/auth/current', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => setUser(res.data.user))
            .catch(err => {
                console.error('Failed to fetch user:', err);
                setError(err.response?.data?.message || 'Failed to fetch user');
            });
    }, []);

    if (error) return <div> {error}</div>;
    if (!user) return <div> Loading user...</div>;
    return (
        <div>
            📊 Welcome to the Dashboard Home, <strong>{user.name || user.email}</strong>!
        </div>
    );
};

export default Home;
