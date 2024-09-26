
import { createUploadthing, type FileRouter } from "uploadthing/next";

const  f = createUploadthing();


export const fileRouter = {

imageUploader: f({image:{maxFileSize:"8MB",maxFileCount:1}})
.onUploadComplete(async({file})=>{   //use metadata to get user id
  console.log("file url",file.url);
})


} satisfies FileRouter;


export type OurFileRouter = typeof fileRouter