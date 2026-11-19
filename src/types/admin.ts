export type Enquiry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  project_type: string;
  budget: string | null;
  timeline: string | null;
  message: string;
  status: string;
  source: string;
  created_at: string;
  updated_at: string;
};

export type EnquiryNote = { id: string; note: string; created_by: string; created_at: string };

export type EnquiryActivity = {
  id: string;
  action: string;
  details: Record<string, unknown>;
  created_by: string;
  created_at: string;
};
