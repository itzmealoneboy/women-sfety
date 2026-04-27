import { useState } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import Input from '../common/Input';
import {
    ExclamationTriangleIcon,
    PhoneIcon,
    ShieldCheckIcon,
    CheckCircleIcon,
    XCircleIcon
} from '@heroicons/react/24/outline';

const EmergencyAccess = ({ onVerify, onCancel, userEmail }) => {
    const [step, setStep] = useState('questions'); // questions, verifying, success, error
    const [answers, setAnswers] = useState({ q1: '', q2: '' });
    const [error, setError] = useState('');

    const securityQuestions = [
        { id: 'q1', question: "What is your mother's name?" },
        { id: 'q2', question: "What was your first school's name?" }
    ];

    const handleSubmit = () => {
        if (!answers.q1 || !answers.q2) {
            setError('Please answer both questions');
            return;
        }

        setStep('verifying');

        // Simulate verification
        setTimeout(() => {
            if (answers.q1.toLowerCase() === 'test' && answers.q2.toLowerCase() === 'test') {
                setStep('success');
                setTimeout(() => {
                    if (onVerify) onVerify({ emergency: true });
                }, 1500);
            } else {
                setStep('error');
                setError('Answers do not match our records');
            }
        }, 2000);
    };

    const callHelpline = () => {
        window.location.href = 'tel:1800123WOMEN';
    };

    return (
        <Card className="max-w-md mx-auto">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-danger/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    {step === 'success' ? (
                        <CheckCircleIcon className="w-8 h-8 text-success" />
                    ) : step === 'error' ? (
                        <XCircleIcon className="w-8 h-8 text-danger" />
                    ) : (
                        <ExclamationTriangleIcon className="w-8 h-8 text-danger" />
                    )}
                </div>
                <h3 className="text-xl font-bold text-gray-800">🆘 Emergency Access</h3>
                <p className="text-gray-600 text-sm mt-1">
                    This should ONLY be used in genuine emergencies
                </p>
            </div>

            {step === 'questions' && (
                <div className="space-y-4">
                    <div className="bg-warning/10 p-4 rounded-lg">
                        <p className="text-sm text-warning flex items-start gap-2">
                            <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                            <span>
                                Emergency access will notify your trusted contacts and share your location.
                                Use only if you cannot login normally.
                            </span>
                        </p>
                    </div>

                    {securityQuestions.map((q) => (
                        <Input
                            key={q.id}
                            label={q.question}
                            type="text"
                            value={answers[q.id]}
                            onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                            placeholder="Enter your answer"
                        />
                    ))}

                    {error && (
                        <div className="text-danger text-sm text-center">
                            {error}
                        </div>
                    )}

                    <Button
                        variant="danger"
                        className="w-full"
                        onClick={handleSubmit}
                    >
                        Verify & Grant Emergency Access
                    </Button>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">OR</span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={callHelpline}
                    >
                        <PhoneIcon className="w-5 h-5 mr-2" />
                        Call Helpline: 1800-123-WOMEN
                    </Button>

                    <Button
                        variant="ghost"
                        className="w-full"
                        onClick={onCancel}
                    >
                        Back to Login
                    </Button>
                </div>
            )}

            {step === 'verifying' && (
                <div className="text-center py-8">
                    <div className="w-16 h-16 border-4 border-danger border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Verifying your answers...</p>
                </div>
            )}

            {step === 'success' && (
                <div className="text-center py-4">
                    <CheckCircleIcon className="w-16 h-16 text-success mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Emergency Access Granted</h4>
                    <p className="text-gray-600 mb-4">
                        Limited access mode activated. Your trusted contacts have been notified.
                    </p>
                    <div className="bg-primary-50 p-3 rounded-lg text-sm text-primary-700 mb-4">
                        <p>📍 Location sharing enabled</p>
                        <p>👥 Trusted contacts notified</p>
                        <p>🚨 Police alert ready</p>
                    </div>
                    <Button variant="primary" className="w-full" onClick={() => window.location.href = '/dashboard?emergency=true'}>
                        Continue to Dashboard
                    </Button>
                </div>
            )}

            {step === 'error' && (
                <div className="text-center py-4">
                    <XCircleIcon className="w-16 h-16 text-danger mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Verification Failed</h4>
                    <p className="text-gray-600 mb-4">{error || 'Answers did not match'}</p>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setStep('questions')}>
                            Try Again
                        </Button>
                        <Button variant="primary" className="flex-1" onClick={callHelpline}>
                            Call Helpline
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
};

export default EmergencyAccess;
