import service1 from "../../assets/icons/service1.png";
import service2 from "../../assets/icons/service2.png";
import service3 from "../../assets/icons/service3.png";
import service4 from "../../assets/icons/service4.png";
export default function OurServices() {
  return (
    <section
      className="w-full py-6 md:py-10 lg:py-16"
    >
      {/* Background image can be added via CSS or inline style */}
      <div className="w-11/12 mx-auto px-0 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 lg:mb-4">
            Our Services
          </h2>
          <p className="text-lg text-[#374151] max-w-2xl mx-auto">
            Comprehensive support for your educational journey
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Service 1: Program Matching */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8">
            <div className="mb-4 md:mb-6 inline-flex">
              <img src={service1} alt="" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 md:mb-3">
              Program Matching
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Find the perfect academic program that aligns with your career
              goals and interests.
            </p>
          </div>

          {/* Service 2: Scholarship Finder */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8">
            <div className="mb-4 md:mb-6 inline-flex">
              <img src={service2} alt="" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 md:mb-3">
              Scholarship Finder
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Discover scholarships and financial aid opportunities tailored to
              your profile.
            </p>
          </div>

          {/* Service 3: Events & Webinars */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8">
            <div className="mb-4 md:mb-6 inline-flex">
              <img src={service3} alt="" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 md:mb-1 md:mb-3">
              Events & Webinars
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Attend virtual and in-person events to connect with university
              representatives.
            </p>
          </div>

          {/* Service 4: Career Resources */}
          <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 md:p-8">
            <div className="mb-4 md:mb-6 inline-flex">
              <img src={service4} alt="" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1 md:mb-3">
              Career Resources
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Access internships, job opportunities, and career development
              resources.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
