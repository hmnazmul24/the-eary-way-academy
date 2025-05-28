import { create } from "zustand";

interface FilterInfo {
  studentDetailDialog: boolean;
  setStudentDetailDialog: (info: boolean) => void;
  studentPaymentDialog: boolean;
  setStudentPaymentDialog: (info: boolean) => void;
  studentDeleteDialog: boolean;
  setStudentDeleteDialog: (info: boolean) => void;
}

const useModalShowHooks = create<FilterInfo>((set) => ({
  studentDetailDialog: false,
  setStudentDetailDialog: (status) => set({ studentDetailDialog: status }),
  studentPaymentDialog: false,
  setStudentPaymentDialog: (info) => set({ studentPaymentDialog: info }),
  studentDeleteDialog: false,
  setStudentDeleteDialog: (info) => set({ studentDeleteDialog: info }),
}));

export default useModalShowHooks;
