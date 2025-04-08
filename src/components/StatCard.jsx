export default function StatCard({ title, value, subtext }) {
    return (
      <div className="bg-white rounded-2xl shadow p-4 w-full">
        <div className="text-sm text-gray-500 font-medium">{title}</div>
        <div className="text-2xl font-bold text-green-900">{value}</div>
        {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
      </div>
    );
  }
  