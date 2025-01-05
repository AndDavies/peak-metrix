import { Home, ClipboardList, BarChart2, Package } from "lucide-react";

const navItems = [
  { label: "Home", icon: <Home size={20} />, path: "/dashboard" },
  { label: "Programs", icon: <Package size={20} />, path: "/dashboard/programs" },
  { label: "Workouts", icon: <ClipboardList size={20} />, path: "/dashboard/workouts" },
  { label: "Analytics", icon: <BarChart2 size={20} />, path: "/dashboard/analytics" },
];

export function AppSidebar() {
  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col">
      <div className="p-4 font-bold text-lg text-pink-500">peakMetrix</div>
      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item, idx) => (
          <a
            key={idx}
            href={item.path}
            className="flex items-center space-x-3 p-3 rounded-md hover:bg-neutral-800"
          >
            {item.icon}
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
}