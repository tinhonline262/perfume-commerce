import React, { FC, ReactElement } from "react";
import { Button } from "antd";
import { useTranslation } from "react-i18next";

import {BASE_URL} from "../../../constants/urlConstants";
import "./SocialButton.css";

type PropsType = {
    socialNetwork: string;
    image: string;
};

const SocialButton: FC<PropsType> = ({ socialNetwork, image }): ReactElement => {
    const { t } = useTranslation();
    return (
        <a href={`${BASE_URL}/oauth2/authorize/${socialNetwork}`}>
            <Button className={`social-btn ${socialNetwork}`} size="large" block>
                <img src={image} alt={socialNetwork} />
                {`${t('auth.login_with', 'Log in with')} ${socialNetwork.charAt(0).toUpperCase() + socialNetwork.slice(1)}`}
            </Button>
        </a>
    );
};

export default SocialButton;
