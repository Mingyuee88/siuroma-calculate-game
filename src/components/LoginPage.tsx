"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { FormEvent } from "react"
import { auth, signInWithEmailAndPassword, signInWithGoogle, sendPasswordResetEmail } from "../firebase"
import { GoogleAuthProvider } from "firebase/auth"
import { useTranslation } from "react-i18next"
import { Globe, Mail, Lock, Phone, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { t, i18n } = useTranslation()
  const router = useRouter()
  const [error, setError] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const emailInputRef = useRef<HTMLInputElement>(null)
  const langDropdownRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "简体中文" },
    { code: "zh-TW", name: "繁體中文" },
  ]

  // 点击外部关闭语言下拉菜单
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsLangOpen(false)
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const target = e.target as typeof e.target & {
      username: { value: string }
      password: { value: string }
    }

    const email = target.username.value
    const password = target.password.value

    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/game")
    } catch (err: any) {
      console.error("登录失败:", err)
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setError(t("login.error.invalidCredentials"))
      } else {
        setError(t("login.error.general"))
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: "select_account" })
      await signInWithGoogle()
      router.push("/game")
    } catch (err: any) {
      console.error("Google 登录失败:", err)
      setError(t("login.error.general"))
    }
  }

  const handleForgotPassword = async () => {
    const email = emailInputRef.current?.value.trim()

    if (!email) {
      setError(t("login.error.emailRequired"))
      return
    }

    try {
      await sendPasswordResetEmail(auth, email)
      alert(t("login.passwordResetSent"))
    } catch (err: any) {
      console.error("发送重置邮件失败:", err)
      setError(t("login.error.resetFailed"))
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-60 h-60 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* 语言切换器 */}
      <div className="absolute top-6 right-6 z-50" ref={langDropdownRef}>
        <button
          onClick={() => setIsLangOpen(!isLangOpen)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white/90 transition-all duration-200 font-gensen border border-white/20"
        >
          <Globe size={18} className="text-indigo-600" />
          <span className="font-medium text-gray-700 text-sm">
            {languages.find((lang) => lang.code === i18n.language)?.name || "English"}
          </span>
        </button>

        {isLangOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl py-2 z-50 border border-white/20">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors font-gensen text-sm ${
                  i18n.language === lang.code ? "text-indigo-600 font-semibold bg-indigo-50" : "text-gray-700"
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2 font-gensen">{t("login.title")}</h2>
          <p className="text-gray-600 text-sm">{"Welcome back! Please sign in to continue"}</p>
        </div>

        {/* Email 登录表单 */}
        <form onSubmit={handleLogin} className="space-y-6 font-gensen">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-gray-700 mb-2 font-medium text-sm">
                {t("login.email")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  id="username"
                  name="username"
                  ref={emailInputRef}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  placeholder={t("login.email")}
                  required
                />
              </div>
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline focus:outline-none transition-colors"
                >
                  {t("login.forgotPassword")}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2 font-medium text-sm">
                {t("login.password")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50/50"
                  placeholder={t("login.password")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl transition-all duration-200 font-semibold text-white shadow-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {t("login.loading")}
              </div>
            ) : (
              t("login.emailLogin")
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-sm text-gray-500 bg-white">{"or continue with"}</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          {/* Google 登录按钮 */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 py-3 px-4 rounded-xl transition-all duration-200 font-medium font-gensen hover:shadow-md"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
              <path
                fill="#EA4335"
                d="M24 9.5c3.04 0 5.66 1.13 7.53 3.05l5.66-5.66C33.22 3.44 28.00 1 24 1 14.67 1 6.63 6.82 2.81 15.38l6.61 5.13C12.27 13.34 17.77 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.19l7.73 6c4.51-4.18 7.49-10.36 7.49-17.42z"
              />
              <path
                fill="#FBBC05"
                d="M10.56 28.02c-.14-.44-.25-.9-.25-1.52 0-.62.11-1.08.25-1.52L2.81 19.5C1.21 22.68 1 24.34 1 24.55c0 .21.19.83 2.81 3.45l7.75-6.43z"
              />
              <path
                fill="#34A853"
                d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.58-4.18-13.46-9.69l-7.75 6.43C6.63 41.18 14.67 47 24 48z"
              />
              <path fill="none" d="M1 1h46v46H1z" />
            </svg>
            {t("login.googleLogin")}
          </button>

          {/* 手机号登录按钮 */}
          <button
            onClick={() => router.push("/phonelogin")}
            className="w-full flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium font-gensen shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Phone className="w-5 h-5" />
            {t("login.phoneLogin")}
          </button>
        </div>

        {/* 注册跳转按钮 */}
        <div className="mt-8 text-center font-gensen">
          <p className="text-sm text-gray-600 mb-3">{t("login.noAccount")}</p>
          <button
            onClick={() => router.push("/register")}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold hover:underline transition-colors"
          >
            {t("login.register")}
          </button>
        </div>
      </div>
    </main>
  )
}
