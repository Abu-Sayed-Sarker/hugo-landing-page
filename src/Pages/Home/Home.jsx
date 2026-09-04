import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Hero from "../../components/Hero/Hero";
import TrustedPartners from "../../components/TrustedPartners/TrustedPartners";
import FeaturedUniversities from "../../components/FeaturedUniversities/FeaturedUniversities";
import OurServices from "../../components/OurServices/OurServices";
import Newsletter from "../../components/Newsletter/Newsletter";
import Testimonial from "../../components/Testimonial/Testimonial";
import Footer from "../../components/Footer/Footer";

export default function Home() {
  return (
    <main className="bg-[#F3F4F6]">
      <Hero />
      <FeaturedUniversities />
      <OurServices />
      <TrustedPartners />
      <Newsletter />
      <Testimonial />
      <Footer />
    </main>
  );
}
