import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decodeHtml',
  standalone: true
})
export class DecodeHtmlPipe implements PipeTransform {

  transform(value: string | null | undefined): string {

    if (!value) return '';

    const textarea = document.createElement('textarea');

    textarea.innerHTML = value;

    return textarea.value;
  }
}