export default function StatCard({ title, value, subtext }) {
  return (
    <div className="bg-olive-50 rounded-2xl shadow p-4 w-full border border-olive-200">
      <div className="text-sm text-olive-600 font-medium">{title}</div>
      <div className="text-2xl font-bold text-olive-800">{value}</div>
      {subtext && <div className="text-xs text-olive-500 mt-1">{subtext}</div>}
    </div>
  );
}