"use client";
import { useState, useEffect } from "react";
import comment from "../../assets/images/comment.png";
import background from "../../assets/images/background3.png";
import { useGetTestimonialsQuery } from "../../Api/universityApi";

export default function Testimonial() {
  const { data: stories = [], isLoading } = useGetTestimonialsQuery();
  const [currentSlide, setCurrentSlide] = useState(0);

  const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("https") || path.startsWith("blob:")) return path;
    return `https://api.clasia.io${path}`;
  };

  // Auto-play carousel
  useEffect(() => {
    if (stories.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stories.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [stories.length]);

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % stories.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (isLoading)
    return (
      <div className="py-20 text-center text-gray-500">
        Cargando historias de éxito...
      </div>
    );
  if (stories.length === 0) return null;

  const story = stories[currentSlide];

  return (
    <section
      className="w-full pt-6 pb-2 md:pt-10 md:pb-0 lg:py-10 bg-contain bg-center relative -top-6 z-40 rounded-t-3xl bg-[#F3F4F6]"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-1 md:mb-3">
            Historias de Éxito de Estudiantes
          </h2>
          <p className="text-gray-600 text-lg">
            Escucha a los estudiantes que encontraron su camino hacia el éxito académico a través de
            EduConnect
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 xl:px-16 md:mb-8 relative min-h-[300px] flex items-center">
          <div className="flex flex-col w-full">
            {/* Quote Section */}
            <div className="absolute left-2 top-2 sm:top-4">
              <img className="h-8 sm:h-auto opacity-20" src={comment} alt="" />
            </div>
            <div className="relative z-10 px-4">
              <p className="text-gray-700 sm:text-lg leading-relaxed mb-6 italic">
                " {story.content} "
              </p>
            </div>

            {/* Student Info */}
            <div className="flex flex-col gap-4 md:gap-0 md:flex-row md:items-end md:justify-between px-4">
              <div className="flex items-center gap-6 justify-start">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm flex-shrink-0">
                  <img
                    src={getFullUrl(story.profile_picture)}
                    alt={story.student_name}
                    className="w-full h-full object-cover text-[10px]"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {story.student_name}
                  </h3>
                  <p className="text-gray-600 text-sm">{story.student_title}</p>
                </div>
              </div>
              {/* Navigation Controls */}
              {stories.length > 1 && (
                <div className="flex items-center justify-between">
                  {/* Arrow Buttons */}
                  <div className="flex gap-3 ml-4">
                    <button
                      onClick={goToPrevious}
                      className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center hover:border-blue hover:text-blue transition-colors bg-base"
                      aria-label="Historia anterior"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={goToNext}
                      className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center hover:border-blue hover:text-blue transition-colors bg-base"
                      aria-label="Siguiente historia"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Dot Indicators */}
        {stories.length > 1 && (
          <div className="flex gap-2 justify-center flex-1">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-blue w-8" : "bg-gray-300"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
