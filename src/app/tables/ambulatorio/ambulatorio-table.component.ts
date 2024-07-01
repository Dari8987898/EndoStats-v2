import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { AmbulatorioTableColumns, IAmbulatorioTableRow } from '../../interfaces/ambulatorio-table-row.interface';
import { ExcellConstants } from '../../excell.service';
import { TableService } from '../table.service';
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
  route: ActivatedRoute = inject(ActivatedRoute);
  displayedColumns: string[] = AmbulatorioTableColumns.concat(['openDettaglio']);
  dataSource!: MatTableDataSource<IAmbulatorioTableRow>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private tableService: TableService) {
    ToolbarComponent.staticTabIndex = 2;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IAmbulatorioTableRow>(this.tableService.getTable(ExcellConstants.DISC_AMBULATORIO));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}