import { Component, OnInit, inject } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute, Router } from "@angular/router";

import { IRiga } from "../interfaces/riga.interface";
import { ExcellService } from "../excell.service";
import { ToolbarComponent } from "../toolbar/toolbar.component";

@Component({
    selector: 'detail',
    standalone: true,
    imports: [
        MatButtonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
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

    route: ActivatedRoute = inject(ActivatedRoute);
    dataSource!: IRiga;

    constructor(
        private excellService: ExcellService,
        private router: Router
    ) {
        ToolbarComponent.staticTabIndex = -1;
        
        this.id = Number(this.route.snapshot.params['id']);

        this.firstDetailId = this.id;
        this.previousDetailId = this.id;
        this.nextDetailId = this.id;
        this.lastDetailId = this.id;
    }

    ngOnInit(): void {
        // Subscribe to route parameter changes
        this.route.params.subscribe(params => {
            let paramId: number = +params['id'];

            if (this.id != paramId) {
                this.id = paramId;
                
                window.location.reload();
                //this.router.navigate(['/detail', this.id]);
            }
        });

        this.dataSource = this.excellService.getDetail(this.id);
        
        let disc: number = -1;

        switch(this.dataSource.discriminante) {
            case "G":
                this.iconaTabella = "groups_3";
                this.tooltipDex = "Gruppi multidisciplinari";
                disc = ExcellService.DISC_GMTABLE;
                break;

            case "A":
                this.iconaTabella = "local_hospital";
                this.tooltipDex = "Ambulatorio";
                disc = ExcellService.DISC_AMBULATORIO;
                break;

            case "?":
                this.iconaTabella = "live_help";
                this.tooltipDex = "Da decidere";
                disc = ExcellService.DISC_DADECIDERE;
                break;

            default:
                break;
        }

        if (disc != -1) {
            let navigationIds: number[] = [4];

            navigationIds = this.excellService.getNavigationIds(this.id, disc);

            this.firstDetailId = navigationIds[0];
            this.previousDetailId = navigationIds[1];
            this.nextDetailId = navigationIds[2];
            this.lastDetailId = navigationIds[3];

            this.disableFirst = this.firstDetailId == this.id;
            this.disablePrevious = this.previousDetailId == this.id;
            this.disableNext = this.nextDetailId == this.id;
            this.disableLast = this.lastDetailId == this.id;
        }
    }

    navigateFirstDetail(): void {
        this.router.navigate(['/detail/', this.firstDetailId]);
    }
    navigatePreviousDetail(): void {
        this.router.navigate(['/detail/', this.previousDetailId]);
    }

    navigateNextDetail(): void {
        this.router.navigate(['/detail/', this.nextDetailId]);
    }

    navigateLastDetail(): void {
        this.router.navigate(['/detail/', this.lastDetailId]);
    }
}
