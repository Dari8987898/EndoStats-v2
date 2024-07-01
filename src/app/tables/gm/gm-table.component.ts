import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { GmTableColumns, IGmTableRow } from '../../interfaces/gm-table-row.interface';
import { ExcellConstants } from '../../excell.service';
import { TableService } from '../table.service';
import { ToolbarComponent } from '../../toolbar/toolbar.component';

@Component({
  selector: 'gm-table',
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
  templateUrl: './gm-table.component.html',
  styleUrl: './gm-table.component.scss'
})
export class GmTableComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  displayedColumns: string[] = GmTableColumns.concat(['openDettaglio']);
  dataSource!: MatTableDataSource<IGmTableRow>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private tableService: TableService) {
    ToolbarComponent.staticTabIndex = 1;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IGmTableRow>(this.tableService.getTable(ExcellConstants.DISC_GMTABLE));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}