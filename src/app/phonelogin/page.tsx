'use client';

import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase';
import { useTranslation } from 'react-i18next';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
    grecaptcha?: any;
  }
}

export default function PhoneLogin() {
  const { t } = useTranslation();
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('+852');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  // 初始化不可见 reCAPTCHA
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'sign-in-button', // ← 绑定到这个按钮 ID
        {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA 成功后自动触发登录流程
            handleSendVerificationCode(); // 自动调用发送验证码函数
          },
        }
      );
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear(); // 清除旧实例
      }
    };
  }, []);

  const handleSendVerificationCode = async () => {
    setLoading(true);
    setError('');

    try {
      const appVerifier = window.recaptchaVerifier;

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);

      setVerificationId(confirmation.verificationId);
    } catch (err: any) {
      console.error('发送验证码失败:', err);
      setError(t('phone.sendCodeError'));
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code || !verificationId) return;
  
    setLoading(true);
    try {
      // 用 verificationId 和 用户输入的 code 构造凭证
      const credential = PhoneAuthProvider.credential(verificationId, code);
  
      // 用凭证登录
      await signInWithCredential(auth, credential);
  
      router.push('/game'); // 登录成功跳转
    } catch (err) {
      setError(t('phone.verifyCodeError'));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">{t('phone.title')}</h2>

        {!verificationId ? (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  {t('phone.number')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={t('phone.placeholder')}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                id="sign-in-button" // ← 必须和 RecaptchaVerifier 的容器一致
                onClick={handleSendVerificationCode}
                disabled={loading}
                className={`w-full py-2 rounded transition-colors duration-200 ${
                  loading
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {loading ? t('phone.sending') : t('phone.sendCode')}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label htmlFor="code" className="block text-gray-700 mb-2">
                  {t('phone.verificationCode')}
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder={t('phone.codePlaceholder')}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                onClick={verifyCode}
                disabled={loading}
                className={`w-full py-2 rounded transition-colors duration-200 ${
                  loading
                    ? 'bg-green-300 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {loading ? t('phone.verifying') : t('phone.verify')}
              </button>
            </div>
          </>
        )}

        {/* 隐藏的 reCAPTCHA 容器 */}
        <div id="recaptcha-container" style={{ display: 'none' }}></div>
      </div>
    </main>
  );
}