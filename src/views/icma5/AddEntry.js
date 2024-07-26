import React, { useEffect, useRef, useState } from 'react'
import {
    CCol,
    CButton,
    CForm,
    CFormInput,
    CFormCheck,
    CToaster,
    CToast,
    CToastBody,
    CToastHeader
} from '@coreui/react'
import { getStyle } from '@coreui/utils';
import { useTranslation, Trans } from 'react-i18next';
import { CIcon } from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import DataTable from 'react-data-table-component';
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

const AddEntry = ({ dynamoTable }) => {

    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const [validated, setValidated] = useState(false);
    const [checkboxes, setCheckboxes] = useState({});
    const [toast, setToast] = useState({ visible: false, message: '', type: '' });
    const formRef = useRef(null);

    const mutation = useMutation({
        mutationFn: async (newEntryData) => {
            try {
                const res = await fetch(`https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/${dynamoTable}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newEntryData),
                });
                if (!res.ok) {
                    // If response status is not OK, throw an error
                    const errorDetails = await res.text();
                    throw new Error(`Error ${res.status}: ${errorDetails}`);
                }

                const data = await res.json();
                return data;

            } catch (error) {
                console.error('Failed to fetch:', error);
                throw error; // Ensure the error is propagated to the mutation's onError handler
            }
        },
        onError: (error) => {
            setToast({ visible: true, message: `${error}`, type: 'danger' });
            console.error('Error submitting form:', error);
            queryClient.invalidateQueries(['viewQData']);
        },
        onSuccess: (data) => {
            setToast({ visible: true, message: `${data}`, type: 'success' });
            formRef.current.reset(); // Reset the form on success
            setValidated(false); // Reset the validation state
            setCheckboxes({}); // Reset checkboxes state
            queryClient.invalidateQueries(['viewQData']);
        },
        onSettled: () => {
            // Additional logic if needed on settled state
        },
    });

    const handleCreateEntry = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false || !validateCheckboxes()) {
            event.stopPropagation();
        } else {
            const formData = new FormData(form);
            const formDataObj = {};
            formData.forEach((value, key) => {
                if (value === 'on') {
                    formDataObj[key] = form.elements[key].checked ? "T" : "F";
                } else {
                    formDataObj[key] = value;
                }
            });
            mutation.mutate(formDataObj);
        }
        setValidated(true);
    };

    const validateCheckboxes = () => {
        let isValid = true;
        const updatedCheckboxes = { ...checkboxes };
        Object.keys(checkboxes).forEach((key) => {
            if (!checkboxes[key]) {
                isValid = false;
                updatedCheckboxes[key] = false;
            }
        });
        setCheckboxes(updatedCheckboxes);
        return isValid;
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckboxes((prev) => ({ ...prev, [name]: checked }));
    };

    const { isPending, error, data } = useQuery({
        queryKey: ['addEntryQData'],
        queryFn: () =>
            fetch(`https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/${dynamoTable}`).then((res) =>
                res.json().then((data) => data),
            ),
    });

    if (isPending) return t('description.loading');
    if (error) return 'An error has occurred: ' + error.message;

    return (
        <>
            {/* Toast Notification */}
            <CToaster placement="bottom-end">
                {toast.visible && (
                    <CToast
                        autohide={true}
                        visible={toast.visible}
                        onClose={() => setToast({ ...toast, visible: false })}
                        color={toast.type}
                    >
                        <CToastHeader closeButton>
                            <strong className="me-auto">Create entry</strong>
                            <small>now</small>
                        </CToastHeader>
                        <CToastBody>{toast.message}</CToastBody>
                    </CToast>
                )}
            </CToaster>

            <CForm
                className="row g-3 needs-validation"
                noValidate
                validated={validated}
                onSubmit={handleCreateEntry}
                ref={formRef}
            >
                {data.items.length > 0 &&
                    Object.keys(data.items[0]).map((key, index) => {
                        if (key.toUpperCase()[0] === 'C') {
                            return (
                                <CCol md={2} className="position-relative" key={index}>
                                    <CFormInput
                                        key={index}
                                        type="text"
                                        name={key}
                                        label={t(dynamoTable + '.' + key.toUpperCase())}
                                        aria-describedby={`validationInput${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t(dynamoTable + '.' + key.toUpperCase())}.`}
                                        placeholder=""
                                        feedbackValid=""
                                        tooltipFeedback
                                        required
                                    />
                                </CCol>
                            );
                        } else if (key.toUpperCase()[0] === 'L') {
                            return (
                                <CCol md={2} className="position-relative" key={index}>
                                    <div className="form-check">
                                        <CFormCheck
                                            key={index}
                                            type="checkbox"
                                            name={key}
                                            label={t(dynamoTable + '.' + key.toUpperCase())}
                                            aria-describedby={`validationCheckbox${index}Feedback`}
                                            feedbackInvalid={`${t('description.ppvText')} ${t(dynamoTable + '.' + key.toUpperCase())}.`}
                                            feedbackValid=""
                                            tooltipFeedback
                                            checked={checkboxes[key] || false}
                                            onChange={handleCheckboxChange}
                                            className={checkboxes[key] === false ? 'is-invalid' : ''}
                                        />
                                        {checkboxes[key] === false && (
                                            <div className="invalid-feedback">
                                                {t('description.ppvText')} {t(dynamoTable + '.' + key.toUpperCase())}
                                            </div>
                                        )}
                                    </div>
                                </CCol>
                            );
                        } else if (key.toUpperCase()[0] === 'N') {
                            return (
                                <CCol md={2} className="position-relative" key={index}>
                                    <CFormInput
                                        key={index}
                                        type="number"
                                        name={key}
                                        label={t(dynamoTable + '.' + key.toUpperCase())}
                                        aria-describedby={`validationNumber${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t(dynamoTable + '.' + key.toUpperCase())}.`}
                                        placeholder=""
                                        feedbackValid=""
                                        tooltipFeedback
                                        required
                                    />
                                </CCol>
                            );
                        } else if (key.toUpperCase()[0] === 'D') {
                            return (
                                <CCol md={2} className="position-relative" key={index}>
                                    <CFormInput
                                        key={index}
                                        type="date"
                                        name={key}
                                        label={t(dynamoTable + '.' + key.toUpperCase())}
                                        aria-describedby={`validationNumber${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t(dynamoTable + '.' + key.toUpperCase())}.`}
                                        placeholder=""
                                        feedbackValid=""
                                        tooltipFeedback
                                        required
                                    />
                                </CCol>
                            );
                        } else {
                            return null;
                        }
                    })}
                <CCol xs={12} className="position-relative">
                    <CButton color="primary" type="submit">
                    {t('description.addEntryBtn')}
                    </CButton>
                </CCol>
            </CForm>
        </>
    );


}

export default AddEntry
