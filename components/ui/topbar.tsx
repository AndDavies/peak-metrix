export default function Topbar() {
    return (
      <header className="w-full bg-neutral-900 border-b border-neutral-800 p-4 flex items-center justify-between">
        <h1 className="text-lg font-bold text-pink-500">Dashboard</h1>
        <div className="flex space-x-4">
          <button className="bg-neutral-800 text-white px-3 py-1 rounded hover:bg-neutral-700">
            Notifications
          </button>
          <button className="bg-neutral-800 text-white px-3 py-1 rounded hover:bg-neutral-700">
            Profile
          </button>
        </div>
      </header>
    );
  }