import { Pie } from "react-chartjs-2";

export default function Graphs() {
  const data = {
    labels: ["Strength", "Endurance", "Flexibility"],
    datasets: [
      {
        label: "Workout Distribution",
        data: [40, 30, 30],
        backgroundColor: ["#F87171", "#4ADE80", "#60A5FA"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-pink-500 mb-4">Workout Distribution</h2>
      <Pie data={data} />
    </div>
  );
}