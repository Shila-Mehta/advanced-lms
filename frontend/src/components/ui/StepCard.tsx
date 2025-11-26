export default function StepCard({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-semibold text-indigo-600">{step}</div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-2 text-sm text-gray-500">{desc}</div>
    </div>
  );
}