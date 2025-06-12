import kapitalLogo from "../assets/images/kapital-insider.png";

export default function Header() {
  return (
    <header className="relative w-full bg-white py-3 px-4 flex flex-col items-center gap-1">
      <img
        src={kapitalLogo}
        alt="Kapital Insider Logo"
        className="w-[180px] h-auto"
      />
      <p className="text-red-700 font-semibold text-[18px] tracking-wide">
        BETA - For Internal Use Only
      </p>
    </header>
  );
}
