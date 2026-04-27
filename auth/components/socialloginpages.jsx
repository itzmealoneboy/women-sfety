import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../store/authstores'
import Button from '../../../components/common/Button'
import { 
  FingerPrintIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { 
  FcGoogle,
  FcGoogle as FcGoogleIcon 
} from 'react-icons/fc'
import { 
  FaFacebook, 
  FaTwitter, 
  FaGithub, 
  FaApple, 
  FaMicrosoft,
  FaLinkedin,
  FaWhatsapp,
  FaTelegram,
  FaInstagram,
  FaSnapchat,
  FaDiscord,
  FaTiktok
} from 'react-icons/fa'
import { 
  SiGmail, 
  SiYahoo, 
  SiOutlook,
  SiProtonmail,
  SiLine,
  SiKakaotalk,
  SiWechat,
  SiSignal,
  SiThreema,
  SiWire
} from 'react-icons/si'
import { MdSms, MdQrCodeScanner } from 'react-icons/md'
import { RiGovernmentFill, RiBankFill } from 'react-icons/ri'
import { BiFingerprint } from 'react-icons/bi'
import toast from 'react-hot-toast'

const SocialLogin = ({ language = 'en', onSuccess, onError }) => {
  const [loading, setLoading] = useState(null)
  const [showMore, setShowMore] = useState(false)
  const [qrData, setQrData] = useState(null)
  const [showQR, setShowQR] = useState(false)
  
  const { googleLogin, facebookLogin, twitterLogin, githubLogin, appleLogin, microsoftLogin } = useAuthStore()
  const navigate = useNavigate()

  // Popular social providers
  const popularProviders = [
    { 
      id: 'google', 
      name: 'Google', 
      icon: FcGoogle, 
      bg: 'bg-white', 
      text: 'text-gray-700',
      border: true,
      action: handleGoogleLogin
    },
    { 
      id: 'facebook', 
      name: 'Facebook', 
      icon: FaFacebook, 
      bg: 'bg-[#1877f2]', 
      text: 'text-white',
      action: handleFacebookLogin
    },
    { 
      id: 'apple', 
      name: 'Apple', 
      icon: FaApple, 
      bg: 'bg-black', 
      text: 'text-white',
      action: handleAppleLogin
    },
    { 
      id: 'twitter', 
      name: 'Twitter', 
      icon: FaTwitter, 
      bg: 'bg-[#1DA1F2]', 
      text: 'text-white',
      action: handleTwitterLogin
    },
    { 
      id: 'microsoft', 
      name: 'Microsoft', 
      icon: FaMicrosoft, 
      bg: 'bg-[#00a4ef]', 
      text: 'text-white',
      action: handleMicrosoftLogin
    },
    { 
      id: 'github', 
      name: 'GitHub', 
      icon: FaGithub, 
      bg: 'bg-[#171515]', 
      text: 'text-white',
      action: handleGithubLogin
    }
  ]

  // Email providers
  const emailProviders = [
    { id: 'gmail', name: 'Gmail', icon: SiGmail, bg: 'bg-[#EA4335]', text: 'text-white' },
    { id: 'outlook', name: 'Outlook', icon: SiOutlook, bg: 'bg-[#0078D4]', text: 'text-white' },
    { id: 'yahoo', name: 'Yahoo', icon: SiYahoo, bg: 'bg-[#6001D2]', text: 'text-white' },
    { id: 'proton', name: 'ProtonMail', icon: SiProtonmail, bg: 'bg-[#6d4aff]', text: 'text-white' }
  ]

  // Messaging apps
  const messagingProviders = [
    { id: 'whatsapp', name: 'WhatsApp', icon: FaWhatsapp, bg: 'bg-[#25D366]', text: 'text-white' },
    { id: 'telegram', name: 'Telegram', icon: FaTelegram, bg: 'bg-[#0088cc]', text: 'text-white' },
    { id: 'signal', name: 'Signal', icon: SiSignal, bg: 'bg-[#3b76e0]', text: 'text-white' },
    { id: 'wechat', name: 'WeChat', icon: SiWechat, bg: 'bg-[#7BB32E]', text: 'text-white' },
    { id: 'line', name: 'LINE', icon: SiLine, bg: 'bg-[#00c300]', text: 'text-white' },
    { id: 'discord', name: 'Discord', icon: FaDiscord, bg: 'bg-[#5865F2]', text: 'text-white' }
  ]

  // Social media
  const socialProviders = [
    { id: 'instagram', name: 'Instagram', icon: FaInstagram, bg: 'bg-[#E4405F]', text: 'text-white' },
    { id: 'snapchat', name: 'Snapchat', icon: FaSnapchat, bg: 'bg-[#FFFC00]', text: 'text-black' },
    { id: 'tiktok', name: 'TikTok', icon: FaTiktok, bg: 'bg-black', text: 'text-white' },
    { id: 'linkedin', name: 'LinkedIn', icon: FaLinkedin, bg: 'bg-[#0A66C2]', text: 'text-white' }
  ]

  // Government/Enterprise
  const enterpriseProviders = [
    { id: 'gov', name: 'Government e-Services', icon: RiGovernmentFill, bg: 'bg-[#138808]', text: 'text-white' },
    { id: 'bank', name: 'Bank Login', icon: RiBankFill, bg: 'bg-[#4B0082]', text: 'text-white' },
    { id: 'aadhaar', name: 'Aadhaar', icon: FingerPrintIcon, bg: 'bg-[#FF9933]', text: 'text-white' },
    { id: 'digilocker', name: 'DigiLocker', icon: DevicePhoneMobileIcon, bg: 'bg-[#1E88E5]', text: 'text-white' }
  ]

  // Alternative methods
  const alternativeMethods = [
    { id: 'sms', name: 'SMS OTP', icon: MdSms, bg: 'bg-[#4CAF50]', text: 'text-white' },
    { id: 'qr', name: 'QR Code', icon: MdQrCodeScanner, bg: 'bg-[#9C27B0]', text: 'text-white' },
    { id: 'biometric', name: 'Biometric', icon: BiFingerprint, bg: 'bg-[#FF5722]', text: 'text-white' },
    { id: 'email', name: 'Email OTP', icon: EnvelopeIcon, bg: 'bg-[#2196F3]', text: 'text-white' }
  ]

  // Handlers for each provider
  async function handleGoogleLogin() {
    setLoading('google')
    try {
      const result = await googleLogin()
      if (result.success) {
        toast.success(getMessage('loginSuccess', 'Google'))
        onSuccess?.(result)
        navigate('/dashboard')
      } else {
        toast.error(result.error || getMessage('loginError'))
        onError?.(result.error)
      }
    } catch (error) {
      toast.error(error.message)
      onError?.(error)
    } finally {
      setLoading(null)
    }
  }

  async function handleFacebookLogin() {
    setLoading('facebook')
    try {
      // Simulate Facebook login
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(getMessage('loginSuccess', 'Facebook'))
      onSuccess?.()
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message)
      onError?.(error)
    } finally {
      setLoading(null)
    }
  }

  async function handleAppleLogin() {
    setLoading('apple')
    try {
      // Simulate Apple login
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(getMessage('loginSuccess', 'Apple'))
      onSuccess?.()
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message)
      onError?.(error)
    } finally {
      setLoading(null)
    }
  }

  async function handleTwitterLogin() {
    setLoading('twitter')
    try {
      // Simulate Twitter login
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(getMessage('loginSuccess', 'Twitter'))
      onSuccess?.()
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message)
      onError?.(error)
    } finally {
      setLoading(null)
    }
  }

  async function handleMicrosoftLogin() {
    setLoading('microsoft')
    try {
      // Simulate Microsoft login
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(getMessage('loginSuccess', 'Microsoft'))
      onSuccess?.()
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message)
      onError?.(error)
    } finally {
      setLoading(null)
    }
  }

  async function handleGithubLogin() {
    setLoading('github')
    try {
      // Simulate GitHub login
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(getMessage('loginSuccess', 'GitHub'))
      onSuccess?.()
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.message)
      onError?.(error)
    } finally {
      setLoading(null)
    }
  }

  async function handleProviderLogin(provider) {
    setLoading(provider.id)
    try {
      // Simulate provider login
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show different messages based on provider
      if (provider.id === 'aadhaar') {
        toast.success(getMessage('aadhaarSuccess'))
      } else if (provider.id === 'qr') {
        generateQRCode()
        setShowQR(true)
        return
      } else {
        toast.success(getMessage('loginSuccess', provider.name))
      }
      
      onSuccess?.()
      if (!['qr', 'sms', 'biometric', 'email'].includes(provider.id)) {
        navigate('/dashboard')
      }
    } catch (error) {
      toast.error(error.message)
      onError?.(error)
    } finally {
      setLoading(null)
    }
  }

  // Generate QR code for login
  const generateQRCode = () => {
    const qrData = {
      sessionId: 'sess_' + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      expiresIn: 300 // 5 minutes
    }
    setQrData(JSON.stringify(qrData))
  }

  // Get localized messages
  const getMessage = (key, provider = '') => {
    const messages = {
      en: {
        loginSuccess: `✅ Successfully logged in with ${provider}`,
        loginError: '❌ Login failed. Please try again.',
        aadhaarSuccess: '✅ Aadhaar authentication successful! Redirecting...',
        qrInstruction: 'Scan this QR code with your mobile app',
        or: 'OR',
        moreOptions: 'More Options',
        showLess: 'Show Less',
        continueWith: 'Continue with',
        enterpriseLogin: 'Government & Enterprise Login',
        alternativeMethods: 'Alternative Methods'
      },
      ta: {
        loginSuccess: `✅ ${provider} மூலம் வெற்றிகரமாக உள்நுழைந்தீர்கள்`,
        loginError: '❌ உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.',
        aadhaarSuccess: '✅ ஆதார் அங்கீகாரம் வெற்றி! திருப்பிவிடப்படுகிறது...',
        qrInstruction: 'உங்கள் மொபைல் பயன்பாட்டில் இந்த QR குறியீட்டை ஸ்கேன் செய்யவும்',
        or: 'அல்லது',
        moreOptions: 'மேலும் விருப்பங்கள்',
        showLess: 'குறைவாக காட்டு',
        continueWith: 'இதன் மூலம் தொடரவும்',
        enterpriseLogin: 'அரசு & நிறுவன உள்நுழைவு',
        alternativeMethods: 'மாற்று முறைகள்'
      },
      hi: {
        loginSuccess: `✅ ${provider} के साथ सफलतापूर्वक लॉगिन किया`,
        loginError: '❌ लॉगिन विफल। कृपया पुनः प्रयास करें।',
        aadhaarSuccess: '✅ आधार प्रमाणीकरण सफल! पुनर्निर्देशित किया जा रहा है...',
        qrInstruction: 'अपने मोबाइल ऐप से इस QR कोड को स्कैन करें',
        or: 'या',
        moreOptions: 'अधिक विकल्प',
        showLess: 'कम दिखाएं',
        continueWith: 'के साथ जारी रखें',
        enterpriseLogin: 'सरकारी और उद्यम लॉगिन',
        alternativeMethods: 'वैकल्पिक तरीके'
      }
    }
    return messages[language]?.[key] || messages.en[key]
  }

  // Render provider button
  const ProviderButton = ({ provider, loading: isLoading }) => {
    const Icon = provider.icon
    const isGoogle = provider.id === 'google'
    
    return (
      <button
        key={provider.id}
        onClick={() => provider.action ? provider.action() : handleProviderLogin(provider)}
        disabled={isLoading === provider.id}
        className={`relative group flex items-center justify-center p-3 rounded-lg transition-all duration-300 ${
          provider.border ? 'border-2 border-gray-200 hover:border-primary-300' : ''
        } ${provider.bg} ${provider.text} ${
          isLoading === provider.id ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-1'
        }`}
        title={provider.name}
      >
        {isLoading === provider.id ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Icon className={`w-5 h-5 ${isGoogle ? 'text-black' : ''}`} />
            <span className="ml-2 text-sm font-medium hidden sm:inline">{provider.name}</span>
          </>
        )}
        
        {/* Tooltip for mobile */}
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap sm:hidden">
          {provider.name}
        </span>
      </button>
    )
  }

  // QR Code Modal
  const QRModal = () => {
    if (!showQR) return null
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 max-w-sm w-full">
          <h3 className="text-lg font-semibold mb-4 text-center">
            {language === 'ta' ? 'QR குறியீடு மூலம் உள்நுழையவும்' : 'Login with QR Code'}
          </h3>
          
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            {qrData ? (
              <div className="text-center">
                {/* In real app, generate actual QR code */}
                <div className="w-48 h-48 mx-auto bg-white p-2 rounded-lg shadow-inner">
                  <div className="w-full h-full bg-gray-300 animate-pulse rounded flex items-center justify-center">
                    <MdQrCodeScanner className="w-12 h-12 text-gray-500" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {getMessage('qrInstruction')}
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Generating QR code...</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowQR(false)}
              className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {language === 'ta' ? 'மூடு' : 'Close'}
            </button>
            <button
              onClick={generateQRCode}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              {language === 'ta' ? 'புதுப்பி' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            {getMessage('or')}
          </span>
        </div>
      </div>

      {/* Popular Providers */}
      <div>
        <p className="text-xs text-gray-500 mb-3 text-center">
          {getMessage('continueWith')}
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {popularProviders.map(provider => (
            <ProviderButton key={provider.id} provider={provider} loading={loading} />
          ))}
        </div>
      </div>

      {/* More Options Toggle */}
      {showMore && (
        <div className="space-y-4 animate-fadeIn">
          {/* Email Providers */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Email</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {emailProviders.map(provider => (
                <ProviderButton key={provider.id} provider={provider} loading={loading} />
              ))}
            </div>
          </div>

          {/* Messaging Apps */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Messaging</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {messagingProviders.map(provider => (
                <ProviderButton key={provider.id} provider={provider} loading={loading} />
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Social Media</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {socialProviders.map(provider => (
                <ProviderButton key={provider.id} provider={provider} loading={loading} />
              ))}
            </div>
          </div>

          {/* Government & Enterprise */}
          <div>
            <p className="text-xs text-gray-500 mb-2">{getMessage('enterpriseLogin')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {enterpriseProviders.map(provider => (
                <ProviderButton key={provider.id} provider={provider} loading={loading} />
              ))}
            </div>
          </div>

          {/* Alternative Methods */}
          <div>
            <p className="text-xs text-gray-500 mb-2">{getMessage('alternativeMethods')}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {alternativeMethods.map(provider => (
                <ProviderButton key={provider.id} provider={provider} loading={loading} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Show More/Less Button */}
      <div className="text-center">
        <button
          onClick={() => setShowMore(!showMore)}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          {showMore 
            ? (language === 'ta' ? 'குறைவாக காட்டு ↑' : 'Show Less ↑')
            : (language === 'ta' ? 'மேலும் விருப்பங்கள் ↓' : 'More Options ↓')}
        </button>
      </div>

      {/* Security Note */}
      <div className="flex items-center gap-2 p-3 bg-primary-50 rounded-lg text-xs text-primary-700">
        <ShieldCheckIcon className="w-4 h-4 flex-shrink-0" />
        <p>
          {language === 'ta' 
            ? 'உங்கள் தனியுரிமை எங்களுக்கு முக்கியம். அனைத்து உள்நுழைவுகளும் பாதுகாப்பானவை மற்றும் குறியாக்கம் செய்யப்பட்டவை.' 
            : 'Your privacy matters. All logins are secure and encrypted.'}
        </p>
      </div>

      {/* Warning for government services */}
      {showMore && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-700">
          <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
          <p>
            {language === 'ta'
              ? 'அரசு சேவைகளுக்கு, உங்கள் ஆதார் அல்லது டிஜிலாக்கர் சான்றுகள் தேவைப்படும்.'
              : 'For government services, you may need your Aadhaar or DigiLocker credentials.'}
          </p>
        </div>
      )}

      {/* QR Code Modal */}
      <QRModal />
    </div>
  )
}

export default SocialLogin
