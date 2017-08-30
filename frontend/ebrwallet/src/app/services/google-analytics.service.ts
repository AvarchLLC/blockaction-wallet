import { Injectable } from '@angular/core';

declare var ga: any;

@Injectable()
export class GoogleAnalyticsService {

  /**
   * Event custom events to google analtics
   * @param eventCategory 
   * @param eventAction 
   * @param eventLabel 
   * @param eventValue 
   */
  public emitEvent(eventCategory: string,
                   eventAction: string,
                   eventLabel: string = null,
                   eventValue: number = null) {
    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }
}
