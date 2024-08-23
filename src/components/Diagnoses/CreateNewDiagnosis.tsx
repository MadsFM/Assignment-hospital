import {Api, Diagnoses} from "../../Api.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


const api = new Api();


const CreateNewDiagnosis = () => {
    const [patients, setPatients] = useState<{ id: number, name: string }[]>([]);
    const [diseases, setDiseases] = useState<{ id: number, name: string }[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
    const [selectedDiseaseId, setSelectedDiseaseId] = useState<number | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();


    useEffect(() => {
        const getPatientAndDiseases = async () => {
            try {
                const patientRes = await api.patients.patientsList();
                const diseaseRes = await api.diseases.diseasesList();
                //@ts-ignore
                setPatients(patientRes.data);
                //@ts-ignore
                setDiseases(diseaseRes.data);
            } catch (error) {
                console.error('Error getting the data', error);
            }
        };
        getPatientAndDiseases()
    }, [])

    const handleCreateDiagnosis = async () => {
        if (selectedPatientId === null || selectedDiseaseId === null) {
            alert('Please select a patient and a disease');
            return;
        }

        setLoading(true);

        try {
            const newDiagnosis: Diagnoses = {
                patient_id: selectedPatientId,
                //@ts-ignore
                disease_id: selectedDiseaseId,
                diagnosis_date: new Date().toUTCString(),
            };

            await api.diagnoses.diagnosesCreate(newDiagnosis);
            navigate('/app', {state: {selectedTab: 'diagnoses'}});
        } catch (error) {
            console.error("Error creating diagnosis", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div className="p-8 h-screen bg-neutral text-white">
                <h2 className="text-2xl font-bold mb-4">Create a new Diagnosis</h2>
                <div className="mb-4">
                    <label className="block mb-2">Select Patient</label>
                    <select
                        value={selectedPatientId ?? ''}
                        onChange={(e) => setSelectedPatientId(Number(e.target.value))}
                        className="p-2 border text-black border-gray-300 rounded-md w-80"
                    >
                        <option value="" disabled>Select a patient</option>
                        {patients.map((patient) => (
                            <option key={patient.id} value={patient.id}>
                                {patient.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Select Disease</label>
                    <select
                        value={selectedDiseaseId ?? ''}
                        onChange={(e) => setSelectedDiseaseId(Number(e.target.value))}
                        className="p-2 border text-black border-gray-300 rounded-md w-80"
                    >
                        <option value="" disabled>Select a disease</option>
                        {diseases.map((disease) => (
                            <option key={disease.id} value={disease.id}>
                                {disease.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex space-x-2">
                    <button
                        className="bg-gray-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                        onClick={() => navigate('/app', {state: {selectedTab: 'diagnoses'}})}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                        onClick={handleCreateDiagnosis}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </>
    )
}

export default CreateNewDiagnosis;