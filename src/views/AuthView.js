import { useState } from 'react';
import { AuthController } from '../controllers/AuthController';

const AuthView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Use Controller for business logic
        await AuthController.login(email, password);
        alert('Login successful! 🎉');
      } else {
        // Use Controller for business logic
        await AuthController.register(email, password);
        alert('Account created successfully! ✅');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Use Controller for business logic
      await AuthController.googleSignIn();
      alert('Google sign-in successful! 🌟');
    } catch (error) {
      alert(error.message);
    }
  };

  // UI RENDERING ONLY
  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      
      <form onSubmit={handleEmailAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none' }}>
          {isLogin ? 'Login' : 'Sign Up'}
        </button>
      </form>

      <button onClick={handleGoogleSignIn} style={{ width: '100%', padding: '10px', background: 'red', color: 'white', margin: '10px 0', border: 'none' }}>
        Sign in with Google
      </button>

      <p>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <span 
          onClick={() => setIsLogin(!isLogin)} 
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLogin ? 'Sign up' : 'Login'}
        </span>
      </p>
    </div>
  );
};

export default AuthView;