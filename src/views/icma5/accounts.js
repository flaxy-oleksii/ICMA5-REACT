import React from 'react'
import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableCaption,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'

// import { useMemo } from "react";
import {
    QueryClient,
    QueryClientProvider,
    useQuery
} from "@tanstack/react-query";

const queryClient = new QueryClient()

export const table_accounts = () => {
    // const columns = useMemo(
    //     () => [
    //         {
    //             accessorKey: "employeeId",
    //             header: "ID",
    //             footer: "ID",
    //         },
    //         {
    //             accessorKey: "employeeName",
    //             header: "Name",
    //             footer: "Name",
    //         },
    //         {
    //             accessorKey: "employeeDescription",
    //             header: "Description",
    //             footer: "Description",
    //         },
    //     ],
    //     []
    // );

    // const { data: serverData } = useQuery({
    //     queryKey: ["accounts"],
    //     queryFn: async () => {
    //         // const result = await axios.get(props.path + "/accounts", {
    //         const result = await axios.get("https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/accounts", {
    //             // headers: {
    //             //     Authorization: localStorage.getItem("token"),
    //             // },
    //         });
    //         return result.data;
    //     },
    // });

    // const data = useMemo(() => serverData ?? [], [serverData]);

    // const table = useReactTable({
    //     columns,
    //     data,
    //     getCoreRowModel: getCoreRowModel(),
    // });

    // return (
    //     <>
    //         <table>
    //             <thead>
    //                 {table.getHeaderGroups().map((headerGroup) => (
    //                     <tr key={headerGroup.id}>
    //                         {headerGroup.headers.map((header) => (
    //                             <th key={header.id}>
    //                                 {flexRender(
    //                                     header.column.columnDef.header,
    //                                     header.getContext()
    //                                 )}
    //                             </th>
    //                         ))}
    //                     </tr>
    //                 ))}
    //             </thead>
    //             <tbody>
    //                 {table.getRowModel().rows.map((row) => (
    //                     <tr key={row.id}>
    //                         {row.getVisibleCells().map((cell) => (
    //                             <td key={cell.id}>
    //                                 {flexRender(cell.column.columnDef.cell, cell.getContext())}
    //                             </td>
    //                         ))}
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //     </>
    // );
    return (
        <CRow>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Request</strong>
                    </CCardHeader>
                    <CCardBody>
                        <QueryClientProvider client={queryClient}>
                            <Example />
                        </QueryClientProvider>
                    </CCardBody>
                </CCard>
            </CCol>
            <CCol xs={12}>
                <CCard className="mb-4">
                    <CCardHeader>
                        <strong>Accounts</strong>
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

function Example() {
    const { isPending, error, data } = useQuery({
        queryKey: ['repoData'],
        queryFn: () =>
            fetch("https://w3b7vnyrg9.execute-api.eu-central-1.amazonaws.com/prod/accounts").then((res) =>
                res.json(),
            ),
    });

    if (isPending) return 'Loading...';

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
            <CTable small hover>
                <CTableHead>
                    <CTableRow>
                        {validColumns.map((key, index) => (
                            <CTableHeaderCell key={index} scope="col">{key.toUpperCase()}</CTableHeaderCell>
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
        );
    } else {
        return 'No data available';
    }
}

export default table_accounts
