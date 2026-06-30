import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, notification, Row, Upload } from "antd";
import { UploadChangeParam } from "antd/lib/upload/interface";
import { useTranslation } from "react-i18next";

import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import FormInput from "../../../components/FormInput/FormInput";
import { selectPerfume } from "../../../redux-toolkit/perfume/perfume-selector";
import {
    selectAdminStateErrors,
    selectIsAdminStateLoading,
    selectIsPerfumeEdited
} from "../../../redux-toolkit/admin/admin-selector";
import { LoadingStatus } from "../../../types/types";
import { resetAdminState, setAdminLoadingState } from "../../../redux-toolkit/admin/admin-slice";
import { fetchPerfume } from "../../../redux-toolkit/perfume/perfume-thunks";
import IconButton from "../../../components/IconButton/IconButton";
import EditPerfumeSelect from "./EditPerfumeSelect";
import { updatePerfume } from "../../../redux-toolkit/admin/admin-thunks";
import "./EditPerfume.css";

type EditPerfumeData = {
    perfumeTitle: string;
    perfumer: string;
    year: string;
    country: string;
    type: string;
    volume: string;
    perfumeGender: string;
    fragranceTopNotes: string;
    fragranceMiddleNotes: string;
    fragranceBaseNotes: string;
    price: string;
};

const EditPerfume: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const params = useParams<{ id: string }>();
    const perfumeData = useSelector(selectPerfume);
    const isLoading = useSelector(selectIsAdminStateLoading);
    const errors = useSelector(selectAdminStateErrors);
    const isPerfumeEdited = useSelector(selectIsPerfumeEdited);
    const [file, setFile] = React.useState<File | null>(null);

    useEffect(() => {
        dispatch(setAdminLoadingState(LoadingStatus.LOADED));
        dispatch(fetchPerfume(params.id));

        return () => {
            dispatch(resetAdminState(LoadingStatus.LOADING));
        };
    }, []);
    
    useEffect(() => {
        if (perfumeData) {
            form.setFieldsValue(perfumeData);
        }
    }, [perfumeData])

    useEffect(() => {
        if (isPerfumeEdited) {
            window.scrollTo(0, 0);
            notification.success({
                message: t('account.admin.perfume_edited', 'Perfume edited'),
                description: t('account.admin.perfume_edited_desc', 'Perfume successfully edited!')
            });
            dispatch(resetAdminState(LoadingStatus.SUCCESS));
        }
    }, [isPerfumeEdited]);

    const onFormSubmit = (data: EditPerfumeData): void => {
        const bodyFormData: FormData = new FormData();
        if (file) {
            bodyFormData.append("file", file, file.name);
        }
        bodyFormData.append(
            "perfume",
            new Blob([JSON.stringify({ ...data, id: perfumeData?.id })], { type: "application/json" })
        );

        dispatch(updatePerfume(bodyFormData));
    };

    const handleUpload = ({ file }: UploadChangeParam<any>): void => {
        if (file.status === "removed") {
            setFile(null);
            return;
        }

        setFile((file.originFileObj || file) as File);
    };

    return (
        <div className="account-section-card">
            <ContentTitle title={t('account.admin.edit_perfume')} titleLevel={4} icon={<EditOutlined />} />
            <Form onFinish={onFormSubmit} form={form} style={{ marginTop: 32 }}>
                <Row gutter={32}>
                    <Col xs={24} md={12}>
                        <FormInput
                            title={t('account.admin.perfume_title')}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"perfumeTitle"}
                            error={errors.perfumeTitleError}
                            disabled={isLoading}
                            placeholder={t('account.admin.perfume_title_placeholder')}
                        />
                        <FormInput
                            title={t('menu.perfumer')}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"perfumer"}
                            error={errors.perfumerError}
                            disabled={isLoading}
                            placeholder={t('account.admin.brand_placeholder')}
                        />
                        <FormInput
                            title={t('product.year')}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"year"}
                            error={errors.yearError}
                            disabled={isLoading}
                            placeholder={t('account.admin.year_placeholder')}
                        />
                        <FormInput
                            title={t('product.country')}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"country"}
                            error={errors.countryError}
                            disabled={isLoading}
                            placeholder={t('account.admin.country_placeholder')}
                        />
                        <EditPerfumeSelect
                            title={t('product.type')}
                            name={"type"}
                            placeholder={t('product.type')}
                            error={errors.typeError}
                            disabled={isLoading}
                            values={["Eau de Parfum", "Eau de Toilette"]}
                        />
                        <EditPerfumeSelect
                            title={t('product.gender')}
                            name={"perfumeGender"}
                            placeholder={t('product.gender')}
                            disabled={isLoading}
                            values={["male", "female"]}
                        />
                        <FormInput
                            title={t('product.volume')}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"volume"}
                            error={errors.volumeError}
                            disabled={isLoading}
                            placeholder={t('account.admin.volume_placeholder')}
                        />
                        <FormInput
                            title={t('product.top_notes')}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"fragranceTopNotes"}
                            error={errors.fragranceTopNotesError}
                            disabled={isLoading}
                            placeholder={t('account.admin.top_notes_placeholder')}
                        />
                        <FormInput
                            title={t('product.middle_notes')}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"fragranceMiddleNotes"}
                            error={errors.fragranceMiddleNotesError}
                            disabled={isLoading}
                            placeholder={t('account.admin.middle_notes_placeholder')}
                        />
                        <FormInput
                            title={t('product.base_notes')}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"fragranceBaseNotes"}
                            error={errors.fragranceBaseNotesError}
                            disabled={isLoading}
                            placeholder={t('account.admin.base_notes_placeholder')}
                        />
                        <FormInput
                            title={t('menu.price')}
                            titleSpan={6}
                            wrapperSpan={18}
                            name={"price"}
                            error={errors.priceError}
                            disabled={isLoading}
                            placeholder={t('account.admin.price_placeholder')}
                        />
                            <FormInput
                                title={"Inventory"}
                                titleSpan={8}
                                wrapperSpan={16}
                                name={"inventory"}
                                error={errors.inventoryError}
                                disabled={isLoading}
                                placeholder={"Enter the inventory"}
                            />
                    </Col>
                    <Col xs={24} md={12}>
                        <Upload name={"file"} onChange={handleUpload} beforeUpload={() => false} maxCount={1}>
                            <Button icon={<UploadOutlined />}>{t('account.admin.upload')}</Button>
                        </Upload>
                        <div className={"edit-perfume-image-wrapper"}>
                            <img
                                className={"edit-perfume-image"}
                                src={perfumeData.filename}
                                alt={perfumeData.perfumeTitle}
                            />
                        </div>
                    </Col>
                </Row>
                <IconButton title={t('account.edit')} icon={<EditOutlined />} disabled={isLoading} loading={isLoading} />
            </Form>
        </div>
    );
};

export default EditPerfume;
