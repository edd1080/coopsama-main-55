import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const isDevAccessEnabled = import.meta.env.DEV;

  const handleDevAccess = async () => {
    try {
      setIsLoading(true);
      localStorage.setItem('authToken', 'dev-access-token');
      toast({ title: "Acceso de desarrollo", description: "Sesión iniciada en modo desarrollo", variant: "success" });
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Error de validación",
        description: "Por favor ingresa usuario y contraseña",
        variant: "destructive"
      });
      return;
    }
    try {
      setIsLoading(true);

      // Simulating API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, accept any non-empty credentials
      console.log('Login successful:', {
        username
      });

      // Store auth token (in a real app, this would come from the server)
      localStorage.setItem('authToken', 'demo-token-12345');
      toast({
        title: "¡Inicio de sesión exitoso!",
        description: "Bienvenido/a a Coopsama App"
      });

      // Redirect to main app
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error de inicio de sesión",
        description: "Credenciales incorrectas o problema de conexión",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <User className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input id="username" type="text" placeholder="Nombre de usuario" value={username} onChange={e => setUsername(e.target.value)} className="pl-10" autoComplete="username" disabled={isLoading} />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Lock className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input id="password" type={showPassword ? "text" : "password"} placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 pr-10" autoComplete="current-password" disabled={isLoading} />
          <button type="button" className="absolute inset-y-0 right-0 flex items-center pr-3" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
            {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </Button>
      {isDevAccessEnabled && (
        <Button type="button" variant="secondary" className="w-full" onClick={handleDevAccess} disabled={isLoading}>
          Acceso de desarrollo
        </Button>
      )}
      
      <div className="text-center text-sm text-muted-foreground">
        
      </div>
    </form>;
};
export default LoginForm;