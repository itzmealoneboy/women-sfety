import { CheckCircleIcon } from '@heroicons/react/24/outline';

const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center justify-between">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isActive = currentStep === step.number;
        const Icon = step.icon;

        return (
          <div key={step.number} className="flex flex-col items-center flex-1">
            <div className="flex items-center w-full">
              <div className="flex-1">
                {index > 0 && (
                  <div className={`h-1 ${
                    isCompleted || isActive ? 'bg-primary-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
              
              <div className={`relative flex items-center justify-center`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted
                    ? 'bg-success text-white'
                    : isActive
                    ? 'bg-primary-500 text-white ring-4 ring-primary-100'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
              </div>

              <div className="flex-1">
                {index < steps.length - 1 && (
                  <div className={`h-1 ${
                    isCompleted ? 'bg-primary-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            </div>

            <span className={`text-xs mt-2 ${
              isActive ? 'text-primary-600 font-medium' : 'text-gray-500'
            }`}>
              {step.name}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressSteps;
