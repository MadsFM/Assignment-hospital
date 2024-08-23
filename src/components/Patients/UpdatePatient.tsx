import {Api} from "../../Api.ts";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {toast} from "react-hot-toast";



const api = new Api();

const UpdatePatient: React.FC = () => {
    const {id} = useParams<{id: string}>();
    const [patientName, setPatientName] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        const getPatient = async () => {
            if (!id) {
                console.error('ID is undefined');
                return;
            }

            setLoading(true);
            try {
                // @ts-ignore
                const response = await api.patients.patientsList({ id: `eq.${id}` });
                const patient = response.data[0];
                if (patient) {
                    setPatientName(patient.name);
                } else {
                    toast.error('Patient not found');
                }
            } catch (error) {
                toast.error('Error getting the patient data', error!);
            } finally {
                setLoading(false);
            }
        };
        getPatient();
    }, [id]);

    const handleUpdate = async () => {
        try {
            if (!id) {
                console.error('Cannot update patient, ID is undefined');
                return;
            }

            await api.patients.patientsPartialUpdate(
                // @ts-ignore
                {name: patientName },
                {id: `eq.${id}` }
            );
            navigate('/app');
        } catch (error) {
            console.error('Error updating patient', error);
        }
    };

    return (
        <>
            <div className="p-8 h-screen bg-neutral text-white">
                <h2 className="text-2xl font-bold mb-4">Update Patient</h2>
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <>
                    <input
                        type="text"
                        placeholder={patientName}
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="p-2 border text-black border-gray-300 rounded-md - w-80 mb-4"
                    />
                    <div className="flex space-x-2">
                        <button
                        className="bg-gray-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                        onClick={() => navigate('/app')}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                        onClick={() => handleUpdate()}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </>
            )}
            </div>
        </>
    )
}

export default UpdatePatient;