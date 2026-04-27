import { useState } from 'react'
import Button from '../../components/common/Button'
import Card from '../../components/common/Card'
import { 
  MagnifyingGlassIcon,
  PhotoIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  CloudArrowUpIcon,
  ArrowPathIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const AIMisuseDetection = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState(null)
  const [deepfakeResult, setDeepfakeResult] = useState(null)
  const [activeTab, setActiveTab] = useState('misuse')

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    setSelectedImage(file)
    
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target.result)
    }
    reader.readAsDataURL(file)
    
    // Reset results
    setResult(null)
    setDeepfakeResult(null)
  }

  const checkMisuse = () => {
    if (!selectedImage) {
      toast.error('Please upload an image first')
      return
    }

    setAnalyzing(true)

    // Simulate AI analysis
    setTimeout(() => {
      const randomScore = Math.random()
      const found = randomScore > 0.7

      if (found) {
        setResult({
          found: true,
          platforms: ['Instagram', 'Facebook', 'Twitter'],
          matches: Math.floor(Math.random() * 5) + 1,
          confidence: Math.floor(Math.random() * 20 + 80),
          locations: ['Mumbai', 'Delhi', 'Bangalore'].slice(0, Math.floor(Math.random() * 3) + 1)
        })
        toast.error('⚠️ Image found on social media platforms!', {
          duration: 5000
        })
      } else {
        setResult({
          found: false,
          confidence: Math.floor(Math.random() * 30 + 70)
        })
        toast.success('✅ No misuse detected', {
          icon: '✓'
        })
      }

      setAnalyzing(false)
    }, 3000)
  }

  const checkDeepfake = () => {
    if (!selectedImage) {
      toast.error('Please upload an image first')
      return
    }

    setAnalyzing(true)

    // Simulate deepfake detection
    setTimeout(() => {
      const isFake = Math.random() > 0.8
      const confidence = Math.floor(Math.random() * 30 + 70)

      setDeepfakeResult({
        isFake,
        confidence,
        analysis: isFake 
          ? 'This image shows signs of AI manipulation' 
          : 'This appears to be authentic'
      })

      if (isFake) {
        toast.error('⚠️ Possible deepfake detected!', {
          duration: 5000
        })
      } else {
        toast.success('✅ No deepfake detected', {
          icon: '✓'
        })
      }

      setAnalyzing(false)
    }, 3500)
  }

  const resetAnalysis = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResult(null)
    setDeepfakeResult(null)
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('misuse')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'misuse'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          Image Misuse Detection
        </button>
        <button
          onClick={() => setActiveTab('deepfake')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            activeTab === 'deepfake'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <DocumentMagnifyingGlassIcon className="w-5 h-5" />
          Deepfake Detection
        </button>
      </div>

      {/* Upload Section */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Area */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Upload Image to Check</h3>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                imagePreview ? 'border-success' : 'border-gray-300 hover:border-primary-500'
              } transition-colors cursor-pointer`}
              onClick={() => document.getElementById('imageInput').click()}
            >
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <p className="text-sm text-success">Image ready for analysis</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto" />
                  <div>
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, JPEG up to 10MB</p>
                  </div>
                </div>
              )}
              
              <input
                id="imageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Analysis Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Analysis Options</h3>

            {imagePreview && (
              <div className="space-y-3">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={activeTab === 'misuse' ? checkMisuse : checkDeepfake}
                  loading={analyzing}
                >
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  {activeTab === 'misuse' ? 'Check for Misuse' : 'Analyze Deepfake'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={resetAnalysis}
                >
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Upload New Image
                </Button>
              </div>
            )}

            {/* Tips */}
            <div className="bg-primary-50 p-4 rounded-lg">
              <h4 className="font-medium text-primary-800 mb-2">Tips for best results:</h4>
              <ul className="text-sm text-primary-700 space-y-1">
                <li>• Use high-quality images</li>
                <li>• Ensure face is clearly visible</li>
                <li>• Avoid filters and heavy editing</li>
                <li>• Check multiple angles if possible</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Section */}
      {result && activeTab === 'misuse' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>

          {result.found ? (
            <div className="bg-danger/10 border border-danger rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-danger rounded-full flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-danger mb-2">
                    ⚠️ Image Found on Social Media!
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Platforms:</span>{' '}
                      {result.platforms.join(', ')}
                    </p>
                    <p>
                      <span className="font-medium">Matches found:</span> {result.matches}
                    </p>
                    <p>
                      <span className="font-medium">Locations:</span>{' '}
                      {result.locations.join(', ')}
                    </p>
                    <p>
                      <span className="font-medium">Confidence:</span> {result.confidence}%
                    </p>
                  </div>

                  <Button
                    variant="danger"
                    className="w-full mt-4"
                    onClick={() => toast.success('Report filed with cyber cell')}
                  >
                    <ExclamationTriangleIcon className="w-5 h-5 mr-2" />
                    Report to Cyber Cell
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-success/10 border border-success rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-success rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-success mb-2">
                    ✅ No Misuse Detected
                  </h4>
                  <p className="text-sm">
                    Your image appears to be safe. No matches found on social media platforms.
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    Confidence: {result.confidence}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Deepfake Results */}
      {deepfakeResult && activeTab === 'deepfake' && (
        <Card>
          <h3 className="text-lg font-semibold mb-4">Deepfake Analysis Results</h3>

          <div className={`p-4 rounded-lg ${
            deepfakeResult.isFake 
              ? 'bg-danger/10 border border-danger' 
              : 'bg-success/10 border border-success'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                deepfakeResult.isFake ? 'bg-danger' : 'bg-success'
              }`}>
                {deepfakeResult.isFake ? (
                  <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                ) : (
                  <CheckCircleIcon className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold mb-2 ${
                  deepfakeResult.isFake ? 'text-danger' : 'text-success'
                }`}>
                  {deepfakeResult.isFake ? '⚠️ Possible Deepfake Detected' : '✅ Authentic Image'}
                </h4>
                
                <p className="text-sm mb-3">{deepfakeResult.analysis}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Confidence Score</span>
                    <span className="font-medium">{deepfakeResult.confidence}%</span>
                  </div>
                  
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        deepfakeResult.isFake ? 'bg-danger' : 'bg-success'
                      }`}
                      style={{ width: `${deepfakeResult.confidence}%` }}
                    />
                  </div>
                </div>

                {deepfakeResult.isFake && (
                  <Button
                    variant="danger"
                    className="w-full mt-4"
                    onClick={() => toast.success('Report submitted to cyber cell')}
                  >
                    <CloudArrowUpIcon className="w-5 h-5 mr-2" />
                    Report to Authorities
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-primary-50 border border-primary-200">
          <h4 className="font-semibold text-primary-800 mb-2">About Image Misuse Detection</h4>
          <p className="text-sm text-primary-700">
            Our AI scans social media platforms and the deep web to detect if your images are being used without consent. We check for unauthorized usage and provide you with actionable insights.
          </p>
        </Card>

        <Card className="bg-primary-50 border border-primary-200">
          <h4 className="font-semibold text-primary-800 mb-2">About Deepfake Detection</h4>
          <p className="text-sm text-primary-700">
            Advanced AI algorithms analyze images for signs of manipulation, including GAN-generated content, inconsistent lighting, and unnatural facial features to identify potential deepfakes.
          </p>
        </Card>
      </div>
    </div>
  )
}

export default AIMisuseDetection
