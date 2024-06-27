import { GenericTableColumns, IGenericTableRow } from "./generic-table-row.interface";

export interface IAmbulatorioTableRow extends IGenericTableRow {
    numero_telefono: string;
}

export const AmbulatorioTableColumns = GenericTableColumns.concat(['numero_telefono']);