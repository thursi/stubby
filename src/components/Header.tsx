"use client";
import { signOut } from "@/api/route";
import {
  getDepartmentData,
  getDoctorData,
  getMedicinesData,
  getPetData,
} from "@/app/home/action";
import SideBarIcon from "@/components/svg/side_bar_icon";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/authStore";
import { useDepartmentStore } from "@/store/departmentStore";
import { useDoctorStore } from "@/store/doctorStore";
import { useMedicineStore } from "@/store/medicinesStore";
import { usePetStore } from "@/store/petStore";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Logoeffect from "../../public/stubby.png";

export default function Home() {
  const pathName = usePathname();
  const [doctors, setAllDoctors] = useDoctorStore((state: any) => [
    state.doctors,
    state.setAllDoctors,
  ]);
  const [departments, setAllDepartments] = useDepartmentStore((state: any) => [
    state.departments,
    state.setAllDepartments,
  ]);

  const [pets, setAllPets] = usePetStore((state: any) => [
    state.pets,
    state.setAllPets,
  ]);

  const [medicines, setAllMedicines] = useMedicineStore((state: any) => [
    state.medicines,
    state.setAllMedicines,
  ]);
  const [login, setLogin] = useAuthStore((state) => [
    state.login,
    state.setLogin,
  ]);

  const fetchData = async () => {
    try {
      const petData = await getPetData();
      const departmentData = await getDepartmentData();
      const doctorData = await getDoctorData();
      const medicinesData = await getMedicinesData();
      setAllDepartments(departmentData);
      setAllMedicines(medicinesData);
      setAllPets(petData);
      setAllDoctors(doctorData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleButtonClick = () => {
    console.log("Search button clicked");
  };

  const doctores = Array.isArray(doctors)
    ? doctors.map((doctor: any) => ({
        src: doctor.preSignedUrl,
        alt: doctor.image,
        textOverlay: doctor.name,
      }))
    : [];

  const [open, setOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const router = useRouter();

  const handleMouseEnter = useCallback(
    (view: string) => setActiveDropdown(view),
    []
  );
  const handleMouseLeave = useCallback(() => setActiveDropdown(null), []);

  const handleSignout = async () => {
    await signOut();
    setLogin(undefined);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderDropdown = (items: any[], hrefBase: string) => (
    <div className="absolute bg-white shadow-md mt-2 w-48">
      <hr className="my-2" />
      <ul className="flex flex-col space-y-2">
        {items &&
          Array.isArray(items) &&
          items.map(
            (item, index) =>
              item && (
                <li key={index}>
                  <a
                    href={`${hrefBase}/${item.id}`}
                    className="text-gray-600 block px-4 py-2"
                  >
                    {item.name}
                    <hr className="mt-2" />
                  </a>
                </li>
              )
          )}
      </ul>
    </div>
  );

  return (
    <header
      className={`fixed top-0 left-0 w-full z-10 transition-all duration-300 bg-white bg-opacity-90`}
    >
      <div
        className={`w-full h-fit flex flex-col md:flex-row justify-between items-center px-8 py-2 text-black`}
      >
        <div className="flex justify-between items-center w-full md:hidden">
          <a href="/">
            <Image src={Logoeffect} alt="Company Logo" className="w-36" />
          </a>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger className="px-3">
              <SideBarIcon />
            </SheetTrigger>
            <SheetContent
              className={`h-full flex flex-col items-start text-black`}
            >
              <Image
                src={Logoeffect}
                className="w-[288px]"
                alt="Company Logo"
              />
              <ul className="flex flex-col space-y-4 text-black">
                {/* Sidebar items */}
                <li key={0}>
                  <a href="/" className="hover:text-red-500">
                    Home
                  </a>
                </li>
                <li key={1}>
                  <a href="/aboutus" className="hover:text-red-500">
                    About Us
                  </a>
                </li>
                {login && (
                  <li key={2}>
                    <a href="/Appointments" className="hover:text-red-500">
                      Appointments
                    </a>
                  </li>
                )}
                <li
                  onClick={() => handleMouseEnter("departments")}
                  className="hover:text-red-500 relative"
                >
                  <a href="/departments" className="hover:text-red-500">
                    Departments
                  </a>
                  {activeDropdown === "departments" &&
                    renderDropdown(departments, "/departments")}
                </li>
                <li
                  onClick={() => handleMouseEnter("doctors")}
                  className="hover:text-red-500 relative"
                >
                  <a href="/doctors" className="hover:text-red-500">
                    Doctors
                  </a>
                  {activeDropdown === "doctors" &&
                    renderDropdown(doctors, "/doctor-details")}
                </li>
                <li
                  onClick={() => handleMouseEnter("medicines")}
                  className="hover:text-red-500 relative"
                >
                  <a href="/medicines" className="hover:text-red-500">
                    Medicines
                  </a>
                  {activeDropdown === "medicines" &&
                    renderDropdown(medicines, "/medicines")}
                </li>
                <li
                  onClick={() => handleMouseEnter("pets")}
                  className="hover:text-red-500 relative"
                >
                  <a href="/pets" className="hover:text-red-500">
                    Pets
                  </a>
                  {activeDropdown === "pets" && renderDropdown(pets, "/pets")}
                </li>
                {login ? (
                  <div
                    onClick={async () =>  await signOut()}
                    className="bg-red-500 hover:bg-yellow-500 text-white px-4 py-1 rounded"
                  >
                    <p className="hover:text-black">SignOut</p>
                  </div>
                ) : (
                  <>
                    {" "}
                    <li className="bg-red-500 hover:bg-yellow-500 text-white px-4 py-1 rounded">
                      <a href="/auth?mode=signin" className="hover:text-black">
                        Sign In
                      </a>
                    </li>
                    <li className="bg-red-500 hover:bg-yellow-500 text-white px-4 py-1 rounded">
                      <a href="/auth?mode=signup" className="hover:text-black">
                        Sign Up
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden md:flex md:items-center w-full text-black">
          <a href="/">
            <Image src={Logoeffect} alt="Company Logo" className="w-36" />
          </a>
          <nav className="flex-1 flex justify-center">
            <ul className="flex space-x-8 text-black">
              {/* Navbar items */}
              <li key={0}>
                <a href="/" className="hover:text-red-500">
                  Home
                </a>
              </li>
              <li key={1}>
                <a href="/aboutus" className="hover:text-red-500">
                  About Us
                </a>
              </li>
              {login && (
                <li key={2}>
                  <a href="/Appointments" className="hover:text-red-500">
                    Appointments{" "}
                  </a>
                </li>
              )}
              <li
                onMouseEnter={() => handleMouseEnter("departments")}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <a href="/departments" className="hover:text-red-500">
                  Departments
                </a>
                {activeDropdown === "departments" &&
                  renderDropdown(departments, "/departments")}
              </li>
              <li
                onMouseEnter={() => handleMouseEnter("doctors")}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <a href="/doctors" className="hover:text-red-500">
                  Doctors
                </a>
                {activeDropdown === "doctors" &&
                  renderDropdown(doctors, "/doctor-details")}
              </li>
              <li
                onMouseEnter={() => handleMouseEnter("medicines")}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <a href="/medicines" className="hover:text-red-500">
                  Medicines
                </a>
                {activeDropdown === "medicines" &&
                  renderDropdown(medicines, "/medicines")}
              </li>
              <li
                onMouseEnter={() => handleMouseEnter("pets")}
                onMouseLeave={handleMouseLeave}
                className="relative"
              >
                <a href="/pets" className="hover:text-red-500">
                  Pets
                </a>
                {activeDropdown === "pets" && renderDropdown(pets, "/pets")}
              </li>
            </ul>
          </nav>
          <div className="flex space-x-4">
            {login ? (
              <button
              onClick={async () => {
                await signOut();
                setLogin(undefined);
              }}
              
                className="bg-red-500 hover:bg-yellow-500 text-white px-4 py-1 rounded"
              >
                Signout
              </button>
            ) : (
              <>
                <button
                  onClick={handleButtonClick}
                  className="bg-red-500 hover:bg-yellow-500 text-white px-4 py-1 rounded"
                >
                  <a href="/auth?mode=signin">Sign In</a>
                </button>
                <button
                  onClick={handleButtonClick}
                  className="bg-red-500 hover:bg-yellow-500 text-white px-4 py-1 rounded"
                >
                  {/* <a href="/auth">Sign Up</a>
                   */}

                  <a href="/auth?mode=signup">Sign Up</a>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}