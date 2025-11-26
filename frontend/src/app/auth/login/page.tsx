// app/auth/login/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUser, login } from '@/redux/slices/authSlice';
import AuthLayout from '@/components/layout/AuthLayout';
import LoginForm from '@/components/forms/LoginForm';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { status, error, token } = useAppSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (token) {
        await dispatch(fetchUser());
        router.push('/dashboard');
      }
    };
    fetchAndRedirect();
  }, [token, router]);

  useEffect(() => {
    const registrationSuccess = sessionStorage.getItem('registrationSuccess');
    if (registrationSuccess) {
      setSuccessMessage('Registration successful! Please log in.');
      sessionStorage.removeItem('registrationSuccess');
    }
  }, []);

  const handleSubmit = async (formData: { email: string; password: string }) => {
    try {
      const result = await dispatch(login({
        email: formData.email,
        password: formData.password
      })).unwrap();

      console.log('Login successful:', result);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleToggleMode = () => {
    router.push('/auth/register');
  };

  return (
    <AuthLayout title="Sign in to AdvancedLMS">
      <LoginForm 
        onSubmit={handleSubmit}
        onToggleMode={handleToggleMode}
        isLoading={status === 'loading'}
      />
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm">{successMessage}</p>
        </div>
      )}
    </AuthLayout>
  );
}