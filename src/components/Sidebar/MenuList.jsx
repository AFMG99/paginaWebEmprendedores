import React, { useState } from "react";
import MenuItem from "./MenuItem";

const MenuList = ({ menuItems, onItemClick, selectedItem }) => {
    const [openMenu, setOpenMenu] = useState(null);

    const handleMenuClick = (item) => {
        if (item.subItems) {
            setOpenMenu(openMenu === item.name ? null : item.name);
            onItemClick(item);
        } else {
            onItemClick(item);
            setOpenMenu(null);
        }
    };

    return (
        <ul className="menu-list">
            {menuItems.map((item, index) => (
                <React.Fragment key={index}>
                    <MenuItem
                        item={item}
                        onClick={() => handleMenuClick(item)}
                        isActive={selectedItem?.name === item.name}
                        isOpen={openMenu === item.name}
                        toggleSubmenu={() => setOpenMenu(openMenu === item.name ? null : item.name)}
                    />
                    {item.subItems && openMenu === item.name && (
                        <ul className="submenu">
                            {item.subItems.map((subItem, subIndex) => (
                                <MenuItem
                                    key={subIndex}
                                    item={subItem}
                                    onClick={onItemClick}
                                    isActive={selectedItem?.name === subItem.name}
                                />
                            ))}
                        </ul>
                    )}
                </React.Fragment>
            ))}
        </ul>
    );
};

export default MenuList;
