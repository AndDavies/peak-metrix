import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const programs = [
  { title: "Hyrox Program", category: "Endurance", description: "Boost your stamina with Hyrox." },
  { title: "Strength Program", category: "Strength", description: "Build your lifting power." },
  { title: "Bodybuilding Program", category: "Hypertrophy", description: "Maximize muscle growth." },
];

export default function ProgramsMarketplace() {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-pink-500 mb-4">Programs Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {programs.map((program, idx) => (
          <Card key={idx} className="bg-neutral-800 hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-white">{program.title}</CardTitle>
              <CardDescription className="text-gray-400">{program.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}