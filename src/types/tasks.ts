export type TaskItem = {
  id: string;
  label: string;
};

export type TaskSubmission = {
  id: string;
  name: string;
  item: string;
  note?: string;
  createdAt: string;
};
