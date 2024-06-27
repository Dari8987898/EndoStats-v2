import { Component, OnInit, inject } from "@angular/core";
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ActivatedRoute } from "@angular/router";

import { IRiga } from "../interfaces/riga.interface";
import { ExcellService } from "../excell.service";
import { ToolbarComponent } from "../toolbar/toolbar.component";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'detail',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatTooltipModule
    ],
    templateUrl: './detail.component.html',
    styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
    readonly id: number = -1;

    iconaTabella: string;
    tooltipDex: string;

    route: ActivatedRoute = inject(ActivatedRoute);
    dataSource!: IRiga;

    constructor(private excellService: ExcellService) {
        ToolbarComponent.staticTabIndex = -1;
        
        this.id = Number(this.route.snapshot.params['id']);

        this.iconaTabella = "error";
        this.tooltipDex = "Errore";

        if (this.id < 0)
            console.log("[Detail constructor] Detail ID: " + this.id);
    }

    ngOnInit(): void {
        this.dataSource = this.excellService.getDetail(this.id);
        
        switch(this.dataSource.discriminante) {
            case "G":
                this.iconaTabella = "groups_3";
                this.tooltipDex = "Gruppi multidisciplinari";
                break;

            case "A":
                this.iconaTabella = "local_hospital";
                this.tooltipDex = "Ambulatorio";
                break;

            case "?":
                this.iconaTabella = "live_help";
                this.tooltipDex = "Da decidere";
                break;

            default:
                break;
        }
    }
}
