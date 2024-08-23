import React, { useState, useEffect } from 'react';
import PatientsInfo from './components/Patients/PatientsInfo.tsx';
import DiseaseInfo from "./components/Diseases/DiseaseInfo.tsx";
import DiagnosesInfo from "./components/Diagnoses/DiagnosesInfo.tsx";
import {Api, Diseases, Patients} from "./Api.ts";
import {useLocation} from "react-router-dom";

const api = new Api();

function App() {
    const location = useLocation();
    const [patients, setPatients] = useState<Patients[]>([]);
    const [diseases, setDiseases] = useState<Diseases[]>([]);
    const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    const [selectedTab, setSelectedTab] = useState('patients');
    const [searchWord, setSearchWord] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (location.state?.selectedTab){
            setSelectedTab(location.state?.selectedTab);
        }
    }, [location.state]);

    useEffect(() => {
        const getSearchablePatients = async () => {
            const response = await api.patients.patientsList();
            setPatients(response.data);
        };
        getSearchablePatients();
    }, []);

    useEffect(() => {
        const getSearchableDiseases = async () => {
            const response = await api.diseases.diseasesList();
            setDiseases(response.data);
        };
        getSearchableDiseases();
    }, []);


    const handleTabChange = (tab: React.SetStateAction<string>) => {
        setSelectedTab(tab);
    };


    return (
        <>
            <div className="h-screen bg-neutral text-white">
                <header
                    className="flex justify-between items-center p-4 border-b border-neutral-focus bg-black bg-opacity-50 fixed w-full z-10">
                    <div className="flex space-x-8">
                        <button
                            className={`text-xl  ${selectedTab === 'patients' ? 'text-blue-500' : 'text-gray-400'}`}
                            onClick={() => handleTabChange('patients')}
                        >
                            Patients
                        </button>
                        <button
                            className={`text-xl ${selectedTab === 'diseases' ? 'text-blue-500' : 'text-gray-400'}`}
                            onClick={() => handleTabChange('diseases')}
                        >
                            Diseases
                        </button>
                        <button
                            className={`text-xl ${selectedTab === 'diagnoses' ? 'text-blue-500' : 'text-gray-400'}`}
                            onClick={() => handleTabChange('diagnoses')}
                        >
                            Diagnoses
                        </button>
                    </div>
                    <div className="flex items-center space-x-4">
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchWord}
                            className="bg-black  rounded-md pl-4 text-blue-500 shadow-gray-200 outline-gray-800"
                            onChange={(event) => setSearchWord(event.target.value)}/>
                        <span className="m-2 font-bold">{time}</span>
                    </div>
                </header>

                <main className="pt-24">
                    {selectedTab === 'patients' && (
                        <section className="mt-8 px-8">
                            <PatientsInfo patients={patients} searchWord={searchWord}/>
                        </section>
                    )}

                    {selectedTab === 'diseases' && (
                        <section className="mt-8 px-8">
                        <DiseaseInfo diseases={diseases} searchWord={searchWord}/>
                        </section>
                    )}
                    {selectedTab === 'diagnoses' && (
                        <section className="mt-8 px-8">
                            <DiagnosesInfo/>
                        </section>
                    )}
                </main>
            </div>
        </>
    );
}

export default App;
