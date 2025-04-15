// src/app/shared/pipes/safe-translate.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'safeTranslate',
  standalone: true,
  pure: false, // required for dynamic language change
})
export class SafeTranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(
    value: string | undefined | null,
    fallbackKey: string = 'COMMON.UNKNOWN'
  ): string {
    if (!value || typeof value !== 'string' || value.trim() === '') {
      return this.translate.instant(fallbackKey);
    }

    const translation = this.translate.instant(value);

    return translation === value
      ? this.translate.instant(fallbackKey)
      : translation;
  }
}
