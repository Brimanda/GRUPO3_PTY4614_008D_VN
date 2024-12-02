import React, { useState } from "react";
import { HeaderComponent } from "./header";
import { FooterComponent } from "./footer";
import Hero from "./hero";
import WorksComponent from "./works";
import Beneficios from "./beneficios";
import PropertyTypes from "./descubre";
import { HeroSectionComponent } from "./hero-section";
import OpinionesCard from "@/components/opiniones";


const images = [
  "/canchababy.jpg?height=1600&width=1200",
  "/canchabasket.jpg?height=1600&width=1200",
]

const Home = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [currentIndex, setCurrentIndex] = React.useState(0)

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  return (
    <div>
      <HeaderComponent />
      <Hero />
      <br />
      <br />
      <br />
      <PropertyTypes />
      <OpinionesCard/>
      <br />
      <br />
      <HeroSectionComponent />
      <WorksComponent />
      <Beneficios />

      <FooterComponent />

    </div>
  );
};

export default Home;
