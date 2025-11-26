'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUser } from "@/redux/slices/authSlice";


export default function CallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Checking authentication...');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const resultAction: any = await dispatch(fetchUser());
        if (fetchUser.fulfilled.match(resultAction)) {
          setStatus("success");
          setMessage(`Welcome ${resultAction.payload.user.name}! Redirecting...`);
          setTimeout(() => router.push("/dashboard"), 1500);
        } else {
          throw new Error(resultAction.payload || "Authentication failed");
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Authentication failed");
      }
    };

    checkAuth();
  }, [dispatch, router]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">L</span>
        </div>

        {status === 'loading' && (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Completing Authentication</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          </>
        )}

        {status === 'success' && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Authentication Successful!</h2>
            <p className="text-gray-600">{message}</p>
            <div className="mt-4 text-green-500 text-4xl">✓</div>
          </>
        )}

        {status === 'error' && (
          <>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">{message}</p>
            <div className="mt-4 text-red-500 text-4xl">✗</div>
            <button
              onClick={() => router.push('/auth/login')}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
