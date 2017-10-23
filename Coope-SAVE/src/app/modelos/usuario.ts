export class Usuario{
    constructor(
        public _id:string,        
        public nombre:string,
        public apellidos:string,
        public correo :string,
        public contrasena :string,
        public rol :string,
        public departamento :String,
        public estado: String,
        public created_at: String,
        public updated_at: String
    ){}
}