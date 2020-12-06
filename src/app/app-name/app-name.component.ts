import { Component,ChangeDetectionStrategy,OnInit, Input, Output, EventEmitter, ElementRef, Renderer2 } from '@angular/core';
import { Testeditems } from './item';


@Component({
  selector: 'app-app-name',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app-name.component.html',
  styleUrls: ['./app-name.component.css']
})
export class AppNameComponent implements OnInit {
  @Input() task: Testeditems;
  @Output() toshow = new EventEmitter<Testeditems>();
  constructor(
    private el: ElementRef,
    private renderer: Renderer2) {

     }

  ngOnInit(): void {
  }
  public open(): void {
    const url = `${this.task.linkstackblitz}`;
    const w = screen.width * 0.9;
    const h = screen.height * 0.8;
    const left = (screen.width / 2) - (w / 2);
    const top = (screen.height / 2) - (h / 2);
    const randomnumber = Math.floor((Math.random() * 100) + 1);
    // tslint:disable-next-line:max-line-length
    window.open(url, '_blank', 'PopUp' + randomnumber + ',scrollbars=1,menubar=0,resizable=1,width = ' + w + ', height = ' + h + ', top = ' + top + ', left = ' + left);
  }

  changeselected(mytask){
    const part = this.el.nativeElement.querySelector('.item');
    this.renderer.setStyle(part, 'background-color', 'lightblue');
    this.toshow.emit(mytask);
  }

}
