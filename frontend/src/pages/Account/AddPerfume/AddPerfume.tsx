import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Col, Form, notification, Row, Upload } from "antd";
import { PlusSquareFilled, PlusSquareOutlined, UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/lib/upload/interface";
import { useTranslation } from "react-i18next";

import {
    selectAdminStateErrors,
    selectIsAdminStateLoading,
    selectIsPerfumeAdded
} from "../../../redux-toolkit/admin/admin-selector";
import { resetAdminState, setAdminLoadingState } from "../../../redux-toolkit/admin/admin-slice";
import { LoadingStatus } from "../../../types/types";
import { addPerfume } from "../../../redux-toolkit/admin/admin-thunks";
import ContentTitle from "../../../components/ContentTitle/ContentTitle";
import AddFormInput from "./AddFormInput";
import AddFormSelect from "./AddFormSelect";
import IconButton from "../../../components/IconButton/IconButton";

type AddPerfumeData = {
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

const AddPerfume: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const isPerfumeAdded = useSelector(selectIsPerfumeAdded);
    const ispPerfumeLoading = useSelector(selectIsAdminStateLoading);
    const perfumeErrors = useSelector(selectAdminStateErrors);
    const [file, setFile] = React.useState<File | null>(null);

    useEffect(() => {
        dispatch(setAdminLoadingState(LoadingStatus.LOADED));

        return () => {
            dispatch(resetAdminState(LoadingStatus.LOADING));
        };
    }, []);

    useEffect(() => {
        if (isPerfumeAdded) {
            window.scrollTo(0, 0);
            notification.success({
                message: t('account.admin.perfume_added', 'Perfume added'),
                description: t('account.admin.perfume_added_desc', 'Perfume successfully added!')
            });
            dispatch(resetAdminState(LoadingStatus.SUCCESS));
        }
    }, [isPerfumeAdded]);

    const onFormSubmit = (data: AddPerfumeData): void => {
        const bodyFormData: FormData = new FormData();
        if (file) {
            bodyFormData.append("file", file, file.name);
        }
        bodyFormData.append(
            "perfume",
            new Blob([JSON.stringify({ ...data, perfumeRating: 0 })], { type: "application/json" })
        );

        dispatch(addPerfume(bodyFormData));
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
            <ContentTitle title={t('account.admin.add_perfume')} titleLevel={4} icon={<PlusSquareOutlined />} />
            <Form onFinish={onFormSubmit} style={{ marginTop: 32 }}>
                <Row gutter={32}>
                    <Col xs={24} md={12}>
                        <AddFormInput
                            title={t('account.admin.perfume_title', 'Perfume title')}
                            name={"perfumeTitle"}
                            error={perfumeErrors.perfumeTitleError}
                            placeholder={t('account.admin.perfume_title_placeholder', 'Enter the perfume title')}
                            disabled={ispPerfumeLoading}
                        />
                        <AddFormInput
                            title={t('product.year')}
                            name={"year"}
                            error={perfumeErrors.yearError}
                            placeholder={t('account.admin.year_placeholder', 'Enter the release year')}
                            disabled={ispPerfumeLoading}
                        />
                        <AddFormSelect
                            title={t('product.type')}
                            name={"type"}
                            error={perfumeErrors.typeError}
                            placeholder={"Eau de Parfum"}
                            disabled={ispPerfumeLoading}
                            values={["Eau de Parfum", "Eau de Toilette"]}
                        />
                        <AddFormSelect
                            title={t('product.gender')}
                            name={"perfumeGender"}
                            error={perfumeErrors.perfumeGenderError}
                            placeholder={"male"}
                            disabled={ispPerfumeLoading}
                            values={["male", "female"]}
                        />
                        <AddFormInput
                            title={t('product.middle_notes')}
                            name={"fragranceMiddleNotes"}
                            error={perfumeErrors.fragranceMiddleNotesError}
                            placeholder={t('account.admin.middle_notes_placeholder', 'Enter the heart notes')}
                            disabled={ispPerfumeLoading}
                        />
                        <AddFormInput
                            title={t('menu.price')}
                            name={"price"}
                            error={perfumeErrors.priceError}
                            placeholder={t('account.admin.price_placeholder', 'Enter the price')}
                            disabled={ispPerfumeLoading}
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <AddFormInput
                            title={t('menu.perfumer')}
                            name={"perfumer"}
                            error={perfumeErrors.perfumerError}
                            placeholder={t('account.admin.brand_placeholder', 'Enter the brand')}
                            disabled={ispPerfumeLoading}
                        />
                        <AddFormInput
                            title={t('product.country')}
                            name={"country"}
                            error={perfumeErrors.countryError}
                            placeholder={t('account.admin.country_placeholder', 'Enter the manufacturer country')}
                            disabled={ispPerfumeLoading}
                        />
                        <AddFormInput
                            title={t('product.volume')}
                            name={"volume"}
                            error={perfumeErrors.volumeError}
                            placeholder={t('account.admin.volume_placeholder', 'Enter the volume')}
                            disabled={ispPerfumeLoading}
                        />
                        <AddFormInput
                            title={t('product.top_notes')}
                            name={"fragranceTopNotes"}
                            error={perfumeErrors.fragranceTopNotesError}
                            placeholder={t('account.admin.top_notes_placeholder', 'Enter the top notes')}
                            disabled={ispPerfumeLoading}
                        />
                        <AddFormInput
                            title={t('product.base_notes')}
                            name={"fragranceBaseNotes"}
                            error={perfumeErrors.fragranceBaseNotesError}
                            placeholder={t('account.admin.base_notes_placeholder', 'Enter the base notes')}
                            disabled={ispPerfumeLoading}
                        />
                        <Upload name={"file"} onChange={handleUpload} beforeUpload={() => false} maxCount={1}>
                            <Button icon={<UploadOutlined />} style={{ marginTop: 22 }}>
                                {t('account.admin.upload', 'Click to Upload')}
                            </Button>
                        </Upload>
                    </Col>
                </Row>
                <IconButton title={t('account.admin.add_perfume').split(' ')[0]} icon={<PlusSquareFilled />} loading={ispPerfumeLoading} disabled={ispPerfumeLoading} />
            </Form>
        </div>
    );
};

export default AddPerfume;
