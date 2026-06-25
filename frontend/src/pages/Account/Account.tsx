import React, { FC, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import { selectUserFromUserState } from "../../redux-toolkit/user/user-selector";
import { resetAuthState } from "../../redux-toolkit/auth/auth-slice";
import { fetchUserInfo } from "../../redux-toolkit/user/user-thunks";
import { UserRoles } from "../../types/types";
import ContentTitle from "../../components/ContentTitle/ContentTitle";
import {
    ACCOUNT,
    ACCOUNT_ADMIN_ADD,
    ACCOUNT_ADMIN_ORDERS,
    ACCOUNT_ADMIN_PERFUMES,
    ACCOUNT_ADMIN_USERS,
    ACCOUNT_USER_EDIT,
    ACCOUNT_USER_INFO,
    ACCOUNT_USER_ORDERS
} from "../../constants/routeConstants";
import AccountLink from "./AccountLink/AccountLink";
import AccountItem from "./AccountItem/AccountItem";
import PersonalData from "./PersonalData/PersonalData";
import AddPerfume from "./AddPerfume/AddPerfume";
import PerfumeList from "./PerfumeList/PerfumeList";
import EditPerfume from "./EditPerfume/EditPerfume";
import OrdersList from "./OrdersList/OrdersList";
import ManageUserOrder from "./ManageUserOrder/ManageUserOrder";
import UsersList from "./UsersList/UsersList";
import ManageUser from "./ManageUser/ManageUser";
import ChangePassword from "./ChangePassword/ChangePassword";
import PersonalOrdersList from "./PersonalOrdersList/PersonalOrdersList";
import "./Account.css";

const Account: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const usersData = useSelector(selectUserFromUserState);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        dispatch(resetAuthState());
        dispatch(fetchUserInfo());
    }, []);

    useEffect(() => {
        if (usersData) {
            setIsAdmin(usersData.roles![0] === UserRoles.ADMIN);
        }
    }, [usersData]);

    return (
        <div className="account-dashboard-container">
            <div className="account-layout">
                <aside className="account-sidebar">
                    <ContentTitle title={t('account.my_account')} titleLevel={4} icon={<UserOutlined />} />
                    <AccountLink link={ACCOUNT_USER_INFO} title={t('account.personal_data')} />
                    {isAdmin ? (
                        <>
                            <AccountLink link={ACCOUNT_ADMIN_ADD} title={t('account.admin.add_perfume')} />
                            <AccountLink link={ACCOUNT_ADMIN_PERFUMES} title={t('account.admin.perfumes_list')} />
                            <AccountLink link={ACCOUNT_ADMIN_ORDERS} title={t('account.admin.orders_list')} />
                            <AccountLink link={ACCOUNT_ADMIN_USERS} title={t('account.admin.users_list')} />
                        </>
                    ) : (
                        <>
                            <AccountLink link={ACCOUNT_USER_EDIT} title={t('account.change_password')} />
                            <AccountLink link={ACCOUNT_USER_ORDERS} title={t('account.orders')} />
                        </>
                    )}
                </aside>
                <section className="account-content">
                    <Route exact path={ACCOUNT} component={AccountItem} />
                    <Route path={ACCOUNT_USER_INFO} component={PersonalData} />
                    <Route path={ACCOUNT_USER_EDIT} component={ChangePassword} />
                    <Route exact path={ACCOUNT_USER_ORDERS} component={PersonalOrdersList} />
                    <Route exact path={`${ACCOUNT_USER_ORDERS}/:id`} component={ManageUserOrder} />
                    {isAdmin ? (
                        <>
                            <Route path={ACCOUNT_ADMIN_ADD} component={AddPerfume} />
                            <Route exact path={ACCOUNT_ADMIN_PERFUMES} component={PerfumeList} />
                            <Route exact path={`${ACCOUNT_ADMIN_PERFUMES}/:id`} component={EditPerfume} />
                            <Route exact path={ACCOUNT_ADMIN_ORDERS} component={OrdersList} />
                            <Route exact path={ACCOUNT_ADMIN_USERS} component={UsersList} />
                            <Route exact path={`${ACCOUNT_ADMIN_USERS}/:id`} component={ManageUser} />
                        </>
                    ) : (
                        <>
                            <Route path={ACCOUNT_ADMIN_ADD} render={() => <Redirect to={ACCOUNT} />} />
                            <Route path={ACCOUNT_ADMIN_PERFUMES} render={() => <Redirect to={ACCOUNT} />} />
                            <Route path={ACCOUNT_ADMIN_ORDERS} render={() => <Redirect to={ACCOUNT} />} />
                            <Route path={ACCOUNT_ADMIN_USERS} render={() => <Redirect to={ACCOUNT} />} />
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default Account;
