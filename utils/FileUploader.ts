// FileUploader.ts
import ssrCache from "~/utils/cache";

class FileUploader {
    private baseUrl: string;
    private onProgress: (chunkNumber: number, totalChunks: number) => void;

    constructor(baseUrl: string, onProgress: (chunkNumber: number, totalChunks: number) => void) {
        this.baseUrl = baseUrl;
        this.onProgress = onProgress;
    }

    async checkChunkExists(identifier: string, chunkNumber: number,token:string,day:string): Promise<boolean> {
        try {
            var url=`${this.baseUrl}/admin/userVideo/check?identifier=${identifier}&chunkNumber=${chunkNumber}&day=${day}`;
            const response = await fetch(url,{
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            const dataJson = await response.json();

            if(dataJson.code == 200){
                return true;
            }else {
                return false;
            }
        } catch (error) {
            console.error('Error checking chunk:', error);
            return false;
        }
    }

    async uploadChunk(fileChunk: Blob, identifier: string, chunkNumber: number, totalChunks: number,token:string,day:string,aid:number,isFree:number,md5:string): Promise<void> {
        const exists = await this.checkChunkExists(identifier, chunkNumber,token,day);
        if (exists) {
            //console.log(`Chunk ${chunkNumber} already uploaded.`);
            this.onProgress(chunkNumber, totalChunks);
            return;
        }

        const formData = new FormData();
        formData.append('file', fileChunk);
        formData.append('day', day);
        formData.append('aid', aid.toString());
        formData.append('isFree', isFree.toString());
        formData.append('md5', md5.toString());
        formData.append('chunkNumber', chunkNumber.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('identifier', identifier);
        var url=`${this.baseUrl}/admin/userVideo/uploadSection`;
        await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`
            },
        });

        this.onProgress(chunkNumber, totalChunks);
    }

    /**
     * 默认每个分段10M
     * @param file
     * @param identifier
     * @param token
     * @param day
     * @param aid
     * @param isFree
     * @param chunkSize
     */
    async uploadFile(file: File, identifier: string,token:string ="",day:string ="",aid:number=0,isFree:number=2,md5:string="", chunkSize: number =10 *  1024 * 1024): Promise<void> {
        const totalChunks = Math.ceil(file.size / chunkSize);
        for (let i = 0; i < totalChunks; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, file.size);
            const chunk = file.slice(start, end);

            await this.uploadChunk(chunk, identifier, i, totalChunks,token,day,aid,isFree,md5);
        }
    }
}
export default FileUploader
// export default FileUploader;

// import FileUploader from './FileUploader';

// // ...
//
// const uploader = new FileUploader('http://localhost:3000/api/upload', (chunkNumber, totalChunks) => {
//     //console.log(`Uploading chunk ${chunkNumber} of ${totalChunks}`);
// });
//
// const file = /* 获取文件对象 */;
// const identifier = 'unique-file-id';
// uploader.uploadFile(file, identifier)
//     .then(() => //console.log('Upload complete'))
//     .catch(error => console.error('Upload failed', error));