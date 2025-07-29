"use client";

import { useEffect, useState } from "react";
import AdminContactView from "@/components/admin-view/contact";
import Login from "@/components/admin-view/login";
import AdminProjectView from "@/components/admin-view/project";
import AdminPotensiView from "@/components/admin-view/potensi";
import AdminPrasaranarView from "@/components/admin-view/prasarana";
import AdminLembagaView from "@/components/admin-view/lembaga";
import AdminKegiatanView from "@/components/admin-view/kegiatan";
import AdminSidebar from "@/components/admin-view/sidebar";
import { addData, getData, login, updateData } from "@/services";

const initialProjectFormData = {
  name: "",
  website: "",
  technologies: "",
  github: "",
};

const initialPotensiFormData = {
  nama: "",
  kategori: "",
  deskripsi: "",
  tahun_mulai: "",
  lokasi: "",
  maps_link: "",
  shopee_link: "",
  facebook_link: "",
  instagram_link: "",
  whatsapp_link: "",
};

const initialPrasaranaFormData = {
  nama: "",
  kategori: "",
  deskripsi: "",
  tahun_pembangunan: "",
  lokasi: "",
  maps_link: "",
};

const initialLembagaFormData = {
  nama: "",
  kategori: "",
  deskripsi: "",
};

const initialKegiatanFormData = {
  nama: "",
  kategori: "",
  deskripsi: "",
  tahun: "",
};

const initialLoginFormData = {
  username: "",
  password: "",
};

export default function AdminView() {
  const [currentSelectedTab, setCurrentSelectedTab] = useState("project");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projectViewFormData, setProjectViewFormData] = useState(initialProjectFormData);
  const [potensiViewFormData, setPotensiViewFormData] = useState(initialPotensiFormData);
  const [prasaranaViewFormData, setPrasaranaViewFormData] = useState(initialPrasaranaFormData);
  const [lembagaViewFormData, setLembagaViewFormData] = useState(initialLembagaFormData);
  const [kegiatanViewFormData, setKegiatanViewFormData] = useState(initialKegiatanFormData);
  const [allData, setAllData] = useState({});
  const [update, setUpdate] = useState(false);
  const [authUser, setAuthUser] = useState(null); // awal null, bukan false
  const [isLoading, setIsLoading] = useState(true);
  const [loginFormData, setLoginFormData] = useState(initialLoginFormData);

  const renderCurrentComponent = () => {
    switch (currentSelectedTab) {
      case "project":
        return (
          <AdminProjectView
            formData={projectViewFormData}
            handleSaveData={handleSaveData}
            setFormData={setProjectViewFormData}
            data={allData?.project}
          />
        );
      case "potensi":
        return (
          <AdminPotensiView
            formData={potensiViewFormData}
            handleSaveData={handleSaveData}
            setFormData={setPotensiViewFormData}
            data={allData?.potensi}
            update={update}
            setUpdate={setUpdate}
          />
        );
      case "prasarana":
        return (
          <AdminPrasaranarView
            formData={prasaranaViewFormData}
            handleSaveData={handleSaveData}
            setFormData={setPrasaranaViewFormData}
            data={allData?.prasarana}
            update={update}
            setUpdate={setUpdate}
          />
        );
      case "lembaga":
        return (
          <AdminLembagaView
            formData={lembagaViewFormData}
            handleSaveData={handleSaveData}
            setFormData={setLembagaViewFormData}
            data={allData?.lembaga}
            update={update}
            setUpdate={setUpdate}
          />
        );
      case "kegiatan":
        return (
          <AdminKegiatanView
            formData={kegiatanViewFormData}
            handleSaveData={handleSaveData}
            setFormData={setKegiatanViewFormData}
            data={allData?.kegiatan}
            update={update}
            setUpdate={setUpdate}
          />
        );
      case "contact":
        return <AdminContactView data={allData?.contact} />;
      default:
        return null;
    }
  };

  async function extractAllDatas() {
    const response = await getData(currentSelectedTab);
    if (response?.success) {
      setAllData((prev) => ({
        ...prev,
        [currentSelectedTab]: response.data,
      }));
    }
  }

  async function handleSaveData() {
    const dataMap = {
      project: projectViewFormData,
      potensi: potensiViewFormData,
      prasarana: prasaranaViewFormData,
      lembaga: lembagaViewFormData,
      kegiatan: kegiatanViewFormData,
    };

    const response = update
      ? await updateData(currentSelectedTab, dataMap[currentSelectedTab])
      : await addData(currentSelectedTab, dataMap[currentSelectedTab]);

    if (response.success) {
      resetFormDatas();
      extractAllDatas();
      setUpdate(false); // Reset update state after successful save
    }
  }

  useEffect(() => {
    extractAllDatas();
  }, [currentSelectedTab]);

  function resetFormDatas() {
    setProjectViewFormData(initialProjectFormData);
    setPotensiViewFormData(initialPotensiFormData);
    setPrasaranaViewFormData(initialPrasaranaFormData);
    setLembagaViewFormData(initialLembagaFormData);
    setKegiatanViewFormData(initialKegiatanFormData);
  }

  useEffect(() => {
    const auth = sessionStorage.getItem("authUser");
    setAuthUser(auth === "true"); // pastikan nilainya boolean
    setIsLoading(false); // selesai cek session
  }, []);

  async function handleLogin() {
    const res = await login(loginFormData);
    if (res?.success) {
      setAuthUser(true);
      sessionStorage.setItem("authUser", "true");
    }
  }

  // Tampilkan loading dulu sampai status auth terbaca
  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  if (!authUser) {
    return (
      <Login
        formData={loginFormData}
        handleLogin={handleLogin}
        setFormData={setLoginFormData}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <AdminSidebar
        currentSelectedTab={currentSelectedTab}
        setCurrentSelectedTab={setCurrentSelectedTab}
        resetFormDatas={resetFormDatas}
        setUpdate={setUpdate}
        setAuthUser={setAuthUser}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-56' : 'ml-0'}`}>
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">
          <div className="max-w-6xl mx-auto">
            {/* Component Content */}
            <div className="bg-white rounded-lg shadow-md p-2">
              {renderCurrentComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}