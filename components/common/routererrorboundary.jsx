import { useRouteError, useNavigate } from 'react-router-dom'
import Button from './Button'
import { logError } from '../../utils/sentry'

const RouteErrorBoundary = () => {
  const error = useRouteError()
  const navigate = useNavigate()
  
  // Log error
  logError(error, { route: window.location.pathname })

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-danger/10 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg className="w-12 h-12 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {import.meta.env.DEV && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg text-left">
            <p className="text-sm font-mono text-gray-700">
              {error.status} - {error.statusText || error.message}
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Go Back
          </Button>
          
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full"
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RouteErrorBoundary
