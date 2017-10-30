export class Vehiculo{
    constructor(
        public _id:string,        
        public tipo:string,
        public marca:string,
        public placa :string,
        public descripcion :string,
        public kilometraje :string,
        public estado :string,
        public reporte :string,
        public horario,
       public created_at: String,
        public updated_at: String
    ){}
}