import React, { FC, ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Affix, Badge, Col, Row, Select } from "antd";
import { ShoppingOutlined, GlobalOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import { selectUserFromUserState } from "../../redux-toolkit/user/user-selector";
import { selectCartItemsCount } from "../../redux-toolkit/cart/cart-selector";
import { logoutSuccess } from "../../redux-toolkit/user/user-slice";
import { ACCOUNT, BASE, CONTACTS, LOGIN, MENU, REGISTRATION } from "../../constants/routeConstants";
import { CART } from "../../constants/urlConstants";
import "./NavBar.scss";

const { Option } = Select;

const NavBar: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t, i18n } = useTranslation();
    const usersData = useSelector(selectUserFromUserState);
    const cartItemsCount = useSelector(selectCartItemsCount);

    const handleLogout = (): void => {
        localStorage.removeItem("token");
        dispatch(logoutSuccess());
    };

    const changeLanguage = (value: string) => {
        i18n.changeLanguage(value);
    };

    return (
        <>
            <div className="navbar-announcement">
                {t('nav.announcement')}
            </div>
            <Affix>
                <nav className={"navbar-wrapper"} aria-label="Main navigation">
                    <Row className="navbar-inner" align="middle">
                        <Col xs={24} md={5}>
                            <Link to={BASE} className="navbar-brand">
                                Essence
                            </Link>
                        </Col>
                        <Col xs={24} md={8}>
                            <ul className="navbar-links">
                                <Link to={BASE}>
                                    <li>{t('nav.home')}</li>
                                </Link>
                                <li>
                                    <Link to={{ pathname: MENU, state: { id: "all" } }}>{t('nav.perfumes')}</Link>
                                </li>
                                <Link to={CONTACTS}>
                                    <li>{t('nav.contacts')}</li>
                                </Link>
                            </ul>
                        </Col>
                        <Col xs={24} md={11}>
                            <ul className="navbar-actions">
                                <li className="navbar-lang">
                                    <Select 
                                        defaultValue={i18n.language} 
                                        style={{ width: 80 }} 
                                        onChange={changeLanguage}
                                        bordered={false}
                                        suffixIcon={<GlobalOutlined />}
                                    >
                                        <Option value="vi">VI</Option>
                                        <Option value="en">EN</Option>
                                    </Select>
                                </li>
                                <li className={"navbar-cart"}>
                                    <Badge count={cartItemsCount} size="small" color={"#6B4F4F"}>
                                        <Link to={CART} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <ShoppingOutlined style={{ fontSize: "18px" }} />
                                            {t('nav.bag')}
                                        </Link>
                                    </Badge>
                                </li>
                                {usersData ? (
                                    <>
                                        <Link to={ACCOUNT}>
                                            <li>
                                                {t('nav.my_account')}
                                            </li>
                                        </Link>
                                        <Link id={"handleLogout"} to={BASE} onClick={handleLogout}>
                                            <li>
                                                {t('nav.exit')}
                                            </li>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to={LOGIN}>
                                            <li>{t('nav.sign_in')}</li>
                                        </Link>
                                        <Link to={REGISTRATION}>
                                            <li>{t('nav.sign_up')}</li>
                                        </Link>
                                    </>
                                )}
                            </ul>
                        </Col>
                    </Row>
                </nav>
            </Affix>
        </>
    );
};

export default NavBar;
