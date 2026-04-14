import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckSquare, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/my-tasks'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email is required'); return; }
    if (!password.trim()) { setError('Password is required'); return; }

    setLoading(true);
    try {
      await login({ email, password });

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

      navigate(storedUser.role === 'admin' ? '/dashboard' : '/my-tasks');
    } catch {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-6">
            <CheckSquare className="h-8 w-8 text-primary" />
            <span className="text-2xl font-heading font-bold">TaskFlow</span>
          </div>
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-heading">Welcome back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
              <div className="text-xs text-muted-foreground text-center space-y-1 pt-2">
                <p>Demo admin: <code className="bg-muted px-1 rounded">admin@example.com</code> / <code className="bg-muted px-1 rounded">password123</code></p>
                <p>Demo member: <code className="bg-muted px-1 rounded">member@example.com</code> / <code className="bg-muted px-1 rounded">password123</code></p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
