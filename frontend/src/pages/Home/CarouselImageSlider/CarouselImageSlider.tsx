import React, { FC, ReactElement } from "react";
import { Carousel } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { MENU, PRODUCT } from "../../../constants/routeConstants";
import "./CarouselImageSlider.css";

export const sliderItems = [
    {
        id: "46",
        eyebrow: "Timeless elegance",
        title: "Luxury fragrance",
        description: "Discover timeless scents crafted with calm materials, warm woods and modern restraint.",
        name: "Dior fragrance bottle on a beige editorial set",
        url: "https://i.ibb.co/C0vbNcy/dior-ENG.jpg",
        note: "Amber, iris, cedar"
    },
    {
        id: "85",
        eyebrow: "Evening ritual",
        title: "Scents that speak quietly",
        description: "A considered edit of warm signatures, bright citrus and smoked vanilla for daily wear.",
        name: "Paco Rabanne perfume bottle in warm studio light",
        url: "https://i.ibb.co/dkpHPXQ/1million-ENG.jpg",
        note: "Citrus, tonka, leather"
    },
    {
        id: "34",
        eyebrow: "Maison selection",
        title: "A restrained fragrance wardrobe",
        description: "Choose focused compositions from established houses, selected for balance and longevity.",
        name: "Minimal perfume bottle with soft stone background",
        url: "https://picsum.photos/seed/santal-noir-bottle/920/1100",
        note: "Sandalwood, musk, cardamom"
    },
    {
        id: "76",
        eyebrow: "Soft projection",
        title: "Polished notes for every day",
        description: "Clean florals and low-lit woods arranged for offices, dinners and slow weekends.",
        name: "Warm-toned fragrance still life with botanical stem",
        url: "https://picsum.photos/seed/rose-blanche-fragrance/920/1100",
        note: "Rose, pear, cashmere"
    },
    {
        id: "106",
        eyebrow: "Quiet opulence",
        title: "Bottle, formula, memory",
        description: "Perfumes chosen for material quality, precise drydown and understated presentation.",
        name: "Amber perfume bottle photographed in soft beige light",
        url: "https://picsum.photos/seed/amber-vanilla-perfume/920/1100",
        note: "Vanilla, resin, suede"
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
                            <span className="hero-eyebrow">{item.eyebrow}</span>
                            <h1>{item.title}</h1>
                            <p>{item.description}</p>
                            <div className="hero-actions">
                                <Link to={`${PRODUCT}/${item.id}`} className="hero-button hero-button-primary">
                                    {t('home.shop_now')}
                                </Link>
                                <Link to={{ pathname: MENU, state: { id: "all" } }} className="hero-button hero-button-secondary">
                                    {t('home.discover_more', 'Discover More')}
                                </Link>
                            </div>
                        </div>
                        <div className="hero-visual" aria-label={item.name}>
                            <img src={item.url} alt={item.name} />
                            <div className="hero-note">
                                <span>{t('home.olfactive_notes', 'Olfactive notes')}</span>
                                <strong>{item.note}</strong>
                            </div>
                        </div>
                    </section>
                </div>
            ))}
        </Carousel>
    );
};

export default CarouselImageSlider;
