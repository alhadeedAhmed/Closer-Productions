import { featuredContent } from "../data/featuredContent";

export default function FeaturedSection() {
  return (
    <div id="content-section" className="bg-[#aafcdc] py-16">
      <h2 className="text-5xl font-bold px-6 sm:px-12 md:px-20 mb-12 text-black overflow-hidden">
        Latest
      </h2>

      {featuredContent.map((item, index) => (
        <div
          key={item.id}
          className={`flex flex-col ${
            item.imagePosition === "right"
              ? "md:flex-row-reverse"
              : "md:flex-row"
          } items-center md:items-stretch mb-24`}
        >
          <div className="w-full md:w-1/2">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 py-10 text-black">
            <p className="text-sm uppercase tracking-wide mb-2">{item.type}</p>
            <h1 className="text-4xl font-bold mb-4">{item.title}</h1>
            <p className="text-lg mb-4">{item.description}</p>
            <a href={item.watchLink} className="underline text-lg font-medium">
              Watch now
            </a>
          </div>
        </div>
      ))}

      <div className="text-center mx-6 sm:mx-12 md:mx-20">
        <p className="text-xl text-black font-medium mb-2 mt-10">
          See our{" "}
          <a href="#" className="underline">
            features
          </a>
          ,{" "}
          <a href="#" className="underline">
            tv shows
          </a>
          ,{" "}
          <a href="#" className="underline">
            other projects
          </a>
        </p>
      </div>
    </div>
  );
}
