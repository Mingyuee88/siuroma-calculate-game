"use client"

import { PhoneAuthProvider, signInWithCredential, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase"
import { useTranslation } from "react-i18next"
import { CountryCodeSelect } from "@/components/UI/CountryCodeSelect"
import { Phone, MessageSquare, ArrowLeft, Shield } from "lucide-react"

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier
    grecaptcha?: any
  }
}

export default function PhoneLogin() {
  const { t } = useTranslation()
  const router = useRouter()
  const [countryCode, setCountryCode] = useState("+86")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [verificationId, setVerificationId] = useState<string | null>(null)
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

  // Clear error when switching between phone input and verification code screens
  useEffect(() => {
    setError("")
  }, [verificationId])

  // 初始化不可见 reCAPTCHA
  useEffect(() => {
    const initializeRecaptcha = () => {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "sign-in-button", {
          size: "invisible",
        })
      }
    }

    // 组件挂载时初始化
    initializeRecaptcha()

    // 组件卸载时清理
    return () => {
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear()
        } catch (error) {
          console.error("Error clearing reCAPTCHA:", error)
        }
        recaptchaVerifierRef.current = null
      }
    }
  }, [])

  const handleSendVerificationCode = async () => {
    if (!phoneNumber.trim()) {
      setError(t("phone.numberRequired"))
      return
    }

    setLoading(true)
    setError("")

    try {
      // 获取当前的 reCAPTCHA 实例
      const appVerifier = recaptchaVerifierRef.current
      if (!appVerifier) {
        throw new Error("reCAPTCHA not initialized")
      }

      const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/^0+/, "")}`
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier)
      setVerificationId(confirmation.verificationId)
      setError("")
    } catch (err: any) {
      console.error("发送验证码失败:", err)
      setError(t("phone.sendCodeError"))

      // 如果发生错误，重新初始化 reCAPTCHA
      if (recaptchaVerifierRef.current) {
        try {
          recaptchaVerifierRef.current.clear()
        } catch (error) {
          console.error("Error clearing reCAPTCHA:", error)
        }
        recaptchaVerifierRef.current = null
      }

      // 创建新的 reCAPTCHA 实例
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, "sign-in-button", {
        size: "invisible",
      })
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    if (!code || !verificationId) return

    setLoading(true)
    setError("")

    try {
      const credential = PhoneAuthProvider.credential(verificationId, code)
      await signInWithCredential(auth, credential)
      router.push("/game")
    } catch (err) {
      setError(t("phone.verifyCodeError"))
    } finally {
      setLoading(false)
    }
  }

  const handleBackToPhone = () => {
    setVerificationId(null)
    setCode("")
    setError("")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            {!verificationId ? (
              <Phone className="w-8 h-8 text-white" />
            ) : (
              <MessageSquare className="w-8 h-8 text-white" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{t("phone.title")}</h2>
          <p className="text-gray-600 text-sm">
            {!verificationId
              ? "Enter your phone number to receive a verification code"
              : "Enter the 6-digit code sent to your phone"}
          </p>
        </div>

        {!verificationId ? (
          <>
            <div className="space-y-6">
              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2 font-medium text-sm">
                  {t("phone.number")}
                </label>
                <div className="flex gap-3">
                  <div className="w-32">
                    <CountryCodeSelect selectedCode={countryCode} onSelect={setCountryCode} />
                  </div>
                  <div className="flex-1 relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      id="phone"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                      placeholder={t("phone.numberPlaceholder")}
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                id="sign-in-button"
                onClick={handleSendVerificationCode}
                disabled={loading}
                className={`w-full py-3 rounded-xl transition-all duration-200 font-semibold text-white shadow-lg ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("phone.sending")}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    {t("phone.sendCode")}
                  </div>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Back button */}
            <button
              onClick={handleBackToPhone}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to phone number</span>
            </button>

            <div className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-gray-700 mb-2 font-medium text-sm">
                  {t("phone.verificationCode")}
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 text-center text-lg font-mono tracking-widest"
                    placeholder={t("phone.codePlaceholder")}
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  {"Sent to"} {countryCode} {phoneNumber}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <button
                onClick={verifyCode}
                disabled={loading || code.length !== 6}
                className={`w-full py-3 rounded-xl transition-all duration-200 font-semibold text-white shadow-lg ${
                  loading || code.length !== 6
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl transform hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {t("phone.verifying")}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="w-5 h-5" />
                    {t("phone.verify")}
                  </div>
                )}
              </button>

              {/* Resend code option */}
              <div className="text-center">
                <button
                  onClick={handleBackToPhone}
                  className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
                >
                  {"Didn't receive code? Try again"}
                </button>
              </div>
            </div>
          </>
        )}

        <div id="recaptcha-container" style={{ display: "none" }}></div>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500 bg-white">{t("phone.otherLoginMethods")}</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Back to login button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-xl transition-all duration-200 font-medium hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("phone.backToLogin")}
          </button>
        </div>
      </div>
    </main>
  )
}
