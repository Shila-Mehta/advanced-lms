
'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  Award, 
  TrendingUp, 
  Star,
  CheckCircle,
  PlayCircle,
  Clock,
  Target
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Landing = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with real-world experience"
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Connect with peers and instructors in our vibrant community"
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn recognized certificates to showcase your achievements"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics"
    }
  ];

  const courses = [
    {
      id: 1,
      title: "Advanced React & TypeScript",
      instructor: "Sarah Johnson",
      rating: 4.9,
      students: 12453,
      duration: "24 hours",
      level: "Advanced",
      image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
    },
    {
      id: 2,
      title: "Full-Stack Web Development",
      instructor: "Michael Chen",
      rating: 4.8,
      students: 8921,
      duration: "48 hours",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      instructor: "Emma Rodriguez",
      rating: 4.9,
      students: 15234,
      duration: "32 hours",
      level: "All Levels",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800"
    }
  ];

  const testimonials = [
    {
      name: "Alex Thompson",
      role: "Software Engineer",
      content: "LearnHub transformed my career. The courses are practical and the instructors are top-notch.",
      rating: 5
    },
    {
      name: "Maria Garcia",
      role: "Product Designer",
      content: "Best investment I've made in my professional development. Highly recommended!",
      rating: 5
    },
    {
      name: "James Wilson",
      role: "Data Scientist",
      content: "The quality of content and community support is unmatched. Worth every penny.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200">
                🎓 Transform Your Career
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Learn Skills That{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Shape Tomorrow
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of learners mastering in-demand skills with expert instructors, 
                interactive courses, and real-world projects.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/courses">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:opacity-90 transition-opacity">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Explore Courses
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="border-blue-200 hover:bg-blue-50">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 mt-8">
                <div>
                  <div className="text-3xl font-bold text-blue-600">50K+</div>
                  <div className="text-sm text-gray-600">Active Learners</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600">500+</div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction</div>
                </div>
              </div>
            </div>
            
            <div className="relative animate-scale-in">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20 blur-3xl rounded-full" />
               <Image 
                src="/hero-learning.jpg" 
                alt="Students learning" 
                className="relative rounded-2xl shadow-2xl w-full"
                width={600}
                height={400}
                priority
              />        
         
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Features</Badge>
            <h2 className="text-4xl font-bold mb-4">Why Choose LearnHub?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to accelerate your learning journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group border-gray-200 bg-white/50 backdrop-blur hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-4 group-hover:shadow-lg transition-shadow">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Top Picks</Badge>
            <h2 className="text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start learning with our most popular courses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="group overflow-hidden border-gray-200 bg-white/50 backdrop-blur hover:border-blue-300 transition-all duration-300 hover:shadow-lg h-full cursor-pointer">
                  <div className="relative overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-white/80 backdrop-blur">
                      {course.level}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{course.instructor}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                        <span className="font-medium text-gray-900">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/courses">
              <Button size="lg" variant="outline" className="border-blue-200 hover:bg-blue-50">
                View All Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200">Testimonials</Badge>
            <h2 className="text-4xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of satisfied learners worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-200 bg-white/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of learners and start your journey today. Get access to all courses with a free trial.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg hover:opacity-90">
                    Start Free Trial
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg" variant="outline" className="border-blue-200">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;

