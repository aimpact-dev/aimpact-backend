import { InlinedFile } from '@vercel/sdk/src/models/createdeploymentop';

interface File {
  type: 'file';
  content: string;
  isBinary: boolean;
  isLocked?: boolean;
  lockedByFolder?: string; // Path of the folder that locked this file
}

interface Folder {
  type: 'folder';
  isLocked?: boolean;
  lockedByFolder?: string; // Path of the folder that locked this folder (for nested folders)
}

type Dirent = File | Folder;

export type FileMap = Record<string, Dirent | undefined>;


const WORK_DIR_NAME = 'project';
const WORK_DIR = `/home/${WORK_DIR_NAME}`;

const regex = new RegExp(`^${WORK_DIR}\/`);

function extractRelativePath(filePath: string) {
  return filePath.replace(regex, '');
}
export function deserializeSnapshot(snapshot: FileMap) {
  const files: Array<InlinedFile> = [];

  for (const [filePath, dirent] of Object.entries(snapshot)) {
    if (dirent?.type === 'file' && !dirent.isBinary) {
      const relativePath = extractRelativePath(filePath);

      // split the path into segments
      files.push({
        data: dirent.content,
        file: relativePath
      })
    }
  }
  return files;
}
