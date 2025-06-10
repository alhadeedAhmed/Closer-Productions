import Navbar from "../components/Navbar";
import VideoSlider from "../components/VideoSlider";
import FeaturedSection from "../components/FeaturedSection";
import LatestNews from "../components/LatestNews";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <Navbar />
      <VideoSlider />
      <FeaturedSection />
      <LatestNews />
      <Footer />
    </div>
  );
}
