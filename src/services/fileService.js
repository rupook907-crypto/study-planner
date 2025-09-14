import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll
} from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

export class FileService {
  // Upload file to Firebase Storage
  static async uploadFile(file, assignmentId, userId) {
    try {
      const filePath = `assignments/${userId}/${assignmentId}/${file.name}`;
      const storageRef = ref(storage, filePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return {
        success: true,
        downloadURL,
        fileName: file.name,
        filePath,
        size: file.size,
        type: file.type
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete file from Firebase Storage
  static async deleteFile(filePath) {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all files for an assignment
  static async getAssignmentFiles(assignmentId, userId) {
    try {
      const folderPath = `assignments/${userId}/${assignmentId}`;
      const folderRef = ref(storage, folderPath);
      const fileList = await listAll(folderRef);
      
      const files = await Promise.all(
        fileList.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return {
            name: item.name,
            url: url,
            path: item.fullPath
          };
        })
      );
      
      return { success: true, files };
    } catch (error) {
      console.error('Error fetching files:', error);
      return { success: false, error: error.message };
    }
  }

  // Get file icon based on type
  static getFileIcon(fileType) {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    if (fileType.includes('zip') || fileType.includes('rar')) return '📦';
    return '📎';
  }

  // Format file size
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
} 