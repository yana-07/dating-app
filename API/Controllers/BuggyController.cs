using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController(DataContext context) : BaseApiController
    {

        [HttpGet("bad-request")]
        public IActionResult Get400Error() 
        {
            return BadRequest("Something bad has happened!");
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetAuth()
        {
            return "secret";
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> Get404Error()
        {
            var user = context.Users.Find(-1);

            if (user == null) return NotFound("Couldn't find what you are looking for!");
            
            return user;
        }

        [HttpGet("server-error")]
        public ActionResult<AppUser> GetServerError()
        {
            var user = context.Users.Find(-1) ?? throw new Exception("A bad thing has happened!");

            return user;
        }
    }
}
