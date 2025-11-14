import FarmerNavbar from "../components/FarmerNavbar";

const UserDashboard = () => {
  return (
    <>
      <FarmerNavbar />

      <div className="p-10 text-center">
        <h1 className="text-4xl font-bold text-[#C24C30]">
          👨‍🌾 User Dashboard
        </h1>
        <p className="mt-4 text-[#8C2F2B]">
          This is a placeholder. You can build your real user dashboard here.
        </p>
      </div>
    </>
  );
};

export default UserDashboard;
