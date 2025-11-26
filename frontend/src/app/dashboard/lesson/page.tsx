'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchLessons, createLesson, updateLesson, deleteLesson } from '@/redux/slices/lessonSlice';
import { ILesson } from '@/types/lesson';

const InstructorLessonsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;

  const dispatch = useAppDispatch();
  const { lessons, loading, error } = useAppSelector(state => state.lessons);

  // Debug logging
  useEffect(() => {
    console.log('Lessons:', lessons);
  }, [lessons]);

  useEffect(() => {
    if (error) {
      console.error('Lesson Error:', error);
    }
  }, [error]);

  const [modalOpen, setModalOpen] = useState(false);
  const [currentLesson, setCurrentLesson] = useState<ILesson | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    content: '',
    duration: 0,
    videoUrl: '',
    type: 'video' as 'video' | 'text' | 'quiz',
    order: 1
  });

  // Fetch lessons on mount
  useEffect(() => {
    if (courseId) {
      dispatch(fetchLessons(courseId))
        .unwrap()
        .catch((err) => {
          console.error('Fetch lessons error:', err);
          toast.error('Failed to fetch lessons');
        });
    }
  }, [dispatch, courseId]);


  // Open Add Modal
  const openAddModal = () => {
    setFormData({id :'', title: '', content: '', duration: 0, videoUrl: '', type: 'video', order: lessons.length + 1 });
    setCurrentLesson(null);
    setModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (lesson: ILesson) => {
    setFormData({
      id:lesson.id,
      title: lesson.title,
      content: lesson.content,
      duration: lesson.duration || 0,
      videoUrl: lesson.videoUrl || '',
      type: lesson.type,
      order: lesson.order
    });
    setCurrentLesson(lesson);
    setModalOpen(true);
  };

  // Form Submit
  const handleFormSubmit = async () => {
    try {
      if (currentLesson) {
        await dispatch(updateLesson({ courseId, lessonId:currentLesson.id, lesson:formData })).unwrap();
        toast.success('Lesson updated successfully');
      } else {
        await dispatch(createLesson({courseId, lesson:formData })).unwrap();
        toast.success('Lesson created successfully');
      }
      setModalOpen(false);
    } catch {
      toast.error('Failed to save lesson');
    }
  };

  // Delete Lesson
  const handleDelete = async (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await dispatch(deleteLesson({ courseId, lessonId })).unwrap();
      toast.success('Lesson deleted successfully');
    } catch {
      toast.error('Failed to delete lesson');
    }
  };


  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Lessons</h1>
        <button onClick={openAddModal} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl">
          <Plus size={18} /> Add Lesson
        </button>
      </div>

      {loading ? (
        <p>Loading lessons...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : lessons.length === 0 ? (
        <p>No lessons yet. Add one above.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">{lesson.order}</td>
                  <td className="px-6 py-4">{lesson.title}</td>
                  <td className="px-6 py-4">{lesson.type}</td>
                  <td className="px-6 py-4">{lesson.duration || '-'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEditModal(lesson)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(lesson.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{currentLesson ? 'Edit Lesson' : 'Add Lesson'}</h2>
              <button onClick={() => setModalOpen(false)}><X size={24} /></button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Lesson Title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border rounded"
              />
              <textarea
                placeholder="Lesson Content"
                value={formData.content}
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="number"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={e => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="w-full px-4 py-2 border rounded"
              />
              <input
                type="url"
                placeholder="Video URL (optional)"
                value={formData.videoUrl}
                onChange={e => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                className="w-full px-4 py-2 border rounded"
              />
              <select value={formData.type} onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as 'video' | 'text' | 'quiz' }))} className="w-full px-4 py-2 border rounded">
                <option value="video">Video</option>
                <option value="text">Text</option>
                <option value="quiz">Quiz</option>
              </select>
              <input
                type="number"
                placeholder="Order"
                value={formData.order}
                onChange={e => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                className="w-full px-4 py-2 border rounded"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                <button onClick={handleFormSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">{currentLesson ? 'Update' : 'Add'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstructorLessonsPage;
