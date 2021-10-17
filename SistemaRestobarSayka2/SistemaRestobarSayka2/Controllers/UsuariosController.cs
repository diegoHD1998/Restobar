﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaRestobarSayka2.Data;
using SistemaRestobarSayka2.Models;

namespace SistemaRestobarSayka2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Usuarios
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuarios()
        {
            var usuarios = await _context.Usuarios.ToListAsync();
            return Ok(usuarios);
        }

        // GET: api/Usuarios/Admin
        [HttpGet("Admin")]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetAdminUsuarios()
        {
            var usuarios = await _context.Usuarios.Where(u => u.RolIdRol == 1).ToListAsync();
            return Ok(usuarios);
        }

        // GET: api/Usuarios/Mesero
        [HttpGet("Mesero")]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetMeseroUsuarios()
        {
            var usuarios = await _context.Usuarios.Where(u => u.RolIdRol == 2).ToListAsync();
            return Ok(usuarios);
        }

        // GET: api/Usuarios/Bartender
        [HttpGet("Bartender")]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetBartenderUsuarios()
        {
            var usuarios = await _context.Usuarios.Where(u => u.RolIdRol == 4).ToListAsync();
            return Ok(usuarios);
        }

        // GET: api/Usuarios/Cocinero
        [HttpGet("Cocinero")]
        public async Task<ActionResult<IEnumerable<Usuario>>> GetCocineroUsuarios()
        {
            var usuarios = await _context.Usuarios.Where(u => u.RolIdRol == 3).ToListAsync();
            return Ok(usuarios);
        }

        // GET: api/Usuarios/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Usuario>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);

            if (usuario == null)
            {
                return NotFound("Usuario No Encontrado");
            }

            return Ok(usuario);
        }

        // PUT: api/Usuarios/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUsuario(int id, Usuario usuario)
        {
            if (id != usuario.IdUsuario)
            {
                return BadRequest("Los Ids de Usuario No Coinciden");
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
                {
                    return NotFound("No se a Encontrado el Usuario a modificar");
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetUsuario", new { id = usuario.IdUsuario }, usuario);
        }

        // POST: api/Usuarios
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Usuario>> PostUsuario(Usuario usuario)
        {
            try
            {
                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();
            }
            catch
            {
                return BadRequest("El Usuario No fue Guardado");
            }

            return CreatedAtAction("GetUsuario", new { id = usuario.IdUsuario }, usuario);
        }

        // DELETE: api/Usuarios/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound("Usuario No Encontrado");
            }

            try
            {
                _context.Usuarios.Remove(usuario);
                await _context.SaveChangesAsync();

            }
            catch
            {
                return BadRequest("El Usuario No fue Eliminado");
            }

            return Ok(id);
        }

        private bool UsuarioExists(int id)
        {
            return _context.Usuarios.Any(e => e.IdUsuario == id);
        }
    }
}
