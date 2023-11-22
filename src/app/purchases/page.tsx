import { getPurchases } from "../actions";

export default async function Purchase() {
    const filteredPurchases = await getPurchases();

    const newPurchases = filteredPurchases.map((purchase, index: number) => {
        const dateFormat = new Date(purchase.date!).toLocaleDateString('pt-PT');
        const formattedID = purchase.id.split('.');
        const id = formattedID[0] + " Nº " + formattedID[1].substring(1, formattedID[1].length) + "/A"
        return (
            <tr key={index}>
                <td>{id}</td>
                <td>{dateFormat}</td>
                <td>{purchase.name}</td>
            </tr>
        )
    })

    return (
        <main className='invoices'>
            Purchases
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Supplier Name</th>
                    </tr>
                </thead>
                <tbody>
                    {newPurchases}
                </tbody>
            </table>
        </main>
    )
}