"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useUserData } from "@/lib/UserDataProvider";
import SocialIcons from "../components/SocialIcons";
import ProfitablerateAdLeft from "./ProfitablerateAdLeft";
import ProfitablerateAdRight from "./ProfitablerateAdRight";
import ProfitablerateAdBottom from "./ProfitablerateAdbottom";
import Cookies from "js-cookie";

// Add AdSense type definition
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>> & {
      push: (params: Record<string, unknown>) => void;
      loaded?: boolean;
    };
  }
}

interface ComparisonItem {
  title: string;
  species?: string;
  family?: string;
  characteristics: { [key: string]: string };
}

interface ComparisonUIProps {
  freeSearchCount: number;
  setFreeSearchCount: (count: number) => void;
}

interface ApiResponse {
  id: string;
  model: string;
  created: number;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  citations?: string[];
  object: string;
  choices: Array<{
    index: number;
    finish_reason: string;
    message: {
      role: string;
      content: string;
    };
    delta?: {
      role: string;
      content: string;
    };
  }>;
}

// Function to parse API response for testing or direct response handling
const parseApiResponse = (responseJson: ApiResponse): ComparisonItem[] => {
  if (!responseJson?.choices?.[0]?.message?.content) {
    return [];
  }

  const content = responseJson.choices[0].message.content;
  console.log("Content to parse:", content);

  // Split content into sections based on ## markers
  const sections = content.split("##").filter(Boolean);
  const items: ComparisonItem[] = [];

  sections.forEach((section: string) => {
    const lines = section
      .trim()
      .split("\n")
      .map((line: string) => line.trim())
      .filter(Boolean);
    if (lines.length === 0) return;

    const currentItem: ComparisonItem = {
      title: lines[0].replace(/\*\*/g, ""), // Remove asterisks from title immediately
      characteristics: {},
    };

    let currentCharKey = "";

    // Process each line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Skip divider lines and conclusion paragraphs
      if (line === "---" || line.startsWith("This comparison")) continue;

      // Check for species
      if (line.includes("**Species:**") || line.includes("Species:")) {
        currentItem.species = line.replace(/(\*\*)?Species:(\*\*)?/, "").trim();
        continue;
      }

      // Check for family
      if (line.includes("**Family:**") || line.includes("Family:")) {
        currentItem.family = line.replace(/(\*\*)?Family:(\*\*)?/, "").trim();
        continue;
      }

      // Check for species/family combined
      if (line.includes("Species/Family:")) {
        const speciesFamilyInfo = line.replace("Species/Family:", "").trim();
        if (speciesFamilyInfo.toLowerCase() !== "n/a") {
          // If it contains a comma, split into species and family
          if (speciesFamilyInfo.includes(",")) {
            const [species, family] = speciesFamilyInfo
              .split(",")
              .map((s) => s.trim());
            currentItem.species = species;
            currentItem.family = family;
          } else {
            currentItem.species = speciesFamilyInfo;
          }
        }
        continue;
      }

      // Check for bullet points with characteristics
      if (line.startsWith("-") || line.startsWith("•")) {
        // Clean any citation references from the line
        const cleanLine = line.replace(/\[\d+\]/g, "");

        // First try to match the pattern "- **Key:** Value"
        const boldFormatMatch = cleanLine.match(/[•-]\s+\*\*(.*?)\*\*:\s*(.*)/);

        if (boldFormatMatch && boldFormatMatch[1] && boldFormatMatch[2]) {
          // Extract key and value using regex groups
          const key = boldFormatMatch[1].trim().replace(/\*\*/g, "");

          // Skip generic "Point X: Key characteristics" entries
          if (
            key.match(/^Point \d+$/) &&
            boldFormatMatch[2].trim().startsWith("Key characteristics")
          ) {
            continue;
          }

          const value = boldFormatMatch[2].trim();
          currentItem.characteristics[key] = value;
          currentCharKey = key;
          continue;
        }

        // Try another pattern - plain text with colon
        const simpleFormatMatch = cleanLine.match(/[•-]\s+(.*?):\s*(.*)/);
        if (simpleFormatMatch && simpleFormatMatch[1] && simpleFormatMatch[2]) {
          const key = simpleFormatMatch[1].trim().replace(/\*\*/g, "");

          // Skip generic "Point X: Key characteristics" entries
          if (
            key.match(/^Point \d+$/) &&
            simpleFormatMatch[2].trim().startsWith("Key characteristics")
          ) {
            continue;
          }

          const value = simpleFormatMatch[2].trim();
          currentItem.characteristics[key] = value;
          currentCharKey = key;
          continue;
        }

        // If there's no clear pattern, just use the whole line as a characteristic
        const bulletText = cleanLine.replace(/^[•-]\s+/, "").trim();
        if (bulletText) {
          // Skip if it's just "Point X: Key characteristics"
          if (bulletText.match(/^Point \d+: Key characteristics/)) {
            continue;
          }

          const key = `Point ${
            Object.keys(currentItem.characteristics).length + 1
          }`;
          currentItem.characteristics[key] = bulletText;
          currentCharKey = key;
        }
      } else if (currentCharKey && line.trim() && !line.includes("[")) {
        // If this line is a continuation of the previous characteristic
        // but skip lines that might contain citations
        currentItem.characteristics[currentCharKey] +=
          " " + line.trim().replace(/\[\d+\]/g, "");
      }
    }

    // Clean up the title (remove any extra spaces or special characters)
    currentItem.title = currentItem.title
      .replace(/[""]/g, "")
      .replace(/\*\*/g, "")
      .trim();

    // Clean up characteristic values
    Object.keys(currentItem.characteristics).forEach((key) => {
      // Replace multiple spaces with a single space
      currentItem.characteristics[key] = currentItem.characteristics[key]
        .replace(/\s+/g, " ")
        .replace(/\[\d+\]/g, "") // Remove citation references
        .replace(/\*\*/g, "") // Remove any asterisks in the characteristics
        .trim();
    });

    items.push(currentItem);
  });

  return items;
};

export default function ComparisonUI({
  freeSearchCount,
}: ComparisonUIProps) {
  const [item1, setItem1] = useState("");
  const [item2, setItem2] = useState("");
  const [item3, setItem3] = useState("");
  const [showThirdInput, setShowThirdInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ComparisonItem[]>([]);
  const [error, setError] = useState("");
  const [showIntro, setShowIntro] = useState(true);
  const { isSignedIn } = useAuth();
  const { userData, incrementSearchCount } = useUserData();

  const searchLimitReached =
    userData && userData.searchCount >= userData.searchLimit;

  // Only show ads for users with free subscription status
  const shouldShowAds = !userData || userData.subscriptionStatus === "free";

  const handleCompare = async () => {
    if (!item1 || !item2 || (showThirdInput && !item3)) {
      setError("Please enter all items to compare");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      let canProceed = true;

      if (isSignedIn) {
        canProceed = await incrementSearchCount();
      } else {
        const guestCount = Number(Cookies.get("freeSearchCount") || "0");
        if (guestCount >= 3) {
          setError("Free search limit reached. Please sign up to continue.");
          setLoading(false);
          return;
        }
        Cookies.set("freeSearchCount", (guestCount + 1).toString(), {
          expires: 7,
        });
      }

      if (!canProceed) {
        setError("You've reached your limit. Please upgrade to continue.");
        setLoading(false);
        return;
      }

      const compareItems = showThirdInput
        ? `${item1}, ${item2}, and ${item3}`
        : `${item1} and ${item2}`;

      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
          },
          body: JSON.stringify({
            model: "sonar",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful assistant that provides concise comparisons. Analyze the items being compared and identify the most relevant characteristics specific to their category, but keep each point brief (maximum 40 words per characteristic). Format the response with ## before titles and STRICT SEPARATION between items. Include Species/Family ONLY for living organisms. For non-living things, skip the species/family line entirely. Use bullet points with characteristic names in ** format (like '- **Characteristic Name:** Brief description'). ALWAYS include a clear divider (---) between different items being compared.",
              },
              {
                role: "user",
                content: `Compare ${compareItems}. Provide a concise comparison focusing on characteristics that are most relevant to these specific items. Format your response with:

                        1. EACH item must have its own completely separate section with BOLD before the title
                        2. FIRST item section (## ${item1}), THEN a separator (---), THEN second item section (## ${item2})${
                  showThirdInput
                    ? `, THEN a separator (---), THEN third item section (## ${item3})`
                    : ""
                }
                        3. Species and Family information ONLY if comparing living organisms (skip this line entirely for non-living things)
                        4. A bullet-pointed list of the most important characteristics with format: "- **Characteristic Name:** Brief description"
                        5. Keep each characteristic(5 characteristics) description VERY BRIEF - no more than 40 words per point
                        6. Focus on the most important distinguishing features only
                        7. DO NOT use generic labels like "Point 1:", "Point 2:", or "Key characteristics:" - use specific feature names instead
                        8. DO NOT provide additional content outside of the item sections
                        9. DO NOT create another section for comparing them together - keep all comparisons within each item's section
                        10. Please provide a detailed comparison based on the above instructions, ensuring each section is well-structured, brief, and adheres strictly to the outlined formatting rules.
                        The format must be:
                        ## [First Item]
                        [Species/Family info if applicable for living things]
                        - **[Characteristic]:** [Description]
                        - **[Characteristic]:** [Description]
                        
                        ---
                        
                        ## [Second Item]
                        [Species/Family info if applicable for living things]
                        - **[Characteristic]:** [Description]
                        - **[Characteristic]:** [Description]
                        ${
                          showThirdInput
                            ? `
                        ---
                        
                        ## [Third Item]
                        [Species/Family info if applicable for living things]
                        - **[Characteristic]:** [Description]
                        - **[Characteristic]:** [Description]`
                            : ""
                        }
                        `,
              },
            ],
            max_tokens: 1024,
            temperature: 0.7,
            stream: false,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error?.message || "Failed to get comparison data"
        );
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (data?.choices?.[0]?.message?.content) {
        console.log("Response content:", data.choices[0].message.content);
      } else {
        console.error("Response is missing expected content structure");
      }

      const items = parseApiResponse(data);

      console.log("Parsed items:", items);
      setResults(items);
    } catch (err) {
      setError("Failed to get comparison. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to render a consistent ad unit
  const renderAdUnit = () => {
    if (!shouldShowAds) return null;
    // Card for bottom ad: 728x90
    return (
      <div
        className="mx-auto mb-6 mt-8 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 flex items-center justify-center"
        style={{
          width: 728,
          height: 90,
          minWidth: 728,
          minHeight: 90,
          maxWidth: 728,
          maxHeight: 90,
          padding: 0,
        }}
      >
        <ProfitablerateAdBottom />
      </div>
    );
  };

  // Only setup AdSense once on first mount

  return (
    <div
      className={`w-full max-w-8xl mx-auto pt-0 px-0 sm:px-6 pb-10 sm:pb-8 overflow-hidden ${
        results.length === 0 && !loading ? "overflow-hidden" : ""
      }`}
    >
      {shouldShowAds && (
        <div
          className="hidden lg:block fixed left-4 top-[45vh] 2xl:top-[50vh] z-10"
          style={{ height: "350px" }}
        >
          <div
            className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden"
            style={{ height: "340px" }}
          >
            <h4 className="text-center mb-1 text-gray-500 dark:text-gray-400 text-xs font-bold">
              Advertisement
            </h4>
            <div
              className="flex justify-center overflow-hidden"
              style={{ height: "320px" }}
            >
              <div
                style={{
                  width: "140px",
                  height: "300px",
                  overflow: "hidden",
                  background: "var(--ad-background, #f0f0f0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ProfitablerateAdLeft />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Right side ad - only visible on larger screens, positioned below navbar */}
      {shouldShowAds && (
        <div
          className="hidden lg:block fixed right-4 top-[45vh] 2xl:top-[50vh] z-10"
          style={{ height: "350px" }}
        >
          <div
            className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 overflow-hidden"
            style={{ height: "340px" }}
          >
            <h4 className="text-center mb-1 text-gray-500 dark:text-gray-400 text-xs font-bold">
              Advertisement
            </h4>
            <div
              className="flex justify-center overflow-hidden"
              style={{ height: "320px" }}
            >
              <div
                style={{
                  width: "140px",
                  height: "300px",
                  overflow: "hidden",
                  background: "var(--ad-background, #f0f0f0)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ProfitablerateAdRight />
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={`relative rounded-[16px] sm:rounded-[28px] sm:rounded-[32px] w-full ${
          results.length === 0 && !loading
            ? "p-3 sm:p-6 md:p-8 sm:max-h-none"
            : "p-4 sm:p-8 md:p-12 sm:min-h-[500px]"
        } transition-colors duration-300`}
        style={{
          minHeight:
            results.length === 0 && !loading
              ? showThirdInput
                ? "920px"
                : "850px"
              : "800px",
          maxHeight: results.length === 0 && !loading ? "950px" : "none",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 transform translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-20 transform -translate-x-1/3 translate-y-1/3"></div>

        <div className="relative">
          <div
            className={`flex flex-col md:flex-row items-center ${
              results.length === 0 && !loading
                ? "gap-6 md:gap-6"
                : "gap-8 md:gap-6"
            } mb-10 md:mb-8 flex-wrap bg-transparent shadow-none border-none`}
          >
            <div className="flex-1 w-full md:w-auto group">
              <label
                htmlFor="item1"
                className="block text-base md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 md:mb-2 text-center group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200"
              >
                First item
              </label>
              <div className="relative">
                <input
                  id="item1"
                  type="text"
                  value={item1}
                  onChange={(e) => {
                    setItem1(e.target.value);
                    if (showIntro) setShowIntro(false);
                  }}
                  placeholder="Enter first item"
                  className="w-full px-4 py-4 md:py-3 text-lg md:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7651DB] focus:border-[#7651DB] shadow-sm bg-white dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-[#7651DB] dark:hover:border-[#AB75FF] text-center placeholder:text-center"
                />
                {item1 && (
                  <button
                    onClick={() => setItem1("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 md:h-4 md:w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center my-2 md:my-0">
              <div className="bg-white dark:bg-gray-700 p-5 md:p-4 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 relative">
                <span className="text-xl md:text-lg font-bold text-gray-500 dark:text-gray-300">
                  VS
                </span>
              </div>
            </div>

            <div className="flex-1 w-full md:w-auto group">
              <label
                htmlFor="item2"
                className="block text-base md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 md:mb-2 text-center group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200"
              >
                Second item
              </label>
              <div className="relative">
                <input
                  id="item2"
                  type="text"
                  value={item2}
                  onChange={(e) => {
                    setItem2(e.target.value);
                    if (showIntro) setShowIntro(false);
                  }}
                  placeholder="Enter second item"
                  className="w-full px-4 py-4 md:py-3 text-lg md:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7651DB] focus:border-[#7651DB] shadow-sm bg-white dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-[#7651DB] dark:hover:border-[#AB75FF] text-center placeholder:text-center"
                />
                {item2 && (
                  <button
                    onClick={() => setItem2("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 md:h-4 md:w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {showThirdInput && (
              <>
                <div className="flex items-center justify-center my-2 md:my-0">
                  <div className="bg-white dark:bg-gray-700 p-5 md:p-4 rounded-full shadow-sm border border-gray-200 dark:border-gray-600 relative">
                    <span className="text-xl md:text-lg font-bold text-gray-500 dark:text-gray-300">
                      VS
                    </span>
                  </div>
                </div>

                <div className="flex-1 w-full md:w-auto group">
                  <label
                    htmlFor="item3"
                    className="block text-base md:text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 md:mb-2 text-center group-hover:text-[#7651DB] dark:group-hover:text-[#AB75FF] transition-colors duration-200"
                  >
                    Third item
                  </label>
                  <div className="relative">
                    <input
                      id="item3"
                      type="text"
                      value={item3}
                      onChange={(e) => {
                        setItem3(e.target.value);
                        if (showIntro) setShowIntro(false);
                      }}
                      placeholder="Enter third item"
                      className="w-full px-4 py-4 md:py-3 text-lg md:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7651DB] focus:border-[#7651DB] shadow-sm bg-white dark:bg-gray-700 dark:text-white transition-all duration-200 hover:border-[#7651DB] dark:hover:border-[#AB75FF] text-center placeholder:text-center"
                    />
                    {item3 && (
                      <button
                        onClick={() => setItem3("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 md:h-4 md:w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-center mb-8 md:mb-4 mt-6 md:mt-0 sticky top-20 z-20">
            <button
              onClick={() => setShowThirdInput(!showThirdInput)}
              className="px-5 py-3 md:px-4 md:py-2 text-[#7651DB] border border-[#7651DB] rounded-full text-base md:text-sm font-medium transition duration-200 hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-[#7651DB] focus:ring-opacity-50 mb-4"
            >
              {showThirdInput ? "Remove Third Item" : "Add Third Item"}
            </button>
          </div>

          <div className="flex justify-center mb-10 md:mb-8">
            <button
              onClick={handleCompare}
              disabled={
                Boolean(loading) ||
                !item1 ||
                !item2 ||
                (showThirdInput && !item3) ||
                (Number(freeSearchCount) >= 3 && !isSignedIn) || // freeSearchCount as number
                (Boolean(searchLimitReached) && Boolean(isSignedIn))
              }
              className={`w-full max-w-[300px] md:max-w-[300px] py-4 md:py-4 bg-gradient-to-b from-[#AB75FF] via-[#6B44EC] to-[#7651DB] text-white rounded-full text-lg md:text-lg font-medium transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#7651DB] focus:ring-opacity-50 ${
                loading ||
                !item1 ||
                !item2 ||
                (showThirdInput && !item3) ||
                (freeSearchCount >= 3 && !isSignedIn) ||
                (searchLimitReached && isSignedIn)
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 md:h-4 md:w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Comparing...
                </div>
              ) : freeSearchCount >= 3 && !isSignedIn ? (
                "Sign up to continue"
              ) : searchLimitReached && isSignedIn ? (
                "Upgrade to continue"
              ) : (
                "Compare Now"
              )}
            </button>
          </div>

          {loading && !error && (
            <div className="flex flex-col justify-center items-center my-8 animate-fadeIn">
              <div className="relative w-20 h-20 md:w-16 md:h-16">
                <div className="loader-ring"></div>
                <div className="loader-ring-inner"></div>
              </div>
              <p className="mt-5 md:mt-4 text-gray-600 dark:text-gray-300 text-center max-w-md mx-auto text-lg md:text-base">
                Analyzing the key differences between{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {item1}
                </span>
                ,{" "}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {item2}
                </span>
                {showThirdInput && (
                  <>
                    {" "}
                    and{" "}
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {item3}
                    </span>
                  </>
                )}
                ...
              </p>

              {/* First ad when loading */}
              {renderAdUnit()}
            </div>
          )}

          {results.length === 0 && !loading && renderAdUnit()}
          {/* 
          {!isSignedIn && (
            <div className="mt-4 text-center p-5 md:p-4 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 rounded-xl md:rounded-lg border border-blue-100 dark:border-blue-800/30 mb-6 animate-fadeIn">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 md:h-5 md:w-5 mr-2 text-blue-500 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-lg md:text-base">
                  Please sign in to use the comparison feature
                </span>
              </div>
              <div className="mt-4 md:mt-3">
                <Link
                  href="/sign-in"
                  className="inline-block px-6 py-3 md:px-4 md:py-2 bg-[#7651DB] text-white rounded-md text-lg md:text-base hover:bg-purple-700 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          )} */}

          {freeSearchCount >= 3 && !isSignedIn && (
            <div className="mt-4 text-center p-5 md:p-4 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-xl md:rounded-lg border border-amber-100 dark:border-amber-800/30 mb-6 animate-fadeIn">
              <div className="flex items-center justify-center">
                <span className="text-lg md:text-base">
                  Free search limit reached! Sign up to continue.
                </span>
              </div>
              <div className="mt-4 md:mt-3">
                <Link
                  href="/sign-up"
                  className="inline-block px-6 py-3 md:px-4 md:py-2 bg-[#7651DB] text-white rounded-md text-lg md:text-base hover:bg-purple-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}

          {searchLimitReached && isSignedIn && (
            <div className="mt-4 text-center p-5 md:p-4 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 rounded-xl md:rounded-lg border border-amber-100 dark:border-amber-800/30 mb-6 animate-fadeIn">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 md:h-5 md:w-5 mr-2 text-amber-500 dark:text-amber-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-lg md:text-base">
                  You&apos;ve reached your free search limit.
                </span>
              </div>
              <div className="mt-4 md:mt-3">
                <Link
                  href="/pricing"
                  className="inline-block px-6 py-3 md:px-4 md:py-2 bg-[#7651DB] text-white rounded-md text-lg md:text-base hover:bg-purple-700 transition-colors"
                >
                  Upgrade now
                </Link>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-600 text-center p-5 md:p-4 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl md:rounded-lg border border-red-100 dark:border-red-800/30 mb-6 animate-fadeIn">
              <div className="flex items-center justify-center">
                <span className="text-lg md:text-base">{error}</span>
              </div>

              {/* If limit reached → show Sign Up for guests, Upgrade for signed in */}
              {error.toLowerCase().includes("limit") && (
                <div className="mt-4 md:mt-3">
                  <Link
                    href={isSignedIn ? "/pricing" : "/sign-up"}
                    className="inline-block px-6 py-3 md:px-4 md:py-2 bg-[#7651DB] text-white rounded-md text-lg md:text-base hover:bg-purple-700 transition-colors"
                  >
                    {isSignedIn ? "Upgrade now" : "Sign Up"}
                  </Link>
                </div>
              )}
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-12 animate-fadeIn">
              <div className="mb-6 text-center">
                <h3 className="font-['Inter'] text-[30px] sm:text-[38px] font-[800] text-[#000000] dark:text-white leading-[100%] tracking-[0%] text-center mb-8 sm:mb-8">
                  Comparison Results
                </h3>
              </div>
              <div
                className={`grid grid-cols-1 ${
                  results.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"
                } gap-8 md:gap-4`}
              >
                {results.map((item, index) => (
                  <div
                    key={index}
                    className={`bg-white dark:bg-gray-700 rounded-[24px] md:rounded-[32px] p-7 md:p-6 border border-[#000000] border-opacity-100 dark:border-gray-600 border-[0.5px] relative transition-colors duration-300 w-full md:w-[98%] max-w-full md:max-w-none`}
                    style={{
                      boxShadow: "0px 4px 15px 0px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    <div className="absolute -top-3 -left-3 w-12 h-12 sm:w-8 sm:h-8 flex items-center justify-center bg-[#7651DB] text-white rounded-full shadow-md text-xl sm:text-base">
                      {index + 1}
                    </div>
                    <div className="mb-5 md:mb-4">
                      <h3 className="text-2xl sm:text-xl font-bold text-gray-800 dark:text-white mb-3 md:mb-2">
                        {item.title.replace(/\*\*/g, "")}
                      </h3>
                      <hr className="border-t-2 sm:border-t border-gray-300 dark:border-gray-600 my-4 sm:my-2" />
                      {item.species && item.species.toLowerCase() !== "n/a" && (
                        <p className="text-gray-700 dark:text-gray-300 mb-2 md:mb-1 text-lg md:text-base">
                          <span className="font-medium">Species:</span>{" "}
                          {item.species}
                        </p>
                      )}
                      {item.family && item.family.toLowerCase() !== "n/a" && (
                        <p className="text-gray-700 dark:text-gray-300 text-lg md:text-base">
                          <span className="font-medium">Family:</span>{" "}
                          {item.family}
                        </p>
                      )}
                    </div>

                    <ul className="space-y-4 md:space-y-3">
                      {Object.entries(item.characteristics).map(
                        ([key, value], i) => (
                          <li
                            key={i}
                            className="flex text-gray-700 dark:text-gray-300 group text-lg md:text-base"
                          >
                            <span className="mr-2 text-[#7651DB] dark:text-[#AB75FF] text-xl md:text-lg">
                              •
                            </span>
                            <span>
                              <span className="font-medium">
                                {key.replace(/\*\*/g, "")}:{" "}
                              </span>
                              {value.replace(/\*\*/g, "")}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Third ad after results */}
              {results.length > 0 && renderAdUnit()}

              {/* Add social buttons at the end of results */}
              {results.length > 0 && (
                <SocialIcons className="flex justify-center space-x-4 xl:sticky xl:top-24 xl:z-30" />
              )}
            </div>
          )}

          {/* Add social buttons on the home/input page as well */}
          {results.length === 0 && !loading && (
            <div className="mt-8">
              <SocialIcons className="flex justify-center space-x-4 xl:sticky xl:top-24 xl:z-30" />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .loader-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid rgba(79, 70, 229, 0.1);
          border-radius: 50%;
          border-top: 4px solid rgba(79, 70, 229, 0.8);
          animation: spin 1.5s linear infinite;
        }

        .loader-ring-inner {
          position: absolute;
          width: 70%;
          height: 70%;
          top: 15%;
          left: 15%;
          border: 4px solid transparent;
          border-radius: 50%;
          border-right: 4px solid rgba(99, 102, 241, 0.6);
          animation: spin 1s linear infinite reverse;
        }

        @media (min-width: 768px) {
          .loader-ring,
          .loader-ring-inner {
            border-width: 3px;
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
