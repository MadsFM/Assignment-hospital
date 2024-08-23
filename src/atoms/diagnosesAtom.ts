import {atom} from "jotai/index";
import {Diagnoses} from "../Api.ts";


export const diagnosesAtom = atom<Diagnoses[]>([]);