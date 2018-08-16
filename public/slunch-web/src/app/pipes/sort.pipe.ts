import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(arr: Array<any>, field: string, direction: string): any {
    return arr.sort((a,b)=>{
      let ret: number = 0;
      if(a[field] > b[field]) ret = 1
      else ret = -1
      if(direction == "desc") ret = ret*-1
      return ret
    });
  }

}
