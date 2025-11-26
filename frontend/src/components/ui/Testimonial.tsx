 export default function Testimonial({ name, role, quote }: { name: string; role: string; quote: string }) {
  return (
    <div className="p-6 bg-white rounded-lg border shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-semibold text-indigo-600">{name[0]}</div>
        <div>
          <div className="font-semibold">{name}</div>
          <div className="text-sm text-gray-400">{role}</div>
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600">“{quote}”</div>
    </div>
  );
}