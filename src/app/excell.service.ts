import { Injectable } from '@angular/core';
import { read, utils } from 'xlsx';

import { IAmbulatorioTableRow } from './interfaces/ambulatorio-table-row.interface';
import { IDaDecidereTableRow } from './interfaces/da-decidere-table-row.interface';
import { IGenericTableRow } from './interfaces/generic-table-row.interface';
import { IGmTableRow } from './interfaces/gm-table-row.interface';
import { IRiga } from './interfaces/riga.interface';

@Injectable({
  providedIn: 'root'
})
export class ExcellService {
  public static readonly DISC_GMTABLE: number = 1;
  public static readonly DISC_DADECIDERE: number = 2;
  public static readonly DISC_AMBULATORIO: number = 3;

  static readonly LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA: string = "allRowsData";
  static readonly LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA: string = "ambulatorioTableData";
  static readonly LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA: string = "daDecidereTableData";
  static readonly LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA: string = "gmTableData";

  constructor() { }

  // PUBLIC METHODS
  public getTable(id: number): any {
    switch (id) {
      case ExcellService.DISC_GMTABLE:
        return this.getGmTableDataFromLocalStorage();

      case ExcellService.DISC_DADECIDERE:
        return this.getDaDecidereTableDataFromLocalStorage();

      case ExcellService.DISC_AMBULATORIO:
        return this.getAmbulatorioTableDataFromLocalStorage();

      default:
        return [];
    }
  }

  public getDetail(id: number): IRiga {
    let detailData: IRiga = {} as IRiga;

    if (localStorage.getItem(ExcellService.LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA) != null) {
      let allRowsData: IRiga[] = JSON.parse(localStorage.getItem(ExcellService.LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA)!);

      //allRowsData[0] contains rowNumber 1, so id==1 is the first row with data (and consequently the first element of the array)
      detailData = allRowsData[id - 1];
    }

    return detailData;
  }

  public uploadData(inputFile: string | ArrayBuffer | null): void {
    if (inputFile != null) {
      // parse workbook
      const workBook = read(inputFile, { cellDates: true, dateNF: 'dd/MM/yyyy' });

      // get the first worksheet
      const workSheet = workBook.Sheets[workBook.SheetNames[0]];

      // generate objects
      const data = utils.sheet_to_json<string[]>(workSheet, { header: 1, raw: false });

      // the first row is jumped because it's the headers' row
      data.shift();

      let rowNumber: number = 1;

      let allRowsData: IRiga[] = [];
      let gmTableData: IGenericTableRow[] = [];
      let ambulatorioTableData: IAmbulatorioTableRow[] = [];
      let daDecidereTableData: IDaDecidereTableRow[] = [];

      let currentRiga: IRiga;

      for (let row of data) {
        if (row[0] == undefined) break;

        currentRiga = this.toRigaInterface(row, rowNumber++);
        allRowsData.push(currentRiga);

        switch (currentRiga.discriminante) {
          case "G":
            gmTableData.push(this.toGmTableInterface(currentRiga));
            break;

          case "A":
            ambulatorioTableData.push(this.toAmbulatorioTableIterface(currentRiga));
            break;

          case "?":
            daDecidereTableData.push(this.toDaDecidereTableInterface(currentRiga));
            break;

          default:
            console.log("[Excell service] Discriminante non riconosciuto: " + row[0]);
            break;
        }
      }

      localStorage.setItem(ExcellService.LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA, JSON.stringify(allRowsData));

      localStorage.setItem(ExcellService.LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA, JSON.stringify(gmTableData));
      localStorage.setItem(ExcellService.LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA, JSON.stringify(ambulatorioTableData));
      localStorage.setItem(ExcellService.LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA, JSON.stringify(daDecidereTableData));

      localStorage.setItem("DataUltimoCaricamento", new Date().toLocaleDateString());
    }
  }

  public getNavigationIds(id: number, disc: number): number[] {
    /*
      [0] => first
      [1] => previous
      [2] => next
      [3] => last
    */
    let resIds: number[] = [4];

    switch (disc) {
      case ExcellService.DISC_AMBULATORIO: // Ambulatorio
      {
        let ambulatorioTableData: IAmbulatorioTableRow[] = this.getAmbulatorioTableDataFromLocalStorage();

        let currentIndex: number = ambulatorioTableData.findIndex((row: IAmbulatorioTableRow, index: number) => {
          if (row.row_number == id)
            return true;
          else
            return false;
        });
        
        if (currentIndex != -1) {
          resIds[0] = ambulatorioTableData[0].row_number;
          resIds[1] = currentIndex == 0 ? id : ambulatorioTableData[currentIndex - 1].row_number;
          resIds[2] = currentIndex == ambulatorioTableData.length - 1 ? id : ambulatorioTableData[currentIndex + 1].row_number;
          resIds[3] = ambulatorioTableData[ambulatorioTableData.length - 1].row_number;
        } else 
          resIds = [id, id, id, id];

        break;
      }

      case ExcellService.DISC_DADECIDERE: // Da decidere
      {
        let daDecidereTableData: IDaDecidereTableRow[] = this.getDaDecidereTableDataFromLocalStorage();

        let currentIndex: number = daDecidereTableData.findIndex((row: IDaDecidereTableRow, index: number) => {
          if (row.row_number == id)
            return true;
          else
            return false;
        });
        
        if (currentIndex != -1) {
          resIds[0] = daDecidereTableData[0].row_number;
          resIds[1] = currentIndex == 0 ? id : daDecidereTableData[currentIndex - 1].row_number;
          resIds[2] = currentIndex == daDecidereTableData.length - 1 ? id : daDecidereTableData[currentIndex + 1].row_number;
          resIds[3] = daDecidereTableData[daDecidereTableData.length - 1].row_number;
        } else 
          resIds = [id, id, id, id];

        break;
      }

      case ExcellService.DISC_GMTABLE: // Gruppi multidisciplinari
      {
        let gmTableData: IGmTableRow[] = this.getGmTableDataFromLocalStorage();

        let currentIndex: number = gmTableData.findIndex((row: IDaDecidereTableRow, index: number) => {
          if (row.row_number == id)
            return true;
          else
            return false;
        });
        
        if (currentIndex != -1) {
          resIds[0] = gmTableData[0].row_number;
          resIds[1] = currentIndex == 0 ? id : gmTableData[currentIndex - 1].row_number;
          resIds[2] = currentIndex == gmTableData.length - 1 ? id : gmTableData[currentIndex + 1].row_number;
          resIds[3] = gmTableData[gmTableData.length - 1].row_number;
        } else 
          resIds = [id, id, id, id];

        break;
      }

      default:
        resIds = [id, id, id, id]
        return resIds;
    }

    return resIds;
  }

  // PRIVATE METHODS
  private getAmbulatorioTableDataFromLocalStorage(): IAmbulatorioTableRow[] {
    if (localStorage.getItem(ExcellService.LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA) != null) {
      let gmTableData: IAmbulatorioTableRow[] = JSON.parse(localStorage.getItem(ExcellService.LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA)!);

      return gmTableData;
    }

    return [];
  }

  private getDaDecidereTableDataFromLocalStorage(): IDaDecidereTableRow[] {
    if (localStorage.getItem(ExcellService.LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA) != null) {
      let gmTableData: IDaDecidereTableRow[] = JSON.parse(localStorage.getItem(ExcellService.LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA)!);

      return gmTableData;
    }

    return [];
  }

  private getGmTableDataFromLocalStorage(): IGmTableRow[] {
    if (localStorage.getItem(ExcellService.LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA) != null) {
      let gmTableData: IGmTableRow[] = JSON.parse(localStorage.getItem(ExcellService.LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA)!);

      return gmTableData;
    }

    return [];
  }

  private toAmbulatorioTableIterface(riga: IRiga): IAmbulatorioTableRow {
    let model: IAmbulatorioTableRow = {
      row_number: riga.row_number,
      nome: riga.nome,
      cognome: riga.cognome,
      data_inserimento: riga.informazioni_cronologiche,
      diagnosi: riga.diagnosi,
      numero_telefono: riga.numero_telefono
    }

    return model;
  }

  private toDaDecidereTableInterface(riga: IRiga): IDaDecidereTableRow {
    let model: IDaDecidereTableRow = {
      row_number: riga.row_number,
      nome: riga.nome,
      cognome: riga.cognome,
      data_inserimento: riga.informazioni_cronologiche,
      diagnosi: riga.diagnosi
    }

    return model;
  }

  private toGmTableInterface(riga: IRiga): IGmTableRow {
    let model: IGmTableRow = {
      row_number: riga.row_number,
      nome: riga.nome,
      cognome: riga.cognome,
      data_inserimento: riga.informazioni_cronologiche,
      diagnosi: riga.diagnosi
    }

    return model;
  }

  private toRigaInterface(row: string[], rowNumber: number): IRiga {
    let riga: IRiga = {
      row_number: rowNumber,
      discriminante: row[0],
      informazioni_cronologiche: row[1],
      email: row[2],
      nome: row[3],
      cognome: row[4],
      luogo_nascita: row[5],
      data_nascita: row[6],
      numero_telefono: row[7],
      residenza: row[8],
      sei_occupata: row[9],
      che_lavoro_svolgi: row[10],
      quanti_anni_hai: row[11],
      diagnosi: row[12],
      dolore_mestruale: row[13],
      quanto_disturbante: row[14],
      da_quanto_tempo: row[15],
      riesci_a_gestire_dolore: row[16],
      come_gestisci_dolore: row[17],
      qualcuno_su_cui_contare: row[18],
      operata_per_endometriosi: row[19],
      qta_dolore_pelvico_cronico: row[20],
      qta_dolore_durante_rapporti: row[21],
      qta_dolori_intestinali: row[22],
      qta_dolori_schiena_lombari: row[23],
      qta_stanchezza_cronica: row[24],
      qta_cistiti_ricorrenti: row[25],
      qta_coliche: row[26],
      qta_cefalea: row[27],
      qta_gonfiore_addominale: row[28],
      qta_influire_sintomi_qualita_vita: row[29],
      assente_lavoro_scuola: row[30],
      interrompere_sport: row[31],
      rapporti_penetrativi: row[32],
      gia_paziente_endocare: row[33],
      se_si_chi_endocare: row[34],
      quali_specialisti_consultati: row[35],
      come_hai_conosciuto_endocare: row[36],
      perche_paziente_endocare: row[37],
      autorizzazione_trattamento_dati: row[38]
    }

    return riga;
  }
}