import { Injectable } from "@angular/core";

import { ExcellConstants } from "../excell.service";
import { LocalStorageService } from "../local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class TableService {
    constructor(private localStorageService: LocalStorageService) { }

    public getTable(table_disc: ExcellConstants): any[] {
        switch (table_disc) {
            case ExcellConstants.DISC_GMTABLE:
                return this.localStorageService.getGmTableDataFromLocalStorage();

            case ExcellConstants.DISC_DADECIDERE:
                return this.localStorageService.getDaDecidereTableDataFromLocalStorage();

            case ExcellConstants.DISC_AMBULATORIO:
                return this.localStorageService.getAmbulatorioTableDataFromLocalStorage();

            default:
                return [];
        }
    }
}