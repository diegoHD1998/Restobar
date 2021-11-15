using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SistemaRestobarSayka2.Dtos
{
    public class UsuarioDto
    {
        public string UserName { get; set; }

        public string Nombre { get; set; }

        public string Apellido { get; set; }

        public int Rol { get; set; }

        public string Token { get; set; }
    }
}
