import { Injectable } from '@angular/core';
import { read, utils } from 'xlsx';

import { IAmbulatorioTable } from './interfaces/ambulatorio-table.interface';
import { IDaDecidereTable } from './interfaces/da-decidere-table.interface';
import { IGenericTable } from './interfaces/generic-table.interface';
import { IGmTable } from './interfaces/gm-table.interface';
import { IRiga } from './interfaces/riga.interface';

@Injectable({
  providedIn: 'root'
})
export class ExcellService {
  readonly LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA: string = "allRowsData";
  readonly LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA: string = "ambulatorioTableData";
  readonly LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA: string = "daDecidereTableData";
  readonly LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA: string = "gmTableData";

  dati: IGenericTable[] = [];
  
  constructor() {}

  public getTable(id: number): any {
    return this.getTableData(id);
  }

  public getDetail(id: number): any {
    if(id < 0) 
      console.log("[Excell service] Detail ID: " + id);
    else if(localStorage.getItem(this.LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA) != null) {
      let allRowsData: IRiga[] = JSON.parse(localStorage.getItem(this.LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA)!);

      //allRowsData[0] contains rowNumber 1, so id==1 is the first row with data (and consequently the first element of the array)
      let detailData: IRiga = allRowsData[id-1];

      return detailData;
    }

    return [];
  }

  public uploadData(inputFile: string | ArrayBuffer | null): void {
    if(inputFile != null) {
      // parse workbook
      const workBook = read(inputFile, {cellDates: true, dateNF: 'dd/MM/yyyy'});
      
      // get the first worksheet
      const workSheet = workBook.Sheets[workBook.SheetNames[0]];
      
      // generate objects
      const data = utils.sheet_to_json<string[]>(workSheet, {header: 1, raw: false});
      
      // the first row is jumped because it's the headers' row
      data.shift();

      let rowNumber: number = 1;

      let allRowsData: IRiga[] = [];
      let gmTableData: IGenericTable[] = [];
      let ambulatorioTableData: IAmbulatorioTable[] = [];
      let daDecidereTableData: IDaDecidereTable[] = [];

      let currentRiga: IRiga;

      for (let row of data) {
        if(row[0] == undefined) break;

        currentRiga = this.toRigaInterface(row, rowNumber++);
        allRowsData.push(currentRiga);

        switch(currentRiga.discriminante) {
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

      localStorage.setItem(this.LOCALSTORAGE_ITEM_NAME_ALLROWS_TABLE_DATA, JSON.stringify(allRowsData));

      localStorage.setItem(this.LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA, JSON.stringify(gmTableData));
      localStorage.setItem(this.LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA, JSON.stringify(ambulatorioTableData));
      localStorage.setItem(this.LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA, JSON.stringify(daDecidereTableData));
      
      localStorage.setItem("DataUltimoCaricamento", new Date().toLocaleDateString());
    } else {
      console.log("[Excell service] File vuoto");
    }
  }

  private getAmbulatorioTableDataFromLocalStorage(): IAmbulatorioTable[] {
    if(localStorage.getItem(this.LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA) != null) {
      let gmTableData: IAmbulatorioTable[] = JSON.parse(localStorage.getItem(this.LOCALSTORAGE_ITEM_NAME_AMBULATORIO_TABLE_DATA)!);

      return gmTableData;
    }

    return [];
  }

  private getDaDecidereTableDataFromLocalStorage(): IDaDecidereTable[] {
    if(localStorage.getItem(this.LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA) != null) {
      let gmTableData: IDaDecidereTable[] = JSON.parse(localStorage.getItem(this.LOCALSTORAGE_ITEM_NAME_DA_DECIDERE_TABLE_DATA)!);

      return gmTableData;
    }

    return [];
  }

  private getGmTableDataFromLocalStorage(): IGmTable[] {
    if(localStorage.getItem(this.LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA) != null) {
      let gmTableData: IGmTable[] = JSON.parse(localStorage.getItem(this.LOCALSTORAGE_ITEM_NAME_GM_TABLE_DATA)!);

      return gmTableData;
    }

    return [];
  }

  private toAmbulatorioTableIterface(riga: IRiga): IAmbulatorioTable {
    let model: IAmbulatorioTable = {
      row_number: riga.row_number,
      nome: riga.nome,
      cognome: riga.cognome,
      data_inserimento: riga.informazioni_cronologiche,
      diagnosi: riga.diagnosi,
      numero_telefono: riga.numero_telefono
    }

    return model;
  }

  private toDaDecidereTableInterface(riga: IRiga): IDaDecidereTable {
    let model: IDaDecidereTable = {
      row_number: riga.row_number,
      nome: riga.nome,
      cognome: riga.cognome,
      data_inserimento: riga.informazioni_cronologiche,
      diagnosi: riga.diagnosi
    }

    return model;
  }

  private toGmTableInterface(riga: IRiga): IGmTable {
    let model: IGmTable = {
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

  private getTableData(id: number): any {
    switch(id) {
      case 1: 
        return this.getGmTableDataFromLocalStorage();

      case 2:
        return this.getDaDecidereTableDataFromLocalStorage();

      case 3:
        return this.getAmbulatorioTableDataFromLocalStorage();

      default:
        return [];
    }
  }
}