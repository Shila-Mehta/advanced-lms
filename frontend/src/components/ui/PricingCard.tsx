 export default function PricingCard({ tier, price, perks, featured }: { tier: string; price: string; perks: string[]; featured?: boolean }) {
  return (
    <div className={`p-6 rounded-lg border shadow-sm ${featured ? 'border-indigo-600 bg-indigo-50' : 'bg-white'}`}>
      <div className="flex items-center justify-between">
        <div className="font-semibold">{tier}</div>
        <div className="text-xl font-bold">{price}</div>
      </div>
      <ul className="mt-4 text-sm text-gray-600 space-y-2">
        {perks.map((p) => (<li key={p}>• {p}</li>))}
      </ul>
      <div className="mt-6">
        <button className={`w-full px-4 py-2 rounded-md ${featured ? 'bg-indigo-600 text-white' : 'border border-gray-200'}`}>{tier === 'Free' ? 'Start Free' : 'Choose plan'}</button>
      </div>
    </div>
  );
}