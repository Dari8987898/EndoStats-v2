import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, RouterLink } from "@angular/router";

import { DetailService } from "./detail.service";
import { ExcellConstants } from "../excell.service";
import { IGenericRow } from "../interfaces/generic-row.interface";
import { ToolbarComponent, ToolbarTabs } from "../toolbar/toolbar.component";
import { Subscription } from "rxjs";

@Component({
    selector: 'detail',
    standalone: true,
    imports: [
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule,
        RouterLink
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit, OnDestroy {
    private routeSub!: Subscription;
    private id: number = -1;

    protected firstDetailId: number;
    protected previousDetailId: number;
    protected nextDetailId: number;
    protected lastDetailId: number;

    protected disableFirst: boolean = true;
    protected disablePrevious: boolean = true;
    protected disableNext: boolean = true;
    protected disableLast: boolean = true;

    iconaTabella: string = "error";
    tooltipDex: string = "Errore";

    dataSource!: IGenericRow;

    constructor(
        private detailService: DetailService,
        private route: ActivatedRoute
    ) {
        ToolbarComponent.staticTabIndex = ToolbarTabs.UNSET;

        this.id = Number(this.route.snapshot.params['id']);

        this.firstDetailId = this.id;
        this.previousDetailId = this.id;
        this.nextDetailId = this.id;
        this.lastDetailId = this.id;
    }

    ngOnInit(): void {
        // Subscribe to route parameter changes
        this.routeSub = this.route.params.subscribe(params => {
            let paramId: number = Number(params['id']);

            if (this.id != paramId) {
                this.id = paramId;

                this.initFunc();
            }
        });

        this.initFunc();
    }

    ngOnDestroy(): void {
        if (this.routeSub) {
            // Unsubscribe to avoid memory leaks
            this.routeSub.unsubscribe();
        }
    }

    private initFunc(): void {
        this.dataSource = this.detailService.getDetail(this.id);

        if (this.dataSource != undefined) {
            let disc: number = -1;

            switch (this.dataSource.discriminante) {
                case "G":
                    this.iconaTabella = "groups_3";
                    this.tooltipDex = "Gruppi multidisciplinari";
                    disc = ExcellConstants.DISC_GMTABLE;
                    break;

                case "A":
                    this.iconaTabella = "local_hospital";
                    this.tooltipDex = "Ambulatorio";
                    disc = ExcellConstants.DISC_AMBULATORIO;
                    break;

                case "?":
                    this.iconaTabella = "live_help";
                    this.tooltipDex = "Da decidere";
                    disc = ExcellConstants.DISC_DADECIDERE;
                    break;

                default:
                    break;
            }

            if (disc != -1) {
                let navigationIds: number[] = this.detailService.getNavigationIds(this.id, disc);

                this.firstDetailId = navigationIds[0];
                this.previousDetailId = navigationIds[1];
                this.nextDetailId = navigationIds[2];
                this.lastDetailId = navigationIds[3];

                this.disableFirst = this.firstDetailId == this.id;
                this.disablePrevious = this.previousDetailId == this.id;
                this.disableNext = this.nextDetailId == this.id;
                this.disableLast = this.lastDetailId == this.id;
            }
        } else {
            this.dataSource = {} as IGenericRow;
        }
    }
}
