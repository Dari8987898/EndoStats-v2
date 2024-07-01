import { Injectable } from "@angular/core";

import { ExcellConstants } from "../excell.service";
import { IAmbulatorioTableRow } from "../interfaces/ambulatorio-table-row.interface";
import { IDaDecidereTableRow } from "../interfaces/da-decidere-table-row.interface";
import { IGenericRow } from "../interfaces/generic-row.interface";
import { IGmTableRow } from "../interfaces/gm-table-row.interface";
import { LocalStorageService } from "../local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class DetailService {
    constructor(private localStorageService: LocalStorageService) { }

    public getDetail(id: number): IGenericRow {
        return this.localStorageService.getDetailFromLocalStorage(id);
    }

    public getNavigationIds(id: number, disc: number): number[] {
        /*
          [0] => first
          [1] => previous
          [2] => next
          [3] => last
        */
        let resIds: number[] = [id, id, id, id];

        switch (disc) {
            case ExcellConstants.DISC_AMBULATORIO: // Ambulatorio
                {
                    let ambulatorioTableData: IAmbulatorioTableRow[] = this.localStorageService.getAmbulatorioTableDataFromLocalStorage();

                    let currentIndex: number = ambulatorioTableData.findIndex((row: IAmbulatorioTableRow, index: number) => {
                        return row.row_number == id;
                    });

                    if (currentIndex != -1) {
                        resIds[0] = ambulatorioTableData[0].row_number;
                        resIds[1] = currentIndex == 0 ? id : ambulatorioTableData[currentIndex - 1].row_number;
                        resIds[2] = currentIndex == ambulatorioTableData.length - 1 ? id : ambulatorioTableData[currentIndex + 1].row_number;
                        resIds[3] = ambulatorioTableData[ambulatorioTableData.length - 1].row_number;
                    }

                    break;
                }

            case ExcellConstants.DISC_DADECIDERE: // Da decidere
                {
                    let daDecidereTableData: IDaDecidereTableRow[] = this.localStorageService.getDaDecidereTableDataFromLocalStorage();

                    let currentIndex: number = daDecidereTableData.findIndex((row: IDaDecidereTableRow, index: number) => {
                        return row.row_number == id;
                    });

                    if (currentIndex != -1) {
                        resIds[0] = daDecidereTableData[0].row_number;
                        resIds[1] = currentIndex == 0 ? id : daDecidereTableData[currentIndex - 1].row_number;
                        resIds[2] = currentIndex == daDecidereTableData.length - 1 ? id : daDecidereTableData[currentIndex + 1].row_number;
                        resIds[3] = daDecidereTableData[daDecidereTableData.length - 1].row_number;
                    }

                    break;
                }

            case ExcellConstants.DISC_GMTABLE: // Gruppi multidisciplinari
                {
                    let gmTableData: IGmTableRow[] = this.localStorageService.getGmTableDataFromLocalStorage();

                    let currentIndex: number = gmTableData.findIndex((row: IDaDecidereTableRow, index: number) => {
                        return row.row_number == id;
                    });

                    if (currentIndex != -1) {
                        resIds[0] = gmTableData[0].row_number;
                        resIds[1] = currentIndex == 0 ? id : gmTableData[currentIndex - 1].row_number;
                        resIds[2] = currentIndex == gmTableData.length - 1 ? id : gmTableData[currentIndex + 1].row_number;
                        resIds[3] = gmTableData[gmTableData.length - 1].row_number;
                    }

                    break;
                }

            default:
                break;
        }

        return resIds;
    }
}