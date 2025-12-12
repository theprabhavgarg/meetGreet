'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Users, Shield, Heart, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-6xl font-bold mb-6 text-text">
              Connect Beyond Dating
            </h1>
            <p className="text-2xl mb-8 text-text/80">
              Find meaningful connections for networking, casual hangouts, and professional discussions
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg">
                Get Started
              </Link>
              <Link href="/login" className="btn-secondary text-lg">
                Sign In
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            {[
              {
                icon: Shield,
                title: 'Verified Profiles',
                description: 'Triple verification via Mobile OTP, Email, and LinkedIn'
              },
              {
                icon: Users,
                title: 'Smart Matching',
                description: 'AI-powered matching based on location, interests, and personality'
              },
              {
                icon: Heart,
                title: 'Safe Meetups',
                description: 'Built-in safety features and verified venue recommendations'
              },
              {
                icon: Sparkles,
                title: 'Premium Features',
                description: 'Free super push stars, story wall, and more'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card text-center"
              >
                <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-text/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Profile',
                description: 'Sign up with verified credentials and complete your personality assessment'
              },
              {
                step: '2',
                title: 'Find Matches',
                description: 'Swipe through profiles matched to your preferences and location'
              },
              {
                step: '3',
                title: 'Connect & Meet',
                description: 'Chat with matches and schedule safe meetups at recommended venues'
              }
            ].map((item, index) => (
              <div key={index} className="card">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-3xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-text/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto card bg-accent/30">
          <h3 className="text-2xl font-bold mb-4 text-center">Safety First</h3>
          <ul className="space-y-3 text-text/80">
            <li>✓ Use only app chat and don't share your phone number initially</li>
            <li>✓ Meet only in well-lit & crowded places</li>
            <li>✓ Use app-recommended restaurants and venues</li>
            <li>✓ This app is for finding new friends, not for dating or inappropriate behavior</li>
            <li>✓ Emergency SOS button available at all times</li>
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-text/10">
        <p className="text-text/70">© 2025 Connect. All rights reserved.</p>
      </footer>
    </div>
  )
}

