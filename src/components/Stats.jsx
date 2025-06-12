const stats = [
  { label: "Founded", value: "2009" },
  { label: "Total series", value: "39" },
  { label: "Total episodes", value: "1,150" },
  { label: "Movies produced", value: "2" },
  { label: "Platform count", value: "19" },
];

export default function Stats() {
  return (
    <section className="max-w-5xl mx-auto bg-[#F5F5F7] border border-gray-500 border-dashed rounded-xl p-1 sm:p-3 md:p-5 my-8 mt-[10px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border border-gray-400 rounded-xl cursor-pointer p-3 sm:p-4 bg-white text-center transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            <p className="text-gray-500 text-sm">{stat.label}</p>
            <p className="text-xl font-semibold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
