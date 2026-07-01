import React, { FC, ReactElement, useEffect, useState } from "react";
import { Card, Col, Row, Typography, Statistic, Form, Input, Button, message, Badge } from "antd";
import { AreaChartOutlined, MailOutlined, WarningOutlined, ShoppingCartOutlined, UserOutlined, AppstoreOutlined } from "@ant-design/icons";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import RequestService from "../../../utils/request-service";
import { ADMIN_STATISTICS, ADMIN_EMAIL_PROMO } from "../../../constants/urlConstants";

const AdminDashboard: FC = (): ReactElement => {
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await RequestService.get(ADMIN_STATISTICS, true);
                setStats(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStats();
    }, []);

    const onSendPromo = async (values: any) => {
        setLoading(true);
        try {
            await RequestService.post(ADMIN_EMAIL_PROMO, values, true);
            message.success("Promotional email sent to all users!");
            form.resetFields();
        } catch (error) {
            message.error("Failed to send promotional email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="account-section-card">
            <ContentTitle title="Dashboard & Statistics" titleLevel={4} icon={<AreaChartOutlined />} />
            
            <Row gutter={[16, 16]} style={{ marginTop: 24, marginBottom: 16 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ borderLeft: "4px solid #1890ff", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                        <Statistic title="Total Orders" value={stats.totalOrders || 0} prefix={<ShoppingCartOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ borderLeft: "4px solid #52c41a", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                        <Statistic title="Total Customers" value={stats.totalCustomers || 0} prefix={<UserOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ borderLeft: "4px solid #722ed1", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                        <Statistic title="Total Products" value={stats.totalProducts || 0} prefix={<AppstoreOutlined />} />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card bordered={false} style={{ borderLeft: "4px solid #f5222d", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", background: stats.lowStockProducts > 0 ? "#fff1f0" : "#fff" }}>
                        <Statistic 
                            title="Low Stock Warnings" 
                            value={stats.lowStockProducts || 0} 
                            valueStyle={{ color: stats.lowStockProducts > 0 ? "#f5222d" : "inherit" }}
                            prefix={<WarningOutlined />} 
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} style={{ background: "#f0f2f5" }}>
                        <Statistic title="Daily Revenue" value={stats.dailyRevenue || 0} suffix="VND" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} style={{ background: "#f0f2f5" }}>
                        <Statistic title="Weekly Revenue" value={stats.weeklyRevenue || 0} suffix="VND" />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8}>
                    <Card bordered={false} style={{ background: "#f0f2f5" }}>
                        <Statistic title="Monthly Revenue" value={stats.monthlyRevenue || 0} suffix="VND" />
                    </Card>
                </Col>
            </Row>

            <ContentTitle title="Send Promotional Email" titleLevel={4} icon={<MailOutlined />} />
            <Card style={{ marginTop: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", border: "none" }}>
                <Form form={form} layout="vertical" onFinish={onSendPromo}>
                    <Form.Item name="subject" label="Subject" rules={[{ required: true }]}>
                        <Input placeholder="E.g. Spring Sale - 20% Off!" />
                    </Form.Item>
                    <Form.Item name="message" label="Message (HTML supported)" rules={[{ required: true }]}>
                        <Input.TextArea rows={6} placeholder="<h1>Special Offer!</h1><p>Use code SPRING20</p>" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" size="large" htmlType="submit" loading={loading} style={{ minWidth: 200 }}>
                            Send to all users
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default AdminDashboard;
