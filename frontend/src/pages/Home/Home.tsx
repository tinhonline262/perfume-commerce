import React, { FC, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";

import CarouselImageSlider from "./CarouselImageSlider/CarouselImageSlider";
import SliderBrands from "./SliderBrands/SliderBrands";
import HomePageTheme from "./HomePageTheme/HomePageTheme";
import PerfumeCardsSlider from "./PerfumeCardsSlider/PerfumeCardsSlider";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

const Home: FC = (): ReactElement => {
    useRevealOnScroll("home");
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="home-page">
            <CarouselImageSlider />
            <SliderBrands />
            <HomePageTheme />
            <PerfumeCardsSlider />
        </main>
    );
};

export default Home;
