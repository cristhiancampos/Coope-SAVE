export class SolicitudSala{
    constructor(
        public _id:string,        
        public sala:string,
        public usuario:string,
        public fecha:any,
        public horaInicio,
        public horaFin,
        public descripcion :string,
        public cantidadPersonas :string,
        public estado :string,
        public recursos :{},
        public created_at: String,
        public updated_at: String
    ){}
}