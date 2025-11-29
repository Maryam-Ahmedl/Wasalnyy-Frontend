import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-box',
  imports: [],
  templateUrl: './message-box.html',
  styles: ``,
})
export class MessageBox {
  @Input() errorMessage:string|null=null;
  @Output() acknowledgeError=new EventEmitter();
  acknowledge(){
    this.acknowledgeError.emit();
  }

}
