// app/contact/page.tsx
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  MessageCircle,
  Users,
  Sparkles,
  Heart,
  Zap,
  Globe,
  Star
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";

export default function ContactPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    const observers = sectionRefs.current.map((ref, index) => {
      if (!ref) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('animate-in');
            }, index * 100);
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormSubmitted(true);
    
    setTimeout(() => {
      setIsFormSubmitted(false);
    }, 4000);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      description: "We'll respond within 24 hours",
      value: "hello@learnhub.com",
      color: "from-blue-500 to-cyan-500",
      delay: 0
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 9am to 6pm",
      value: "+1 (555) 123-LEARN",
      color: "from-purple-500 to-pink-500",
      delay: 200
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come say hello at our office",
      value: "123 Education Street, Tech City",
      color: "from-green-500 to-emerald-500",
      delay: 400
    },
    {
      icon: Clock,
      title: "Response Time",
      description: "Quick support when you need it",
      value: "< 2 hours average",
      color: "from-orange-500 to-red-500",
      delay: 600
    }
  ];

  const socialLinks = [
    { name: "Twitter", url: "#", icon: "𝕏", color: "hover:bg-black hover:text-white" },
    { name: "LinkedIn", url: "#", icon: "in", color: "hover:bg-blue-700 hover:text-white" },
    { name: "GitHub", url: "#", icon: "{}", color: "hover:bg-gray-800 hover:text-white" },
    { name: "Discord", url: "#", icon: "💬", color: "hover:bg-indigo-600 hover:text-white" }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.15), transparent 80%),
            radial-gradient(400px at ${mousePosition.x * 0.8}px ${mousePosition.y * 1.2}px, rgba(139, 92, 246, 0.1), transparent 50%)
          `
        }}
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Badge */}
            <div 
              ref={(el: HTMLDivElement | null) => addToRefs(el, 0)}
              className="inline-flex items-center gap-2 mb-8 opacity-0 translate-y-8 transition-all duration-700"
            >
              <div className="relative">
                <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
                <div className="absolute inset-0 text-blue-600 animate-ping">✨</div>
              </div>
              <Badge className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2 backdrop-blur-sm">
                Get In Touch
              </Badge>
            </div>
            
            {/* Main Heading */}
            <div 
              ref={(el: HTMLDivElement | null) => addToRefs(el, 1)}
              className="opacity-0 translate-y-8 transition-all duration-700 delay-200"
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Let's Transform
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Education Together
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Ready to revolutionize learning? Our team is here to help you create 
                exceptional educational experiences with cutting-edge technology.
              </p>
            </div>

            {/* Animated Indicators */}
            <div 
              ref={(el: HTMLDivElement | null) => addToRefs(el, 2)}
              className="flex items-center justify-center gap-6 text-gray-500 opacity-0 translate-y-8 transition-all duration-700 delay-400"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-bounce"></div>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span>Expert Team</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                <span>Fast Response</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="relative py-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            
            {/* Contact Form */}
            <div 
              ref={(el: HTMLDivElement | null) => addToRefs(el, 3)}
              className="opacity-0 scale-95 transition-all duration-700 delay-300"
            >
              <Card className="border-gray-200/80 bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 group relative overflow-hidden">
                {/* Animated Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                
                <CardContent className="p-8 relative">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Send Message</h2>
                      <p className="text-gray-600">We're excited to hear from you</p>
                    </div>
                  </div>

                  {isFormSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <Heart className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Message Received!</h3>
                      <p className="text-gray-600 mb-2">We'll get back to you within 2 hours.</p>
                      <p className="text-sm text-gray-500">Thank you for choosing LearnHub</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">First Name</label>
                          <Input 
                            placeholder="John" 
                            required 
                            className="border-gray-300 focus:border-blue-500 transition-all duration-300 focus:scale-105"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Last Name</label>
                          <Input 
                            placeholder="Doe" 
                            required 
                            className="border-gray-300 focus:border-blue-500 transition-all duration-300 focus:scale-105"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <Input 
                          type="email" 
                          placeholder="john@example.com" 
                          required 
                          className="border-gray-300 focus:border-blue-500 transition-all duration-300 focus:scale-105"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Subject</label>
                        <Input 
                          placeholder="How can we help transform learning?" 
                          required 
                          className="border-gray-300 focus:border-blue-500 transition-all duration-300 focus:scale-105"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Message</label>
                        <Textarea 
                          placeholder="Tell us about your educational vision..." 
                          rows={5}
                          required 
                          className="border-gray-300 focus:border-blue-500 transition-all duration-300 focus:scale-105 resize-none"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-xl group"
                      >
                        <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                        Send Message
                        <Zap className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information & Social */}
            <div className="space-y-6">
              {contactInfo.map((item, index) => (
                <div 
                  key={index}
                  ref={(el: HTMLDivElement | null) => addToRefs(el, 4 + index)}
                  className="opacity-0 translate-x-8 transition-all duration-700"
                  style={{ transitionDelay: `${item.delay}ms` }}
                >
                  <Card className="border-gray-200/80 bg-white/80 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-500 group overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    <CardContent className="p-6 relative">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <p className="text-gray-900 font-medium">{item.value}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Social Links */}
              <div 
                ref={(el: HTMLDivElement | null) => addToRefs(el, 8)}
                className="opacity-0 translate-y-8 transition-all duration-700 delay-800"
              >
                <Card className="border-gray-200/80 bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 text-center">Join Our Community</h3>
                    <div className="flex justify-center gap-3">
                      {socialLinks.map((social, index) => (
                        <a
                          key={index}
                          href={social.url}
                          className={`w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center ${social.color} hover:scale-110 hover:shadow-lg transition-all duration-500 font-semibold text-gray-700 backdrop-blur-sm`}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          {social.icon}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {[
              { number: "50K+", label: "Learners Helped", delay: 0 },
              { number: "98%", label: "Satisfaction Rate", delay: 100 },
              { number: "2h", label: "Avg Response Time", delay: 200 },
              { number: "24/7", label: "Support Available", delay: 300 }
            ].map((stat, index) => (
              <div 
                key={index}
                ref={(el: HTMLDivElement | null) => addToRefs(el, 9 + index)}
                className="opacity-0 scale-90 transition-all duration-700"
                style={{ transitionDelay: `${stat.delay}ms` }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 hover:scale-110 transition-transform duration-500 cursor-default">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-float-delayed" />
        </div>
        
        <div 
          ref={(el: HTMLDivElement | null) => addToRefs(el, 13)}
          className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-2xl">
              <Globe className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Learning Journey?</h2>
            
            <p className="text-blue-100 mb-8 text-xl max-w-2xl mx-auto leading-relaxed">
              Join thousands of educators and learners transforming education with LearnHub's cutting-edge platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 hover:scale-105 transition-all duration-500 shadow-2xl px-8">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-500 backdrop-blur-sm px-8">
                  <Star className="w-4 h-4 mr-2" />
                  Book Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(15px) rotate(-5deg); }
        }

        .animate-float {
          animation: float 8s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 10s ease-in-out infinite;
        }

        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transform: translateX(0) !important;
          transform: scale(1) !important;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}