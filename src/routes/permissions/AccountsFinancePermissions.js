export const AccountsFinancePermissions = {
  "General Manager": [
    {
      path: "/accounts/budgets",
      label: "BGD",
      icon: "fas fa-chevron-right me-1",
    },
    {
      path: "/accounts/proformas",
      label: "Pro. Invoices",
      icon: "fas fa-chevron-right me-1",
    },
    {
      path: "#",
      label: "Sub Store",
      icon: "fas fa-store me-1",
      submenus: [
        {
          path: "/sub-stores/special/4",
          label: "HO",
          icon: "fas fa-chevron-right me-1 ml-25 no_circle",
        },
        {
          path: "/sub-stores/special/1",
          label: "JMS",
          icon: "fas fa-chevron-right me-1 ml-25 no_circle",
        },
        {
          path: "/sub-stores/special/2",
          label: "MCL",
          icon: "fas fa-chevron-right me-1 ml-25 no_circle",
        },

        {
          path: "/sub-stores/special/3",
          label: "MBL",
          icon: "fas fa-chevron-right me-1 ml-25 no_circle",
        },
      ],
    },

    //requisition

    {
      path: "#",
      label: "Purchase Requisition",
      icon: "fas fa-chevron-right me-1",
      submenus: [
        {
          path: "/requisitions/special/4",
          label: "Head Office",
          icon: "fas fa-chevron-right me-1 ml-25 no_circle",
        },
        {
          path: "/requisitions/special/1",
          label: "JMS",
          icon: "fas fa-chevron-right me-1 ml-25 no_circle",
        },
        {
          path: "/requisitions/special/2",
          label: "MCL",
          icon: "fas fa-chevron-right me-1 ml-25 no_circle",
        },
        {
          path: "/requisitions/special/3",
          label: "MBL",
          icon: "fas fa-chevron-right me-1 ml-25 no_circle",
        },
      ],
    },
  ],


  
  Manager: [
    {
      path: "/accounts/budgets",
      label: "Budgets",
      icon: "fas fa-chevron-right me-1",
    },
    {
      path: "/accounts/proformas",
      label: "Pro. Invoices",
      icon: "fas fa-chevron-right me-1",
    },
  ],
  Executive: [
    {
      path: "/sub-stores",
      label: "Sub Store",
      icon: "fas fa-chevron-right me-1",
    },
    {
      path: "/requisitions",
      label: "Requisitions",
      icon: "fas fa-border-all me-1",
    },
    {
      path: "/requisitions-pending",
      label: "Pending Purchase",
      icon: "fas fa-info me-1 ml-25 no_circle",
    },
  ],
  "Jr. Executive": [
    {
      path: "/sub-stores",
      label: "Sub Store",
      icon: "fas fa-chevron-right me-1",
    },
    {
      path: "/requisitions",
      label: "Requisitions",
      icon: "fas fa-border-all me-1",
    },
  ],
  "Sr. Executive": [
    //SUBSTORE SUBMENU
    {
      path: "/sub-stores/special/4",
      label: "Head Office",
      icon: "fas fa-chevron-right me-1 ml-25 no_circle",
    },
    {
      path: "/sub-stores/special/1",
      label: "JMS",
      icon: "fas fa-chevron-right me-1 ml-25 no_circle",
    },
    {
      path: "/sub-stores/special/2",
      label: "MCL",
      icon: "fas fa-chevron-right me-1 ml-25 no_circle",
    },

    {
      path: "/sub-stores/special/3",
      label: "MBL",
      icon: "fas fa-chevron-right me-1 ml-25 no_circle",
    },
    {
      path: "/requisitions",
      label: "Requisitions",
      icon: "fas fa-border-all me-1",
    },
  ],
};
