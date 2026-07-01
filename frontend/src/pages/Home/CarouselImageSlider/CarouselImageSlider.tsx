import React, { FC, ReactElement } from "react";
import { Carousel } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MENU, PRODUCT } from "../../../constants/routeConstants";
import "./CarouselImageSlider.css";

export const sliderItems = [
    {
        id: "46",
        eyebrowKey: "home.hero.slider1.eyebrow",
        titleKey: "home.hero.slider1.title",
        descriptionKey: "home.hero.slider1.description",
        name: "Dior fragrance bottle on a beige editorial set",
        url: "https://i.ibb.co/C0vbNcy/dior-ENG.jpg",
        noteKey: "home.hero.slider1.note"
    },
    {
        id: "85",
        eyebrowKey: "home.hero.slider2.eyebrow",
        titleKey: "home.hero.slider2.title",
        descriptionKey: "home.hero.slider2.description",
        name: "Paco Rabanne perfume bottle in warm studio light",
        url: "https://i.ibb.co/dkpHPXQ/1million-ENG.jpg",
        noteKey: "home.hero.slider2.note"
    },
    {
        id: "34",
        eyebrowKey: "home.hero.slider3.eyebrow",
        titleKey: "home.hero.slider3.title",
        descriptionKey: "home.hero.slider3.description",
        name: "Minimal perfume bottle with soft stone background",
        url: "https://picsum.photos/seed/santal-noir-bottle/920/1100",
        noteKey: "home.hero.slider3.note"
    },
    {
        id: "76",
        eyebrowKey: "home.hero.slider4.eyebrow",
        titleKey: "home.hero.slider4.title",
        descriptionKey: "home.hero.slider4.description",
        name: "Warm-toned fragrance still life with botanical stem",
        url: "https://picsum.photos/seed/rose-blanche-fragrance/920/1100",
        noteKey: "home.hero.slider4.note"
    },
    {
        id: "106",
        eyebrowKey: "home.hero.slider5.eyebrow",
        titleKey: "home.hero.slider5.title",
        descriptionKey: "home.hero.slider5.description",
        name: "Amber perfume bottle photographed in soft beige light",
        url: "https://picsum.photos/seed/amber-vanilla-perfume/920/1100",
        noteKey: "home.hero.slider5.note"
    }
];

const CarouselImageSlider: FC = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <Carousel className="hero-carousel" autoplay>
            {sliderItems.map((item, index) => (
                <div key={item.id}>
                    <section className="carousel-item-wrapper reveal-on-scroll" style={{ "--index": index } as React.CSSProperties}>
                        <div className="hero-copy">
                            <span className="hero-eyebrow">{t(item.eyebrowKey)}</span>
                            <h1>{t(item.titleKey)}</h1>
                            <p>{t(item.descriptionKey)}</p>
                            <div className="hero-actions">
                                <Link to={`${PRODUCT}/${item.id}`} className="hero-button hero-button-primary">
                                    {t('home.hero.primaryButton')}
                                </Link>
                                <Link to={{ pathname: MENU, state: { id: "all" } }} className="hero-button hero-button-secondary">
                                    {t('home.hero.secondaryButton')}
                                </Link>
                            </div>
                        </div>
                        <div className="hero-visual" aria-label={item.name}>
                            <img src={item.url} alt={item.name} />
                            <div className="hero-note">
                                <span>{t('home.hero.cardFooterLabel')}</span>
                                <strong>{t(item.noteKey)}</strong>
                            </div>
                        </div>
                    </section>
                </div>
            ))}
        </Carousel>
    );
};

export default CarouselImageSlider;
