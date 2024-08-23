
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import {Api} from "../../Api.ts";


const api = new Api();


const CreateNewDisease: React.FC = () => {
    const [newDiseaseName, setNewDiseaseName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();


    const handleCreate = async () => {
        if (!newDiseaseName.trim()) {
            alert('Please enter a new disease');
            return;
        }
        setLoading(true);

        try {

            const newDisease = {
                name: newDiseaseName,
            };
            await api.diseases.diseasesCreate(newDisease);
            navigate("/app", {state: {selectedTab: 'diseases'}});
        } catch (error) {
            console.log('Error creating disease', error)
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="p-8 h-screen bg-neutral text-white">
                <h2 className="text-2xl font-bold mb-4">Create new disease</h2>
                <input
                type="text"
                placeholder="Enter disease name"
                value={newDiseaseName}
                onChange={(event) => setNewDiseaseName(event.target.value)}
                className="p-2 border text-amber-950 border-gray-300 rounded-md - w-80 mb-4"
                />
                <div className="flex space-x-2">
                    <button className="bg-gray-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                            onClick={() => navigate("/app", {state: {selectedTab: 'diseases'}})}
                            disabled={loading}
                    >
                        Cancel
                    </button>
                    <button className="bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600"
                            onClick={handleCreate}
                            disabled={loading}>
                        {loading ? "Saving..." : "Create"}
                    </button>
                </div>
            </div>
        </>
    );
};

export default CreateNewDisease;