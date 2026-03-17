import { Injectable, computed, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, of, switchMap, tap } from 'rxjs';

// Replace with your actual service
// import { ExampleService } from '@core/services/example.service';

interface ExampleData {
  id: number;
  name: string;
}

interface ExampleState {
  data: ExampleData | null;
  error: string | null;
  isLoading: boolean;
}

const initialState: ExampleState = {
  data: null,
  error: null,
  isLoading: false,
};

@Injectable({ providedIn: 'root' })
export class ExampleStore {
  // private readonly exampleService = inject(ExampleService);

  private readonly loadTrigger$ = new Subject<void>();

  private readonly _data = signal<ExampleData | null>(initialState.data);
  private readonly _error = signal<string | null>(initialState.error);
  private readonly _isLoading = signal(initialState.isLoading);

  readonly data = this._data.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly displayName = computed(() => this._data()?.name ?? 'No data');
  readonly hasData = computed(() => this._data() !== null);

  constructor() {
    this.loadTrigger$
      .pipe(
        tap(() => {
          this._error.set(null);
          this._isLoading.set(true);
        }),
        switchMap(() =>
          of({ id: 1, name: 'Example' }).pipe(
            tap((data) => {
              this._data.set(data);
              this._isLoading.set(false);
            }),
            catchError((err: Error) => {
              this._error.set(err.message ?? 'Error loading data');
              this._isLoading.set(false);
              return of(null);
            })
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  load(): void {
    this.loadTrigger$.next();
  }

  reset(): void {
    this._data.set(null);
    this._error.set(null);
    this._isLoading.set(false);
  }
}
