import React from "react";
import britishCouncil from "../../assets/images/BritishCouncil.png";
import ielts from "../../assets/images/ielts.png";
import toefl from "../../assets/images/toefl.jpg";
import ets from "../../assets/images/ets.png";

const logos = [
  <img src={britishCouncil} alt="British Council" className="h-6 md:h-7 w-auto object-contain mix-blend-multiply" key="1" />,
  <img src={ielts} alt="IELTS" className="h-10 md:h-14 w-auto object-contain mix-blend-multiply" key="2" />,
  <img src={toefl} alt="TOEFL" className="h-10 md:h-12 w-auto object-contain mix-blend-multiply" key="3" />,
  <img src={ets} alt="ETS" className="h-10 md:h-14 w-auto object-contain mix-blend-multiply" key="4" />
];

export default function TrustedPartners() {
  return (
    <div className="w-full bg-[#F3F4F6] py-6 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="bg-[#F8FAFC] rounded-2xl shadow-sm border border-gray-100 py-4 px-6 flex flex-col md:flex-row items-center gap-6 overflow-hidden">
          
          <div className="text-[#64748B] font-semibold text-sm whitespace-nowrap shrink-0 z-10 bg-[#F8FAFC] pr-4">
            Trusted by students and institutions worldwide
          </div>

          <div className="flex-1 overflow-hidden flex relative mask-image-fade">
            <div className="flex items-center animate-marquee flex-nowrap w-max">
              {/* First block */}
              <div className="flex items-center flex-shrink-0 gap-12 pr-12">
                {[...logos, ...logos, ...logos].map((logo, index) => (
                  <div key={`logo-1-${index}`} className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer inline-block">
                    {logo}
                  </div>
                ))}
              </div>
              {/* Identical Second block for seamless loop */}
              <div className="flex items-center flex-shrink-0 gap-12 pr-12">
                {[...logos, ...logos, ...logos].map((logo, index) => (
                  <div key={`logo-2-${index}`} className="flex-shrink-0 opacity-80 hover:opacity-100 transition-opacity cursor-pointer inline-block">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
