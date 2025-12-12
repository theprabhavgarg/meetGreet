'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Step1BasicInfo from '@/components/registration/Step1BasicInfo'
import Step2ProfileDetails from '@/components/registration/Step2ProfileDetails'
import Step3Verification from '@/components/registration/Step3Verification'
import Step4PersonalityAssessment from '@/components/registration/Step4PersonalityAssessment'
import Step5Preferences from '@/components/registration/Step5Preferences'
import { Shield } from 'lucide-react'

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<any>({})

  const totalSteps = 5

  const updateFormData = (data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo onNext={nextStep} updateData={updateFormData} data={formData} />
      case 2:
        return <Step2ProfileDetails onNext={nextStep} onBack={prevStep} updateData={updateFormData} data={formData} />
      case 3:
        return <Step3Verification onNext={nextStep} onBack={prevStep} updateData={updateFormData} data={formData} />
      case 4:
        return <Step4PersonalityAssessment onNext={nextStep} onBack={prevStep} updateData={updateFormData} data={formData} />
      case 5:
        return <Step5Preferences onBack={prevStep} updateData={updateFormData} data={formData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Create Your Profile</h1>
          </div>
          <p className="text-text/70">
            Join our verified community of professionals and young adults
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step <= currentStep
                      ? 'bg-primary text-text'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`w-16 h-1 mx-2 transition-all ${
                      step < currentStep ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-text/60 mt-2">
            <span>Basic Info</span>
            <span>Profile</span>
            <span>Verify</span>
            <span>Personality</span>
            <span>Preferences</span>
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Safety Notice */}
        <div className="mt-8 card bg-accent/20 text-sm">
          <p className="font-semibold mb-2">🔒 Your Safety Matters</p>
          <ul className="space-y-1 text-text/70">
            <li>• All profiles undergo triple verification (Mobile, Email, LinkedIn)</li>
            <li>• Only verified profiles can see and match with others</li>
            <li>• Your data is encrypted and never shared without consent</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

