import {
  departmentResponse,
  Doctor,
  doctorResponses,
  Hospital,
  medicineResponse,
} from '@/lib/typings';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Store = {
  loading: boolean;
  hospitals: Hospital[];
  doctors: doctorResponses[];
  departments: departmentResponse[];
  medicines: medicineResponse[];
  selectedHospital: Hospital | null | undefined;
  setAllHospitals: (hospitals: Hospital[]) => void;
  setSelectedHospital: (hospital: Hospital | null | undefined) => void;
  setDoctors: (doctors: doctorResponses[]) => void;
  setDepartments: (departments: departmentResponse[]) => void;
  setMedicines: (medicines: medicineResponse[]) => void;
  setLoading: (loading: boolean) => void;
};

export const useHospitalStore = create<Store>()(
  persist(
    (set) => ({
      loading: true,
      hospitals: [],
      doctors: [],
      departments: [],
      medicines: [],
      selectedHospital: null,

      setAllHospitals: (hospitals: Hospital[]) => {
        set({ hospitals, loading: false });
      },

      setSelectedHospital: (hospital: Hospital | null | undefined) => {
        let departments: departmentResponse[] = [];
        let doctors: doctorResponses[] = [];
        let medicines: medicineResponse[] = [];

        hospital?.doctorDepartmentResponses?.forEach((department: any) => {
          if (department?.departmentResponse) {
            departments.push(department.departmentResponse);
          }

          department.doctorResponses?.forEach((doctor: any) => {
            if (doctors?.some((doc: any) => doc?.id === doctor?.id)) {
              return;
            }
            doctors.push(doctor);
          });
        });

        hospital?.medicineResponses?.forEach((medicine: any) => {
          medicines.push(medicine);
        });

        set({
          selectedHospital: hospital,
          departments,
          doctors,
          medicines,
          loading: false,
        });
      },

      setDoctors: (doctors: doctorResponses[]) => {
        set({ doctors, loading: false });
      },

      setDepartments: (departments: departmentResponse[]) => {
        set({ departments, loading: false });
      },

      setMedicines: (medicines: medicineResponse[]) => {
        set({ medicines, loading: false });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },
    }),
    {
      name: 'hospital_store',
    }
  )
);
