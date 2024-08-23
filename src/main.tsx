import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import CreateNewPatient from "./components/Patients/CreateNewPatient.tsx";
import UpdatePatient from "./components/Patients/UpdatePatient.tsx";
import CreateNewDisease from "./components/Diseases/CreateNewDisease.tsx";
import CreateNewDiagnosis from "./components/Diagnoses/CreateNewDiagnosis.tsx";
import WelcomePage from "./components/WelcomePage.tsx";


createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<WelcomePage/>} />
              <Route path="/app" element={<App/>}/>
              <Route path="/create-patient" element={<CreateNewPatient/>}/>
              <Route path="/update-patient/:id" element={<UpdatePatient/>}/>
              <Route path="/create-disease" element={<CreateNewDisease/>}/>
              <Route path="create-diagnosis" element={<CreateNewDiagnosis/>}/>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
)
