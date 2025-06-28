"use client";

import { useEffect, useState } from "react";
import AdminContactView from "@/components/admin-view/contact";
import Login from "@/components/admin-view/login";
import AdminProjectView from "@/components/admin-view/project";
import AdminSidebar from "@/components/admin-view/sidebar";
import { addData, getData, login, updateData } from "@/services";

const initialProjectFormData = {
  name: "",
  website: "",
  technologies: "",
  github: "",
};

const initialLoginFormData = {
  username: "",
  password: "",
};

export default function AdminView() {
  const [currentSelectedTab, setCurrentSelectedTab] = useState("project");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projectViewFormData, setProjectViewFormData] = useState(initialProjectFormData);
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
    };

    const response = update
      ? await updateData(currentSelectedTab, dataMap[currentSelectedTab])
      : await addData(currentSelectedTab, dataMap[currentSelectedTab]);

    if (response.success) {
      resetFormDatas();
      extractAllDatas();
    }
  }

  useEffect(() => {
    extractAllDatas();
  }, [currentSelectedTab]);

  function resetFormDatas() {
    setProjectViewFormData(initialProjectFormData);
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
            {/* Header */}
            <div className="mb-2 ">
              <div className="flex items-center space-x-3 mb-4">  
                  <span className="text-white text-xl">
                    {currentSelectedTab === "Berita & Artikel"}
                    {currentSelectedTab === "Saran & Masukan"}
                  </span>
                <div>
                </div>
              </div>
              {/* Breadcrumb */}
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className="px-2 py-1 bg-green1-500 rounded-md">Dashboard</span>
                <svg className="w-4 h-4" fill="black" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="px-2 py-1 bg-green1-500 text-indigo-700 rounded-md capitalize">
                  {currentSelectedTab}
                </span>
              </div>
            </div>

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
