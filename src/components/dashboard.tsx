import UploadButton from "./upload-button";

const Dashboard = () => {
  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        <UploadButton />
      </div>
    </main>
  );
};

export default Dashboard;
