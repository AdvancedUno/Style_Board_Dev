import { useState } from 'react';

import '@/styles/login.css'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Replace with your actual login logic, e.g., API call
    if (email === 'test@example.com' && password === 'password') {
      // Store user information in local storage
      localStorage.setItem('user', JSON.stringify({ email }));
      // Refresh the page or update the state in your main component
      window.location.reload();
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="login-error">{error}</p>}
      <form onSubmit={handleLogin} className="login-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
}
