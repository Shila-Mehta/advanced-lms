'use client';
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  CheckCircle,
  FileText,
  MessageSquare,
  BookOpen,
  Menu,
  X,
  Loader2,
  AlertCircle,
  Code,
  HelpCircle,
  Activity
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCourseById, markLessonCompleted } from "@/redux/slices/courseSlice";

const CoursePlayer = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const dispatch = useAppDispatch();

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  // Get course data from Redux store
  const { currentCourse, loading, error, lessons } = useAppSelector(
    (state) => state.courses
  );

  const totalLessons = lessons.length;
  const currentLesson = lessons[currentLessonIndex];

  // Fetch course data when component mounts
  useEffect(() => {
    if (id) {
      console.log('Fetching course with ID:', id);
      dispatch(fetchCourseById(id));
    }
  }, [dispatch, id]);

  // Handle mark lesson as completed
  const handleMarkComplete = async () => {
    if (!currentCourse || !currentLesson) return;

    setIsMarkingComplete(true);
    try {
      await dispatch(markLessonCompleted({
        courseId: currentCourse._id,
        lessonId: currentLesson._id
      })).unwrap();
    } catch (error) {
      console.error('Failed to mark lesson as completed:', error);
    } finally {
      setIsMarkingComplete(false);
    }
  };

  // Calculate progress
  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Navigation functions
  const goToNextLesson = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  // Get lesson icon based on type
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return PlayCircle;
      case 'text': return BookOpen;
      case 'quiz': return HelpCircle;
      case 'code': return Code;
      case 'exercise': return Activity;
      case 'assignment': return FileText;
      default: return FileText;
    }
  };

  // Get lesson badge color based on type
  const getLessonBadgeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-blue-100 text-blue-800';
      case 'text': return 'bg-gray-100 text-gray-800';
      case 'quiz': return 'bg-purple-100 text-purple-800';
      case 'code': return 'bg-green-100 text-green-800';
      case 'exercise': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Render lesson content based on type
  const renderLessonContent = (lesson: any) => {
    if (!lesson) return null;

    switch (lesson.type) {
      case 'text':
        return (
          <div className="prose prose-lg max-w-none">
            {lesson.content && (
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            )}
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Quiz: {lesson.title}</h3>
            {lesson.quiz && lesson.quiz.length > 0 ? (
              <div className="space-y-4">
                {lesson.quiz.map((question: any, index: number) => (
                  <Card key={index} className="p-4">
                    <h4 className="font-semibold mb-3">{question.question}</h4>
                    <div className="space-y-2">
                      {question.options.map((option: string, optIndex: number) => (
                        <div key={optIndex} className="flex items-center space-x-2">
                          <input 
                            type="radio" 
                            id={`q${index}-opt${optIndex}`} 
                            name={`question-${index}`} 
                            className="w-4 h-4"
                          />
                          <label htmlFor={`q${index}-opt${optIndex}`} className="text-sm">
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                    {question.explanation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">{question.explanation}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No quiz questions available.</p>
            )}
          </div>
        );

      case 'code':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Code Exercise: {lesson.title}</h3>
            {lesson.code && lesson.code.length > 0 ? (
              <div className="space-y-4">
                {lesson.code.map((codeBlock: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline">{codeBlock.language}</Badge>
                    </div>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                      <code>{codeBlock.code}</code>
                    </pre>
                    {codeBlock.description && (
                      <p className="mt-2 text-sm text-muted-foreground">{codeBlock.description}</p>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No code exercises available.</p>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Content type not supported.</p>
          </div>
        );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading course content...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !currentCourse) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error ? "Error Loading Course" : "Course Not Found"}
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The course you're looking for doesn't exist."}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => dispatch(fetchCourseById(id))}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Try Again
            </Button>
            <Link href="/courses">
              <Button variant="outline">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/courses">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">{currentCourse.title}</h1>
              <p className="text-sm text-muted-foreground">
                {completedLessons}/{totalLessons} lessons completed • {progress}%
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
        <div className="px-6 pb-2">
          <Progress value={progress} className="h-1" />
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-6xl mx-auto">
            {/* Video Player (only for video lessons) */}
            {currentLesson?.type === 'video' && currentLesson?.videoUrl && (
              <Card className="mb-6 overflow-hidden border-border/40">
                <div className="relative bg-black aspect-video flex items-center justify-center">
                  {(() => {
                    const isYouTube = currentLesson.videoUrl.includes('youtube.com') || currentLesson.videoUrl.includes('youtu.be');

                    if (isYouTube) {
                      const videoId = currentLesson.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];

                      return videoId ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={currentLesson.title}
                        />
                      ) : (
                        <div className="text-white text-center">
                          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>Invalid YouTube URL</p>
                        </div>
                      );
                    } else {
                      return (
                        <video
                          controls
                          className="w-full h-full"
                          poster="/video-poster.jpg"
                        >
                          <source src={currentLesson.videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      );
                    }
                  })()}
                </div>
              </Card>
            )}

            {/* Lesson Info */}
            {currentLesson ? (
              <div className="mb-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {(() => {
                        const IconComponent = getLessonIcon(currentLesson.type);
                        return <IconComponent className="w-6 h-6 text-primary" />;
                      })()}
                      <Badge className={getLessonBadgeColor(currentLesson.type)}>
                        {currentLesson.type}
                      </Badge>
                      {currentLesson.metadata?.difficulty && (
                        <Badge variant="outline" className="capitalize">
                          {currentLesson.metadata.difficulty}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-3xl font-bold mb-2">{currentLesson.title}</h2>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>Lesson {currentLessonIndex + 1} of {totalLessons}</span>
                      <span>•</span>
                      <span>{currentLesson.duration ? `${currentLesson.duration} minutes` : 'No duration'}</span>
                      {currentLesson.completed && (
                        <>
                          <span>•</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    onClick={handleMarkComplete}
                    className={currentLesson.completed ?
                      "bg-green-600 hover:bg-green-700" :
                      "bg-gradient-primary"
                    }
                    disabled={currentLesson.completed || isMarkingComplete}
                  >
                    {isMarkingComplete ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    )}
                    {currentLesson.completed ? "Completed" :
                      isMarkingComplete ? "Marking..." : "Mark Complete"}
                  </Button>
                </div>

                {currentLesson.description && (
                  <p className="text-muted-foreground mb-4">{currentLesson.description}</p>
                )}
              </div>
            ) : (
              <div className="mb-6 text-center py-8">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h2 className="text-2xl font-bold mb-2">No Lesson Selected</h2>
                <p className="text-muted-foreground">
                  Select a lesson from the sidebar to get started.
                </p>
              </div>
            )}

            {/* Lesson Content (for non-video lessons) */}
            {currentLesson && currentLesson.type !== 'video' && (
              <Card className="mb-6 border-border/40">
                <CardContent className="p-6">
                  {renderLessonContent(currentLesson)}
                </CardContent>
              </Card>
            )}

            {/* Content Tabs */}
            <Tabs defaultValue="overview" className="mb-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="resources">
                  <FileText className="w-4 h-4 mr-2" />
                  Resources
                </TabsTrigger>
                <TabsTrigger value="discussion">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Discussion
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="border-border/40 bg-card/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">
                      {currentLesson ? `About "${currentLesson.title}"` : 'Course Overview'}
                    </h3>
                    
                    {/* Show lesson content in overview for non-video lessons */}
                    {currentLesson && currentLesson.type !== 'video' && currentLesson.content ? (
                      <div className="prose prose-lg max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                      </div>
                    ) : currentLesson?.description ? (
                      <p className="text-muted-foreground mb-4">{currentLesson.description}</p>
                    ) : (
                      <p className="text-muted-foreground mb-4">
                        {currentCourse.description}
                      </p>
                    )}

                    {currentCourse.learning && currentCourse.learning.length > 0 && (
                      <>
                        <h4 className="font-semibold mb-3">What You'll Learn:</h4>
                        <ul className="space-y-2 text-muted-foreground">
                          {currentCourse.learning.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="mt-6">
                <Card className="border-border/40 bg-card/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Lesson Resources</h3>
                    <div className="space-y-3">
                      {currentLesson?.resources && currentLesson.resources.length > 0 ? (
                        currentLesson.resources.map((resource: any, index: number) => (
                          <Button key={index} variant="outline" className="w-full justify-start" asChild>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              <FileText className="w-4 h-4 mr-2" />
                              {resource.name}
                            </a>
                          </Button>
                        ))
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No resources available for this lesson</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="discussion" className="mt-6">
                <Card className="border-border/40 bg-card/50">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Discussion</h3>
                    <p className="text-muted-foreground mb-4">
                      Join the conversation with other students and instructors. Ask questions,
                      share insights, and collaborate with your peers.
                    </p>
                    <div className="mt-4 p-6 bg-muted/50 rounded-lg text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-sm text-muted-foreground">
                        Discussion forum coming soon!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Navigation */}
            {currentLesson && (
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  disabled={currentLessonIndex === 0}
                  onClick={goToPreviousLesson}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous Lesson
                </Button>
                <Button
                  className="bg-gradient-primary"
                  disabled={currentLessonIndex === lessons.length - 1}
                  onClick={goToNextLesson}
                >
                  Next Lesson
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside
          className={`
            w-80 border-l border-border/40 bg-card/50 overflow-y-auto
            ${isSidebarOpen ? 'block' : 'hidden'} lg:block
            absolute lg:relative right-0 top-0 h-full z-40 lg:z-auto
            transition-transform duration-300 ease-in-out
            ${!isSidebarOpen ? 'translate-x-full lg:translate-x-0' : ''}
          `}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Course Content</h3>
              <span className="text-sm text-muted-foreground">
                {completedLessons}/{totalLessons}
              </span>
            </div>
            <div className="space-y-2">
              {lessons.length > 0 ? (
                lessons.map((lesson, index) => {
                  const IconComponent = getLessonIcon(lesson.type);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        setCurrentLessonIndex(index);
                        if (window.innerWidth < 1024) {
                          setIsSidebarOpen(false);
                        }
                      }}
                      className={`
                        w-full text-left p-4 rounded-lg transition-all border
                        ${index === currentLessonIndex
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
                          : 'bg-background hover:bg-secondary border-border hover:border-primary/30'
                        }
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {lesson.completed ? (
                          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-500" />
                        ) : (
                          <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${index === currentLessonIndex ? 'text-primary-foreground' : 'text-muted-foreground'
                            }`} />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium mb-1 truncate ${index === currentLessonIndex ? 'text-primary-foreground' : 'text-foreground'
                            }`}>
                            {lesson.title}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getLessonBadgeColor(lesson.type)}`}
                            >
                              {lesson.type}
                            </Badge>
                            <span className={`text-sm ${index === currentLessonIndex ? 'text-primary-foreground/80' : 'text-muted-foreground'
                              }`}>
                              {lesson.duration ? `${lesson.duration} min` : 'No duration'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No lessons available</p>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayer;