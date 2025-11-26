// app/auth/register/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { register } from '@/redux/slices/authSlice';
import AuthLayout from '@/components/layout/AuthLayout';
import RegisterForm from '@/components/forms/RegisterForm';

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { status, error } = useAppSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'succeeded' && !error) {
      setSuccessMessage('Registration successful! Redirecting to login...');
      sessionStorage.setItem('registrationSuccess', 'true');
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);
    }
  }, [status, error, router]);

  const handleSubmit = async (formData: { name: string; email: string; password: string }) => {
    try {
      const result = await dispatch(register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      })).unwrap();

      console.log('Registration successful:', result);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  const handleToggleMode = () => {
    router.push('/auth/login');
  };

  return (
    <AuthLayout title="Sign up to AdvancedLMS">
      <RegisterForm 
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