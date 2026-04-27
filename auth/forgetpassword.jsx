import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authstores'
import { LANGUAGES } from '../../config/constant'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Card from '../../components/common/Card'
import { 
  EnvelopeIcon, 
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ShieldCheckIcon,
  PhoneIcon,
  KeyIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [step, setStep] = useState(1) // 1: email, 2: verification, 3: new password, 4: success
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [method, setMethod] = useState('email') // email or phone
  const [language, setLanguage] = useState('ta')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [passwordStrength, setPasswordStrength] = useState(0)
  
  const { resetPassword, verifyCode, updatePassword } = useAuthStore()

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      toast.error(language === 'ta' ? 'மின்னஞ்சலை உள்ளிடவும்' : 'Please enter your email')
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In real app, this would call your backend
      // await resetPassword({ email })
      
      setStep(2)
      startCountdown()
      toast.success(language === 'ta' 
        ? ' verification code sent to your email' 
        : 'Verification code sent to your email')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle phone submission
  const handlePhoneSubmit = async (e) => {
    e.preventDefault()
    
    if (!phone || !/^\d{10}$/.test(phone)) {
      toast.error(language === 'ta' 
        ? 'சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்' 
        : 'Please enter valid 10-digit phone number')
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setStep(2)
      startCountdown()
      toast.success(language === 'ta' 
        ? 'உறுதிப்படுத்தல் குறியீடு உங்கள் தொலைபேசிக்கு அனுப்பப்பட்டது' 
        : 'Verification code sent to your phone')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle verification
  const handleVerify = async (e) => {
    e.preventDefault()
    
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error(language === 'ta' 
        ? '6 இலக்க உறுதிப்படுத்தல் குறியீட்டை உள்ளிடவும்' 
        : 'Please enter 6-digit verification code')
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In real app, this would verify the code
      // await verifyCode({ email, code: verificationCode })
      
      setStep(3)
      toast.success(language === 'ta' 
        ? 'குறியீடு சரிபார்க்கப்பட்டது' 
        : 'Code verified successfully')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault()
    
    // Validate passwords
    if (!newPassword || !confirmPassword) {
      toast.error(language === 'ta' 
        ? 'கடவுச்சொல்லை உள்ளிடவும்' 
        : 'Please enter password')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error(language === 'ta' 
        ? 'கடவுச்சொற்கள் பொருந்தவில்லை' 
        : 'Passwords do not match')
      return
    }

    if (passwordStrength < 3) {
      toast.error(language === 'ta' 
        ? 'வலுவான கடவுச்சொல்லை உள்ளிடவும்' 
        : 'Please enter a stronger password')
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // In real app, this would update the password
      // await updatePassword({ email, newPassword })
      
      setStep(4)
      toast.success(language === 'ta' 
        ? 'கடவுச்சொல் வெற்றிகரமாக மீட்டமைக்கப்பட்டது' 
        : 'Password reset successfully')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Start countdown for resend
  const startCountdown = () => {
    setCountdown(60)
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle resend code
  const handleResend = async () => {
    if (countdown > 0) return
    
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      startCountdown()
      toast.success(language === 'ta' 
        ? 'புதிய குறியீடு அனுப்பப்பட்டது' 
        : 'New code sent')
    } finally {
      setLoading(false)
    }
  }

  // Calculate password strength
  const calculateStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.match(/[a-z]/)) strength++
    if (password.match(/[A-Z]/)) strength++
    if (password.match(/[0-9]/)) strength++
    if (password.match(/[^a-zA-Z0-9]/)) strength++
    setPasswordStrength(strength)
  }

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value)
    calculateStrength(e.target.value)
  }

  const getStrengthColor = () => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-600']
    return colors[passwordStrength - 1] || 'bg-gray-200'
  }

  const getStrengthText = () => {
    const texts = [
      language === 'ta' ? 'மிகவும் பலவீனம்' : 'Very Weak',
      language === 'ta' ? 'பலவீனம்' : 'Weak',
      language === 'ta' ? 'சராசரி' : 'Average',
      language === 'ta' ? 'நல்லது' : 'Good',
      language === 'ta' ? 'வலுவானது' : 'Strong'
    ]
    return texts[passwordStrength - 1] || ''
  }

  // Render step 1: Email/Phone input
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Method Selection */}
      <div className="flex gap-3">
        <button
          onClick={() => setMethod('email')}
          className={`flex-1 p-3 rounded-lg border-2 transition-all ${
            method === 'email'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300'
          }`}
        >
          <EnvelopeIcon className={`w-5 h-5 mx-auto mb-2 ${
            method === 'email' ? 'text-primary-600' : 'text-gray-500'
          }`} />
          <span className="text-sm">Email</span>
        </button>
        
        <button
          onClick={() => setMethod('phone')}
          className={`flex-1 p-3 rounded-lg border-2 transition-all ${
            method === 'phone'
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-primary-300'
          }`}
        >
          <PhoneIcon className={`w-5 h-5 mx-auto mb-2 ${
            method === 'phone' ? 'text-primary-600' : 'text-gray-500'
          }`} />
          <span className="text-sm">Phone</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={method === 'email' ? handleEmailSubmit : handlePhoneSubmit}>
        {method === 'email' ? (
          <Input
            label={language === 'ta' ? 'மின்னஞ்சல்' : 'Email Address'}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<EnvelopeIcon className="w-5 h-5" />}
            placeholder="Enter your registered email"
            required
          />
        ) : (
          <Input
            label={language === 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={<PhoneIcon className="w-5 h-5" />}
            placeholder="10-digit mobile number"
            required
            pattern="[0-9]{10}"
          />
        )}

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          loading={loading}
        >
          {language === 'ta' ? 'உறுதிப்படுத்தல் குறியீடு அனுப்பு' : 'Send Verification Code'}
        </Button>
      </form>

      {/* Back to Login */}
      <div className="text-center">
        <Link 
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          {language === 'ta' ? 'மீண்டும் நுழைவுப் பக்கத்திற்கு' : 'Back to Login'}
        </Link>
      </div>
    </div>
  )

  // Render step 2: Verification code
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {language === 'ta' ? 'உறுதிப்படுத்தல் குறியீடு' : 'Verification Code'}
        </h3>
        <p className="text-sm text-gray-600">
          {language === 'ta' 
            ? `உங்கள் ${method === 'email' ? 'மின்னஞ்சலுக்கு' : 'தொலைபேசிக்கு'} 6 இலக்க குறியீடு அனுப்பப்பட்டுள்ளது` 
            : `A 6-digit code has been sent to your ${method === 'email' ? 'email' : 'phone'}`}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {method === 'email' ? email : phone}
        </p>
      </div>

      <form onSubmit={handleVerify}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {language === 'ta' ? 'உறுதிப்படுத்தல் குறியீடு' : 'Verification Code'}
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="w-full text-center text-2xl tracking-[0.5em] px-4 py-4 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none font-mono"
            placeholder="••••••"
            maxLength="6"
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          loading={loading}
        >
          {language === 'ta' ? 'சரிபார்க்கவும்' : 'Verify'}
        </Button>
      </form>

      {/* Resend Code */}
      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={countdown > 0 || loading}
          className={`text-sm ${
            countdown > 0 
              ? 'text-gray-400 cursor-not-allowed' 
              : 'text-primary-600 hover:text-primary-700'
          }`}
        >
          {countdown > 0 
            ? `${language === 'ta' ? 'மீண்டும் அனுப்ப' : 'Resend'} (${countdown}s)` 
            : language === 'ta' ? 'குறியீடு மீண்டும் அனுப்பவும்' : 'Resend Code'}
        </button>
      </div>
    </div>
  )

  // Render step 3: New password
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <KeyIcon className="w-8 h-8 text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {language === 'ta' ? 'புதிய கடவுச்சொல்' : 'New Password'}
        </h3>
        <p className="text-sm text-gray-600">
          {language === 'ta' 
            ? 'உங்கள் புதிய கடவுச்சொல்லை உள்ளிடவும்' 
            : 'Enter your new password'}
        </p>
      </div>

      <form onSubmit={handlePasswordReset}>
        <div className="space-y-4">
          <Input
            label={language === 'ta' ? 'புதிய கடவுச்சொல்' : 'New Password'}
            type="password"
            value={newPassword}
            onChange={handlePasswordChange}
            icon={<KeyIcon className="w-5 h-5" />}
            required
          />

          {/* Password Strength Meter */}
          {newPassword && (
            <div className="space-y-2">
              <div className="flex gap-1 h-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-full transition-all ${
                      i < passwordStrength ? getStrengthColor() : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-600">
                {language === 'ta' ? 'கடவுச்சொல் பலம்:' : 'Password strength:'} {getStrengthText()}
              </p>
            </div>
          )}

          <Input
            label={language === 'ta' ? 'கடவுச்சொல்லை உறுதிப்படுத்தவும்' : 'Confirm Password'}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<CheckCircleIcon className="w-5 h-5" />}
            required
          />

          {/* Password requirements */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">
              {language === 'ta' ? 'கடவுச்சொல் தேவைகள்:' : 'Password requirements:'}
            </p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${newPassword?.length >= 8 ? 'bg-success' : 'bg-gray-300'}`} />
                {language === 'ta' ? 'குறைந்தது 8 எழுத்துகள்' : 'At least 8 characters'}
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${/[a-z]/.test(newPassword) ? 'bg-success' : 'bg-gray-300'}`} />
                {language === 'ta' ? 'ஒரு சிறிய எழுத்து' : 'One lowercase letter'}
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(newPassword) ? 'bg-success' : 'bg-gray-300'}`} />
                {language === 'ta' ? 'ஒரு பெரிய எழுத்து' : 'One uppercase letter'}
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(newPassword) ? 'bg-success' : 'bg-gray-300'}`} />
                {language === 'ta' ? 'ஒரு எண்' : 'One number'}
              </li>
              <li className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${/[^a-zA-Z0-9]/.test(newPassword) ? 'bg-success' : 'bg-gray-300'}`} />
                {language === 'ta' ? 'ஒரு சிறப்பு எழுத்து' : 'One special character'}
              </li>
            </ul>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          loading={loading}
        >
          {language === 'ta' ? 'கடவுச்சொல்லை மீட்டமைக்கவும்' : 'Reset Password'}
        </Button>
      </form>
    </div>
  )

  // Render step 4: Success
  const renderStep4 = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-success/10 rounded-full mx-auto flex items-center justify-center animate-bounce">
        <CheckCircleIcon className="w-10 h-10 text-success" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {language === 'ta' ? 'கடவுச்சொல் மீட்டமைக்கப்பட்டது!' : 'Password Reset Successful!'}
        </h3>
        <p className="text-gray-600">
          {language === 'ta' 
            ? 'உங்கள் கடவுச்சொல் வெற்றிகரமாக மீட்டமைக்கப்பட்டது. இப்போது புதிய கடவுச்சொல்லுடன் உள்நுழையலாம்.' 
            : 'Your password has been reset successfully. You can now login with your new password.'}
        </p>
      </div>

      <Link to="/login">
        <Button variant="primary" className="w-full">
          {language === 'ta' ? 'நுழைவுப் பக்கத்திற்குச் செல்லவும்' : 'Go to Login'}
        </Button>
      </Link>
    </div>
  )

  return (
    <Card className="w-full max-w-md mx-auto">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
          <span className="text-white text-2xl font-bold">S</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">
          {language === 'ta' ? 'கடவுச்சொல் மறந்தேன்' : 'Forgot Password'}
        </h1>
        <p className="text-gray-600 mt-1">
          {language === 'ta' 
            ? 'உங்கள் கணக்கை மீட்டமைக்க கீழே உள்ள படிகளைப் பின்பற்றவும்' 
            : 'Follow the steps below to reset your account'}
        </p>
      </div>

      {/* Language Selector */}
      <div className="mb-6">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
        >
          {LANGUAGES.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= s 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 text-gray-500'
            }`}>
              {step > s ? <CheckCircleIcon className="w-4 h-4" /> : s}
            </div>
            {s < 4 && (
              <div className={`w-12 h-1 mx-1 ${
                step > s ? 'bg-primary-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
    </Card>
  )
}

export default ForgotPassword
