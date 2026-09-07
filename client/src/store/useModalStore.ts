import { create } from "zustand";

interface ModalState {
  isLoginModalOpen: boolean;
  isPostModalOpen: boolean;
  isCommentModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openPostModal: () => void;
  closePostModal: () => void;
  openCommentModal: () => void;
  closeCommentModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isLoginModalOpen: false,
  isPostModalOpen: false,
  isCommentModalOpen: false,
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
  openPostModal: () => set({ isPostModalOpen: true }),
  closePostModal: () => set({ isPostModalOpen: false }),
  openCommentModal: () => set({ isCommentModalOpen: true }),
  closeCommentModal: () => set({ isCommentModalOpen: false }),
}));
