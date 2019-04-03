import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';

export class EditableComponent implements OnChanges {
  @Input() entity: any;
  @Input() set field(entityField: string) {
    this.entityField = entityField;
    this.setOriginValue();
    console.log('in setter', this.entity[this.entityField]);
  }
  isActiveInput: boolean = false;
  @Input() className: string;
  @Input() style: any;
  @Output() entityUpdated = new EventEmitter();
  public entityField: string;
  public originEntityValue: any;
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    this.setOriginValue();
    this.isActiveInput = false;
    // console.log('in onchanges', this.entity[this.entityField]);
  }
  updateEntity() {
    const entityValue = this.entity[this.entityField];
    if (entityValue !== this.originEntityValue) {
      this.entityUpdated.emit({
        [this.entityField]: this.entity[this.entityField]
      });
      this.setOriginValue();
    }
    this.isActiveInput = false;
  }

  cancelUpdate() {
    this.isActiveInput = false;
    this.entity[this.entityField] = this.originEntityValue;
  }
  setOriginValue() {
    this.originEntityValue = this.entity[this.entityField];
  }
}
