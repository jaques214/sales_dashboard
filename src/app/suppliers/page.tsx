import React from 'react'
import { getSuppliers } from '../actions';

export default async function Supplier() {
    const filteredSuppliers = await getSuppliers();

    const newSuppliers = filteredSuppliers.map((supplier, index: number) => {
        const fullAddress = `${supplier.addressDetail}, ${supplier.postalCode}, ${supplier.city}, ${supplier.country}`
        return (
            <tr key={index}>
                <td>{supplier.id}</td>
                <td>{supplier.companyName}</td>
                <td>{(supplier.telephone !== undefined) ? supplier.telephone : "-"}</td>
                <td>{fullAddress}</td>
            </tr>
        )
    })


    return (
        <main className='invoices'>
            Suppliers
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Tel</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {newSuppliers}
                </tbody>
            </table>
        </main >
    )
}
