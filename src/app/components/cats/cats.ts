import { AfterViewInit, Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { CatService } from '../../shared/services/cat-service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ICat } from '../../shared/models/icat';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddEditCat } from './add-edit-cat/add-edit-cat';
import { CommonService } from '../../shared/services/common-service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-cats',
  imports: [CommonModule, MatTableModule, MatIconModule, MatSortModule, MatButtonModule, MatProgressSpinnerModule,MatToolbarModule,MatTooltipModule],
  templateUrl: './cats.html',
  styleUrl: './cats.scss',
})
export class Cats implements AfterViewInit {
  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  private readonly catService = inject(CatService);
  private readonly dialog = inject(MatDialog);
  private readonly reloadTrigger = signal(0);
  private readonly destroyRef = inject(DestroyRef);
  private readonly commonService = inject(CommonService);

  readonly loading = signal(true);

  protected readonly cats = toSignal(
    toObservable(this.reloadTrigger).pipe(
      tap(() => this.loading.set(true)),
      switchMap(() => this.catService.getAllCats()),
      tap(() => this.loading.set(false))
    ),
    { initialValue: [] as ICat[] }
  );

  displayedColumns: string[] = ['name', 'description', 'age', 'actions'];
  dataSource: MatTableDataSource<ICat> = new MatTableDataSource<ICat>();

  constructor() {
    console.log(this.cats());
    effect(() => {
      this.dataSource.data = this.cats();

    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: ICat, property: string) => {
      switch (property) {
        case 'name': return item.info?.name ?? '';
        case 'age': return item.info?.age ?? '';
        case 'description': return item.info?.description ?? '';
        default: return (item as any)[property];
      }
    };
  }

  addCat() {
    this.dialog.open(AddEditCat, {
      maxWidth: '96vw',
      maxHeight: '98vh',
      disableClose: true,
      data: { cat: null, type: 'add' },
    });
  }
  editCat(cat: ICat) {
    this.dialog.open(AddEditCat, {
      maxWidth: '96vw',
      maxHeight: '98vh',
      disableClose: true,
      data: { cat: cat, type: 'edit' },
    });
  }

  deleteCat(id: string) {
    this.loading.set(true)

    const confirm = window.confirm('Are you sure you want to delete this cat?');

    if (confirm) {
      this.catService.deleteCat(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.reloadTrigger.update(v => v + 1);
            this.commonService.open('Cat Deleted', 'Dismiss');
            this.loading.set(false);
          }
          , error: (err) => {
            this.loading.set(false);
            this.commonService.open(err.error.message, 'Dismiss');

          }
        });
    } else {
      this.loading.set(false);
    }
  }

  viewCat(cat: ICat) {
    this.dialog.open(AddEditCat, {
      width: '400px',
      maxWidth: '96vw',
      maxHeight: '98vh',
      disableClose: true,
      data: { cat: cat, type: 'view' },
    });
  }
}
