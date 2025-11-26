// app/courses/[id]/page.tsx
'use client';

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Star, 
  Users, 
  Clock, 
  PlayCircle,
  CheckCircle,
  Globe,
  Award,
  Bookmark,
  Share2,
  Zap,
  Sparkles,
  Heart
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useRef, useState } from "react";

// Define types for your API response
interface Lesson {
  title: string;
  duration: string;
  type: "video" | "quiz" | "assignment";
  completed: boolean;
}

interface CurriculumSection {
  title: string;
  lessons: Lesson[];
}

interface Instructor {
  name: string;
  title: string;
  bio: string;
  students: number;
  courses: number;
  rating: number;
  image: string;
}

interface Course {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  reviews: number;
  students: number;
  duration: string;
  level: string;
  category: string;
  price: string;
  image: string;
  description: string;
  learning: string[];
  requirements: string[];
  curriculum: CurriculumSection[];
  instructor_details: Instructor;
}

const CourseDetail = () => {
  const params = useParams();
  const id = params.id;
  const [isVisible, setIsVisible] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fetch course data from your API
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/courses/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch course data');
        }
        
        const courseData = await response.json();
        setCourse(courseData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
        setIsVisible(true);
      }
    };

    if (id) {
      fetchCourseData();
    }
  }, [id]);

  useEffect(() => {
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
  }, [course]); // Re-run when course data loads

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading course details...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Not Found</h2>
              <p className="text-gray-600 mb-6">{error || "The course you're looking for doesn't exist."}</p>
              <Link href="/courses">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Browse All Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-12 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div 
                  ref={(el: HTMLDivElement | null) => addToRefs(el, 0)}
                  className="opacity-0 translate-y-8 transition-all duration-700"
                >
                  <Badge className="mb-4 bg-blue-600 text-white">
                    {course.category}
                  </Badge>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {course.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {course.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold text-lg">{course.rating}</span>
                      <span className="text-gray-600">({course.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>{course.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{course.duration}</span>
                    </div>
                    <Badge variant="outline" className="bg-white">{course.level}</Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <Image 
                      src={course.instructor_details.image} 
                      alt={course.instructor_details.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-medium">Created by {course.instructor}</div>
                      <div className="text-sm text-gray-600">{course.instructor_details.title}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrollment Card */}
              <div className="lg:col-span-1">
                <div 
                  ref={(el: HTMLDivElement | null) => addToRefs(el, 1)}
                  className="opacity-0 scale-95 transition-all duration-700 delay-300"
                >
                  <Card className="sticky top-24 border-gray-200 bg-white/80 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 group overflow-hidden">
                    {/* Animated Border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
                    
                    <CardContent className="p-0 relative">
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          src={course.image} 
                          alt={course.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <Button 
                          size="icon"
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl"
                        >
                          <PlayCircle className="w-8 h-8 text-blue-600" />
                        </Button>
                      </div>
                      
                      <div className="p-6">
                        <div className="text-3xl font-bold text-blue-600 mb-4">{course.price}</div>
                        
                        <div className="space-y-3 mb-6">
                          <Link href={`/learn/${course.id}`}>
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group">
                              Enroll Now
                              <Zap className="w-4 h-4 ml-2 group-hover:scale-125 transition-transform duration-300" />
                            </Button>
                          </Link>
                          <Button variant="outline" className="w-full hover:scale-105 transition-all duration-300 group" size="lg">
                            <Bookmark className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                            Save for Later
                          </Button>
                          <Button variant="ghost" className="w-full hover:scale-105 transition-all duration-300 group" size="lg">
                            <Share2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                            Share Course
                          </Button>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>{course.duration} on-demand video</span>
                          </div>
                          <div className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">
                            <Globe className="w-4 h-4 text-gray-500" />
                            <span>Full lifetime access</span>
                          </div>
                          <div className="flex items-center gap-2 hover:translate-x-1 transition-transform duration-300">
                            <Award className="w-4 h-4 text-gray-500" />
                            <span>Certificate of completion</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Tabs */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:pr-[400px]">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start mb-8 bg-gray-100 p-1 rounded-xl">
                  {["overview", "curriculum", "instructor", "reviews"].map((tab, index) => (
                    <TabsTrigger 
                      key={tab}
                      value={tab}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-lg hover:scale-105 transition-all duration-300 capitalize"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  {/* What You'll Learn */}
                  <div 
                    ref={(el: HTMLDivElement | null) => addToRefs(el, 2)}
                    className="opacity-0 translate-y-8 transition-all duration-700"
                  >
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Sparkles className="w-6 h-6 text-blue-600" />
                          <h3 className="text-2xl font-bold">What You'll Learn</h3>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          {course.learning.map((item, index) => (
                            <div 
                              key={index} 
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-all duration-300 group-hover:translate-x-2"
                              style={{ transitionDelay: `${index * 100}ms` }}
                            >
                              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                              <span className="text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Requirements */}
                  <div 
                    ref={(el: HTMLDivElement | null) => addToRefs(el, 3)}
                    className="opacity-0 translate-y-8 transition-all duration-700 delay-200"
                  >
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 group">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-6">Requirements</h3>
                        <ul className="space-y-3">
                          {course.requirements.map((req, index) => (
                            <li 
                              key={index} 
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-purple-50 transition-all duration-300 group-hover:translate-x-2"
                              style={{ transitionDelay: `${index * 100}ms` }}
                            >
                              <div className="w-2 h-2 rounded-full bg-purple-600 mt-2.5 group-hover:scale-150 transition-transform duration-300" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="curriculum">
                  <div 
                    ref={(el: HTMLDivElement | null) => addToRefs(el, 4)}
                    className="opacity-0 translate-y-8 transition-all duration-700"
                  >
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Award className="w-6 h-6 text-blue-600" />
                          <h3 className="text-2xl font-bold">Course Curriculum</h3>
                        </div>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          {course.curriculum.map((section, index) => (
                            <AccordionItem 
                              key={index} 
                              value={`section-${index}`}
                              className="border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 data-[state=open]:shadow-lg"
                            >
                              <AccordionTrigger className="text-lg font-semibold p-6 hover:no-underline hover:bg-gray-50 rounded-lg transition-all duration-300">
                                <div className="flex items-center gap-4">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <span>{section.title}</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-6 pb-6">
                                <div className="space-y-3">
                                  {section.lessons.map((lesson, lessonIndex) => (
                                    <div 
                                      key={lessonIndex} 
                                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition-all duration-300 group cursor-pointer"
                                    >
                                      <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                          lesson.completed 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-blue-100 text-blue-600'
                                        } group-hover:scale-110 transition-transform duration-300`}>
                                          {lesson.completed ? (
                                            <CheckCircle className="w-4 h-4" />
                                          ) : (
                                            <PlayCircle className="w-4 h-4" />
                                          )}
                                        </div>
                                        <div>
                                          <span className="font-medium">{lesson.title}</span>
                                          <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                                              {lesson.type}
                                            </span>
                                            <span>{lesson.duration}</span>
                                          </div>
                                        </div>
                                      </div>
                                      {lesson.completed && (
                                        <Badge className="bg-green-100 text-green-700">Completed</Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="instructor">
                  <div 
                    ref={(el: HTMLDivElement | null) => addToRefs(el, 5)}
                    className="opacity-0 translate-y-8 transition-all duration-700"
                  >
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6 mb-6">
                          <div className="relative">
                            <Image 
                              src={course.instructor_details.image} 
                              alt={course.instructor_details.name}
                              width={96}
                              height={96}
                              className="w-24 h-24 rounded-full group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                              <Star className="w-4 h-4 text-white fill-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{course.instructor_details.name}</h3>
                            <p className="text-gray-600 mb-4">{course.instructor_details.title}</p>
                            <div className="flex flex-wrap gap-6 text-sm">
                              <div className="text-center hover:scale-110 transition-transform duration-300">
                                <div className="font-bold text-lg text-blue-600">{course.instructor_details.students.toLocaleString()}</div>
                                <div className="text-gray-600">Students</div>
                              </div>
                              <div className="text-center hover:scale-110 transition-transform duration-300">
                                <div className="font-bold text-lg text-purple-600">{course.instructor_details.courses}</div>
                                <div className="text-gray-600">Courses</div>
                              </div>
                              <div className="text-center hover:scale-110 transition-transform duration-300">
                                <div className="flex items-center gap-1 font-bold text-lg text-green-600">
                                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                  <span>{course.instructor_details.rating}</span>
                                </div>
                                <div className="text-gray-600">Rating</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{course.instructor_details.bio}</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div 
                    ref={(el: HTMLDivElement | null) => addToRefs(el, 6)}
                    className="opacity-0 translate-y-8 transition-all duration-700"
                  >
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>
                        <div className="text-center py-12">
                          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-blue-600" />
                          </div>
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">Be the First to Review!</h4>
                          <p className="text-gray-600">No reviews yet. Enroll now and share your experience.</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
      </div>

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
};

export default CourseDetail;