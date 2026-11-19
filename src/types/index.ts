export type Project = {
  slug: string;
  number: string;
  name: string;
  category: string;
  description: string;
  overview: string;
  status: string;
  stack: string[];
  externalUrl?: string;
};

export type ContactFormValues = {
  submissionId: string;
  name: string;
  email: string;
  company?: string;
  projectType: string;
  budget?: string;
  timeline?: string;
  message: string;
  consent: true;
  turnstileToken: string;
};
