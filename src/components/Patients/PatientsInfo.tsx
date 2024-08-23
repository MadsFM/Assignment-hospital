import { useEffect, useState } from "react";
import { Api, Patients, Diseases } from "../../Api.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";



const api = new Api();

const PatientsInfo = ({patients, searchWord}: {patients: Patients[], searchWord: string} ) => {
    const [filteredPatients, setFilteredPatients] = useState<Patients[]>(patients);
    const [expandedPatientId, setExpandedPatientId] = useState<number | null>(null);
    const [patientDiseases, setPatientDiseases] = useState<Record<number, Diseases[]> | null>(null);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.showToast) {
            toast.success('Created a new patient', {position: "top-center"});
            navigate(location.pathname, {replace: true, state: {} });
        }
    }, [location, navigate]);

    useEffect(() => {
        if (searchWord) {
            const filtered = patients.filter(patient =>
                patient.name.toLowerCase().includes(searchWord.toLowerCase())
            );
            setFilteredPatients(filtered);
        } else {
            setFilteredPatients(patients);
        }
    }, [searchWord, patients]);

    useEffect(() => {
        const getPatientDiseases = async () => {
            try {
                const patientDiseaseList: Record<number, Diseases[]> = {};
                for (const patient of patients) {
                    const res = await api.diagnoses.diagnosesList({patient_id: `eq.${patient.id}` });
                    const diseases = await Promise.all(
                        res.data.map(async (diagnose) => {
                            const diseaseRes = await api.diseases.diseasesList({id: `eq.${diagnose.disease_id}`});
                            return diseaseRes.data[0];
                        })
                    );
                    //@ts-ignore
                    patientDiseaseList[patient.id] = diseases;
                }
                setPatientDiseases(patientDiseaseList);
            } catch (error) {
                console.error('Error getting the data', error);
            }
        };
        getPatientDiseases();
    }, [patients]);



    const getAdditionalInformation = async (patientId: number | undefined) => {
        if (expandedPatientId === patientId) {
            setExpandedPatientId(null);
        } else {
            setExpandedPatientId(patientId!);
            if (!patientDiseases || !patientDiseases[patientId!]) {
                try {
                    const response = await api.diagnoses.diagnosesList({ patient_id: `eq.${patientId}` });

                    const diseases = await Promise.all(
                        response.data.map(async (diagnosis) => {
                            const diseaseResponse = await api.diseases.diseasesList({ id: `eq.${diagnosis.disease_id}` });
                            return diseaseResponse.data[0];
                        })
                    );
                    setPatientDiseases((prev) => ({ ...prev, [patientId!]: diseases }));
                } catch (error) {
                    console.error("Failed to load patient data", patientId, error);
                }
            }
        }
    };

    const handleDeletePatient = async (patientId: number | undefined) => {
        if (window.confirm("Are you sure you want to delete this patient?")) {
            setIsDeleting(true);
            try {
                await api.patients.patientsDelete({ id: `eq.${patientId}` });
                setFilteredPatients((prev) => prev?.filter((patient) => patient.id !== patientId) || []);
                toast.success('Deleted patient');
                setExpandedPatientId(null);
            } catch (error) {
                console.error("Failed to delete patient", error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    if (filteredPatients.length === 0) return <div>No patients available.</div>;


    return (
        <>
            <div>
                <button className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 mb-8"
                onClick={() => navigate('/create-patient')}>
                    + create new patient
                </button>
                <h2 className="text-2xl font-bold mb-4 underline">All Patients</h2>
                <div className="overflow-scroll h-[40vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredPatients.map((patient) => {
                            //@ts-ignore
                            const hasDiseases = patientDiseases && patientDiseases[patient.id] && patientDiseases[patient.id].length > 0;

                            return (
                                <div
                                    key={patient.id}
                                    className={`rounded-md shadow-md ${hasDiseases ? 'hover:shadow-yellow-500' : 'hover:shadow-gray-200'} bg-gray-800`}
                                >
                                    <div
                                        className="p-4 cursor-pointer"
                                        onClick={() => getAdditionalInformation(patient.id)}
                                    >
                                        <h3 className="text-xl font-bold">{patient.name}</h3>
                                    </div>
                                    {expandedPatientId === patient.id && (
                                        <div className="p-4 bg-gray-700">
                                            <h4 className="text-lg font-bold">Diseases:</h4>
                                            <ul className="list-disc list-inside">
                                                {hasDiseases ? (
                                                    patientDiseases![patient.id].map((disease) => (
                                                        <li key={disease.id}>{disease.name}</li>
                                                    ))
                                                ) : (
                                                    <li>Patient is healthy</li>
                                                )}
                                            </ul>
                                            <div className="mt-4 flex space-x-2">
                                                <button
                                                    className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                                                    onClick={() => navigate(`/update-patient/${patient.id}`)}
                                                >
                                                    Update
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                                                    onClick={() => handleDeletePatient(patient.id)}
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientsInfo;
