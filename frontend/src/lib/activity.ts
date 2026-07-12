import type { ActivityLog } from "@/types/activity";

export function formatActivityDetails(
  action: string,
  details: unknown,
  displayText?: string
): string {
  if (displayText) return displayText;
  if (details == null) return "";
  if (typeof details === "string") return details;
  if (typeof details !== "object") return String(details);

  const d = details as Record<string, unknown>;
  const actionLower = (action || "").toLowerCase();

  if ("assetId" in d && "employeeId" in d) {
    return `Asset #${d.assetId} allocated to employee #${d.employeeId}`;
  }
  if ("bookingId" in d && "assetId" in d) {
    return `Booking #${d.bookingId} created for asset #${d.assetId}`;
  }

  const parts = Object.entries(d)
    .filter(([, v]) => v != null)
    .map(([k, v]) => `${k.replace(/Id$/, "")} #${v}`);
  if (parts.length > 0) return parts.join(", ");

  return actionLower ? `${action.replace(/_/g, " ")} recorded` : "Activity recorded";
}

export function formatActivityTitle(log: ActivityLog): string {
  if (log.displayText) {
    const dash = log.displayText.indexOf(" - ");
    return dash > 0 ? log.displayText.slice(0, dash) : log.displayText;
  }
  const label = (log.action || "activity")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return `${label} #${log.id}`;
}

export function formatActivitySubtitle(log: ActivityLog): string {
  if (log.displayText) {
    const dash = log.displayText.indexOf(" - ");
    return dash > 0 ? log.displayText.slice(dash + 3) : "";
  }
  return formatActivityDetails(log.action, log.details);
}
