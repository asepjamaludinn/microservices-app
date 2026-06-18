export type AuditLog = {
  id: number;
  user_id: number | null;
  action: string;
  entity_type: string;
  entity_id: number;
  details: Record<string, any> | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};
