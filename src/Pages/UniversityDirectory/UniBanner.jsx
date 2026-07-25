import { useState } from "react";
import { MapPin, ChevronLeft, Star, ShieldCheck, TrendingUp, Landmark, University } from "lucide-react";
import defaultLogo from "../../assets/icons/harvard.png";
import { Link, useNavigate } from "react-router-dom";
import { useGetOrCreateRoomMutation } from "../../Api/chatApi";
import { LiaUniversitySolid } from "react-icons/lia";

export default function UniBannerWrapper({ data, setShowApply }) {
  return (
    <>
      <UniBannerInner setShowApply={setShowApply} data={data} />
    </>
  );
}

// Split the component so we can use stateful wrapper while preserving original structure
function UniBannerInner({ setShowApply, data }) {
  const navigate = useNavigate();
  const [getOrCreateRoom, { isLoading }] = useGetOrCreateRoomMutation();

  const handleMessageClick = async () => {
    try {
      if (data?.id) {
        await getOrCreateRoom(data.id).unwrap();
        navigate("/message");
      }
    } catch (error) {
      console.error("Failed to create or get chat room:", error);
      // Even if it fails, maybe navigate anyway or show a toast
      navigate("/message");
    }
  };

  const location = data?.locations?.[0];
  const locationString = location
    ? `${location.location_name}, ${location.address}`
    : "Location not available";
  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  return (
    <div className="relative overflow-hidden md:h-[50vh] h-[45vh]">
      {/* Background Container (video unchanged) */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={getFullUrl(data?.banner_video)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Dark gradient overlays for readability, matching the reference */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
      </div>

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm flex items-center justify-center text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>

      {/* Content, overlaid on the video like the reference image */}
      <div className="absolute bottom-10 left-0 right-0 z-10 p-5 md:p-8">
        <div className="w-11/12 mx-auto flex flex-col md:flex-row md:items-end gap-4 md:gap-5">
          <div className="flex items-start gap-4 md:gap-5 flex-1 min-w-0">
          {/* Logo */}
          <div className="w-16 h-16 md:w-24 md:h-24 lg:h-32 lg:w-32 bg-white rounded-xl flex-shrink-0">
            <img
              src={getFullUrl(data?.logo) || defaultLogo}
              className="h-full w-full object-cover rounded-xl"
              alt={data?.univ_name}
            />
          </div>

          {/* Text content */}
          <div className="text-white min-w-0 max-w-3xl">
            {data?.is_top_university && (
              <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/30 text-white text-xs font-medium px-3 py-1 rounded-full mb-2 backdrop-blur-sm">
                <Star size={12} className="fill-current text-yellow-400" />
                Top University
              </span>
            )}

            <h1 className="text-xl md:text-2xl lg:text-4xl font-bold mb-1 leading-tight text-balance">
              {data?.univ_name || "University Name"}
            </h1>

            {data?.tagline && (
              <p className="text-sm md:text-[16px] text-yellow-300/80 font-medium my-2">
                {data.tagline}
              </p>
            )}

            <p className="flex items-center gap-1.5 text-xs md:text-base text-white/90 break-words mb-3">
              <MapPin size={16} className="text-yellow-300/80 flex-shrink-0" />
              {locationString}
            </p>

            {Array.isArray(data?.highlights) && data.highlights.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.highlights.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs px-3 py-1.5 rounded-md backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            )}
            <span
              className="flex items-center w-fit gap-1.5 bg-white/10 text-white text-xs px-3 py-1.5 rounded-md backdrop-blur-sm"
            >
              <LiaUniversitySolid className="text-2xl text-purple-400" />
              {data?.univ_type} university
            </span>
          </div>
        </div>

        {/* Apply Now / Message buttons */}
        <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={() => setShowApply(true)}
              className="px-4 py-1.5 md:py-2 text-sm md:text-base border border-white/70 text-white rounded-md hover:bg-white/10 transition-colors backdrop-blur-sm whitespace-nowrap"
            >
              Apply Now
            </button>
            <button
              onClick={handleMessageClick}
              disabled={isLoading}
              className={`px-4 py-1.5 md:py-2 text-sm md:text-base border border-white/70 text-white rounded-md hover:bg-white/10 transition-colors backdrop-blur-sm whitespace-nowrap ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Connecting..." : "Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}