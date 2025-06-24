import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, FileText, List, Play, Users, Shield, Zap } from 'lucide-react';

export const LandingPage = () => {
  const features = [
    {
      icon: Monitor,
      title: 'Screen Management',
      description: 'Manage multiple displays from a single dashboard with real-time monitoring.',
    },
    {
      icon: FileText,
      title: 'Content Creation',
      description: 'Create engaging content with text, images, and videos using our intuitive editor.',
    },
    {
      icon: List,
      title: 'Playlist Management',
      description: 'Organize content into playlists and schedule them across your displays.',
    },
    {
      icon: Play,
      title: 'Auto-Rotation',
      description: 'Content automatically rotates based on your timing preferences.',
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Team collaboration with user management and access controls.',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with reliable content delivery.',
    },
  ];

  const steps = [
    {
      step: '1',
      title: 'Create Content',
      description: 'Upload images, videos, or create text-based content with our easy-to-use editor.',
    },
    {
      step: '2',
      title: 'Build Playlists',
      description: 'Organize your content into playlists and set display durations for each item.',
    },
    {
      step: '3',
      title: 'Setup Screens',
      description: 'Register your display screens and assign playlists to them.',
    },
    {
      step: '4',
      title: 'Go Live',
      description: 'Open the display URL on your screens and watch your content come to life.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Monitor className="h-8 w-8 text-websign-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">WebSign</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-websign-600 to-websign-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6">
              Digital Signage Made Simple
            </h1>
            <p className="text-xl text-websign-100 mb-8 max-w-3xl mx-auto">
              Create, manage, and display content across multiple screens with WebSign's 
              powerful yet intuitive digital signage platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-websign-600 hover:bg-gray-100">
                  <Zap className="h-5 w-5 mr-2" />
                  Start Free Trial
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-websign-600">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Everything you need for digital signage
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From content creation to display management, WebSign provides all the tools 
              you need to create engaging digital experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="mx-auto bg-websign-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-websign-600" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* How it Works */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              How WebSign Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started with digital signage in four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto bg-websign-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-websign-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              Ready to transform your displays?
            </h2>
            <p className="text-xl text-websign-100 mb-8">
              Join thousands of businesses using WebSign for their digital signage needs.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-websign-600 hover:bg-gray-100">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Monitor className="h-6 w-6 text-websign-400 mr-2" />
              <span className="text-lg font-bold text-white">WebSign</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 WebSign. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};