export class Sala{
    constructor(
        public _id:string,        
        public nombre:string,
        public cupo:string,
        public descripcion :string,
        public estado :string,
        public reporte :string,
        public horario,
        public created_at: String,
        public updated_at: String
    ){}
}