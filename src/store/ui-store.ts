// src/store/ui-store.ts
import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface UIState {
  sidebarOpen: boolean
  globalLoading: boolean
  toasts: Toast[]
}

interface UIActions {
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  setGlobalLoading: (loading: boolean) => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearToasts: () => void
}

type UIStore = UIState & UIActions

const initialState: UIState = {
  sidebarOpen: false,
  globalLoading: false,
  toasts: [],
}

export const useUIStore = create<UIStore>()((set) => ({
  ...initialState,

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  setGlobalLoading: (loading) => set({ globalLoading: loading }),

  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),
}))
