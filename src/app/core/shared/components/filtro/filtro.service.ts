import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FiltroService {
  private activatedRoute = inject(ActivatedRoute);
  private router = inject(Router);

  currentFiltro = toSignal(
    this.activatedRoute.queryParamMap.pipe(
      map((params) => {
        const statusParam = params.get('status');
        if (!statusParam) return 'publicada';
        return statusParam;
      })
    ),
    { initialValue: 'publicada' }
  );
}
