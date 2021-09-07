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
    public class OpcionModificadoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OpcionModificadoresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/OpcionModificadores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OpcionModificador>>> GetOpcionModificadors()
        {
            return await _context.OpcionModificadors.ToListAsync();
        }

        // GET: api/OpcionModificadores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OpcionModificador>> GetOpcionModificador(int id)
        {
            var opcionModificador = await _context.OpcionModificadors.FindAsync(id);

            if (opcionModificador == null)
            {
                return NotFound();
            }

            return opcionModificador;
        }

        // PUT: api/OpcionModificadores/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOpcionModificador(int id, OpcionModificador opcionModificador)
        {
            if (id != opcionModificador.IdOpcionM)
            {
                return BadRequest();
            }

            _context.Entry(opcionModificador).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OpcionModificadorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/OpcionModificadores
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OpcionModificador>> PostOpcionModificador(OpcionModificador opcionModificador)
        {
            _context.OpcionModificadors.Add(opcionModificador);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOpcionModificador", new { id = opcionModificador.IdOpcionM }, opcionModificador);
        }

        // DELETE: api/OpcionModificadores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOpcionModificador(int id)
        {
            var opcionModificador = await _context.OpcionModificadors.FindAsync(id);
            if (opcionModificador == null)
            {
                return NotFound();
            }

            _context.OpcionModificadors.Remove(opcionModificador);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OpcionModificadorExists(int id)
        {
            return _context.OpcionModificadors.Any(e => e.IdOpcionM == id);
        }
    }
}