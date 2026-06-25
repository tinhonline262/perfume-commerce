import React, { FC, ReactElement } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";

import { MENU } from "../../../constants/routeConstants";
import "./HomePageTheme.css";

const collectionThemes = [
    {
        id: "female",
        titleKey: "home.themes.female.title",
        textKey: "home.themes.female.text",
        image: "https://i.ibb.co/jMmJs60/Them-Woman-ENG.jpg",
        alt: "Soft floral fragrance collection arranged in warm light"
    },
    {
        id: "male",
        titleKey: "home.themes.male.title",
        textKey: "home.themes.male.text",
        image: "https://i.ibb.co/mJGKz8c/Them-Man-ENG.jpg",
        alt: "Warm woody fragrance collection on a beige editorial surface"
    }
];

const HomePageTheme: FC = (): ReactElement => {
    const { t } = useTranslation();
    return (
        <section className={"page-theme reveal-on-scroll"}>
            <div className="page-theme-heading">
                <span>{t('home.discovery', 'Discovery')}</span>
                <h2>{t('home.build_wardrobe', 'Build a compact fragrance wardrobe.')}</h2>
            </div>
            <Row gutter={[48, 48]} justify="center">
                {collectionThemes.map((theme) => (
                    <Col xs={24} lg={24} key={theme.id} style={{ display: 'flex', justifyContent: 'center' }}>
                        <Link className="page-theme-card" to={{ pathname: MENU, state: { id: theme.id } }}>
                            <div className="page-theme-image-wrapper">
                                <img src={theme.image} alt={theme.alt} />
                            </div>
                            <div className="page-theme-card-copy">
                                <span>{t('home.collection', 'Collection')}</span>
                                <h3>{t(theme.titleKey)}</h3>
                                <p>{t(theme.textKey)}</p>
                            </div>
                        </Link>
                    </Col>
                ))}
            </Row>
        </section>
    );
};

export default HomePageTheme;
