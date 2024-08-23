import {Api, Diseases} from "../../Api.ts";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";


const api = new Api();

const DiseaseInfo = ({ diseases, searchWord }: { diseases: Diseases[], searchWord: string }) => {
    const [filteredDiseases, setFilteredDiseases] = useState<Diseases[]>(diseases);
    const [expandedDiseaseId, setExpandedDiseaseId] = useState<number | null>(null);
    const [patientCount, setPatientCount] = useState<Record<number, number>>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (searchWord) {
            const filtered = diseases.filter(disease =>
                disease.name.toLowerCase().includes(searchWord.toLowerCase())
            );
            setFilteredDiseases(filtered);
        } else {
            setFilteredDiseases(diseases);
        }
    }, [searchWord, diseases]);

    useEffect(() => {
        const getPatientCount = async () => {
            try {
                const counts: Record<number, number> = {};
                for (const disease of diseases) {
                    const res = await api.diagnoses.diagnosesList({disease_id: `eq.${disease.id}`});
                    //@ts-ignore
                    counts[disease.id] = res.data.length;
                }
                setPatientCount(counts);
            } catch (error) {
                console.error('Failed loading data to the counter', error)
            }
        };
        getPatientCount();
    }, [diseases]);

    const handleExpand = (diseaseId: number | undefined) => {
        if (expandedDiseaseId === diseaseId) {
            setExpandedDiseaseId(null);
        } else {
            setExpandedDiseaseId(diseaseId!);
        }
    };

    const handleDelete = async (diseaseId: number | undefined) => {
        if (window.confirm('Are you sure you want to delete this disease')) {
            try {
                await api.diseases.diseasesDelete({ id: `eq.${diseaseId}` });
                setFilteredDiseases((prev) => prev.filter((disease) => disease.id !== diseaseId));
            } catch (error) {
                console.error('Error deleting the disease', error);
            }
        }
    }

    if (filteredDiseases.length === 0) return <div>No diseases available.</div>;

    return (
        <>
            <div>
                <button className="bg-green-500 text-white py-1 px-4 rounded-md hover:bg-green-600 mb-8"
                        onClick={() => navigate('/create-disease')}>
                    + create new disease
                </button>
            </div>
            <h2 className="text-2xl font-bold mb-4 underline">All Diseases</h2>
            <div className="overflow-scroll h-[40vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDiseases.map((disease) => {
                        // @ts-ignore
                        const hasPatients = patientCount[disease.id] > 0;

                        return (
                            <div
                                key={disease.id}
                                className={`p-4 rounded-md shadow-md ${hasPatients ? 'hover:shadow-yellow-500' : 'hover:shadow-gray-200'} bg-gray-800`}
                            >
                                <div className="cursor-pointer" onClick={() => handleExpand(disease.id)}>
                                    <h3 className="text-xl font-bold">{disease.name}</h3>
                                    {expandedDiseaseId === disease.id && (
                                        <div className="mt-4">
                                            <p>Patients with disease: {patientCount[disease.id] ?? 0}</p>
                                            <button
                                                className="mt-2 bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                                                onClick={() => handleDelete(disease.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}

export default DiseaseInfo;