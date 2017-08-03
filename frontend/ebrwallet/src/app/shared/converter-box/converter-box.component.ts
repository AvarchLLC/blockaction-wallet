import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-converter-box',
  templateUrl: './converter-box.component.html',
  styleUrls: ['./converter-box.component.css']
})
export class ConverterBoxComponent implements OnInit {

  @Input() baseName: string;
  @Input() quoteName: string;

  @Input() baseImage: string;
  @Input() quoteImage: string;

  @Input() bid: string;

  @Output() on_change: EventEmitter<object> = new EventEmitter();

  baseValue: string;
  quoteValue: string;

  constructor() { }

  ngOnInit() {
    const quote_value = parseFloat(this.baseValue) * parseFloat(this.bid);
    this.quoteValue = quote_value.toString();
  }

  baseToQuote(evt) {
    const base_value = parseFloat(evt.target.value);
    if (base_value !== 0 && evt.target.value.length > base_value.toString().length) {
      evt.target.value = base_value;
    }
    if(!base_value) {
      this.baseValue = '0';
      this.quoteValue = '0';
    }
    if (base_value && !isNaN(base_value) && base_value >= 0) {
      const quote_value = base_value * parseFloat(this.bid);
      this.quoteValue = quote_value.toString();
    }
    this.emit_change();
  }

  quoteToBase(evt) {
    const quote_value = parseFloat(evt.target.value);
    if (quote_value !== 0 && evt.target.value.length > quote_value.toString().length) {
      evt.target.value = quote_value;
    }
    if (quote_value && !isNaN(quote_value) && quote_value >= 0) {
      const base_value = quote_value / parseFloat(this.bid);
      this.baseValue = base_value.toString();
    }
    this.emit_change();
  }

  emit_change() {
    this.on_change.emit({baseValue: this.baseValue, quoteValue: this.quoteValue})
  }
}
