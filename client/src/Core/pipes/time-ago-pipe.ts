import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string): unknown {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29) {
        return 'Just now'
      }
      const intervals: { [key: string]: number } = {
        'year': 31536000,
        'month': 2592000,
        'week': 604800,
        'day': 86400,
        'hour': 3600,
        'minute': 60,
        'second': 1
      };
      let Counter;
      for (const i in intervals) {
        Counter = Math.floor(seconds / intervals[i]);
        if (Counter > 0) {
          if (Counter === 1) {
            return Counter + ' ' + i + ' ago';
          } else {
            return Counter + ' ' + i + 's ago';
          }
        }
      }
    }
    return value;
  }

}
