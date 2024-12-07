import { Injectable } from '@angular/core';
import { read, utils } from 'xlsx';

import { IAmbulatorioTableRow } from './interfaces/ambulatorio-table-row.interface';
import { IDaDecidereTableRow } from './interfaces/da-decidere-table-row.interface';
import { IGenericTableRow } from './interfaces/generic-table-row.interface';
import { IGmTableRow } from './interfaces/gm-table-row.interface';
import { IGenericRow } from './interfaces/generic-row.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExcellService {
  constructor(private localStorageService: LocalStorageService) { }

  // PUBLIC METHODS
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

      let allRowsData: IGenericRow[] = [];
      let gmTableData: IGenericTableRow[] = [];
      let ambulatorioTableData: IAmbulatorioTableRow[] = [];
      let daDecidereTableData: IDaDecidereTableRow[] = [];

      let currentRiga: IGenericRow;

      for (let row of data) {
        if (row[0] == undefined)
          break;

        currentRiga = this.toGenericRowInterface(row, rowNumber++);
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
            break;
        }
      }

      this.localStorageService.setAllData(allRowsData, gmTableData, ambulatorioTableData, daDecidereTableData, new Date().toLocaleDateString());
    }
  }

  // PRIVATE METHODS
  private toAmbulatorioTableIterface(riga: IGenericRow): IAmbulatorioTableRow {
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

  private toDaDecidereTableInterface(riga: IGenericRow): IDaDecidereTableRow {
    let model: IDaDecidereTableRow = {
      row_number: riga.row_number,
      nome: riga.nome,
      cognome: riga.cognome,
      data_inserimento: riga.informazioni_cronologiche,
      diagnosi: riga.diagnosi
    }

    return model;
  }

  private toGmTableInterface(riga: IGenericRow): IGmTableRow {
    let model: IGmTableRow = {
      row_number: riga.row_number,
      nome: riga.nome,
      cognome: riga.cognome,
      data_inserimento: riga.informazioni_cronologiche,
      diagnosi: riga.diagnosi
    }

    return model;
  }

  private toGenericRowInterface(row: string[], rowNumber: number): IGenericRow {
    let genericRow: IGenericRow = {
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
      autorizzazione_trattamento_dati: row[38],
      note: row[39]
    }

    return genericRow;
  }
}

export enum ExcellConstants {
  DISC_GMTABLE = 1,
  DISC_DADECIDERE = 2,
  DISC_AMBULATORIO = 3
}
