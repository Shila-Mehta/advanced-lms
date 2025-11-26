'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Star,
  Users,
  Clock,
  Filter,
  BookOpen,
  Award,
  PlayCircle,
  Zap,
  Sparkles
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchCourses } from "@/redux/slices/courseSlice";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();
  const { courses, loading, error } = useAppSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourses()).finally(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

  const categories = [
    "All Categories",
    "Web Development",
    "Data Science",
    "Design",
    "Business",
    "Marketing",
    "Programming"
  ];

  const displayCourses = courses.map(course => ({
    id: course.id,
    title: course.title,
    instructor: course.instructorInfo?.name || "Expert Instructor",
    rating: course.rating || 4.5,
    students: course.studentsCount || Math.floor(Math.random() * 1000) + 100,
    duration: course.duration || "24 hours",
    level: course.level || "Intermediate",
    category: course.category,
    price: course.price || 49.99,
    originalPrice: course.originalPrice,
    image: course.image || "/image.png",
    description: course.description,
    isPublished: course.isPublished,
    isFeatured: course.isFeatured || Math.random() > 0.7
  }));

  const filteredCourses = displayCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || course.level === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600 font-medium">Discovering amazing courses...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Header />
        <div className="pt-24 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Courses</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button
                onClick={() => dispatch(fetchCourses())}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <div className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">          <div className="absolute inset-0 bg-black/10" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-white/20 backdrop-blur text-white border-0 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                {courses.length}+ Professional Courses
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Build Career-Shaping Skills
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Master practical skills with industry-expert instructors and hands-on learning.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search courses, technologies, or instructors..."
                  className="pl-12 h-14 bg-white border-0 text-lg shadow-xl rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Rest of your code remains exactly the same */}
        {/* Filters Section */}
        <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Filter Courses</h3>
                  <p className="text-sm text-gray-600">Find your perfect learning path</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[200px] bg-white border-gray-200">
                    <BookOpen className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.filter(cat => cat !== "All Categories").map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-[180px] bg-white border-gray-200">
                    <Award className="w-4 h-4 mr-2 text-gray-500" />
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <div className="ml-auto flex items-center gap-4">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {filteredCourses.length} courses
                  </Badge>
                  {(searchQuery || selectedCategory !== "all" || selectedLevel !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedLevel("all");
                      }}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Clear filters
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filteredCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="group overflow-hidden border border-gray-200 bg-white hover:border-blue-300 hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col"
                  >
                    <div className="relative overflow-hidden">
                      <div className="aspect-video relative">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/image.png";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        <Button
                          size="icon"
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-300 shadow-lg"
                          asChild
                        >
                          <Link href={`/courses/${course.id}`}>
                            <PlayCircle className="w-5 h-5 text-blue-600" />
                          </Link>
                        </Button>
                      </div>

                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <Badge className="bg-blue-600 text-white border-0 shadow-md">
                          {course.category}
                        </Badge>
                        {course.isFeatured && (
                          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 shadow-md">
                            <Sparkles className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="bg-white/95 backdrop-blur shadow-md">
                          {course.level}
                        </Badge>
                      </div>
                    </div>

                    <CardContent className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 mb-4 text-sm line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                            {course.instructor.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{course.instructor}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                              <span className="font-semibold text-gray-900">{course.rating}</span>
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
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatPrice(course.price)}
                            </span>
                            {course.originalPrice && course.originalPrice > course.price && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatPrice(course.originalPrice)}
                              </span>
                            )}
                          </div>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                            asChild
                          >
                            <Link href={`/courses/${course.id}`}>
                              <Zap className="w-4 h-4 mr-2" />
                              Enroll Now
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No courses found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  We couldn't find any courses matching your criteria. Try adjusting your search terms or filters.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setSelectedLevel("all");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Show all courses
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Courses;