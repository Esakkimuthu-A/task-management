export interface UserDetails {
    email: string;
    password: string;
    role: string;
    name: string;
}

export interface TaskDetails {
    taskName: string;
    assignee: string;
    priority: string;
    status: string;
    dueDate: string;
    created?: string;
    createdOn?: string | Date;
    description: string | null;
    id: string;
}

export interface ConfirmationDialogData{
    header: string;
    content: string;
    actionType: string;
}