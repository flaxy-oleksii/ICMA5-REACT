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

import DynamoDataTable from './DynamoDataTable'
import AddEntry from './AddEntry'

const queryClient = new QueryClient();
export const subsidies_extra = () => {

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
                                        <DynamoDataTable dynamoTable={'subsidies-extra'} />
                                    </QueryClientProvider>
                                </CTabPanel>
                                <CTabPanel className="py-3" aria-labelledby="add-tab-pane" itemKey={2} onShow={() => addEntryFunc()}>
                                    <QueryClientProvider client={queryClient}>
                                        <AddEntry dynamoTable={'subsidies-extra'} />
                                    </QueryClientProvider>
                                </CTabPanel>
                                <CTabPanel className="py-3" aria-labelledby="edit-tab-pane" itemKey={3}>
                                    <QueryClientProvider client={queryClient}>
                                        {/* <EditEntryForm entryId="01940004" /> */}
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

function addEntryFunc() {
    console.log('Add Entry function called');
}

function handleEditEntry(id) {

    alert('Edit Entry ' + id);
    // Perform your action with the ID here
}

export default subsidies_extra
