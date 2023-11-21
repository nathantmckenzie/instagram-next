"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function MediaUploadModal({
  showMediaUploadModal,
  setShowMediaUploadModal,
}) {
  const [dropzoneFile, setDropzoneFile] = useState(null);

  const dropMedia = (e) => {
    console.log(e.dataTransfer);
    const dropzoneFile = e.dataTransfer;
    console.log(dropzoneFile);

    // this.dropzoneFile = e.dataTransfer.files[0];
    // this.contentType = contentTypeEnum[this.dropzoneFile?.type];

    // if (this.dropzoneFile && this.contentType === 1) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    // 	const imagePreview = document.getElementById("imagePreview");
    // 	imagePreview.src = e.target.result;
    // 	setTimeout(() => {
    // 	  this.cropImage();
    // 	  // this.dropzoneFile.dataURL = cropped;
    // 	}, 200);
    //   };
    //   reader.readAsDataURL(this.dropzoneFile);
    // } else if (this.dropzoneFile && this.contentType === 2) {
    //   const reader = new FileReader();
    //   reader.onload = function (e) {
    // 	const videoPreview1 = document.getElementById("videoPreview1");
    // 	videoPreview1.src = e.target.result;
    // 	const videoPreview2 = document.getElementById("videoPreview2");
    // 	videoPreview2.src = e.target.result;
    //   };
    //   reader.readAsDataURL(this.dropzoneFile);
    // }
  };

  return (
    <div
      onDragOver={dropMedia}
      className="absolute left-[50%] top-[50%] flex h-[80%] w-[30%] min-w-[500px] -translate-x-2/4 -translate-y-2/4 rounded-[3%] border border-solid border-[black] bg-white"
    >
      <span
        className="m-3 cursor-pointer"
        onClick={() => setShowMediaUploadModal(false)}
      >
        X
      </span>
      <div className="flex w-full items-center justify-center">
        Upload{" "}
        {dropzoneFile ? (
          <div>
            Dropzone file
            <img
              id="imagePreview"
              ref="originalImage"
              src="#"
              alt="Image Preview"
              className="media-preview"
            />
          </div>
        ) : (
          <div>
            <div>Drag photos and videos here</div>
            <label>
              <div>Select from computer</div>
            </label>
            <input type="file" id="dropzoneFile" onChange={dropMedia} />
          </div>
        )}
      </div>
    </div>
  );
}
