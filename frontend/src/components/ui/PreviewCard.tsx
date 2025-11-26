 export default function PreviewCard({ title, caption }: { title: string; caption?: string }) {
  return (
    <div className="p-4 bg-white rounded-lg border shadow-sm flex flex-col">
      <div className="w-full h-36 rounded-md bg-gray-50 flex items-center justify-center text-gray-300">{title} screenshot</div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="mt-1 text-sm text-gray-500">{caption}</div>
    </div>
  );
}
