type Encoding = 'base64' | 'utf-8';
interface InlinedFile {
  data: string;
  encoding?: Encoding;
  file: string;
  isBinary: boolean;
}

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
const DIST_DIR = `${WORK_DIR}/dist`;

const regex = new RegExp(`^${WORK_DIR}\/`);

function extractRelativePath(filePath: string) {
  return filePath.replace(regex, '');
}

function extractDistRelativePath(filePath: string) {
  return filePath.replace(`${DIST_DIR}/`, '');
}

export function deserializeSnapshot(snapshot: FileMap) {
  const files: Array<InlinedFile> = [];

  for (const [filePath, dirent] of Object.entries(snapshot)) {
    if (dirent?.type === 'file' && !dirent.isBinary) {
      const relativePath = extractRelativePath(filePath);

      // split the path into segments
      files.push({
        data: dirent.content,  // base64 if isBinary == true
        file: relativePath,
        isBinary: dirent.isBinary,
      });
    }
  }
  return files;
}

export function deserializeDistSnapshot(snapshot: FileMap) {
  const files: Array<InlinedFile> = [];

  for (const [filePath, dirent] of Object.entries(snapshot)) {
    if (dirent?.type === 'file') {
      const relativePath = extractDistRelativePath(filePath);

      // split the path into segments
      files.push({
        data: dirent.content,
        file: relativePath,
        isBinary: dirent.isBinary,
      });
    }
  }
  return files;
}
