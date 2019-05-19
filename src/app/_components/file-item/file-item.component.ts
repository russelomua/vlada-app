import { Component, OnInit, Input } from '@angular/core';
import { FileModel } from 'src/app/_models';

@Component({
  selector: 'app-file-item',
  templateUrl: './file-item.component.html',
  styleUrls: ['./file-item.component.scss'],
})
export class FileItemComponent implements OnInit {
  @Input() file: FileModel;

  constructor() { }

  ngOnInit() {
  }

}
