import React, { useEffect, useRef, useState } from 'react'
import {
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CToaster,
    CToast,
    CToastBody,
    CToastHeader
} from '@coreui/react';
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

const DynamoDataTable = ({ dynamoTable }) => {

    const queryClient = useQueryClient();
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
            const res = await fetch(`https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/${dynamoTable}/${id}`, {
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
            queryClient.invalidateQueries(['viewQData']);
        },
        onSuccess: () => {
            setToast({ visible: true, message: 'Successfully deleted the entry.', type: 'success' });
            queryClient.invalidateQueries(['viewQData']);
        },
    });

    const { isPending, error, data } = useQuery({
        queryKey: ['viewQData'],
        queryFn: () =>
            fetch(`https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/${dynamoTable}`).then((res) =>
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
            name: t(dynamoTable + '.' + key.toUpperCase()),
            selector: (row) => row[key],
            sortable: true,
        };
    });

    columns.push({
        name: t('description.actionColumn'),
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
        selectAllRowsItemText: t('description.paginatorSelectAllText'),
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

export default DynamoDataTable
