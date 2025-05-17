import { AccountsFinancePermissions } from "./AccountsFinancePermissions";
import { AuditPermissions } from "./AuditPermissions";
import { CommercialPermissions } from "./CommercialPermissions";
import { CuttingPermissions } from "./CuttingPermissions";
import { DevelopmentPermissions } from "./DevelopmentPermissions";
import { EmbroideryPermissions } from "./EmbroideryPermissions";
import { ItPermissions } from "./ItPermissions";
import { MerchandisingPermissions } from "./MerchandisingPermissions";
import { MaintenancePermissions } from "./MaintenancePermissions";
import { AdministrationPermissions } from "./AdministrationPermissions";
import { ManagementPermissions } from "./ManagementPermissions";
import { PlaningPermissions } from "./PlaningPermissions";
import { PurchasePermissions } from "./PurchasePermissions";
import { SamplePermissions } from "./SamplePermissions";
import { SewingPermissions } from "./SewingPermissions";
import { FinishingPermissions } from "./FinishingPermissions";
import { StorePermissions } from "./StorePermissions";
import { WashingPermissions } from "./WashingPermissions";

export const rolesPermissions = {
  "Accounts & Finance": AccountsFinancePermissions,
  Administration: AdministrationPermissions,
  Audit: AuditPermissions,
  Commercial: CommercialPermissions,
  Cutting: CuttingPermissions,
  Development: DevelopmentPermissions,
  Embroidery: EmbroideryPermissions,
  Finishing: FinishingPermissions,
  Washing: WashingPermissions,
  IT: ItPermissions,
  Management: ManagementPermissions,
  Merchandising: MerchandisingPermissions,
  Maintenance: MaintenancePermissions,
  Planing: PlaningPermissions,
  Purchase: PurchasePermissions,
  Sample: SamplePermissions,
  Sewing: SewingPermissions,
  Store: StorePermissions,
};

// Default permissions for all users
export const defaultConfig = [
  { path: "/mailbox", label: "Mail", icon: "fas fa-envolope me-1" },
  { path: "/schedules", label: "Cal", icon: "fas fa-calender me-1" },
  { path: "#", label: "Task", icon: "fas fa-calender me-1" },
  { path: "#", label: "Works", icon: "fas fa-calender me-1" },
  { path: "/files", label: "Files", icon: "fa fa-folder me-1" },
  { path: "/parcels", label: "Parcels", icon: "fas fa-gift me-1" },
  { path: "/messages", label: "Chats", icon: "fas fa-comment me-1" },
];
