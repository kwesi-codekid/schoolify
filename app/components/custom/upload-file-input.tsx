const UploadFileInput = ({ name }: { name: string }) => {
  return (
    <>
      <div className="relative font-nunito">
        <input
          name={name}
          type="file"
          className="w-full rounded-md border-2 p-3 border-neutral-300/90 dark:border-neutral-700 outline-none transition-all duration-400 hover:border-lightgreen/70 file:bg-lightgreen/30 file:mr-4 file:rounded file:border-none file:py-1 file:font-nunito file:px-[10px] file:text-sm file:font-medium dark:file:text-white focus:border-lightgreen file:focus:border-lightgreen active:border-lightgreen disabled:bg-[#F5F7FD]"
        />
      </div>
    </>
  );
};

export default UploadFileInput;
