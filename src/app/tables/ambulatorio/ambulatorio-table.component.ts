import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AmbulatorioTableColumns, IAmbulatorioTable } from '../../interfaces/ambulatorio-table.interface';
import { ExcellService } from '../../excell.service';
import { ToolbarComponent } from '../../toolbar/toolbar.component';

@Component({
  selector: 'ambulatorio-table',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './ambulatorio-table.component.html',
  styleUrl: './ambulatorio-table.component.scss'
})
export class AmbulatorioTableComponent implements OnInit {
  readonly idTabella: number = 3;

  route: ActivatedRoute = inject(ActivatedRoute);
  displayedColumns: string[] = AmbulatorioTableColumns.concat(['openDettaglio']);
  dataSource!: MatTableDataSource<IAmbulatorioTable>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private excellService: ExcellService) {
    ToolbarComponent.staticTabIndex = 2;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IAmbulatorioTable>(this.excellService.getTable(this.idTabella));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}