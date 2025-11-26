'use client';
import React from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { closeModal } from '@/redux/slices/uiSlice';

const ConfirmModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const confirmModals = useAppSelector(state =>
    state.ui.modals.filter(m => m.type === 'confirm' && m.isOpen)
  );

  return (
    <>
      {confirmModals.map(modal => (
        <div key={modal.id} className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{modal.props.title}</h2>
            <p className="mb-6">{modal.props.message}</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => dispatch(closeModal(modal.id))}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  modal.props.onConfirm?.();
                  dispatch(closeModal(modal.id));
                }}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ConfirmModal;
