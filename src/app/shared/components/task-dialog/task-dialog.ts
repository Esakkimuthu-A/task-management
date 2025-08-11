import { Component, Inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Priority, Status } from '../../constants/project.constant';
import { TaskDetails, UserDetails } from '../../../core/models/user.models';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-task-dialog',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule, MatIconModule, CommonModule, MatTooltipModule],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.scss',
  providers: [
    provideNativeDateAdapter()
  ]
})
export class TaskDialog {
  /**
   * Reactive form group for task creation/editing
   */
  taskForm !: FormGroup;
  /**
   * Stores the logged-in user details
   */
  userDetails!: UserDetails;
  /**
   * Dialog mode - 'add' or 'edit'
   */
  mode: 'add' | 'edit' = 'add';
  /**
   * List of statuses used in select dropdown
   */
  statusList = Status;
  /**
   * List of priorities used in select dropdown
   */
  priorityList = Priority;
  /**
   * List of assignable users
   */
  assigneeList = ['admin@gmail.com', 'manager@gmail.com', 'member@gmail.com'];
  /**
   * Injects dialog data, dialog reference, and common service
   */
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<TaskDialog>) { }

  /**
   * Lifecycle hook - initializes the form with default or edit values
   */
  ngOnInit() {
    const userDetails = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    this.mode = this.data?.mode || 'add';
    this.taskForm = new FormGroup({
      taskName: new FormControl(this.data?.task?.taskName ?? null, Validators.required),
      assignee: new FormControl({ value: this.data?.task?.assignee ?? null, disabled: userDetails.role === 'manager' || userDetails.role === 'member' }, Validators.required),
      status: new FormControl(this.data?.task?.status ?? null, Validators.required),
      dueDate: new FormControl(this.data?.task?.dueDate ?? null, Validators.required),
      priority: new FormControl(this.data?.task?.priority ?? null, Validators.required),
      description: new FormControl(this.data?.task?.description ?? null)
    });
  }

  /**
   * Handles form submission for add/edit mode
   */
  submit() {
    if (this.taskForm.valid) {
      const existingData = JSON.parse(localStorage.getItem('userFormList') || '[]');
      if (this.mode === 'edit') {
        const updatedTask = { ...this.data.task, ...this.taskForm.value };
        const storedTasks = localStorage.getItem('userFormList');
        let tasks: TaskDetails[] = storedTasks ? JSON.parse(storedTasks) : [];
        const index = tasks.findIndex(task => task.id === updatedTask.id);
        if (index !== -1) {
          tasks[index] = updatedTask;
          localStorage.setItem('userFormList', JSON.stringify(tasks));
          console.log('Task updated successfully');
        } else {
          console.error('Task not found with id:', updatedTask.id);
        }
        this.dialogRef.close(true);
      } else {
        const userId = existingData.length > 0
          ? Math.max(...existingData.map((item: TaskDetails) => item.id)) + 1
          : 1;
        const dataToStore = {
          ...this.taskForm.value,
          id: userId,
          createdBy: 'admin@gmail.com',
          createdOn: new Date()
        };
        existingData.push(dataToStore);
        localStorage.setItem('userFormList', JSON.stringify(existingData));
        localStorage.setItem('id', userId.toString());
        this.dialogRef.close(true);
      }
    }
  }
}
