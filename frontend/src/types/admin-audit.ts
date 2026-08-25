export interface AdminAuditLog {
  id: string;
  logId: string;
  user: string;
  userRole: string;
  action: string;
  module: string;
  record: string;
  timestamp: string;
  ipAddress: string;
  device: string;
  oldValue?: string;
  newValue?: string;
}

export interface AdminAuditStats {
  totalLogs: number;
  logsToday: number;
  uniqueUsers: number;
  modulesTracked: number;
}
