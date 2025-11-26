// app/about/page.tsx
'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Target,
  Users,
  Award,
  BookOpen,
  GraduationCap,
  Globe,
  Star,
  ArrowRight,
  Lightbulb,
  Shield,
  Zap,
  Heart,
  Sparkles
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useRef, useState } from "react";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    setIsVisible(true);
    
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
      observers.forEach(observer => observer?.disconnect());
    };
  }, []);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

  // Color mapping to avoid dynamic class names
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600',
      border: 'border-indigo-200'
    },
    purple: {
      bg: 'bg-purple-100', 
      text: 'text-purple-600',
      border: 'border-purple-200'
    },
    blue: {
      bg: 'bg-blue-100',
      text: 'text-blue-600', 
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200'
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "Course Management",
      description: "Create, organize, and deliver courses with intuitive tools and flexible content management.",
      color: "indigo" as keyof typeof colorClasses
    },
    {
      icon: Users,
      title: "Student Engagement", 
      description: "Tools to track progress, provide feedback, and keep students motivated throughout their journey.",
      color: "purple" as keyof typeof colorClasses
    },
    {
      icon: Award,
      title: "Progress Tracking",
      description: "Monitor student performance, completion rates, and learning outcomes with detailed analytics.",
      color: "blue" as keyof typeof colorClasses
    }
  ];

  const differentiators = [
    {
      icon: Zap,
      title: "Modern Technology Stack",
      description: "Built with Next.js, React, and modern web technologies for fast performance and reliable user experience.",
      color: "indigo" as keyof typeof colorClasses
    },
    {
      icon: Heart, 
      title: "User-Focused Design",
      description: "Clean, intuitive interfaces designed with both instructors and students in mind.",
      color: "purple" as keyof typeof colorClasses
    },
    {
      icon: Shield,
      title: "Reliable & Secure", 
      description: "Enterprise-grade security and reliability to protect your data and ensure uptime.",
      color: "green" as keyof typeof colorClasses
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Learners", color: "indigo" as keyof typeof colorClasses },
    { number: "500+", label: "Courses", color: "purple" as keyof typeof colorClasses },
    { number: "98%", label: "Satisfaction Rate", color: "blue" as keyof typeof colorClasses },
    { number: "150+", label: "Countries", color: "green" as keyof typeof colorClasses }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section 
        ref={(el: HTMLDivElement | null) => addToRefs(el, 0)}
        className={`pt-24 pb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6 animate-pulse">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">
                About Learn Hub
              </Badge>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Transforming <span className="text-indigo-600">Education</span> Through Technology
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              We're building the future of education with technology that empowers 
              instructors and transforms learning experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              
              {/* Mission */}
              <div 
                ref={(el: HTMLDivElement | null) => addToRefs(el, 1)}
                className="opacity-0 translate-y-8 transition-all duration-700"
              >
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-indigo-300 group">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                    <p className="text-gray-600 leading-relaxed">
                      To create intuitive, powerful learning management tools that help educators 
                      deliver exceptional experiences and help students achieve their goals.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Vision */}
              <div 
                ref={(el: HTMLDivElement | null) => addToRefs(el, 2)}
                className="opacity-0 translate-y-8 transition-all duration-700 delay-200"
              >
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-purple-300 group">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                    <p className="text-gray-600 leading-relaxed">
                      A world where technology enhances education, making quality learning 
                      accessible to everyone and empowering educators to do their best work.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
            <p className="text-gray-600">
              Comprehensive tools for modern education management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((item, index) => (
              <div 
                key={index}
                ref={(el: HTMLDivElement | null) => addToRefs(el, 3 + index)}
                className="opacity-0 translate-y-8 transition-all duration-700"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card className="border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-lg ${colorClasses[item.color].bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-6 h-6 ${colorClasses[item.color].text}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose  Learn Hub</h2>
              <p className="text-gray-600">
                Built with modern technology and a focus on user experience
              </p>
            </div>

            <div className="space-y-6">
              {differentiators.map((item, index) => (
                <div 
                  key={index}
                  ref={(el: HTMLDivElement | null) => addToRefs(el, 6 + index)}
                  className="opacity-0 translate-x-8 transition-all duration-700"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="flex items-start gap-4 p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-300 group">
                    <div className={`w-8 h-8 rounded-full ${colorClasses[item.color].bg} flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className={`w-4 h-4 ${colorClasses[item.color].text}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            {stats.map((stat, index) => (
              <div 
                key={index}
                ref={(el: HTMLDivElement | null) => addToRefs(el, 9 + index)}
                className="opacity-0 scale-90 transition-all duration-700"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`text-3xl font-bold ${colorClasses[stat.color].text} mb-2 hover:scale-110 transition-transform duration-300 cursor-default`}>
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-indigo-600">
        <div 
          ref={(el: HTMLDivElement | null) => addToRefs(el, 13)}
          className="opacity-0 translate-y-8 transition-all duration-700"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-indigo-100 mb-8 text-lg">
                Join thousands of educators and students using AdvancedLMS
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses">
                  <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 hover:scale-105 transition-transform duration-300">
                    Browse Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-indigo-700 hover:scale-105 transition-transform duration-300">
                    Create Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transform: translateX(0) !important;
          transform: scale(1) !important;
        }
      `}</style>
    </div>
  );
}