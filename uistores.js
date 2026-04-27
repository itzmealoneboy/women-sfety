import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // Sidebar state
  sidebarOpen: false,
  
  // Theme
  theme: 'light',
  
  // Loading states
  loading: {
    global: false,
    page: false,
    component: {}
  },
  
  // Modals
  modals: {
    sos: false,
    auth: false,
    confirm: false,
    imageView: false,
    documentView: false,
    locationShare: false
  },
  
  // Notifications
  notifications: [],
  
  // Toast
  toasts: [],
  
  // Breadcrumbs
  breadcrumbs: [],
  
  // Recent pages
  recentPages: [],
  
  // Search
  searchQuery: '',
  searchResults: [],
  searchOpen: false,
  
  // Filters
  filters: {},
  
  // Sort
  sort: {
    field: 'createdAt',
    direction: 'desc'
  },
  
  // Pagination
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false
  },

  // Sidebar actions
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),

  // Theme actions
  setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    get().setTheme(newTheme);
  },

  // Loading actions
  setGlobalLoading: (loading) => set(state => ({
    loading: { ...state.loading, global: loading }
  })),
  setPageLoading: (loading) => set(state => ({
    loading: { ...state.loading, page: loading }
  })),
  setComponentLoading: (component, loading) => set(state => ({
    loading: {
      ...state.loading,
      component: { ...state.loading.component, [component]: loading }
    }
  })),

  // Modal actions
  openModal: (modal) => set(state => ({
    modals: { ...state.modals, [modal]: true }
  })),
  closeModal: (modal) => set(state => ({
    modals: { ...state.modals, [modal]: false }
  })),
  toggleModal: (modal) => set(state => ({
    modals: { ...state.modals, [modal]: !state.modals[modal] }
  })),
  closeAllModals: () => set(state => ({
    modals: Object.keys(state.modals).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {})
  })),

  // Notification actions
  addNotification: (notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    set(state => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50)
    }));
    
    return id;
  },
  removeNotification: (id) => set(state => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  markNotificationAsRead: (id) => set(state => ({
    notifications: state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
  })),
  markAllNotificationsAsRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),
  clearNotifications: () => set({ notifications: [] }),

  // Toast actions
  addToast: (toast) => {
    const id = Date.now().toString();
    const newToast = {
      id,
      timestamp: Date.now(),
      ...toast
    };
    
    set(state => ({
      toasts: [...state.toasts, newToast]
    }));
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      get().removeToast(id);
    }, toast.duration || 3000);
    
    return id;
  },
  removeToast: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
  clearToasts: () => set({ toasts: [] }),

  // Breadcrumb actions
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  addBreadcrumb: (breadcrumb) => set(state => ({
    breadcrumbs: [...state.breadcrumbs, breadcrumb]
  })),
  clearBreadcrumbs: () => set({ breadcrumbs: [] }),

  // Recent pages actions
  addRecentPage: (page) => set(state => ({
    recentPages: [
      { path: page, timestamp: Date.now() },
      ...state.recentPages.filter(p => p.path !== page)
    ].slice(0, 10)
  })),
  clearRecentPages: () => set({ recentPages: [] }),

  // Search actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchResults: (results) => set({ searchResults: results }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false, searchQuery: '', searchResults: [] }),

  // Filter actions
  setFilter: (key, value) => set(state => ({
    filters: { ...state.filters, [key]: value }
  })),
  removeFilter: (key) => set(state => {
    const { [key]: _, ...rest } = state.filters;
    return { filters: rest };
  }),
  clearFilters: () => set({ filters: {} }),

  // Sort actions
  setSort: (field, direction) => set({ sort: { field, direction } }),
  toggleSortDirection: () => set(state => ({
    sort: {
      ...state.sort,
      direction: state.sort.direction === 'asc' ? 'desc' : 'asc'
    }
  })),

  // Pagination actions
  setPage: (page) => set(state => ({
    pagination: { ...state.pagination, page }
  })),
  setLimit: (limit) => set(state => ({
    pagination: { ...state.pagination, limit, page: 1 }
  })),
  setTotal: (total) => set(state => ({
    pagination: { ...state.pagination, total, hasMore: state.pagination.page * state.pagination.limit < total }
  })),
  nextPage: () => set(state => ({
    pagination: {
      ...state.pagination,
      page: state.pagination.page + 1,
      hasMore: (state.pagination.page + 1) * state.pagination.limit < state.pagination.total
    }
  })),
  prevPage: () => set(state => ({
    pagination: {
      ...state.pagination,
      page: Math.max(1, state.pagination.page - 1),
      hasMore: true
    }
  })),
  resetPagination: () => set({
    pagination: { page: 1, limit: 10, total: 0, hasMore: false }
  }),

  // Utility getters
  getUnreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },
  
  isLoading: (component) => {
    const { loading } = get();
    if (component) {
      return loading.component[component] || false;
    }
    return loading.global || loading.page;
  },

  // Clear all state
  clearAll: () => set({
    sidebarOpen: false,
    theme: 'light',
    loading: { global: false, page: false, component: {} },
    modals: {
      sos: false,
      auth: false,
      confirm: false,
      imageView: false,
      documentView: false,
      locationShare: false
    },
    notifications: [],
    toasts: [],
    breadcrumbs: [],
    recentPages: [],
    searchQuery: '',
    searchResults: [],
    searchOpen: false,
    filters: {},
    sort: { field: 'createdAt', direction: 'desc' },
    pagination: { page: 1, limit: 10, total: 0, hasMore: false }
  })
}));
