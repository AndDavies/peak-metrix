// app/classes/page.tsx
import ClassesClient from "./ClassesClient";

/**
 * Minimal server component that simply renders the client-based Classes page.
 * No SSR data fetching unless you want it. This prevents extra re-renders 
 * just by tabbing away, as we won't do a server re-fetch on each focus.
 */
export default function ClassesPage() {
  return (
    <div className="bg-[#121212] text-[#E5E7EB] min-h-screen">
      <ClassesClient />
    </div>
  );
}
