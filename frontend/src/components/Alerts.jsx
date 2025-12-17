export default function Alerts({ alerts = [] }) {
  return (
    <div className="bg-yellow-50 p-6 rounded-2xl shadow-md border border-yellow-200">
      <h3 className="font-semibold text-lg mb-2 text-yellow-700">⚠️ Smart Alerts</h3>
      <ul className="list-disc list-inside space-y-1 text-gray-700 max-h-64 overflow-y-auto">
        {alerts.length > 0 ? (
          alerts.map((alert, idx) => <li key={idx}>{alert}</li>)
        ) : (
          <li>✅ Loading alerts...</li>
        )}
      </ul>
    </div>
  );
}
