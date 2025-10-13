import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Icon, LoadingIcon } from '@/components/ui/icon';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    const success = await login(email, password);
    if (success) {
      toast.success('Login realizado com sucesso!');
      navigate('/dashboard');
    } else {
      setError('Email ou senha incorretos');
      toast.error('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-unicopag-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center pt-4 pb-2">
          <div className="flex justify-center mb-2">
            <img 
              src="/logo-unicopag.png" 
              alt="UnicoPag" 
              className="h-22 w-auto object-cover"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-unicopag-dark-blue">
            Acesso ao Sistema
          </CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema UnicoPag PoS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <Icon name="error" className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingIcon className="mr-2" />
                  Entrando...
                </>
              ) : (
                <>
                  <Icon name="user" className="mr-2" />
                  Entrar
                </>
              )}
            </Button>
          </form>
          
          {import.meta.env.NODE_ENV !== 'production' && (
            <div className="mt-6 p-4 bg-unicopag-light-gray rounded-lg">
              <h4 className="font-semibold text-unicopag-dark-blue mb-2">
                Credenciais de Demonstração:
              </h4>
              <p className="text-sm text-unicopag-gray-text">
                <strong>Email:</strong> admin@unicopag.com<br />
                <strong>Senha:</strong> admin123
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
