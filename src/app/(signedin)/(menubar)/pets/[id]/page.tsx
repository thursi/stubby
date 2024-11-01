"use client";

import { getDoctorData } from "@/app/admin/doctors/action";
import { getPetById } from "@/app/admin/pets/action";
import PopularDoctors from "@/components/Image";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Index = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any>([]);
  const [pet, setPet] = useState<any>(undefined);
  const [dloading, setdLoading] = useState<boolean>(true);
  async function fetchData() {
    const response = await getDoctorData(1, 10, undefined, params.id);
    const dep = await getPetById(params.id);

    console.log(dep);
    setPet(dep);
    setDoctors(response?.records);
    setdLoading(false);
  }

  const handleClick = (imageName: any) => {
    console.log(`${imageName} clicked!`);
  };

  const doctores = Array.isArray(doctors)
    ? doctors.map((doctor: any) => ({
        id: doctor.id,
        src: doctor.preSignedUrl,
        alt: doctor.image,
        textOverlay: doctor.name,
        description: doctor.description,
        specializationName: doctor.specializationName,
        dayTimeSlotResponses: doctor.dayTimeSlotResponses,
      }))
    : [];

  useEffect(() => {
    fetchData();
  }, []);
  if (dloading && !pet) {
    return (
      <div className="mt-14 px-7 w-full flex flex-colbg-gray-100 items-center py-4">
        <div className="w-full max-w-[1204px] flex flex-col items-center justify-center px-3 py-5 h-full rounded-lg">
          <Loader className="h-10 w-10" />
        </div>
      </div>
    );
  }
  return (
    <div className="mt-14 px-7 w-full flex flex-col items-center py-4">
      <div className="w-full flex flex-col max-w-[1204px] gap-y-3">
        <PopularDoctors
          title={`${pet?.name}`}
          description="Meet With Professional Doctors."
          //   link="/doctors"
          handleClick={handleClick}
          linkDescription="Doctors"
          doctors={doctors}
          pathname={"/appointmentdoctor"}
          query={doctores}
          doctor={true}
        />
      </div>
    </div>
  );
};

export default Index;