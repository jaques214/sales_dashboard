'use client';
import { usePathname } from 'next/navigation'
import './sidebar.css'
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupsIcon from '@mui/icons-material/Groups';
import HandshakeIcon from '@mui/icons-material/Handshake';
import InventoryIcon from '@mui/icons-material/Inventory';
import Link from 'next/link';
import { ReactElement } from 'react';

type NavBar = {
    id: number,
    title: string,
    icon: ReactElement,
    url: string
}

const DashboardIconStyle = { width: '40px', height: '40px', padding: '5px', color: '#00d1ff' };

const links: NavBar[] = [
    {
        id: 1,
        title: "Dashboard",
        icon: <DashboardIcon sx={DashboardIconStyle} />,
        url: "/"
    },
    {
        id: 2,
        title: "Sales",
        icon: <PointOfSaleIcon sx={DashboardIconStyle} />,
        url: "/sales"
    },
    {
        id: 3,
        title: "Purchases",
        icon: <ShoppingCartIcon sx={DashboardIconStyle} />,
        url: "/purchases"
    },
    {
        id: 4,
        title: "Customers",
        icon: <GroupsIcon sx={DashboardIconStyle} />,
        url: "/customers"
    },
    {
        id: 5,
        title: "Suppliers",
        icon: <HandshakeIcon sx={DashboardIconStyle} />,
        url: "/suppliers"
    },
    {
        id: 6,
        title: "Products",
        icon: <InventoryIcon sx={DashboardIconStyle} />,
        url: "/products"
    }
]

export default function Sidebar() {
    const pathname = usePathname()

    const navLinks = links.map((link: NavBar) => {
        return (
            <Link key={link.id} className={pathname == link.url ? 'nav-item active' : 'nav-item'} href={link.url}>
                {link.icon}
                {link.title}
            </Link>
        )
    })

    return (
        <aside className='sidebar'>
            <div className='logo'>
                <LocalShippingIcon className="truck-icon"></LocalShippingIcon>
                <p>Engenheiros das Peles, LDA.</p>
            </div>
            {navLinks}
        </aside>
    )
}