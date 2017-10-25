export class SolicitudSala{
    constructor(
        public _id:string,        
        public sala:string,
        public usuario:string,
        public fecha :Date,
        public horaInicio :Date,
        public horaFin :Date,
        public descripcion :string,
        public cantidadPersonas :string,
        public estado :string,
        public recursos :{},
        public created_at: String,
        public updated_at: String
    ){}
}