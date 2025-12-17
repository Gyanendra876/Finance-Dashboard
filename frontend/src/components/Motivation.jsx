export default function Motivation({ quote = "Loading quote...", author = "" }) {
  return (
    <div className="bg-indigo-50 p-6 rounded-2xl shadow-md border border-indigo-200">
      <h3 className="font-semibold text-lg mb-2 text-indigo-700">💡 Daily Motivation</h3>
      <p className="text-gray-800 italic">{quote}</p>
      {author && <p className="text-sm text-gray-500 mt-2">- {author}</p>}
    </div>
  );
}
