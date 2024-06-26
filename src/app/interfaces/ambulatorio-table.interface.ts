import { GenericTableColumns, IGenericTable } from "./generic-table.interface";

export interface IAmbulatorioTable extends IGenericTable {
    numero_telefono: string;
}

export const AmbulatorioTableColumns = GenericTableColumns.concat(['numero_telefono']);