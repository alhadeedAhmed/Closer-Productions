'use client';

import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-0 sm:min-h-screen relative py-8 sm:pt-[20px] px-4 sm:px-6">
        <div 
          className="w-full max-w-[1109px] bg-white dark:bg-gray-800 rounded-[20px] sm:rounded-[32px] border border-[#FFFFFF] dark:border-gray-700 shadow-xl overflow-hidden mx-auto my-4 sm:my-0" 
          style={{
            boxShadow: "0px 40px 40px rgba(0, 0, 0, 0.07)"
          }}
        >
          <div className="flex flex-col items-center p-4 sm:p-10 md:p-16">
            <h1 className="text-3xl sm:text-4xl md:text-[52px] font-bold tracking-[3px] md:tracking-[5px] text-center mb-4 sm:mb-8 text-gray-900 dark:text-white">
              ABOUT US
            </h1>
            
            <p className="text-center max-w-[628px] mb-2 font-['Gilroy-Medium'] text-base sm:text-[18px] leading-[26px] sm:leading-[29px] text-gray-800 dark:text-gray-200 px-2 sm:px-4">
              At The Diff Between, our mission is to empower users with clear, accurate, and concise comparisons using the most current sources and technology.
            </p>
            <p className="text-center max-w-[628px] mb-2 font-['Gilroy-Medium'] text-base sm:text-[18px] leading-[26px] sm:leading-[29px] text-gray-800 dark:text-gray-200 px-2 sm:px-4">
              When you enter two or three items of your choice, 
              we will deliver straightforward explanations that highlight their key differences, 
              helping you make informed decisions quickly and confidently.
            </p>
            <p className="text-center max-w-[628px] mb-6 sm:mb-20 font-['Gilroy-Medium'] text-base sm:text-[18px] leading-[26px] sm:leading-[29px] text-gray-800 dark:text-gray-200 px-2 sm:px-4">
              Thank you for visiting TheDiffBetween.com. Please share and post.
            </p>
            {/* <div className="relative flex justify-center w-full mb-4 sm:mb-0">
              <div 
                className="absolute w-[220px] sm:w-[288.48px] h-[70px] sm:h-[84.08px] rounded-[10px]"
                style={{
                  backgroundColor: "black",
                  filter: "blur(20px)",
                  opacity: 0.25,
                  transform: "translateY(12px)",
                }}
              />
              
              <Link 
                href="/about/more"
                className="relative bg-black text-white inline-flex items-center justify-center w-[220px] sm:w-[288.48px] h-[70px] sm:h-[84.08px] rounded-[10px]"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
                  boxShadow: `
                    0px 40px 5px 0px #44444420,
                    0px 40px 15px 0px #44444430,
                    0px 40px 20px 0px #44444440,
                    0px 40px 30px 0px #44444450,
                    0px 40px 40px 0px #44444460,
                    0px 60px 60px 0px #44444470
                  `
                }}
              >
                <span className="uppercase tracking-wider font-bold text-sm sm:text-[16px]">EXPLORE MORE</span>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 