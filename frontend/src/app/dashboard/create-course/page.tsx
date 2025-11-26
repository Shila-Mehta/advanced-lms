'use client';

import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from '@/redux/slices/courseSlice';
import { fetchInstructors } from '@/redux/slices/instructorSlice';
import { Pencil, Trash2, Search, DollarSign, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { CourseForm } from '@/types/course';
import { Instructor } from '@/types/user';
import { useRouter } from 'next/navigation';

const categories = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Personal Development'];

const InstructorCourseManagementPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { courses, loading: coursesLoading } = useAppSelector((state) => state.courses);
  const { list: instructors, loading: instructorsLoading } = useAppSelector((state) => state.instructors);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<string | null>(null);
  const [filters, setFilters] = useState({ search: '', category: '', status: '' });
  const [newTag, setNewTag] = useState('');

  const [formData, setFormData] = useState<CourseForm>({
    title: '',
    description: '',
    price: 0,
    category: '',
    instructors: [],
    courseImage: '',
    isPublished: false,
    tags: [],
  });

  useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchInstructors());
  }, [dispatch]);

  // Filtered courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.description?.toLowerCase().includes(filters.search.toLowerCase());
    const matchesCategory = !filters.category || course.category === filters.category;
    const matchesStatus = !filters.status ||
      (filters.status === 'published' ? course.isPublished : !course.isPublished);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Open Add Modal
  const openAddModal = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      category: '',
      instructors: [],
      courseImage: '',
      isPublished: false,
      tags: [],
    });
    setCurrentCourseId(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (course: any) => {
    setFormData({
      title: course.title || '',
      description: course.description || '',
      price: course.price || 0,
      category: course.category || '',
      instructors: course.instructors?.map((i: Instructor | string) => typeof i === 'string' ? i : i.id) || [],
      courseImage: course.courseImage || '',
      isPublished: course.isPublished || false,
      tags: course.tags || [],
    });
    setCurrentCourseId(course.id);
    setModalOpen(true);
  };

  // Handle Form Submit
  const handleFormSubmit = async () => {
    try {
      if (currentCourseId) {
        await dispatch(updateCourse({ courseId: currentCourseId, data: formData })).unwrap();
        toast.success('Course updated successfully!');
      } else {
        await dispatch(createCourse(formData as any)).unwrap();
        toast.success('Course created successfully!');
      }
      setModalOpen(false);
    } catch {
      toast.error('Error saving course');
    }
  };

  // Delete Course
  const handleDelete = async (courseId: string) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await dispatch(deleteCourse(courseId)).unwrap();
        toast.success('Course deleted successfully!');
      } catch {
        toast.error('Error deleting course');
      }
    }
  };

  // Tag handlers
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Create, edit, and manage your courses</p>
        </div>
        <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2">
          <Pencil size={20} /> Add Course
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="flex-1 w-full relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <select value={filters.category} onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))} className="px-4 py-3 border border-gray-300 rounded-xl">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
          </select>

          <select value={filters.status} onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))} className="px-4 py-3 border border-gray-300 rounded-xl">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Pending Approval</option>
          </select>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Instructors</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coursesLoading || instructorsLoading ? (
              <tr><td colSpan={8} className="text-center py-8">Loading...</td></tr>
            ) : filteredCourses.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-8">No courses found</td></tr>
            ) : (
              filteredCourses.map(course => (
                <tr key={course.id} className="hover:bg-gray-50 cursor-pointer">
                  <td className="px-6 py-4" onClick={() => router.push(`/dashboard/courses/${course.id}`)}>
                    <div className="flex items-center gap-4">
                      <img src={course.courseImage || "/images/default-course.png"} className="w-12 h-12 rounded-xl object-cover border" />
                      <div>
                        <div className="font-medium">{course.title}</div>
                        <div className="text-gray-500 text-xs">{course.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><DollarSign size={14} /> {course.price}</td>
                  <td className="px-6 py-4">{course.category || 'Uncategorized'}</td>
                  <td className="px-6 py-4">{course.isPublished ? '✅ Published' : '⏸️ Pending'}</td>
                  <td className="px-6 py-4">{course.students?.length || 0}</td>
                  <td className="px-6 py-4">
                    {course.instructors?.map(inst => inst.name).join(', ')}
                  </td>
                  <td className="px-6 py-4">{new Date(course.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={(e) => { e.stopPropagation(); openEditModal(course); }}><Pencil size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(course.id); }}><Trash2 size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); router.push(`/dashboard/courses/${course.id}`); }}>📚</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative">
            <button className="absolute top-4 right-4" onClick={() => setModalOpen(false)}><X size={20} /></button>
            <h2 className="text-xl font-semibold mb-4">{currentCourseId ? 'Edit Course' : 'Add Course'}</h2>

            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Course Title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="px-4 py-2 border rounded-xl w-full"
              />

              <textarea
                placeholder="Course Description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="px-4 py-2 border rounded-xl w-full"
              />

              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="px-4 py-2 border rounded-xl w-full"
              />

              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="px-4 py-2 border rounded-xl w-full"
              >
                <option value="">Select Category</option>
                {categories.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
              </select>

              {/* Instructors Multi-Select */}
              {/* Instructors Multi-Select */}
              <div className="flex flex-col gap-2">
                <label className="font-medium">Instructors</label>

                {/* Dropdown */}
                <select
                  value=""
                  onChange={e => {
                    const selectedId = e.target.value;
                    if (selectedId && !formData.instructors.includes(selectedId)) {
                      setFormData(prev => ({ ...prev, instructors: [...prev.instructors, selectedId] }));
                    }
                  }}
                  className="px-4 py-2 border rounded-xl w-full"
                >
                  <option value="">Select Instructor</option>
                  {instructors.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name}</option>
                  ))}
                </select>

                {/* Display selected instructors */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.instructors.map(id => {
                    const inst = instructors.find(i => i.id === id);
                    if (!inst) return null;
                    return (
                      <span key={id} className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
                        {inst.name}
                        <X
                          size={14}
                          className="cursor-pointer"
                          onClick={() =>
                            setFormData(prev => ({
                              ...prev,
                              instructors: prev.instructors.filter(i => i !== id)
                            }))
                          }
                        />
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  className="px-4 py-2 border rounded-xl flex-1"
                />
                <button onClick={addTag} className="bg-blue-600 text-white px-4 py-2 rounded-xl">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
                    {tag} <X size={14} className="cursor-pointer" onClick={() => removeTag(tag)} />
                  </span>
                ))}
              </div>

              {/* Course Image */}
              <input
                type="text"
                placeholder="Course Image URL"
                value={formData.courseImage}
                onChange={e => setFormData(prev => ({ ...prev, courseImage: e.target.value }))}
                className="px-4 py-2 border rounded-xl w-full"
              />

              {/* Published Toggle */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={e => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                />
                Published
              </label>

              <button onClick={handleFormSubmit} className="bg-green-600 text-white px-6 py-3 rounded-xl mt-2">
                {currentCourseId ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorCourseManagementPage;
