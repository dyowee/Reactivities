using MediatR;
using Domain;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using Persistence;
using Microsoft.EntityFrameworkCore;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>>
        {
        }

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {       
                return _context.Activities.ToListAsync();     
            }
        }
    }
}