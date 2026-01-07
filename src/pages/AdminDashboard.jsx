import CandidateList from "./CandidateList";
import CandidateUpload from "../components/CandidateUpload";

const AdminDashboard = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <CandidateUpload />
            <CandidateList />
        </div>
    );
};

export default AdminDashboard;
