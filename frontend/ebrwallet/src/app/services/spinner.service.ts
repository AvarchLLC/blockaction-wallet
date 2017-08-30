import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SpinnerService {
  public spinnerStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  /**
   * Sets the loading spinner visibility flag
   * @param value spinner visibility
   */
  displaySpiner(value: boolean) {
    this.spinnerStatus.next(value);
  }
}
