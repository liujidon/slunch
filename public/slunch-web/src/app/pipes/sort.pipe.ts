import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(arr: Array<any>, field: string, direction: string): any {
    return arr.sort((a,b)=>(direction == "desc" ? -1 : 1) *  (a[field].toLowerCase() < b[field].toLowerCase() ? -1 : 1));
  }

}
