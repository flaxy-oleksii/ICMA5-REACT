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
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CToaster,
    CToast,
    CToastBody,
    CToastHeader
} from '@coreui/react'
import { useTranslation, Trans } from 'react-i18next';
import { CIcon } from '@coreui/icons-react';
import { cilTrash, cilPencil } from '@coreui/icons';
import DataTable from 'react-data-table-component';
import { useState, useRef } from "react";
import {
    QueryClient,
    QueryClientProvider,
    useQuery,
    useMutation
} from "@tanstack/react-query";

const queryClient = new QueryClient();

export const table_accounts = () => {

    const { t } = useTranslation(); const [showTab, setShowTab] = useState(false);

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
                                        <DynamoDataTable />
                                    </QueryClientProvider>
                                </CTabPanel>
                                <CTabPanel className="py-3" aria-labelledby="add-tab-pane" itemKey={2} onShow={() => addEntryFunc()}>
                                    <QueryClientProvider client={queryClient}>
                                        <AddEntryForm />
                                    </QueryClientProvider>
                                </CTabPanel>
                                <CTabPanel className="py-3" aria-labelledby="edit-tab-pane" itemKey={3}>
                                    <QueryClientProvider client={queryClient}>
                                        <EditEntryForm entryId="01940004" />
                                    </QueryClientProvider>
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

function AddEntryForm() {
    const { t } = useTranslation();
    const [validated, setValidated] = useState(false);
    const [checkboxes, setCheckboxes] = useState({});
    const [toast, setToast] = useState({ visible: false, message: '', type: '' });
    const formRef = useRef(null);

    const mutation = useMutation({
        mutationFn: async (newEntryData) => {
            try {
                const res = await fetch('https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/accounts', {
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
            queryClient.invalidateQueries(['viewAccountsQData']);
        },
        onSuccess: (data) => {
            setToast({ visible: true, message: `${data}`, type: 'success' });
            formRef.current.reset(); // Reset the form on success
            setValidated(false); // Reset the validation state
            setCheckboxes({}); // Reset checkboxes state
            queryClient.invalidateQueries(['viewAccountsQData']);
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
                    formDataObj[key] = form.elements[key].checked;
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
            fetch('https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/accounts').then((res) =>
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
                                        label={t('accounts.' + key.toUpperCase())}
                                        aria-describedby={`validationInput${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t('accounts.' + key.toUpperCase())}.`}
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
                                            label={t('accounts.' + key.toUpperCase())}
                                            aria-describedby={`validationCheckbox${index}Feedback`}
                                            feedbackInvalid={`${t('description.ppvText')} ${t('accounts.' + key.toUpperCase())}.`}
                                            feedbackValid=""
                                            tooltipFeedback
                                            checked={checkboxes[key] || false}
                                            onChange={handleCheckboxChange}
                                            className={checkboxes[key] === false ? 'is-invalid' : ''}
                                        />
                                        {checkboxes[key] === false && (
                                            <div className="invalid-feedback">
                                                {t('description.ppvText')} {t('accounts.' + key.toUpperCase())}
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
                                        label={t('accounts.' + key.toUpperCase())}
                                        aria-describedby={`validationNumber${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t('accounts.' + key.toUpperCase())}.`}
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
                                        label={t('accounts.' + key.toUpperCase())}
                                        aria-describedby={`validationNumber${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t('accounts.' + key.toUpperCase())}.`}
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
                        Add Entry
                    </CButton>
                </CCol>
            </CForm>
        </>
    );
}

function DynamoDataTable() {
    const { t } = useTranslation();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [toast, setToast] = useState({ visible: false, message: '', type: '' });

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteMutation.mutate(deleteId);
        setShowDeleteModal(false);
    };

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const res = await fetch(`https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/accounts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error('Error deleting the entry');
            }
            return res.json();
        },
        onError: (error) => {
            setToast({ visible: true, message: `${error}`, type: 'danger' });
            queryClient.invalidateQueries(['viewAccountsQData']);
        },
        onSuccess: () => {
            setToast({ visible: true, message: 'Successfully deleted the entry.', type: 'success' });
            queryClient.invalidateQueries(['viewAccountsQData']);
        },
    });

    const { isPending, error, data } = useQuery({
        queryKey: ['viewAccountsQData'],
        queryFn: () =>
            fetch('https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/accounts').then((res) =>
                res.json().then((data) => {
                    return data;
                }),
            ),
    });

    if (isPending) return t('description.loading');
    if (error) return 'An error has occurred: ' + error.message;

    const headerItem = data.items[0]; // Get the first item as a sample

    const columns = Object.keys(headerItem).map((key) => {
        return {
            name: t('accounts.' + key.toUpperCase()),
            selector: (row) => row[key],
            sortable: true,
        };
    });

    columns.push({
        name: 'Action',
        cell: (row) => (
            <div className="d-grid gap-2 d-md-block">
                <CButton color="danger" className="btn actionDeleteEntry" onClick={() => handleDeleteClick(row.id)}>
                    <CIcon icon={cilTrash} size="xl" />
                </CButton>
            </div>
        ),
    });

    const paginationComponentOptions = {
        rowsPerPageText: t('description.paginatorRowsPerPage'),
        rangeSeparatorText: t('description.paginatorRangeSeparatorText'),
        selectAllRowsItem: true,
        selectAllRowsItemText: t('description.paginatorSelectAText'),
    };

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
                            <strong className="me-auto">Delete entry</strong>
                            <small>now</small>
                        </CToastHeader>
                        <CToastBody>{toast.message}</CToastBody>
                    </CToast>
                )}
            </CToaster>

            <DataTable
                dense
                pagination
                paginationComponentOptions={paginationComponentOptions}
                responsive
                columns={columns}
                data={data.items}
                defaultSortFieldId={30} // Field to sort by
                defaultSortAsc={false} // Set to false for descending order (true for ascending)
            />

            <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
                <CModalHeader>
                    <CModalTitle>Confirm Delete</CModalTitle>
                </CModalHeader>
                <CModalBody>Are you sure you want to delete this entry?</CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </CButton>
                    <CButton color="primary" onClick={confirmDelete}>
                        Confirm
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}

function EditEntryForm(entryId) {

    const { t } = useTranslation();
    const [validated, setValidated] = useState(false)
    const handleEditSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        setValidated(true)
    }

    const { isPending, error, data } = useQuery({
        queryKey: ['editEntryQData'],
        queryFn: () =>
            fetch("https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/accounts/" + entryId.entryId).then((res) =>
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
                key="editForm"
                noValidate
                validated={validated}
                onSubmit={handleEditSubmit}
            >
                {
                    Object.keys(data.items[0]).map((key, index) => {
                        // Add if statement to check if key is 'C'
                        if (key.toUpperCase()[0] === 'C') {
                            return (
                                <CCol md={2} className="position-relative" key={index}>
                                    <CFormInput
                                        key={index}
                                        type="text"
                                        name={key} // Ensure name attribute is present
                                        // id={`validationTooltip${index}`}
                                        label={t('accounts.' + key.toUpperCase())}
                                        aria-describedby={`validationInput${index}Feedback`}
                                        feedbackInvalid={`${t('description.ppvText')} ${t('accounts.' + key.toUpperCase())}.`}
                                        placeholder=''
                                        // value={data.items[0][key]}
                                        feedbackValid=''
                                        tooltipFeedback
                                        required
                                    />
                                </CCol>
                            );
                        }
                        if (key.toUpperCase()[0] === 'L') {
                            return (
                                <CCol md={2} className="position-relative" key={index}>
                                    <CFormCheck
                                        key={index}
                                        type="checkbox"
                                        name={key} // Ensure name attribute is present
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
                                <CCol md={2} className="position-relative" key={index}>
                                    <CFormInput
                                        key={index}
                                        type="number"
                                        name={key} // Ensure name attribute is present
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
                                <CCol md={2} className="position-relative" key={index}>
                                    <CFormInput
                                        key={index}
                                        type="date"
                                        name={key} // Ensure name attribute is present
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
                        Edit Entry
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

function handleEditEntry(id) {

    alert('Edit Entry ' + id);
    // Perform your action with the ID here
}

function useCreateEntry() {
    console.log('Create Entry function called');
}


export default table_accounts
