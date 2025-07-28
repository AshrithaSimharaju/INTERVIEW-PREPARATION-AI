import React, { useState, useEffect } from "react";
import { LuPlus } from "react-icons/lu";
import { CARD_BG } from "../../utils/data";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import SummaryCard from "../../components/Cards/SummaryCard";
import { BASE_URL, API_PATHS } from "../../utils/apiPaths";
import Modal from "../../components/Loader/Modal";
import CreateSessionForm from "./CreateSessionForm";
import axiosInstance from "../../utils/axiosInstance"; // ✅ adjust the path if needed

import DeleteAlertContent from "../../components/Loader/DeleteAlertContent";

const Dashboard = () => {
  const navigate = useNavigate();
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    open: false,
    data: null,
  });

  // const fetchAllSessions = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       toast.error("Please login to view your sessions.");
  //       return;
  //     }

  //     const url = `${BASE_URL}${API_PATHS.SESSION.GET_ALL}`;
  //     console.log("Requesting:", url);

  //     const res = await fetch(url, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const data = await res.json();
  //     console.log("Fetched sessions:", data);

  //     if (!res.ok) {
  //       throw new Error(data?.message || "Failed to fetch sessions.");
  //     }

  //     setSessions(data?.data || []);
  //   } catch (error) {
  //     console.error("Error fetching sessions:", error.message);
  //     toast.error(error.message || "Failed to load sessions.");
  //   }
  // };

 const fetchAllSessions = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to view your sessions.");
      return;
    }

    const url = `${BASE_URL}${API_PATHS.SESSION.GET_ALL}`;
    console.log("Requesting:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ token attached
      },
    });

    const data = await res.json();
    console.log("Fetched sessions:", data);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch sessions.");
    }

    setSessions(data?.data || []);
  } catch (error) {
    console.error("Error fetching sessions:", error.message);
    toast.error(error.message || "Failed to load sessions.");
  }
};




  const deleteSession=async(sessionData)=>{
    try{
      await axiosInstance.delete(API_PATHS.SESSION.DELETE(sessionData?._id));
      toast.success("session deleted successfully");
      setOpenDeleteAlert({
        open:false,
        data:null,
      });
      fetchAllSessions();
    }catch(error){
      console.error("error",error);
    }
    }
  useEffect(() => {
    fetchAllSessions();
  }, []);

  return (
    <DashboardLayout>
      <div className="container mx-auto pt-4 pb-4 bg-white min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-7 pt-1 pb-6 px-4 md:px-3">
          {sessions.length === 0 ? (
            <p className="text-center col-span-3 text-gray-600">
              No sessions found.
            </p>
          ) : (
            sessions.map((data, index) => (
              <SummaryCard
                key={data?._id || index}
                colors={CARD_BG[index % CARD_BG.length]}
                role={data?.role || ""}
                topicsToFocus={data?.topicsToFocus || ""}
                experience={data?.experience || "-"}
                questions={data?.questions?.length || "-"}
                description={data?.description || ""}
                lastUpdated={
                  data?.updatedAt
                    ? moment(data.updatedAt).format("Do MMM YYYY")
                    : ""
                }
                onSelect={() => navigate(`/interview-prep/${data?._id}`)}
                onDelete={() => setOpenDeleteAlert({ open: true, data })}
              />
            ))
          )}
        </div>

        <button
          className="h-12 md:h-12 flex items-center justify-center gap-3 bg-gradient-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-7 py-2.5 rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer hover:shadow-2xl hover:shadow-orange-300 fixed bottom-10 md:bottom-20 right-10 md:right-20"
          onClick={() => setOpenCreateModal(true)}
        >
          <LuPlus className="text-2xl text-white" />
          Add New
        </button>
      </div>

    <Modal
  isOpen={openCreateModal}
  onClose={() => setOpenCreateModal(false)}
  hideHeader
>
  <div className="w-full max-w-[480px] mx-auto bg-white rounded-2xl p-6 shadow-xl max-h-[90vh] overflow-y-auto">
    <CreateSessionForm onCancel={() => setOpenCreateModal(false)} />
  </div>
</Modal>
<Modal
    isOpen={openDeleteAlert?.open}
    onClose={()=>{
         setOpenDeleteAlert({open:false,data:null});
    }}
    title="Delete Alert"
>
  <div className="w-[30vw]">
    <DeleteAlertContent
         content="Are you sure you want to delete this session details?"
         onDelete={()=>deleteSession(openDeleteAlert.data)}
   />
  </div>

</Modal>
    </DashboardLayout>
  );
};

export default Dashboard;









