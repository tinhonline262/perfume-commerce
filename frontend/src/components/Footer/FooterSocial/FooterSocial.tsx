import React, { FC, ReactElement } from "react";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";

import { socialLinks } from "../../../config/socialLinks";
import "./FooterSocial.scss";

export const FooterSocial: FC = (): ReactElement => {
    const { t } = useTranslation();

    const getIcon = (id: string) => {
        switch (id) {
            case 'facebook': return <FaFacebook size={24} />;
            case 'instagram': return <FaInstagram size={24} />;
            case 'tiktok': return <FaTiktok size={24} />;
            case 'youtube': return <FaYoutube size={24} />;
            default: return null;
        }
    };

    return (
        <div className="footer-wrapper-social">
            <Typography.Title level={4}>{t('footer.followUs')}</Typography.Title>
            <div className="social-icons">
                {socialLinks.map((link) => (
                    <a
                        key={link.id}
                        href={link.url}
                        rel="noreferrer"
                        target="_blank"
                        aria-label={link.ariaLabel}
                        className="social-icon-link"
                    >
                        {getIcon(link.id)}
                    </a>
                ))}
            </div>
        </div>
    );
};
