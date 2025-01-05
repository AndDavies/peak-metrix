// app/programming/page.tsx


import ProgrammingClient from "./programmingClient";

/**
 * Minimal server component to render the Programming page.
 * We won't do SSR data fetching here unless needed.
 */
export default function ProgrammingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#E5E7EB]">
      <ProgrammingClient />
    </div>
  );
}
