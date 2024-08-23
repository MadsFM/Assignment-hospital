import {atom} from "jotai/index";
import {Diseases} from "../Api.ts";


export const diseasesAtom = atom<Diseases[]>([]);