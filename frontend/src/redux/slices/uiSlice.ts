import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  read: boolean;
  timestamp: Date;
}

export interface Modal {
  id: string;
  type: string;
  props?: any;
  isOpen: boolean;
}

export interface SidebarState {
  isOpen: boolean;
  expandedItems: string[];
}

interface UIState {
  theme: 'light' | 'dark';
  sidebar: SidebarState;
  modals: Modal[];
  notifications: Notification[];
  loading: {
    global: boolean;
    auth: boolean;
    courses: boolean;
    dashboard: boolean;
  };
  currentPage: string;
  mobileMenuOpen: boolean;
}

const initialState: UIState = {
  theme: 'light',
  sidebar: {
    isOpen: true,
    expandedItems: ['dashboard'],
  },
  modals: [],
  notifications: [],
  loading: {
    global: false,
    auth: false,
    courses: false,
    dashboard: false,
  },
  currentPage: 'dashboard',
  mobileMenuOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Theme actions
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },

    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebar.isOpen = action.payload;
    },
    toggleSidebarItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      const index = state.sidebar.expandedItems.indexOf(itemId);
      
      if (index > -1) {
        state.sidebar.expandedItems.splice(index, 1);
      } else {
        state.sidebar.expandedItems.push(itemId);
      }
    },
    expandSidebarItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      if (!state.sidebar.expandedItems.includes(itemId)) {
        state.sidebar.expandedItems.push(itemId);
      }
    },
    collapseSidebarItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.sidebar.expandedItems = state.sidebar.expandedItems.filter(id => id !== itemId);
    },

    // Modal actions
    openModal: (state, action: PayloadAction<{ id: string; type: string; props?: any }>) => {
      const { id, type, props } = action.payload;
      const existingModal = state.modals.find(modal => modal.id === id);
      
      if (!existingModal) {
        state.modals.push({
          id,
          type,
          props,
          isOpen: true,
        });
      } else {
        existingModal.isOpen = true;
        existingModal.props = props;
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const modalId = action.payload;
      const modal = state.modals.find(m => m.id === modalId);
      if (modal) {
        modal.isOpen = false;
      }
    },
    removeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(modal => modal.id !== action.payload);
    },

    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false,
        ...action.payload,
      };
      state.notifications.unshift(newNotification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Loading actions
    setLoading: (state, action: PayloadAction<{ key: keyof UIState['loading']; value: boolean }>) => {
      const { key, value } = action.payload;
      state.loading[key] = value;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },

    // Page actions
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },

    // Mobile menu actions
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
  },
});

export const {
  // Theme
  toggleTheme,
  setTheme,
  
  // Sidebar
  toggleSidebar,
  setSidebarOpen,
  toggleSidebarItem,
  expandSidebarItem,
  collapseSidebarItem,
  
  // Modals
  openModal,
  closeModal,
  removeModal,
  
  // Notifications
  addNotification,
  removeNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotifications,
  
  // Loading
  setLoading,
  setGlobalLoading,
  
  // Page
  setCurrentPage,
  
  // Mobile menu
  toggleMobileMenu,
  setMobileMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;