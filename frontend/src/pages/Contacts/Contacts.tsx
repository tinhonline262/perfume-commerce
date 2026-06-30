import React, {FC, ReactElement, useEffect} from "react";
import { Col, Row, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import ContentWrapper from "../../components/ContentWrapper/ContentWrapper";
import ContentTitle from "../../components/ContentTitle/ContentTitle";

const Contacts: FC = (): ReactElement => {
    const { t } = useTranslation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    
    return (
        <ContentWrapper narrow>
            <ContentTitle icon={<InfoCircleOutlined />} title={t('contacts.title')} />
            <Row gutter={32}>
                <Col xs={24} md={12}>
                    <div>
                        <Typography.Text strong>{t('contacts.phone') + ": "}</Typography.Text>
                        <Typography.Text>(066) 696-66-23</Typography.Text>
                    </div>
                    <div>
                        <Typography.Text strong>{t('contacts.email') + ": "}</Typography.Text>
                        <Typography.Text>support@perfume.local</Typography.Text>
                    </div>
                    <div>
                        <Typography.Text strong>{t('order.address')}</Typography.Text>
                        <Typography.Text>3/2, Ninh Kiều, Cần Thơ</Typography.Text>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <Typography.Text strong>{t('contacts.working_time')}</Typography.Text>
                    </div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        <Typography.Text>
                            {t('contacts.time')}
                        </Typography.Text>
                    </div>
                    <div style={{ marginTop: 16 }}>
                        <Typography.Text strong>{t('contacts.delivery')}</Typography.Text>
                    </div>
                    <div>
                        <Typography.Text>{t('contacts.delivery_desc')}</Typography.Text>
                    </div>
                </Col>
            </Row>
        </ContentWrapper>
    );
};

export default Contacts;
