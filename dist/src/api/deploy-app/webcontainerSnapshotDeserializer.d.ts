type Encoding = 'base64' | 'utf-8';
interface InlinedFile {
    data: string;
    encoding?: Encoding;
    file: string;
}
interface File {
    type: 'file';
    content: string;
    isBinary: boolean;
    isLocked?: boolean;
    lockedByFolder?: string;
}
interface Folder {
    type: 'folder';
    isLocked?: boolean;
    lockedByFolder?: string;
}
type Dirent = File | Folder;
export type FileMap = Record<string, Dirent | undefined>;
export declare function deserializeSnapshot(snapshot: FileMap): InlinedFile[];
export {};
