import packageJson from '../../../package.json';

import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterOutlet } from '@angular/router';

import { ExcellService } from '../excell.service';
import { LocalStorageService } from '../local-storage.service';

export enum ToolbarTabs {
  UNSET = -1,
  HOME = 0,
  GMTABLE = 1,
  AMBULATORIO = 2,
  DADECIDERE = 3
}

@Component({
  selector: 'toolbar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  public static staticTabIndex: number = ToolbarTabs.HOME;

  public appVersion: string = packageJson.version;

  file: Blob;
  dataUltimoCaricamento: string | null;

  constructor(
    private excellService: ExcellService,
    private localStorageService: LocalStorageService
  ) {
    this.file = new Blob();

    this.dataUltimoCaricamento = this.localStorageService.getDataUltimoCaricamento();
  }

  get staticTabIndex(): number {
    return ToolbarComponent.staticTabIndex;
  }

  fileChanged(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();

    fileReader.onload = () => {
      this.excellService.uploadData(fileReader.result);
    }

    fileReader.readAsArrayBuffer(this.file)

    window.location.reload();
  }

  onTabClick(index: number): void {
    ToolbarComponent.staticTabIndex = index;
  }
}