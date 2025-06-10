import { FaInstagram, FaFacebookF, FaVimeoV } from "react-icons/fa";
import footerLogo from "../assets/Images/closerlogofooter.svg";

const Footer = () => {
  return (
    <footer className="w-full bg-white text-black px-6 md:px-16 py-10 border-t border-gray-200 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-6">
        <div className="flex-1 max-w-md text-sm leading-relaxed">
          <p>
            We acknowledge that we live and work on the traditional country of
            the Kaurna people of the Adelaide Plains. We pay our respects to
            their Elders of past and present as Traditional Owners and
            Custodians of the land.
          </p>
        </div>

        <div className="flex-1 flex justify-center md:justify-center">
          <img
            src={footerLogo}
            alt="Closer Productions Logo"
            className="w-28 h-28 md:w-32 md:h-32 object-contain"
          />
        </div>

        <div className="flex-1 max-w-sm">
          <p className="text-[18px] font-medium mb-2">
            Subscribe to our newsletter:
          </p>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full  py-2 bg-transparent focus:outline-none  placeholder-gray-400"
          />
          <button className="mt-3 underline text-black hover:text-gray-700 transition">
            Subscribe
          </button>

          <p className="text-xs text-gray-500 mt-6 leading-relaxed">
            © 2025 Closer Productions.
            <br />
            Web design by{" "}
            <span className="underline">Elle Williams Studio</span> and{" "}
            <span className="underline">Vanessa Brewster</span>. Development by{" "}
            <span className="underline">Vanessa Brewster</span>.
          </p>
        </div>

        <div className="flex-1 max-w-sm">
          <p className="text-[20px] font-medium mb-2">Get Closer to Closer:</p>
          <a
            href="mailto:closer@closerproductions.com.au"
            className="underline text-black block mb-2"
          >
            closer@closerproductions.com.au
          </a>
          <p className="text-sm mb-4">
            We do not accept unsolicited materials or offer work experience
            placements.
          </p>
          <div className="flex gap-4 text-xl text-black">
            <a href="#">
              <FaInstagram />
            </a>
            <a href="#">
              <FaFacebookF />
            </a>
            <a href="#">
              <FaVimeoV />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
