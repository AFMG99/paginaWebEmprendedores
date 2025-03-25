import React from "react";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

const MenuItem = ({ item, onClick, isActive, isOpen, toggleSubmenu }) => {
    return (
        <li className={`menu-item ${isActive ? "active" : ""}`}>
            <button className="menu-button" onClick={() => onClick(item)}>
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.name}</span>
                {item.subItems && (
                    <span className="submenu-arrow" onClick={(e) => {
                        e.stopPropagation(); 
                        toggleSubmenu();
                    }}>
                        {isOpen ? <FaChevronDown /> : <FaChevronRight />}
                    </span>
                )}
            </button>
        </li>
    );
};

export default MenuItem;
