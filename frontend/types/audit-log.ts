export type AuditLog = {
  id: number;
  user_id: number | null;
  user_name: string | null;
  action: string;
  entity_type: string;
  entity_id: number;
  details: Record<string, any> | null;
  created_at: string;
};
