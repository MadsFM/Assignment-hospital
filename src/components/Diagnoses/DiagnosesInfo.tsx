import {Api, Diagnoses} from "../../Api.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


const api = new Api();

interface DetailedDiagnosis extends Diagnoses {
    patientName?: string;
    diseaseName?: string;
}

const DiagnosesInfo = () => {
    const [diagnoses, setDiagnoses] = useState<DetailedDiagnosis[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedDiagnosisId, setExpandedDiagnosisId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getAllDiagnoses = async () => {
            try {
                const res = await api.diagnoses.diagnosesList();
                const diagnosesData = res.data;

                const detailedDiagnoses = await Promise.all(
                    diagnosesData.map(async (diagnosis) => {
                        const patientResponse = await api.patients.patientsList({id: `eq.${diagnosis.patient_id}`});
                        const diseaseResponse = await api.diseases.diseasesList({ id: `eq.${diagnosis.disease_id}` });

                        const patientName = patientResponse.data[0]?.name || 'Unknown';
                        const diseaseName = diseaseResponse.data[0]?.name || 'Unknown';

                        return {
                            ...diagnosis,
                            patientName,
                            diseaseName
                        };
                    })
                )
                setDiagnoses(detailedDiagnoses);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                setError('Error getting diagnoses');
            } finally {
                setLoading(false);
            }
        }
        getAllDiagnoses();
    }, []);

    const handleExpand = (diagnosisId: number) => {
        setExpandedDiagnosisId(prevId => (prevId === diagnosisId ? null : diagnosisId));
    };

    const handleDelete = async (diagnosisId: number | undefined) => {
        if (window.confirm('Are you sure you want to delete this diagnosis?')) {
            try {
                await api.diagnoses.diagnosesDelete({ id: `eq.${diagnosisId}` });
                setDiagnoses(prev => prev.filter(diagnosis => diagnosis.id !== diagnosisId));
            } catch (error) {
                console.error('Error deleting diagnosis', error);
            }
        }
    };

    const generateNewColor = (str: string): string => {
        let hash =0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash) << 5) - hash;
        }
        const color = Math.floor(Math.abs(Math.sin(hash) * 16777215)) % 16777215;
        return `#${('0000' + color.toString(16)).slice(-6)}`;
    }

    if (loading) <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!diagnoses || diagnoses.length === 0) return <div>No patients available.</div>;



    return (
        <>
            <div>
                <button
                    className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 mb-8"
                    onClick={() => navigate('/create-diagnosis')}
                >
                    + create new diagnosis
                </button>
                <h2 className="text-2xl font-bold mb-4 underline">All Diagnosis</h2>
                <div className="overflow-scroll h-[40vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {diagnoses.map((diagnosis) => {
                            const shadowColor = generateNewColor(diagnosis.diseaseName || "Unknown");

                            return (
                                <div
                                    key={diagnosis.id}
                                    className="p-4 bg-gray-800 rounded-md shadow-md"
                                    style={{boxShadow: `0 4px 6px -1px ${shadowColor}, 0 2px 4px -2px ${shadowColor}`}}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = `0 8px 12px -3px ${shadowColor}, 0 4px 6px -4px ${shadowColor}`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = `0 4px 6px -1px ${shadowColor}, 0 2px 4px -2px ${shadowColor}`;
                                    }}
                                >
                                    <h3
                                        className="text-xl font-bold cursor-pointer"
                                        onClick={() => handleExpand(diagnosis.id)}
                                    >
                                        Diagnosis id: {diagnosis.id}
                                    </h3>
                                    {expandedDiagnosisId === diagnosis.id && (
                                        <>
                                            <p className="text-white">Patient: {diagnosis.patientName}</p>
                                            <p className="text-white">Diseases: {diagnosis.diseaseName}</p>
                                            <p>Date: {new Date(diagnosis.diagnosis_date!).toLocaleDateString()}</p>
                                            <button
                                                className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600 mt-4"
                                                onClick={() => handleDelete(diagnosis.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default DiagnosesInfo;