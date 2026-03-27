import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  readonly snackBar = inject(MatSnackBar);
  open(message: string, action = '') {
    const matSnackBarConfig: MatSnackBarConfig = { duration: 2000 };
    return this.snackBar.open(message, action, matSnackBarConfig);
  }
}
