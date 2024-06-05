import { Property } from "../Property";

export interface InputCommitEvent {
    text: string;

    commitMethod: mw.TextCommit;

    validate?: Property.DataValidateResult;
}

export interface InputChangeEvent {
    text: string;
}
