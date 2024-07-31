import { INodeData } from "../node/INodeData";

export interface ITreeData {
    name: string;

    root: INodeData;

    desc?: string;
}