import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import API from '../api';
import { saveToken } from '../auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', { email, password });

      if (res.data.success) {
        toast.success(res.data.message || 'Login successful!');
        saveToken(res.data.token);
        setTimeout(() => navigate('/dashboard'), 1000); // Delay for toast
      } else {
        toast.error(res.data.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'Something went wrong. Please try again.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={handleLogin}
        className="bg-gray-100 text-gray-900 p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
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
          className="w-full py-3 rounded bg-blue-600 text-white hover:bg-blue-700 font-semibold"
        >
          Login
        </button>

        <div className="text-center mt-4">
          <span className="text-sm">Don't have an account?</span>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="ml-2 text-blue-600 hover:underline font-medium"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
