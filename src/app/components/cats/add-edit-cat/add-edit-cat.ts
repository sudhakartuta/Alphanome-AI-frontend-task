import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ICat } from '../../../shared/models/icat';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICatInfo } from '../../../shared/models/icat-info';
import { CatService } from '../../../shared/services/cat-service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonService } from '../../../shared/services/common-service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-add-edit-cat',
  imports: [MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule,MatProgressSpinnerModule,MatDividerModule],
  templateUrl: './add-edit-cat.html',
  styleUrl: './add-edit-cat.scss',
})
export class AddEditCat {

  private readonly dialogRef = inject(MatDialogRef<AddEditCat>);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly catService = inject(CatService);
  private readonly commonService = inject(CommonService);

  isLoading = signal(false);
  readonly data = inject<{ cat: ICat | null, type: string }>(MAT_DIALOG_DATA);
  cat: ICatInfo | undefined;
  catForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
    age: new FormControl(''),
  });

  constructor() {
    console.log(this.data);
    this.cat = this.data?.cat?.info;
    if (this.data.type === 'edit' && this.cat) {
      this.catForm.patchValue(this.cat);
    }

  }

  save() {
    this.isLoading.set(true);
    console.log(this.catForm.value);
    const catInfo: ICatInfo = this.catForm.value as ICatInfo;

    if (this.data.type === 'add') {
      this.catService.createCat(catInfo)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (cat: ICat) => {
            this.commonService.open('New Cat is added', 'Dismiss');
            this.dialogRef.close(cat);
            this.isLoading.set(false);
          }, error: (err) => {
            this.commonService.open(err.error.message, 'Dismiss');
            this.isLoading.set(false);
          }
        });

    } else {
      this.catService.updateCat(this.data.cat?.id, catInfo)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (cat: ICat) => {
            this.commonService.open('Cat is updated', 'Dismiss');
            this.dialogRef.close(cat);
            this.isLoading.set(false);
          }, error: (err) => {
            this.commonService.open(err.error.message, 'Dismiss');
            this.isLoading.set(false);
          }
        });

    }
  }



}
