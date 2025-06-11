'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';
import { auth, signInWithEmailAndPassword, signInWithGoogle, sendPasswordResetEmail } from '../firebase';
import { GoogleAuthProvider } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const emailInputRef = useRef<HTMLInputElement>(null); // 用于忘记密码功能

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const target = e.target as typeof e.target & {
      username: { value: string };
      password: { value: string };
    };

    const email = target.username.value;
    const password = target.password.value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/game');
    } catch (err: any) {
      console.error('登录失败:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('用户名或密码错误');
      } else {
        setError('登录失败，请稍后再试。');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' }); // 强制账号选择
      await signInWithGoogle(); // 确保你已经在 firebase.ts 中导出这个方法
      router.push('/game');
    } catch (err: any) {
      console.error('Google 登录失败:', err);
      setError('使用 Google 登录失败，请重试。');
    }
  };

  const handleForgotPassword = async () => {
    const email = emailInputRef.current?.value.trim();

    if (!email) {
      setError('请输入邮箱以接收重置密码邮件');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert('重置密码邮件已发送，请查收您的邮箱。');
    } catch (err: any) {
      console.error('发送重置邮件失败:', err);
      setError('无法发送重置邮件，请检查邮箱是否正确或稍后再试');
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">登录</h2>

        {/* Email 登录表单 */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-700 mb-2">
              邮箱
            </label>
            <input
              type="email"
              id="username"
              name="username"
              ref={emailInputRef} // 绑定到 ref
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="输入邮箱"
              required
            />
            {/* 忘记密码按钮 */}
            <div className="mt-1 text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-500 hover:underline focus:outline-none"
              >
                忘记密码？
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">
              密码
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="输入密码"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded transition-colors duration-200 ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {loading ? '登录中...' : '邮箱登录'}
          </button>
        </form>
        {/* 手机号登录按钮 */}
        <div className="mt-6">
          <button
            onClick={() => router.push('/phonelogin')}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            使用手机号登录
          </button>
        </div>
        {/* Google 登录按钮 */}
        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.04 0 5.66 1.13 7.53 3.05l5.66-5.66C33.22 3.44 28.00 1 24 1 14.67 1 6.63 6.82 2.81 15.38l6.61 5.13C12.27 13.34 17.77 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.19l7.73 6c4.51-4.18 7.49-10.36 7.49-17.42z"/>
              <path fill="#FBBC05" d="M10.56 28.02c-.14-.44-.25-.9-.25-1.52 0-.62.11-1.08.25-1.52L2.81 19.5C1.21 22.68 1 24.34 1 24.55c0 .21.19.83 2.81 3.45l7.75-6.43z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.58-4.18-13.46-9.69l-7.75 6.43C6.63 41.18 14.67 47 24 48z"/>
              <path fill="none" d="M1 1h46v46H1z"/>
            </svg>
            使用 Google 登录
          </button>
        </div>

        {/* 注册跳转按钮 */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">还没有账号？</p>
          <button
            onClick={() => router.push('/register')}
            className="text-blue-500 hover:underline text-sm"
          >
            立即注册
          </button>
        </div>
      </div>
    </main>
  );
}