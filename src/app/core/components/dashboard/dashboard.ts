import { Component, TemplateRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDialog } from '../../../shared/components/task-dialog/task-dialog';
import { TaskDetails, UserDetails } from '../../models/user.models';
import { CommonService } from '../../../shared/services/common-service';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { Dialog } from '../../../shared/services/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [MatTableModule, MatCardModule, MatIconModule, MatButtonModule, MatDialogModule, CommonModule, MatPaginatorModule, MatTooltipModule, MatDividerModule, MatSortModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  /**
   * Reference to table sort functionality  
   */
  @ViewChild(MatSort) sort!: MatSort;
  /**
   * Reference to table pagination
   */
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  /**
   * Reference to the view modal for task details
   */
  @ViewChild('view', { static: true }) view!: TemplateRef<Dashboard>;
  /**
   * Stores the current logged-in user's details
   */
  userDetails!: UserDetails;
  /**
   * Columns to display in the task table
   */
  columns = ['taskName', 'assignee', 'priority', 'status', 'dueDate', 'createdBy', 'createdOn'];
  /**
   * Data source for the material table
   */
  dataSource = new MatTableDataSource<any>();
  /**
   * Stores the currently selected task for view/edit/delete
   */
  selectedTask !: TaskDetails;
  /**
   * Subscription object which is used to unsubscribe the subscribed values
   * @type {Subscription}
   */
  subscriptionObj: Subscription = new Subscription();

  constructor(private dialog: MatDialog, private commonService: CommonService, private cdRef: ChangeDetectorRef, private dialogService: Dialog, private _liveAnnouncer: LiveAnnouncer) { }

  /**
   * Angular lifecycle hook - Called once component is initialized
   */
  ngOnInit() {
    this.getUserDetails();
    this.getAllTasks();
  }

  /**
   * Retrieves user details from local storage via CommonService
   */
  getUserDetails() {
    this.userDetails = this.commonService.getUser();
  }

  /**
   * Angular lifecycle hook - Called after the view has been initialized
   */
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Opens the task creation dialog and refreshes the task list after a successful addition
   */
  createTask() {
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '500px',
      disableClose: true
    });
    this.subscriptionObj.add(dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.getAllTasks();
      }
    }))
  }

  /**
   * Retrieves all tasks from local storage
   */
  getAllTasks() {
    const datas = localStorage.getItem('userFormList');
    let res = datas ? JSON.parse(datas) : [];
    if (this.userDetails.role === 'member') {
      res = res.filter((task: TaskDetails) => task.assignee === this.userDetails.email);
    }
    if (this.userDetails.role === 'manager') {
      res = res.filter((task: TaskDetails) => task.assignee === this.userDetails.email);
    }
    this.dataSource.data = res;
    this.cdRef.detectChanges();
  }

  /**
   * Opens a modal to view task details
   * @param data the task to view 
   */
  onRowClick(data: TaskDetails): void {
    this.selectedTask = data;
    this.dialog.open(this.view, { width: '500px' })
  }

  /**
   * Opens the task edit dialog and refreshes task list after editing
   */
  editTask() {
    this.dialog.closeAll();
    const dialogRef = this.dialog.open(TaskDialog, {
      width: '500px',
      disableClose: true,
      data: { mode: 'edit', task: this.selectedTask }
    });
    this.subscriptionObj.add(dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.getAllTasks();
      }
    }))
  }

  /**
   * Opens a confirmation dialog and deletes the selected task if confirmed
   */
  onDeleteTask() {
    this.dialog.closeAll();
    if (this.selectedTask?.id) {
      const dialogRef = this.dialogService.openConfirmationDialog("Are you sure you want to delete this task permanently? please note that this action cannot be undone.");
      this.subscriptionObj.add(dialogRef.afterClosed().subscribe((res: boolean) => {
        if (res) {
          const deletedData = this.dataSource.data.filter(item => item.id !== this.selectedTask?.id);
          localStorage.setItem('userFormList', JSON.stringify(deletedData));
          this.getAllTasks();
        }
      }))
    }
  }

  /**
   * Returns CSS class name based on task status
   */
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'new':
        return 'status-new';
      case 'in progress':
        return 'status-progress';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  }
  /**
   * Announces the current sorting direction for accessibility support
   * @param sortState the sorting data 
   */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  /**
   * Logs out the current user and navigates to the login page
   */
  logout() {
    this.commonService.logout()
  }

  /**
   * Angular life cycle hooks which is used to destroy the subscription
   */
  ngOnDestroy(): void {
    this.subscriptionObj.unsubscribe();
  }
}
