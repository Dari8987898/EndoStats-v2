import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { DaDecidereTableColumns, IDaDecidereTableRow } from '../../interfaces/da-decidere-table-row.interface';
import { ExcellService } from '../../excell.service';
import { ToolbarComponent } from '../../toolbar/toolbar.component';

@Component({
  selector: 'da-decidere-table',
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
  templateUrl: './da-decidere-table.component.html',
  styleUrl: './da-decidere-table.component.scss'
})
export class DaDecidereTableComponent implements OnInit {
  route: ActivatedRoute = inject(ActivatedRoute);
  displayedColumns: string[] = DaDecidereTableColumns.concat(['openDettaglio']);
  dataSource!: MatTableDataSource<IDaDecidereTableRow>;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private excellService: ExcellService) {
    ToolbarComponent.staticTabIndex = 3;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<IDaDecidereTableRow>(this.excellService.getTable(ExcellService.DISC_DADECIDERE));
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}