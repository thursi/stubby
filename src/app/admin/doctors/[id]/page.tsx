"use client";

import DoctorAppointments from "@/components/AdminPanelComponents/DoctorComponents/DoctorAppointments";
import DoctorTimeSlots from "@/components/AdminPanelComponents/DoctorComponents/DoctorTimeSlots";
import EditIcon from "@/components/svg/edit_icon";
import GenderIcon from "@/components/svg/gender-icon";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDoctorStore } from "@/store/doctorStore";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import DefaultImage from "../../../../../public/default_user.png";
import { getAppointmentsByDoctorId, getDoctorById, updateTimeSlot } from "./action";

const Index = ({ params }: { params: { id: string } }) => {
  const [
    selectedDoctor,
    setSelectedDoctor,
    loading,
    doctorAppointments,
    setDoctorAppointments,
  ] = useDoctorStore((state: any) => [
    state.selectedDoctor,
    state.setSelectedDoctor,
    state.loading,
    state.doctorAppointments,
    state.setDoctorAppointments,
  ]);

  const [dayTimeSlotModal, setDayTimeSlotModal] = useState<boolean>(false);

  const handleSelectDoctor = useCallback(async () => {
    const data = await getDoctorById(params.id);
    const appointments = await getAppointmentsByDoctorId(params.id, 1, 10);
    setSelectedDoctor(data);
    setDoctorAppointments(appointments); // Ensure you're also setting appointments
  }, [params.id, setSelectedDoctor, setDoctorAppointments]); // Add dependencies

  useEffect(() => {
    handleSelectDoctor();
  }, [handleSelectDoctor]); // Include handleSelectDoctor to prevent the warning

  if (loading) {
    return <div>Loading...!</div>; // Ensure to return the loading state
  }

  return (
    <div className="flex flex-col px-3 bg-white py-5 h-full w-full rounded-lg">
      <div className="flex relative">
        <EditIcon className="absolute top-0 right-0 cursor-pointer" />
        <div className="relative">
          <EditIcon className="absolute top-5 right-5 z-10 cursor-pointer" />
          {selectedDoctor?.preSignedUrl ? (
            <Image
              src={selectedDoctor?.preSignedUrl}
              alt="Doctor Image"
              width={200}
              height={200}
              className="rounded-full border-4 object-cover h-[200px] w-[200px]"
            />
          ) : (
            <Image
              src={DefaultImage}
              className="rounded-full border-4"
              alt="default_img"
              height={200}
              width={200}
            />
          )}
        </div>
        <div className="grow flex flex-col gap-2 px-3 py-2">
          <div className="font-bold text-2xl flex gap-2 items-center">
            {selectedDoctor?.name}
            <GenderIcon gender={selectedDoctor?.gender} className="w-6 h-6" />
          </div>
          <div>
            <div className="font-semibold mb-1">
              {selectedDoctor?.specializationName}
            </div>
            <div className="font-semibold mb-2">
              {selectedDoctor?.departmentName}
            </div>
          </div>

          <div className="font-semibold text-xl">{selectedDoctor?.email}</div>
          <div className="font-semibold text-xl">{selectedDoctor?.phoneNo}</div>
          <div className="font-semibold text-xl">
            &quot;{selectedDoctor?.description}&quot;
          </div>
        </div>
      </div>
      <Separator />
      <Tabs defaultValue="appointments" className="w-full py-2">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="timeslot">Time Slots & Duration</TabsTrigger>
          <TabsTrigger value="pets">Pets</TabsTrigger>
        </TabsList>
        <TabsContent value="appointments">
          <DoctorAppointments appointments={doctorAppointments} />
        </TabsContent>
        <TabsContent value="timeslot">
          <DoctorTimeSlots
            modal={dayTimeSlotModal}
            setModal={setDayTimeSlotModal}
            doctorId={params.id}
            duration={selectedDoctor?.duration}
            dayTimeSlotReponse={selectedDoctor?.dayTimeSlotResponses}
            allocateTimeSlot={updateTimeSlot}
          />
        </TabsContent>
        <TabsContent value="pets">No pets added yet.</TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
