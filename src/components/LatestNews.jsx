import latestNews from "../assets/Images/latestnews.png";

export default function LatestNews() {
  return (
    <section
      className="w-full bg-[#aafcdc] px-4 sm:px-8 py-12 overflow-hidden"
      id="latest-news"
    >
      <hr className="border-t-2 border-black mb-20" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
        <div>
          <h3 className="text-sm uppercase font-semibold text-gray-800 mb-2 tracking-wide">
            Latest News
          </h3>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black leading-snug mb-4">
            New factual show, Eat the Invaders, presented by Tony Armstrong –
            coming to ABC in 2025
          </h2>

          <p className="text-base sm:text-lg text-gray-800 mb-4">
            Eat the Invaders, hosted by Tony Armstrong, written and directed by
            Matt Bate is set to premiere on ABC TV & iView in January 2025.
          </p>

          <a
            href="#"
            className="underline text-black font-medium text-base sm:text-lg hover:text-gray-700"
          >
            Read more
          </a>
        </div>

        <div className="w-full h-full overflow-hidden flex justify-center items-center">
          <img
            src={latestNews}
            alt="Eat The Invaders"
            className="w-[450px] h-auto object-cover rounded-none transition-transform duration-500 ease-out hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
