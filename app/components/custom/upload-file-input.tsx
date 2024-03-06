/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

const UploadFileInput = ({ name }: { name: string }) => {
  const [base64, setBase64] = useState("");

  return (
    <>
      <div className="relative font-nunito">
        <input
          name={name}
          id="imageInput"
          type="text"
          className="hidden"
          value={base64}
        />
        <input
          name={"uploader"}
          onChange={(e: any) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
              setBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
          }}
          type="file"
          className="w-full rounded-md border-2 p-3 border-neutral-300/90 dark:border-neutral-700 outline-none transition-all duration-400 hover:border-lightgreen/70 file:bg-lightgreen/30 file:mr-4 file:rounded file:border-none file:py-1 file:font-nunito file:px-[10px] file:text-sm file:font-medium dark:file:text-white focus:border-lightgreen file:focus:border-lightgreen active:border-lightgreen disabled:bg-[#F5F7FD]"
        />
      </div>
    </>
  );
};

export default UploadFileInput;
