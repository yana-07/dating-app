import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 400:
            const errors = error.error.errors;
            if (errors) {
              const modelStateErrors = [];
              for (const key in errors) {
                if (errors[key]) {
                  modelStateErrors.push(...errors[key]);
                }
              }
              throw modelStateErrors;
            } else {
              toastr.error(error.error, error.status.toString());
            }
            break;
          case 401:
            toastr.error('Unauthorised', error.status.toString());
            break;
          case 404:
            router.navigate(['/not-found']);
            break;
          case 500:
            const navigationExtras: NavigationExtras = {
              state: { error: error.error },
            };
            router.navigate(['/server-error'], navigationExtras);
            break;
          default:
            toastr.error('Something unexpected went wrong!');
        }
      }

      throw error;
    })
  );
};
