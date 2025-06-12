export default function StickyButtons() {
  return (
    <div className="sticky top-2 z-50">
      <div className="bg-white rounded p-2 sm:p-3 flex flex-row gap-2 w-fit ml-auto">
        <a
          href="/assets/files/kapital-entertainment.pdf"
          download="kapital-entertainment.pdf"
          className="bg-white border border-gray-300 text-black px-3 py-1 rounded hover:bg-gray-100 text-md font-bold"
        >
          Export to PDF
        </a>
        <a
          href="/assets/files/kapital-entertainment-shows.csv"
          download="kapital-entertainment-shows.csv"
          className="bg-white border border-gray-300 text-black px-3 py-1 rounded hover:bg-gray-100 text-md font-bold"
        >
          Export to CSV
        </a>
      </div>
    </div>
  );
}
