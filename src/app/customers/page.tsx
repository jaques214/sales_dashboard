import { Metadata } from 'next'
import { getCustomers } from "../actions";

export const metadata: Metadata = {
    title: 'Customers',
}

export default async function Customer() {
    const filteredCustomers = await getCustomers();

    const newCustomers = filteredCustomers.map((customer, index: number) => {
        const fullAddress = `${customer.addressDetail}, ${customer.postalCode}, ${customer.city}, ${customer.country}`
        return (
            <tr key={index}>
                <td>{customer.id}</td>
                <td>{customer.companyName}</td>
                <td>{(customer.telephone !== undefined) ? customer.telephone : "-"}</td>
                <td>{fullAddress}</td>
            </tr>
        )
    })

    return (
        <main className='invoices'>
            Customers
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
                    {newCustomers}
                </tbody>
            </table>
        </main>
    )
}