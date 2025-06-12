import Header from "./components/Header";
import Buttons from "./components/Buttons";
import Stats from "./components/Stats";
import Platforms from "./components/Platforms";
import ChartSection from "./components/ChartSection";
import ShowsListing from "./components/ShowsListing";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <main className="max-w-5xl mx-auto px-4">
        <Buttons />
        <Stats />
        <Platforms />
        <ChartSection />
        <ShowsListing />
      </main>
    </div>
  );
}
