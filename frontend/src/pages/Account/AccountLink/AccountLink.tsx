import React, { FC, ReactElement } from "react";
import { NavLink } from "react-router-dom";

import "./AccountLink.css";

type PropsType = {
    link: string;
    title: string;
};

const AccountLink: FC<PropsType> = ({ link, title }): ReactElement => {
    return (
        <NavLink
            to={link}
            className="account-sidebar-link"
            activeClassName="is-active"
        >
            {title}
        </NavLink>
    );
};

export default AccountLink;
