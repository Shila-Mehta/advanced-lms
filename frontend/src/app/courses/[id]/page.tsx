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
  RefreshCw,
  Code,
  Activity,
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

  const { currentCourse, lessons, loading, error } = useAppSelector(
    (state) => state.courses
  );

  useEffect(() => {
    if (id) {
      console.log('Fetching course with ID:', id);
      dispatch(fetchCourseById(id));
    }

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [dispatch, id]);

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

  const handleEnroll = () => {
    if (currentCourse) {
      console.log('Enrolling in course:', id);
      dispatch(enrollInCourse(id)).then((result) => {
        if (enrollInCourse.fulfilled.match(result)) {
          console.log('Enrollment successful, redirecting to:', `/learn/${id}`);
          router.push(`/learn/${id}`);
        } else {
          console.error('Enrollment failed:', result);
        }
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatLessonDuration = (duration?: number): string => {
    if (!duration) return '0 min';
    return `${duration} min`;
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      case 'code':
        return <Code className="w-4 h-4" />;
      case 'exercise':
        return <Activity className="w-4 h-4" />;
      case 'assignment':
        return <Award className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getLessonBadgeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'text':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'quiz':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'code':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'exercise':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
                          src={currentCourse.image || "/image.png"}
                          alt={currentCourse.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/image.png";
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
                      key={index}
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

                  {/* Features */}
                  <div
                    ref={(el: HTMLDivElement | null) => addToRefs(el, 4)}
                    className="opacity-0 translate-y-8 transition-all duration-700 delay-300"
                  >
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 group">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-6">This Course Includes</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          {(currentCourse.features || []).map((feature: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-all duration-300"
                            >
                              <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Tags */}
                  {currentCourse.tags && currentCourse.tags.length > 0 && (
                    <div
                      ref={(el: HTMLDivElement | null) => addToRefs(el, 5)}
                      className="opacity-0 translate-y-8 transition-all duration-700 delay-400"
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
                  <div className="opacity-100">
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-6">
                          <Award className="w-6 h-6 text-blue-600" />
                          <h3 className="text-2xl font-bold">Course Curriculum</h3>
                          <Badge variant="outline" className="ml-2">
                            {Array.isArray(lessons) ? lessons.length : 0} lessons
                          </Badge>
                        </div>

                        {!lessons || lessons.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p>No curriculum available for this course yet.</p>
                          </div>
                        ) : (
                          <Accordion type="single" collapsible className="w-full space-y-4">
                            {lessons.map((lesson: any, index: number) => {
                              const normalizedLesson = {
                                id: lesson?.id || lesson?._id || `lesson-${index}`,
                                _id: lesson?._id || lesson?.id,
                                title: lesson?.title || `Lesson ${index + 1}`,
                                description: lesson?.description,
                                duration: lesson?.duration || 0,
                                type: lesson?.type || 'video',
                                isCompleted: lesson?.completed || false,
                                content: lesson?.content,
                                code: lesson?.code || [],
                                quiz: lesson?.quiz || [],
                                metadata: lesson?.metadata || {},
                                videoUrl: lesson?.videoUrl
                              };

                              return (
                                <AccordionItem
                                  key={normalizedLesson.id}
                                  value={normalizedLesson.id}
                                  className="border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 data-[state=open]:shadow-lg"
                                >
                                  <AccordionTrigger className="text-lg font-semibold p-6 hover:no-underline hover:bg-gray-50 rounded-lg transition-all duration-300">
                                    <div className="flex items-center gap-4 w-full text-left">
                                      <div className="flex items-center gap-4 flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${normalizedLesson.isCompleted
                                          ? 'bg-green-100 text-green-600'
                                          : 'bg-blue-100 text-blue-600'
                                          }`}>
                                          {normalizedLesson.isCompleted ? (
                                            <CheckCircle className="w-4 h-4" />
                                          ) : (
                                            index + 1
                                          )}
                                        </div>
                                        <div>
                                          <span className="font-semibold">{normalizedLesson.title}</span>
                                          <div className="flex items-center gap-2 mt-1">
                                            <Badge 
                                              variant="outline" 
                                              className={`text-xs ${getLessonBadgeColor(normalizedLesson.type)}`}
                                            >
                                              {normalizedLesson.type}
                                            </Badge>
                                            {normalizedLesson.duration > 0 && (
                                              <Badge variant="outline" className="text-xs">
                                                {formatLessonDuration(normalizedLesson.duration)}
                                              </Badge>
                                            )}
                                            {normalizedLesson.metadata?.difficulty && (
                                              <Badge variant="outline" className="text-xs capitalize">
                                                {normalizedLesson.metadata.difficulty}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </AccordionTrigger>

                                  <AccordionContent className="px-6 pb-6">
                                    {/* Lesson Description */}
                                    {normalizedLesson.description && (
                                      <p className="text-gray-600 mb-4">{normalizedLesson.description}</p>
                                    )}

                                    {/* Lesson Metadata */}
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
                                      <div className="flex items-center gap-2">
                                        {getLessonIcon(normalizedLesson.type)}
                                        <span className="capitalize">{normalizedLesson.type}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>Duration: {formatLessonDuration(normalizedLesson.duration)}</span>
                                      </div>
                                      {normalizedLesson.metadata?.points && (
                                        <div className="flex items-center gap-2">
                                          <Award className="w-4 h-4" />
                                          <span>{normalizedLesson.metadata.points} points</span>
                                        </div>
                                      )}
                                      {normalizedLesson.metadata?.required !== false && (
                                        <div className="flex items-center gap-2">
                                          <CheckCircle className="w-4 h-4 text-green-600" />
                                          <span>Required</span>
                                        </div>
                                      )}
                                    </div>

                                    {/* Content Preview */}
                                    {normalizedLesson.content && (
                                      <div className="mb-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Content Preview</h4>
                                        <div className="prose prose-sm max-w-none bg-gray-50 p-3 rounded-lg">
                                          <div 
                                            className="text-gray-700 line-clamp-3"
                                            dangerouslySetInnerHTML={{ 
                                              __html: normalizedLesson.content.length > 200 
                                                ? normalizedLesson.content.substring(0, 200) + '...' 
                                                : normalizedLesson.content 
                                            }} 
                                          />
                                        </div>
                                      </div>
                                    )}

                                    {/* Code Exercises Preview */}
                                    {normalizedLesson.code && normalizedLesson.code.length > 0 && (
                                      <div className="mb-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Code Exercises</h4>
                                        <div className="space-y-2">
                                          {normalizedLesson.code.slice(0, 2).map((codeBlock: any, codeIndex: number) => (
                                            <div key={codeIndex} className="bg-gray-900 text-gray-100 p-3 rounded text-sm">
                                              <div className="flex justify-between items-center mb-2">
                                                <Badge variant="outline" className="text-xs bg-gray-800">
                                                  {codeBlock.language}
                                                </Badge>
                                              </div>
                                              <pre className="overflow-x-auto">
                                                <code>{codeBlock.code.substring(0, 100)}...</code>
                                              </pre>
                                            </div>
                                          ))}
                                          {normalizedLesson.code.length > 2 && (
                                            <p className="text-sm text-gray-500">
                                              +{normalizedLesson.code.length - 2} more code exercises
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Quiz Preview */}
                                    {normalizedLesson.quiz && normalizedLesson.quiz.length > 0 && (
                                      <div>
                                        <h4 className="font-medium text-gray-700 mb-2">Quiz Questions</h4>
                                        <div className="space-y-2">
                                          {normalizedLesson.quiz.slice(0, 2).map((question: any, quizIndex: number) => (
                                            <div key={quizIndex} className="bg-gray-50 p-3 rounded text-sm">
                                              <p className="font-medium mb-2">{question.question}</p>
                                              <p className="text-gray-500 text-xs">
                                                {question.options.length} options
                                              </p>
                                            </div>
                                          ))}
                                          {normalizedLesson.quiz.length > 2 && (
                                            <p className="text-sm text-gray-500">
                                              +{normalizedLesson.quiz.length - 2} more questions
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Video Preview */}
                                    {normalizedLesson.videoUrl && (
                                      <div className="mt-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Video Content</h4>
                                        <div className="bg-gray-900 aspect-video rounded-lg flex items-center justify-center">
                                          <div className="text-center text-white">
                                            <Video className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                            <p className="text-sm">Video lesson available</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </AccordionContent>
                                </AccordionItem>
                              );
                            })}
                          </Accordion>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="instructor">
                  <div className="opacity-100">
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 group">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6 mb-6">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-105 transition-transform duration-500">
                              {currentCourse.instructorInfo?.name?.charAt(0) || 'I'}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                              <Star className="w-4 h-4 text-white fill-white" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold mb-1">
                              {currentCourse.instructorInfo?.name || currentCourse.instructor}
                            </h3>
                            <p className="text-gray-600 mb-4">
                              {currentCourse.instructorInfo?.title || 'Course Instructor'}
                            </p>
                            <div className="flex flex-wrap gap-6 text-sm">
                              <div className="text-center hover:scale-110 transition-transform duration-300">
                                <div className="font-bold text-lg text-blue-600">
                                  {currentCourse.instructorInfo?.students?.toLocaleString() || currentCourse.studentsCount?.toLocaleString() || '0'}
                                </div>
                                <div className="text-gray-600">Students</div>
                              </div>
                              <div className="text-center hover:scale-110 transition-transform duration-300">
                                <div className="font-bold text-lg text-purple-600">
                                  {currentCourse.instructorInfo?.courses || '1'}
                                </div>
                                <div className="text-gray-600">Courses</div>
                              </div>
                              <div className="text-center hover:scale-110 transition-transform duration-300">
                                <div className="flex items-center gap-1 font-bold text-lg text-green-600">
                                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                  <span>{currentCourse.instructorInfo?.rating || currentCourse.rating}</span>
                                </div>
                                <div className="text-gray-600">Rating</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {currentCourse.instructorInfo?.bio ||
                            "Experienced instructor dedicated to providing high-quality learning experiences."}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="opacity-100">
                    <Card className="border-gray-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500">
                      <CardContent className="p-6">
                        <h3 className="text-2xl font-bold mb-6">Student Reviews</h3>

                        {currentCourse.reviews && Array.isArray(currentCourse.reviews) && currentCourse.reviews.length > 0 ? (
                          <div className="space-y-6">
                            {currentCourse.reviews.map((review: any) => (
                              <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                <div className="flex items-start gap-4 mb-3">
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                    {review.user?.name?.charAt(0) || 'U'}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-semibold">{review.user?.name || 'Anonymous User'}</h4>
                                      <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                                        <span className="text-sm font-medium">{review.rating}</span>
                                      </div>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                      {review.date ? new Date(review.date).toLocaleDateString() : 'Recent'}
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
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CourseDetail;