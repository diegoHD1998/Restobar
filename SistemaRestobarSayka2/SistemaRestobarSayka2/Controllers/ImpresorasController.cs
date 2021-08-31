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
    public class ImpresorasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ImpresorasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Impresoras
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Impresora>>> GetImpresoras()
        {
            return await _context.Impresoras.ToListAsync();
        }

        // GET: api/Impresoras/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Impresora>> GetImpresora(int id)
        {
            var impresora = await _context.Impresoras.FindAsync(id);

            if (impresora == null)
            {
                return NotFound();
            }

            return impresora;
        }

        // PUT: api/Impresoras/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutImpresora(int id, Impresora impresora)
        {
            if (id != impresora.IdImpresora)
            {
                return BadRequest();
            }

            _context.Entry(impresora).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImpresoraExists(id))
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

        // POST: api/Impresoras
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Impresora>> PostImpresora(Impresora impresora)
        {
            _context.Impresoras.Add(impresora);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetImpresora", new { id = impresora.IdImpresora }, impresora);
        }

        // DELETE: api/Impresoras/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteImpresora(int id)
        {
            var impresora = await _context.Impresoras.FindAsync(id);
            if (impresora == null)
            {
                return NotFound();
            }

            _context.Impresoras.Remove(impresora);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ImpresoraExists(int id)
        {
            return _context.Impresoras.Any(e => e.IdImpresora == id);
        }
    }
}
