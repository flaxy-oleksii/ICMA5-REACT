import React from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTabs,
    CTab,
    CTabPanel,
    CTabContent,
    CTabList,
    CTableBody,
    CTableCaption,
    CButton,
    CForm,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CInputGroup,
    CFormCheck,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,

} from '@coreui/react'
import { useTranslation, Trans } from 'react-i18next';

import { useState } from "react";
import {
    QueryClient,
    QueryClientProvider,
    useQuery
} from "@tanstack/react-query";
import { func } from 'prop-types';

const queryClient = new QueryClient()

export const table_accounts = () => {

    const { t } = useTranslation();

    return (

        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>{t('description.accounts')}</strong>
                    </CCardHeader>
                    <CCardBody>

                        <CTabs activeItemKey={1}>
                            <CTabList variant="pills" layout="justified">
                                <CTab aria-controls="view-tab-pane" itemKey={1}>{t('description.view')}</CTab>
                                <CTab aria-controls="add-tab-pane" itemKey={2}>{t('description.add')}</CTab>
                                <CTab aria-controls="edit-tab-pane" itemKey={3}>{t('description.edit')}</CTab>
                                <CTab aria-controls="report-tab-pane" disabled itemKey={4}>{t('description.report')}</CTab>
                            </CTabList>
                            <CTabContent>
                                <CTabPanel className="py-3" aria-labelledby="view-tab-pane" itemKey={1}>
                                    <QueryClientProvider client={queryClient}>
                                        <DynamoTable />
                                    </QueryClientProvider>
                                </CTabPanel>
                                <CTabPanel className="py-3" aria-labelledby="add-tab-pane" itemKey={2} onShow={() => addEntryFunc()}>
                                    <QueryClientProvider client={queryClient}>
                                        <EditEntryForm />
                                    </QueryClientProvider>
                                </CTabPanel>
                                <CTabPanel className="py-3" aria-labelledby="edit-tab-pane" itemKey={3}>
                                    Contact tab content
                                </CTabPanel>
                                <CTabPanel className="py-3" aria-labelledby="report-tab-pane" itemKey={4}>
                                    Disabled tab content
                                </CTabPanel>
                            </CTabContent>
                        </CTabs>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12}>

                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Request</strong>
                    </CCardHeader>
                    <CCardBody>

                        <p className="text-body-secondary small">
                            Add <code>small</code> property to make any <code>&lt;CTable&gt;</code> more compact
                            by cutting all cell <code>padding</code> in half.
                        </p>
                        <CTable small hover>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                                    <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow>
                                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                                    <CTableDataCell>Mark</CTableDataCell>
                                    <CTableDataCell>Otto</CTableDataCell>
                                    <CTableDataCell>@mdo</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell scope="row">2</CTableHeaderCell>
                                    <CTableDataCell>Jacob</CTableDataCell>
                                    <CTableDataCell>Thornton</CTableDataCell>
                                    <CTableDataCell>@fat</CTableDataCell>
                                </CTableRow>
                                <CTableRow>
                                    <CTableHeaderCell scope="row">3</CTableHeaderCell>
                                    <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                                    <CTableDataCell>@twitter</CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    )
};

function DynamoTable() {

    const { t } = useTranslation();
    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch("https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/accounts").then((res) =>
                // Update the global variable with fetched items
                res.json().then(data => {
                    return data; // Continue to return data for the useQuery hook
                }),
            ),
    });

    if (isPending) return t('description.loading');

    if (error) return 'An error has occurred: ' + error.message;

    // Determine valid columns
    const validColumns = data.items.reduce((acc, item) => {
        Object.keys(item).forEach(key => {
            // Check if the item's value for the key is valid and not already included
            if (item[key] && !acc.includes(key)) {
                acc.push(key);
            }
        });
        return acc;
    }, []);

    if (data.items.length > 0 && validColumns.length > 0) {
        return (
            <div style={{ overflowX: 'auto' }}>
                <CTable small hover>
                    <CTableHead>
                        <CTableRow>
                            {validColumns.map((key, index) => (
                                <CTableHeaderCell key={index} scope="col">{t('accounts.' + key.toUpperCase())}</CTableHeaderCell>
                            ))}
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {data.items.map((item, index) => (
                            <CTableRow key={index}>
                                {validColumns.map((key, subIndex) => (
                                    <CTableDataCell key={subIndex}>{item[key]}</CTableDataCell>
                                ))}
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </div>
        );
    } else {
        return 'No data available';
    }
}

function EditEntryForm() {

    const { t } = useTranslation();
    const [validated, setValidated] = useState(false)
    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        setValidated(true)
    }

    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch("https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/accounts").then((res) =>
                // Update the global variable with fetched items
                res.json().then(data => {
                    return data; // Continue to return data for the useQuery hook
                }),
            ),
    });

    if (isPending) return t('description.loading');

    if (error) return 'An error has occurred: ' + error.message;

    if (data.items.length > 0) {

        return (
            <CForm
                className="row g-3 needs-validation"
                key="addForm"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
            >
                {
                    Object.keys(data.items[0]).map((key, index) => {
                        // Add if statement to check if key is 'C'
                        if (key.toUpperCase()[0] === 'C') {
                            return (
                                <CCol md={2} className="position-relative">
                                    <CFormInput
                                        key={index}
                                        type="text"
                                        // id={`validationTooltip${index}`}
                                        label={t('accounts.' + key.toUpperCase())}
                                        aria-describedby={`validationInput${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t('accounts.' + key.toUpperCase())}.`}
                                        placeholder=''
                                        feedbackValid=''
                                        tooltipFeedback
                                        required
                                    />
                                </CCol>
                            );
                        }
                        if (key.toUpperCase()[0] === 'L') {
                            return (
                                <CCol md={2} className="position-relative">
                                    <CFormCheck
                                        key={index}
                                        type="checkbox"
                                        // id={`validationTooltip${index}`}
                                        label={t('accounts.' + key.toUpperCase())}
                                        aria-describedby={`validationCheckbox${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t('accounts.' + key.toUpperCase())}.`}
                                        feedbackValid=''
                                        tooltipFeedback
                                        required
                                    />
                                </CCol>
                            );
                        }
                        else if (key.toUpperCase()[0] === 'N') {
                            return (
                                <CCol md={2} className="position-relative">
                                    <CFormInput
                                        key={index}
                                        type="number"
                                        // id={`validationTooltip${index}`}
                                        label={t('accounts.' + key.toUpperCase())}
                                        aria-describedby={`validationNumber${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t('accounts.' + key.toUpperCase())}.`}
                                        placeholder=''
                                        feedbackValid=''
                                        tooltipFeedback
                                        required
                                    />
                                </CCol>
                            );
                        }
                        else if (key.toUpperCase()[0] === 'D') {
                            return (
                                <CCol md={2} className="position-relative">
                                    <CFormInput
                                        key={index}
                                        type="date"
                                        // id={`validationTooltip${index}`}
                                        label={t('accounts.' + key.toUpperCase())}
                                        aria-describedby={`validationNumber${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t('accounts.' + key.toUpperCase())}.`}
                                        placeholder=''
                                        feedbackValid=''
                                        tooltipFeedback
                                        required
                                    />
                                </CCol>
                            );
                        }
                        else {
                            return null;
                        }
                        // If key is not 'C', return null or any other JSX as needed
                    })
                }
                <CCol xs={12} className="position-relative">
                    <CButton color="primary" type="submit">
                        Submit form
                    </CButton>
                </CCol>
            </CForm>
        )
    } else {
        return 'No data available';
    }
}

function addEntryFunc() {
    console.log('Add Entry function called');
}

export default table_accounts
