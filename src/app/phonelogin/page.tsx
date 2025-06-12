'use client';

import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../../firebase';
import { useTranslation } from 'react-i18next';
import { CountryCodeSelect } from '@/components/UI/CountryCodeSelect';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    grecaptcha?: any;
  }
}

export default function PhoneLogin() {
  const { t } = useTranslation();
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('+86');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  // Clear error when switching between phone input and verification code screens
  useEffect(() => {
    setError('');
  }, [verificationId]);

  // 初始化不可见 reCAPTCHA
  useEffect(() => {
    const initializeRecaptcha = () => {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          'sign-in-button',
          {
            size: 'invisible',
          }
        );
      }
    };

    // 组件挂载时初始化
    initializeRecaptcha();

    // 组件卸载时清理
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
        recaptchaVerifierRef.current = null;
      }
    };
  }, []);

  const handleSendVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      setError(t('phone.numberRequired'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 获取当前的 reCAPTCHA 实例
      const appVerifier = recaptchaVerifierRef.current;
      if (!appVerifier) {
        throw new Error('reCAPTCHA not initialized');
      }

      const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/^0+/, '')}`;
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      setVerificationId(confirmation.verificationId);
      setError('');
    } catch (err: any) {
      console.error('发送验证码失败:', err);
      setError(t('phone.sendCodeError'));

      // 如果发生错误，重新初始化 reCAPTCHA
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear();
        } catch (error) {
          console.error('Error clearing reCAPTCHA:', error);
        }
        recaptchaVerifierRef.current = null;
      }

      // 创建新的 reCAPTCHA 实例
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        'sign-in-button',
        {
          size: 'invisible',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code || !verificationId) return;
  
    setLoading(true);
    setError('');

    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      router.push('/game');
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
                <div className="flex gap-2">
                  <div className="w-32">
                    <CountryCodeSelect
                      selectedCode={countryCode}
                      onSelect={setCountryCode}
                    />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder={t('phone.numberPlaceholder')}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                id="sign-in-button"
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
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
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

        <div id="recaptcha-container" style={{ display: 'none' }}></div>
      </div>
    </main>
  );
}