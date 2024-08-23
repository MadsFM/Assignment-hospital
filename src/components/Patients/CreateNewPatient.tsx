import {Api, Patients} from "../../Api.ts";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";


const api = new Api();

const CreateNewPatient: React.FC = () => {
    const [newPatientName, setNewPatientName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();


    const handleCreateNewPatient = async () => {
        if (!newPatientName.trim()) {
            alert('Please enter a new patient name');
            return;
        }
        setLoading(true);

        try {
            const newPatient: Patients = {
                name: newPatientName,
            };
            await api.patients.patientsCreate(newPatient);
            navigate("/app", {state: {selectedTab: 'patients'}});
        }catch (error) {
            console.error("Error creating new patient", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="p-8 h-screen bg-neutral text-white">
                <h2 className="text-2xl font-bold mb-4">Create a new patient</h2>
                <input
                type="text"
                placeholder="Enter new patient name"
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                className="p-2 border text-amber-950 border-gray-300 rounded-md - w-80 mb-4"

                />
                <div className="flex space-x-2">
                    <button className="bg-gray-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                    onClick={() => navigate('/app', { state: {selectedTab: 'patients'}})}
                    disabled={loading}
                    >
                        Cancel
                    </button>
                    <button className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                            onClick={handleCreateNewPatient}
                            disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default CreateNewPatient;