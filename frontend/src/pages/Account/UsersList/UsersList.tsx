import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TeamOutlined } from "@ant-design/icons";
import { Table } from "antd";
import { useTranslation } from "react-i18next";

import {
    selectAdminStateUsers,
    selectIsAdminStateLoading,
    selectTotalElements
} from "../../../redux-toolkit/admin/admin-selector";
import { fetchAllUsers } from "../../../redux-toolkit/admin/admin-thunks";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import { BaseUserResponse, LoadingStatus } from "../../../types/types";
import { ACCOUNT_ADMIN_USERS } from "../../../constants/routeConstants";
import { resetAdminState } from "../../../redux-toolkit/admin/admin-slice";
import { useTablePagination } from "../../../hooks/useTablePagination";

const UsersList: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const users = useSelector(selectAdminStateUsers);
    const isLoading = useSelector(selectIsAdminStateLoading);
    const totalElements = useSelector(selectTotalElements);
    const handleTableChange = useTablePagination<BaseUserResponse, number>(fetchAllUsers);

    useEffect(() => {
        dispatch(fetchAllUsers(0));

        return () => {
            dispatch(resetAdminState(LoadingStatus.LOADING));
        };
    }, []);

    return (
        <div className="account-section-card">
            <ContentTitle title={t('account.admin.users_list')} titleLevel={4} icon={<TeamOutlined />} />
            <div style={{ marginTop: 32 }}>
                <Table
                    rowKey={"id"}
                onChange={handleTableChange}
                loading={isLoading}
                pagination={{
                    total: totalElements,
                    position: ["bottomRight", "topRight"]
                }}
                dataSource={users}
                columns={[
                    {
                        title: "Id",
                        dataIndex: "id",
                        key: "id"
                    },
                    {
                        title: t('auth.first_name'),
                        dataIndex: "firstName",
                        key: "firstName",
                        ellipsis: true
                    },
                    {
                        title: t('auth.email', "E-mail"),
                        dataIndex: "email",
                        key: "email",
                        ellipsis: true
                    },
                    {
                        title: t('account.admin.role', 'Role'),
                        dataIndex: "roles",
                        key: "roles",
                        render: (_, user: BaseUserResponse) => user.roles[0]
                    },
                    {
                        title: t('account.admin.provider', 'Provider'),
                        dataIndex: "provider",
                        key: "provider"
                    },
                    {
                        title: t('account.actions'),
                        dataIndex: "amount",
                        key: "amount",
                        render: (_, user: BaseUserResponse) => (
                            <Link 
                                to={`${ACCOUNT_ADMIN_USERS}/${user.id}`}
                                style={{ 
                                    color: "var(--color-primary)", 
                                    fontWeight: 700, 
                                    fontSize: 12, 
                                    textTransform: "uppercase", 
                                    letterSpacing: "0.06em" 
                                }}
                            >
                                {t('account.details')}
                            </Link>
                        )
                    }
                ]}
            />
            </div>
        </div>
    );
};

export default UsersList;
