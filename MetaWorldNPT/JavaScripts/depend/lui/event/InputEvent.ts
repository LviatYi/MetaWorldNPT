import { Property } from "../style/Property";

export enum CommitType {
    Blur = 0,
    Enter = 1,
}

export interface InputCommitEvent {
    text: string;

    commitType: CommitType;

    validate?: Property.DataValidateResult;
}

export interface InputChangeEvent {
    text: string;
}
