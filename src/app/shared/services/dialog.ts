import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../components/confirmation-dialog/confirmation-dialog';

@Injectable({
  providedIn: 'root'
})
export class Dialog {
  constructor(public dialog: MatDialog) { }
  openConfirmationDialog(message: string, className?: string) {
    const dialog = this.dialog.open(ConfirmationDialog, {
      data: {
        header: "Confirmation",
        content: message,
        actionType: "Confirmation",
      },
      disableClose: true,
      autoFocus: false
    });
    return dialog;
  }
}
