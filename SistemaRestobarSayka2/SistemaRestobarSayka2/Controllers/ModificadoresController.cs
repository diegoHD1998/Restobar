using System;
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
    public class ModificadoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ModificadoresController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Modificadores
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Modificador>>> GetModificadors()
        {
            return await _context.Modificadors.ToListAsync();
        }

        // GET: api/Modificadores/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Modificador>> GetModificador(int id)
        {
            var modificador = await _context.Modificadors.FindAsync(id);

            if (modificador == null)
            {
                return NotFound();
            }

            return modificador;
        }

        // PUT: api/Modificadores/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutModificador(int id, Modificador modificador)
        {
            if (id != modificador.IdModificador)
            {
                return BadRequest();
            }

            _context.Entry(modificador).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ModificadorExists(id))
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

        // POST: api/Modificadores
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Modificador>> PostModificador(Modificador modificador)
        {
            _context.Modificadors.Add(modificador);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetModificador", new { id = modificador.IdModificador }, modificador);
        }

        // DELETE: api/Modificadores/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteModificador(int id)
        {
            var modificador = await _context.Modificadors.FindAsync(id);
            if (modificador == null)
            {
                return NotFound();
            }

            _context.Modificadors.Remove(modificador);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ModificadorExists(int id)
        {
            return _context.Modificadors.Any(e => e.IdModificador == id);
        }
    }
}
