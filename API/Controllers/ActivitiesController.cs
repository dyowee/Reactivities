using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Mvc;
using MediatR;
using Application.Activities;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        readonly IMediator _mediator;

        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        [HttpGet]
        public Task<List<Activity>> List()
        {            
            return _mediator.Send(new List.Query());
        }

        [HttpGet("{id}")]
        public Task<Activity> Details(Guid id)
        {            
            return _mediator.Send(new Details.Query { Id = id });
        }

        [HttpPost]
        public Task<Unit> Create(Create.Command command)
        {
            return _mediator.Send(command);
        }

        [HttpPut("{id}")]
        public Task<Unit> Edit(Guid id, Edit.Command command)
        {
            command.Id = id;
            return _mediator.Send(command);
        }

        [HttpDelete("{id}")]
        public Task<Unit> Delete(Guid id)
        {            
            return _mediator.Send(new Delete.Command { Id = id });
        }
    }
}