export class SolcitudSala{
    constructor(
        public _id:string,        
        public sala:string,
        public usuario:string,
        public fecha :string,
        public horaInicio :string,
        public horaFin :string,
        public descripcion :string,
        public cantidadPersonas :string,
        public estado :string,
        public recursos :{},
        public created_at: String,
        public updated_at: String
    ){}
}