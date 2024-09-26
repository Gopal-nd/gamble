"use client";

import { UploadButton } from "@/utils/uploadthing";



const UploadPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          console.log("Upload completed:", res);
          alert("Upload successful!");
        }}
        onUploadError={(error) => {
          console.error("Upload failed:", error);
          alert("Upload failed. Please try again.");
        }}
      />
      <hr />
    
    </div>
  );
};

export default UploadPage;
