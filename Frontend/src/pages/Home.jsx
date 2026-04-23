import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left fade-in">
              <div className="inline-flex items-center glass-card rounded-full px-4 py-2 mb-6 border-white/20">
                <span className="text-white/90 text-sm font-medium">Join 10,000+ learners growing their careers</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Find Your Perfect Mentor,
                <br />
                <span className="text-gradient">
                  Accelerate Your Learning
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto lg:mx-0">
                Connect with experienced professionals who can guide you on your learning journey. 
                Get personalized mentorship in your field of interest and achieve your career goals faster.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] neon-border transition-all duration-300 hover:scale-105">
                    Get Started
                  </Button>
                </Link>
                <Link to="/mentors">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all duration-300 hover:scale-105">
                    Browse Mentors
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-white/70">Expert Mentors</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">50+</div>
                  <div className="text-white/70">Domains</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-3xl font-bold text-white">10k+</div>
                  <div className="text-white/70">Happy Students</div>
                </div>
              </div>
            </div>
            
            <div className="relative slide-in-right">
              <div className="relative z-10 p-1 rounded-2xl bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 neon-border hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Professional mentorship session with diverse group"
                  className="rounded-xl w-full h-auto object-cover hover:scale-[1.03] transition-transform duration-700"
                />
                
                {/* Floating Cards */}
                <div className="absolute -bottom-6 -left-6 glass-card p-4 hidden md:block fade-in animate-float">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                      <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Success Rate</div>
                      <div className="text-sm text-white/70">95% achieve goals</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 glass-card p-4 hidden md:block fade-in animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                      <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-white">Top Rated</div>
                      <div className="text-sm text-white/70">4.8/5 average</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose MentorMatch?
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              We make it easy to find the perfect mentor for your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 glass-card card-hover">
              <div className="bg-indigo-500/20 border border-indigo-500/30 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Expert Mentors</h3>
              <p className="text-white/70 leading-relaxed">Learn from industry professionals with real-world experience</p>
            </div>

            <div className="text-center p-8 glass-card card-hover">
              <div className="bg-blue-500/20 border border-blue-500/30 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.415 1.415l.707-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Personalized Learning</h3>
              <p className="text-white/70 leading-relaxed">Get customized guidance based on your interests and goals</p>
            </div>

            <div className="text-center p-8 glass-card card-hover">
              <div className="bg-purple-500/20 border border-purple-500/30 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Flexible Scheduling</h3>
              <p className="text-white/70 leading-relaxed">Learn at your own pace with mentors available when you need them</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 mb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card border-indigo-500/30 p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 z-0"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join thousands of students who are already accelerating their careers
              </p>
              <Link to="/signup">
                <Button size="xl" className="shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:shadow-[0_0_40px_rgba(236,72,153,0.8)] neon-border hover:scale-105 transition-all duration-300">
                  Get Started Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
