 export  default function FeatureCard({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="text-2xl">{icon}</div>
      <div className="mt-4 font-semibold">{title}</div>
      <div className="mt-2 text-sm text-gray-500">{desc}</div>
    </div>
  );
}