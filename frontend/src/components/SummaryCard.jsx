export default function SummaryCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className={`text-2xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}
