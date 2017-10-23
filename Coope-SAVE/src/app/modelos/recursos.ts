export class Recurso{
    constructor(
        public _id:string,        
        public nombre:string,
        public codigoActivo:string,
        public descripcion :string,
        public estado :string,
        public reporte: string,
        public created_at: String,
        public updated_at: String
    ){}
}