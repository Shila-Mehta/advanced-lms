'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { fetchCourses, updateCourse, deleteCourse } from '@/redux/slices/courseSlice';
import { Pencil, Trash2, Search, Filter, Users, BookOpen, BarChart } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AdminCourseDashboard() {
  const dispatch = useAppDispatch();
  const { courses, loading, error } = useAppSelector((state) => state.courses);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    isPublished: false,
  });

  // Fetch courses on mount
  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Dashboard summary stats
  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const draftCourses = totalCourses - publishedCourses;

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === 'All'
        ? true
        : filterStatus === 'Published'
        ? course.isPublished
        : !course.isPublished;
    return matchesSearch && matchesFilter;
  });

  // Edit and update logic
  const handleEdit = (course:any) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      isPublished:course.published,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (courseId:any) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await dispatch(deleteCourse(courseId)).unwrap();
      toast.success('Course deleted successfully!');
    } catch {
      toast.error('Error deleting course.');
    }
  };

  const handleFormSubmit = async (e:any) => {
    e.preventDefault();
    if (!selectedCourse) return;
    try {
      await dispatch(updateCourse({courseId:selectedCourse.id, data: formData })).unwrap();
      toast.success('Course updated successfully!');
      setIsModalOpen(false);
      setSelectedCourse(null);
    } catch {
      toast.error('Error updating course.');
    }
  };

  return (
    <div className="p-8 space-y-8">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart className="text-blue-600" /> Admin Course Dashboard
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Review, edit, and manage all instructor courses in the system.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <h3 className="text-sm text-gray-500">Total Courses</h3>
          <p className="text-2xl font-bold text-blue-700">{totalCourses}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-5">
          <h3 className="text-sm text-gray-500">Published</h3>
          <p className="text-2xl font-bold text-green-700">{publishedCourses}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
          <h3 className="text-sm text-gray-500">Draft / Pending</h3>
          <p className="text-2xl font-bold text-yellow-700">{draftCourses}</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-2 shadow-sm w-full md:w-1/2">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm outline-none"
          >
            <option value="All">All</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Course Cards */}
      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : filteredCourses.length === 0 ? (
        <p className="text-gray-600 text-center">No courses match your filters.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start mb-3">
                <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    course.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {course.isPublished ? 'Published' : 'Pending'}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{course.description}</p>

              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <BookOpen size={16} /> {course.category || 'Uncategorized'}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={16} /> {course.instructors?.length || 0} Instructors
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">${course.price}</span>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(course)}
                    className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-lg p-6 relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Course (Admin)</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Course Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 outline-none h-24 resize-none"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <label>Publish this course</label>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
