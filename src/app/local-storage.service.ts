import { Injectable } from "@angular/core";
import { IGenericRow } from "./interfaces/generic-row.interface";
import { IAmbulatorioTableRow } from "./interfaces/ambulatorio-table-row.interface";
import { IDaDecidereTableRow } from "./interfaces/da-decidere-table-row.interface";
import { IGmTableRow } from "./interfaces/gm-table-row.interface";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    constructor() { }

    public setItem(name: string, jsonData: string): void {
        localStorage.setItem(name, jsonData);
    }

    public setAllData(
        allRowsData: IGenericRow[],
        gmTableData: IGmTableRow[],
        ambulatorioTableData: IAmbulatorioTableRow[],
        daDecidereTableData: IDaDecidereTableRow[],
        date: string
    ): void {
        this.setItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA, JSON.stringify(allRowsData));

        this.setItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA, JSON.stringify(gmTableData));
        this.setItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA, JSON.stringify(ambulatorioTableData));
        this.setItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA, JSON.stringify(daDecidereTableData));

        this.setItem("DataUltimoCaricamento", date);
    }

    public getDetailFromLocalStorage(id: number): any {
        let detailData: IGenericRow = {} as IGenericRow;

        if (localStorage.getItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA) != null) {
            let allRowsData: IGenericRow[] = JSON.parse(localStorage.getItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA)!);

            //allRowsData[0] contains rowNumber 1, so id==1 is the first row with data (and consequently the first element of the array)
            detailData = allRowsData[id - 1];
        }

        return detailData;
    }

    public getAmbulatorioTableDataFromLocalStorage(): IAmbulatorioTableRow[] {
        let ambulatorioTableData: IAmbulatorioTableRow[] = [];

        if (localStorage.getItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA) != null) {
            ambulatorioTableData = JSON.parse(localStorage.getItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA)!);
        }

        return ambulatorioTableData;
    }

    public getDaDecidereTableDataFromLocalStorage(): IDaDecidereTableRow[] {
        let daDecidereTableData: IDaDecidereTableRow[] = [];

        if (localStorage.getItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA) != null) {
            daDecidereTableData = JSON.parse(localStorage.getItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA)!);
        }

        return daDecidereTableData;
    }

    public getGmTableDataFromLocalStorage(): IGmTableRow[] {
        let gmTableData: IGmTableRow[] = [];

        if (localStorage.getItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA) != null) {
            gmTableData = JSON.parse(localStorage.getItem(LocalStorageServiceConstants.LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA)!);
        }

        return gmTableData;
    }
}

export enum LocalStorageServiceConstants {
    LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA = "allRowsData",
    LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA = "ambulatorioTableData",
    LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA = "daDecidereTableData",
    LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA = "gmTableData"
}