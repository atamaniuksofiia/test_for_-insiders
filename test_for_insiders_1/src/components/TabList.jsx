import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Tab.css';

import {
  MdDashboard,
  MdAccountBalance,
  MdTimeline,
  MdAccountBalanceWallet,
  MdMenuBook,
  MdBarChart,
  MdBusinessCenter,
  MdAdminPanelSettings,
  MdHelpOutline,
  MdShowChart,
  MdPayments,
  MdAttachMoney,
  MdSearch,
  MdExpandMore,
  MdClose,
} from 'react-icons/md';

const getTabIcon = tabId => {
  const iconMap = {
    1: <MdDashboard className="tab-icon" />,
    2: <MdAccountBalance className="tab-icon" />,
    3: <MdTimeline className="tab-icon" />,
    4: <MdAccountBalanceWallet className="tab-icon" />,
    5: <MdMenuBook className="tab-icon" />,
    6: <MdBarChart className="tab-icon" />,
    7: <MdBusinessCenter className="tab-icon" />,
    8: <MdAdminPanelSettings className="tab-icon" />,
    9: <MdHelpOutline className="tab-icon" />,
    10: <MdShowChart className="tab-icon" />,
    11: <MdPayments className="tab-icon" />,
    12: <MdAttachMoney className="tab-icon" />,
    13: <MdSearch className="tab-icon" />,
  };
  return iconMap[tabId] || <MdDashboard className="tab-icon" />;
};

const initialTabs = [
  { id: 1, name: 'Dashboard', url: '/dashboard', pinned: false },
  { id: 2, name: 'Banking', url: '/banking', pinned: false },
  { id: 3, name: 'Timeline', url: '/timeline', pinned: false },
  { id: 4, name: 'Accounting', url: '/accounting', pinned: false },
  { id: 5, name: 'Manual', url: '/manual', pinned: false },
  { id: 6, name: 'Statistics', url: '/statistics', pinned: false },
  { id: 7, name: 'Bank Office', url: '/bank-office', pinned: false },
  { id: 8, name: 'Administration', url: '/administration', pinned: false },
  { id: 9, name: 'Help', url: '/help', pinned: false },
  { id: 10, name: 'Wertpapierhandel', url: '/wertpapierhandel', pinned: false },
  { id: 11, name: 'Ausschüttungen', url: '/ausschuttungen', pinned: false },
  { id: 12, name: 'Finanzl', url: '/finanzl', pinned: false },
  { id: 13, name: 'Search', url: '/search', pinned: false },
  { id: 14, name: 'Analytics', url: '/analytics', pinned: false },
  { id: 15, name: 'Clients', url: '/clients', pinned: false },
  { id: 16, name: 'Invoices', url: '/invoices', pinned: false },
  { id: 17, name: 'Calendar', url: '/calendar', pinned: false },
  { id: 18, name: 'Messages', url: '/messages', pinned: false },
  { id: 19, name: 'Reports', url: '/reports', pinned: false },
  { id: 20, name: 'Settings', url: '/settings', pinned: false },
];

const TabList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tabs, setTabs] = useState(() => {
    const stored = localStorage.getItem('tabs');
    return stored ? JSON.parse(stored) : initialTabs;
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [visibleTabs, setVisibleTabs] = useState([]);
  const [overflowTabs, setOverflowTabs] = useState([]);

  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const tabRefs = useRef({});
  const pendingTabSwapRef = useRef(false);
  const isInitialRenderRef = useRef(true);

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingTab = tabs.find(tab => tab.url === currentPath);
    if (matchingTab) {
      setActiveTab(matchingTab.id);
    } else if (tabs.length > 0 && !activeTab) {
      setActiveTab(tabs[0].id);
      navigate(tabs[0].url);
    }
  }, [location.pathname, tabs, navigate, activeTab]);

 const handleTabClick = tabId => {
 
  const updatedTabs = tabs.map(tab =>
    tab.id === tabId ? { ...tab, pinned: !tab.pinned } : tab
  );

  
  setTabs(updatedTabs);
  setActiveTab(tabId);

 
  const clickedTab = updatedTabs.find(t => t.id === tabId);
  if (clickedTab) {
    navigate(clickedTab.url); 
  }
};

  const handleDragStart = index => {
    dragItem.current = index;
  };

  const handleDragEnter = index => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const copiedTabs = [...tabs];
    const draggedTab = copiedTabs[dragItem.current];
    copiedTabs.splice(dragItem.current, 1);
    copiedTabs.splice(dragOverItem.current, 0, draggedTab);
    setTabs(copiedTabs);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const updateTabVisibility = useCallback(() => {
    if (!containerRef.current) return;

    setTimeout(() => {
      const container = containerRef.current;
      const containerStyles = window.getComputedStyle(container);
      const containerPaddingLeft = parseFloat(containerStyles.paddingLeft) || 0;
      const containerPaddingRight = parseFloat(containerStyles.paddingRight) || 0;
      const containerWidth = container.offsetWidth - containerPaddingLeft - containerPaddingRight;

      const dropdownButtonWidth = dropdownRef.current?.offsetWidth || 40;
      let totalWidth = 0;
      const visible = [];
      const overflow = [];

      const allRefsExist = tabs.every(tab => !!tabRefs.current[tab.id]);
      if (!allRefsExist) {
        setTimeout(updateTabVisibility, 100);
        return;
      }

      for (const tab of tabs) {
        const tabEl = tabRefs.current[tab.id];
        if (!tabEl) continue;
        const tabStyles = window.getComputedStyle(tabEl);
        const tabMarginLeft = parseFloat(tabStyles.marginLeft) || 0;
        const tabMarginRight = parseFloat(tabStyles.marginRight) || 0;
        const tabFullWidth = tabEl.offsetWidth + tabMarginLeft + tabMarginRight;

        if (totalWidth + tabFullWidth + dropdownButtonWidth < containerWidth) {
          totalWidth += tabFullWidth;
          visible.push(tab);
        } else {
          overflow.push(tab);
        }
      }

      setVisibleTabs(visible);
      setOverflowTabs(overflow);
    }, 0);
  }, [tabs]);

  useEffect(() => {
    if (pendingTabSwapRef.current) {
      const timer = setTimeout(() => {
        updateTabVisibility();
        pendingTabSwapRef.current = false;
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [tabs, updateTabVisibility]);

  useEffect(() => {
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;

      const timer = setTimeout(updateTabVisibility, 100);
      return () => clearTimeout(timer);
    } else {
      updateTabVisibility();
    }

    const handleResize = () => {
      pendingTabSwapRef.current = true;
      updateTabVisibility();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateTabVisibility]);

  useEffect(() => {
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }, [tabs]);
  useEffect(() => {
    console.log(
      'Visible tabs:',
      visibleTabs.map(t => t.name)
    );
    console.log(
      'Overflow tabs:',
      overflowTabs.map(t => t.name)
    );
  }, [visibleTabs, overflowTabs]);
  return (
    <div className="tabs-container" ref={containerRef}>
      <div className="tabs-list">
        {visibleTabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''} ${tab.pinned ? 'pinned' : ''}`}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={e => e.preventDefault()}
            onClick={() => handleTabClick(tab.id)}
          >
            {getTabIcon(tab.id)}
            <span className="tab-name">{tab.name}</span>
          </div>
        ))}

        <div className="dropdown-wrapper">
          <div
            className="dropdown-toggle"
            ref={dropdownRef}
            onClick={e => {
              e.stopPropagation();
              setDropdownOpen(prev => !prev);
            }}
          >
            <MdExpandMore className="dropdown-icon" />
            {overflowTabs.length > 0 && (
              <span className="overflow-count">{overflowTabs.length}</span>
            )}
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
              {overflowTabs.map(tab => (
                <div
                  key={tab.id}
                  className={`dropdown-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    handleTabClick(tab.id);
                    setDropdownOpen(false);
                  }}
                >
                  {getTabIcon(tab.id)}
                  <span>{tab.name}</span>
                  <button
                    className="close-btn"
                    onClick={e => {
                      e.stopPropagation();
                      alert(`Закрито таб "${tab.name}"`);
                    }}
                  >
                    <MdClose className="close-icon" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ position: 'absolute', visibility: 'hidden', top: '-9999px' }}>
        {tabs.map(tab => (
          <div
            key={`measure-${tab.id}`}
            ref={el => {
              if (el) tabRefs.current[tab.id] = el;
            }}
            className="tab"
          >
            {getTabIcon(tab.id)}
            <span className="tab-name">{tab.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabList;
