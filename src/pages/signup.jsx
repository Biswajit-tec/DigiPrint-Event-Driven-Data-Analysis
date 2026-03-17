import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/AuthLayout';

const SignupPage = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target;
    const name = form.querySelector('#name')?.value;
    const email = form.querySelector('#email')?.value;
    const password = form.querySelector('#password')?.value;
    const confirmPassword = form.querySelector('#confirm-password')?.value;

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mb-2">
            <span className="text-primary-foreground font-bold text-xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your information below to create your account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
            />
            <p className="text-xs text-muted-foreground">
              We&apos;ll use this to contact you. We will not share your email with anyone else.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters long.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-muted-foreground">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              required
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 hover:shadow-lg shadow-primary/20 transition-all duration-200 active:scale-[0.98] text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline underline-offset-4 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
