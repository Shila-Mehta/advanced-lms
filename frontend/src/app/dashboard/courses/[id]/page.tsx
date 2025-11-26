// app/courses/[id]/page.tsx
'use client';

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Heart,
  AlertCircle,
  Video,
  FileText,
  HelpCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCourseById, enrollInCourse, clearCurrentCourse } from "@/redux/slices/courseSlice";

const CourseDetail = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const dispatch = useAppDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get course data from Redux store - same pattern as your courses page
  const { currentCourse, lessons, loading, error } = useAppSelector(
    (state) => state.courses
  );

  // Debug logging
  useEffect(() => {
    console.log('Redux State:', {
      currentCourse,
      lessons,
      loading,
      error
    });
  }, [currentCourse, lessons, loading, error]);

  // Fetch course data when component mounts
  useEffect(() => {
    if (id) {
      console.log('Fetching course with ID:', id);
      dispatch(fetchCourseById(id));
    }

    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [dispatch, id]);

  // Animation observer
  useEffect(() => {
    if (currentCourse) {
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
    }
  }, [currentCourse]);

  const addToRefs = (el: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = el;
  };

  // Handle enrollment
  const handleEnroll = () => {
    if (currentCourse) {
      console.log('Enrolling in course:', currentCourse.id);
      dispatch(enrollInCourse(currentCourse.id)).then((result) => {
        if (enrollInCourse.fulfilled.match(result)) {
          console.log('Enrollment successful, redirecting to:', `/learn/${currentCourse.id}`);
          router.push(`/learn/${currentCourse.id}`);
        } else {
          console.error('Enrollment failed:', result);
        }
      });
    }
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  // Format lesson duration
  const formatLessonDuration = (duration?: number): string => {
    if (!duration) return '0 min';
    return `${duration} min`;
  };

  // Get section icon based on type
  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      case 'assignment':
        return <Award className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
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
                <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
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
  if (error || !currentCourse) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {error ? "Error Loading Course" : "Course Not Found"}
              </h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {error || "The course you're looking for doesn't exist or may have been removed."}
              </p>
              <div className="flex gap-4 justify-center">
                <Button 
                  onClick={() => dispatch(fetchCourseById(id))}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Link href="/courses">
                  <Button variant="outline">
                    Browse All Courses
                  </Button>
                </Link>
              </div>
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
                  <Badge className="mb-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    {currentCourse.category}
                  </Badge>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {currentCourse.title}
                  </h1>
                  <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                    {currentCourse.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold text-lg">{currentCourse.rating}</span>
                      <span className="text-gray-600">({currentCourse.reviews?.length || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-5 h-5" />
                      <span>{currentCourse.studentsCount?.toLocaleString() || '0'} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{currentCourse.duration}</span>
                    </div>
                    <Badge variant="outline" className="bg-white hover:bg-gray-50">
                      {currentCourse.level}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {currentCourse.instructor?.charAt(0) || 'I'}
                    </div>
                    <div>
                      <div className="font-medium">Created by {currentCourse.instructor}</div>
                      <div className="text-sm text-gray-600">Course Instructor</div>
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
                    <CardContent className="p-0 relative">
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          src={currentCourse.image || "/images/course-placeholder.jpg"}
                          alt={currentCourse.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/course-placeholder.jpg";
                          }}
                        />
                        <Button 
                          size="icon"
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl"
                          asChild
                        >
                          <Link href={`/learn/${currentCourse.id}`}>
                            <PlayCircle className="w-8 h-8 text-blue-600" />
                          </Link>
                        </Button>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-3xl font-bold text-blue-600">
                            {formatPrice(currentCourse.price)}
                          </div>
                          {currentCourse.originalPrice && currentCourse.originalPrice > currentCourse.price && (
                            <div className="text-lg text-gray-500 line-through">
                              {formatPrice(currentCourse.originalPrice)}
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          <Button 
                            onClick={handleEnroll}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl group"
                            size="lg"
                          >
                            Enroll Now
                            <Zap className="w-4 h-4 ml-2 group-hover:scale-125 transition-transform duration-300" />
                          </Button>
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
                            <span>{currentCourse.duration} of content</span>
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
                          {(currentCourse.learning || []).map((item, index) => (
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
                          {(currentCourse.requirements || []).map((req, index) => (
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

                  {/* Tags */}
                  {currentCourse.tags && currentCourse.tags.length > 0 && (
                    <div 
                      ref={(el: HTMLDivElement | null) => addToRefs(el, 4)}
                      className="opacity-0 translate-y-8 transition-all duration-700 delay-300"
                    >
                      <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 group">
                        <CardContent className="p-6">
                          <h3 className="text-2xl font-bold mb-6">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {currentCourse.tags.map((tag, index) => (
                              <Badge 
                                key={index} 
                                variant="secondary"
                                className="hover:scale-105 transition-transform duration-300 cursor-pointer"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="curriculum">
                  <div 
                    ref={(el: HTMLDivElement | null) => addToRefs(el, 5)}
                    className="opacity-0 translate-y-8 transition-all duration-700"
                  >
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Award className="w-6 h-6 text-blue-600" />
                          <h3 className="text-2xl font-bold">Course Curriculum</h3>
                          <Badge variant="outline" className="ml-2">
                            {lessons.length} lessons
                          </Badge>
                        </div>
                        {lessons.length > 0 ? (
                          <Accordion type="single" collapsible className="w-full space-y-4">
                            {lessons.map((lesson, index) => (
                              <AccordionItem 
                                key={lesson.id} 
                                value={`lesson-${lesson.id}`}
                                className="border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 data-[state=open]:shadow-lg"
                              >
                                <AccordionTrigger className="text-lg font-semibold p-6 hover:no-underline hover:bg-gray-50 rounded-lg transition-all duration-300">
                                  <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                                      {index + 1}
                                    </div>
                                    <span>{lesson.title}</span>
                                    <Badge variant="outline" className="ml-2">
                                      {formatLessonDuration(lesson.duration)}
                                    </Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-6 pb-6">
                                  {lesson.description && (
                                    <p className="text-gray-600 mb-4">{lesson.description}</p>
                                  )}
                                  {lesson.sections && lesson.sections.length > 0 && (
                                    <div className="space-y-3">
                                      {lesson.sections.map((section, sectionIndex) => (
                                        <div 
                                          key={section.id}
                                          className="flex items-center gap-3 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-200 group/section"
                                        >
                                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                            section.isCompleted 
                                              ? 'bg-green-100 text-green-600' 
                                              : 'bg-white text-gray-600'
                                          } group-hover/section:scale-110 transition-transform duration-300`}>
                                            {getSectionIcon(section.type)}
                                          </div>
                                          <div className="flex-1">
                                            <span className="font-medium text-sm">{section.title}</span>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                              <span className="px-1.5 py-0.5 bg-gray-200 rounded capitalize">
                                                {section.type}
                                              </span>
                                              {section.duration && section.duration > 0 && (
                                                <span>{formatLessonDuration(section.duration)}</span>
                                              )}
                                            </div>
                                          </div>
                                          {section.isCompleted && (
                                            <CheckCircle className="w-4 h-4 text-green-600" />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No curriculum available for this course yet.</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="instructor">
                  <div 
                    ref={(el: HTMLDivElement | null) => addToRefs(el, 6)}
                    className="opacity-0 translate-y-8 transition-all duration-700"
                  >
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6 mb-6">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-105 transition-transform duration-500">
                              {currentCourse.instructor?.charAt(0) || 'I'}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                              <Star className="w-4 h-4 text-white fill-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-1">{currentCourse.instructor}</h3>
                            <p className="text-gray-600 mb-4">Course Instructor</p>
                            <div className="flex flex-wrap gap-6 text-sm">
                              <div className="text-center hover:scale-110 transition-transform duration-300">
                                <div className="font-bold text-lg text-blue-600">{currentCourse.studentsCount?.toLocaleString() || '0'}</div>
                                <div className="text-gray-600">Students</div>
                              </div>
                              <div className="text-center hover:scale-110 transition-transform duration-300">
                                <div className="font-bold text-lg text-purple-600">1</div>
                                <div className="text-gray-600">Course</div>
                              </div>
                              <div className="text-center hover:scale-110 transition-transform duration-300">
                                <div className="flex items-center gap-1 font-bold text-lg text-green-600">
                                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                  <span>{currentCourse.rating}</span>
                                </div>
                                <div className="text-gray-600">Rating</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          Experienced instructor dedicated to providing high-quality learning experiences.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div 
                    ref={(el: HTMLDivElement | null) => addToRefs(el, 7)}
                    className="opacity-0 translate-y-8 transition-all duration-700"
                  >
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>
                        {currentCourse.reviews && currentCourse.reviews.length > 0 ? (
                          <div className="space-y-6">
                            {currentCourse.reviews.map((review) => (
                              <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                <div className="flex items-start gap-4 mb-3">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {review.user.name.charAt(0)}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold">{review.user.name}</h4>
                                      <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        <span className="text-sm font-medium">{review.rating}</span>
                                      </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                      {new Date(review.date).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                              <Heart className="w-8 h-8 text-blue-600" />
                            </div>
                            <h4 className="text-xl font-semibold text-gray-900 mb-2">Be the First to Review!</h4>
                            <p className="text-gray-600">No reviews yet. Enroll now and share your experience.</p>
                          </div>
                        )}
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