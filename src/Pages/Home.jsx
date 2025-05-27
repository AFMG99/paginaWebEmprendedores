import React, { useEffect, useState } from 'react';
import {
    FaUserCog,
    FaShoppingCart,
    FaChartBar,
    FaFileAlt,
    FaUsers,
    FaUserPlus,
    FaCashRegister,
    FaShoppingBasket,
    FaDollarSign,
    FaClipboardList,
    FaShoppingBag,
    FaBars,
    FaTimes
} from "react-icons/fa";
import MenuList from '../components/Sidebar/MenuList';
import AdminUsers from './AdminUsers';
import ProfitAnalysis from './ProfitAnalysis';
import Reports from './Reports';
import Sales from './Sales';
import CreateUser from '../components/AdminUsers/CreateUser';
import UserList from '../components/AdminUsers/UserList';
import Purchases from './Purchases';
import ManagePurchases from '../components/Purchases/ManagePurchases';
import HomeCarrousel from '../components/Carrousel/HomeCarrousel';
import SalesManager from '../components/Sales/SalesManger';
import CheckSale from '../components/Sales/Check/CheckSale';
import ConsultaCompras from '../components/Purchases/Check/ConsultaCompras';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [reset, setReset] = useState(0);
    const [isResponsive, setIsResponsive] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleResize = () => {
        setIsResponsive(window.innerWidth < 992);
        if (window.innerWidth >= 992) {
            setSidebarOpen(true);
        } else {
            setSidebarOpen(false);
        }
    };

    const handleItemClick = (item) => {
        if (item.name === "Usuarios" || item.name === "Ventas" || item.name === "Compras" || item.name === "Registrar") {
            setReset(prev => prev + 1);
        }
        setSelectedItem(item);
    };

    const menuItems = [
        {
            name: "Usuarios",
            icon: <FaUserCog />,
            component: <AdminUsers resetView={reset} />,
            subItems: [
                { name: "Consultar", icon: <FaUsers />, component: <UserList /> },
                ...(user?.role === "Admin" ?
                    [{ name: "Registrar", icon: <FaUserPlus />, component: <CreateUser /> }] :
                    []
                ),
            ],
        },
        {
            name: "Ventas",
            icon: <FaShoppingCart />,
            component: <Sales resetView={reset} />,
            subItems: [
                {
                    name: "Consultar",
                    icon: <FaClipboardList />,
                    component: <CheckSale key={reset} resetView={reset} />
                },
                {
                    name: "Registrar",
                    icon: <FaCashRegister />,
                    component: <SalesManager key={reset} resetView={reset} />
                },
            ],
        },
        {
            name: "Compras",
            icon: <FaShoppingBasket />,
            component: <Purchases resetView={reset} />,
            subItems: [
                {
                    name: "Consultar",
                    icon: <FaShoppingBag />,
                    component: <ConsultaCompras key={reset} resetView={reset} />
                },
                {
                    name: "Registrar",
                    icon: <FaDollarSign />,
                    component: <ManagePurchases key={reset} resetView={reset} />
                },
            ],
        },
        ...(user?.role === "Admin" ?
            [{ name: "Rentabilidad", icon: <FaChartBar />, component: <ProfitAnalysis /> }] :
            []
        ),
        { name: "Informes", icon: <FaFileAlt />, component: <Reports /> },
    ];

    return (
        <div className="home-container">
            {isResponsive && (
                <button
                    className='hamburger-button'
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
            )}
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''} ${isResponsive ? 'responsive' : ''}`}>
                <MenuList
                    menuItems={menuItems}
                    onItemClick={(item) => {
                        handleItemClick(item);
                        if (isResponsive) setSidebarOpen(false);
                    }}
                    selectedItem={selectedItem}
                />
            </aside>

            {isResponsive && sidebarOpen && (
                <div
                    className='sidebar-overlay'
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <main className="content">
                {selectedItem ? selectedItem.component : <HomeCarrousel />}
            </main>
            <button
                className="floating-button"
            >
                💬
            </button>
        </div>
    );
};

export default Home;
