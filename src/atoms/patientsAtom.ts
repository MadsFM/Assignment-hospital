import {atom} from "jotai/index";
import {Patients} from "../Api.ts";


export const patientsAtom = atom<Patients[]>([]);