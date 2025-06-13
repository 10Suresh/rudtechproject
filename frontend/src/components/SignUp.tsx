import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { saveToken } from '../auth';
import toast, { Toaster } from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa'; 

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 👈 loading state
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // 👈 Start loading

    try {
      const res = await API.post('/auth/register', { name, email, password });

      if (res.status === 201) {
        saveToken(res.data.token);
        toast.success(res.data.message);
        setTimeout(() => navigate('/'), 1000);
      } else if (res.status === 400) {
        toast.error(res.data.message || 'Email is already registered.');
      } else {
        toast.error('Something went wrong.');
      }
    } catch (error: any) {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 400) {
        toast.error(message || 'Email is already registered.');
      } else if (status === 500) {
        toast.error(message || 'Registration failed due to server error.');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false); // 👈 Stop loading
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={handleSignUp}
        className="bg-gray-100 text-gray-900 p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Full Name"
          required
          className="w-full p-3 mb-4 rounded bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-3 mb-4 rounded bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-3 mb-6 rounded bg-white border border-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white font-semibold ${loading
              ? 'bg-green-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <FaSpinner className="animate-spin" /> Signing up...
            </div>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
