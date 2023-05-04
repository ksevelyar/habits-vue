import { rest } from 'msw'

export default [
  rest.get('http://localhost:5000/reports', (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        'data': [
          {
            'date': '2022-08-25',
            'fiber_meals': 5,
            'id': 1567,
            'kettlebell_sets': null,
            'protein_meals': 3,
            'pullups': null,
            'sleep': 7,
            'stepper': null,
            'steps': 4900,
            'updated_at': '2022-08-25T13:53:45',
            'weight': null
          },
          {
            'date': '2022-08-24',
            'fiber_meals': 5,
            'id': 1550,
            'kettlebell_sets': null,
            'protein_meals': 2,
            'pullups': null,
            'sleep': 9,
            'stepper': null,
            'steps': 10500,
            'updated_at': '2022-08-24T21:16:17',
            'weight': '75.7'
          },
          {
            'date': '2022-08-23',
            'fiber_meals': 5,
            'id': 1541,
            'kettlebell_sets': null,
            'protein_meals': 3,
            'pullups': null,
            'sleep': 10,
            'stepper': null,
            'steps': 8000,
            'updated_at': '2022-08-23T18:06:27',
            'weight': '75.1'
          },
          {
            'date': '2022-08-22',
            'fiber_meals': 5,
            'id': 1512,
            'kettlebell_sets': 4,
            'protein_meals': 3,
            'pullups': 21,
            'sleep': 9,
            'stepper': null,
            'steps': 8000,
            'updated_at': '2022-08-22T21:08:02',
            'weight': '74.9'
          },
          {
            'date': '2022-08-21',
            'fiber_meals': 5,
            'id': 1502,
            'kettlebell_sets': null,
            'protein_meals': 4,
            'pullups': null,
            'sleep': 10,
            'stepper': null,
            'steps': 4000,
            'updated_at': '2022-08-21T18:34:10',
            'weight': '75.3'
          },
          {
            'date': '2022-08-20',
            'fiber_meals': 5,
            'id': 1486,
            'kettlebell_sets': null,
            'protein_meals': 3,
            'pullups': null,
            'sleep': 9,
            'stepper': 800,
            'steps': 4000,
            'updated_at': '2022-08-20T21:10:09',
            'weight': null
          },
          {
            'date': '2022-08-19',
            'fiber_meals': 4,
            'id': 1469,
            'kettlebell_sets': 3,
            'protein_meals': 3,
            'pullups': 24,
            'sleep': 8,
            'stepper': null,
            'steps': 9000,
            'updated_at': '2022-08-19T20:12:37',
            'weight': '75.7'
          },
          {
            'date': '2022-08-18',
            'fiber_meals': 4,
            'id': 1447,
            'kettlebell_sets': null,
            'protein_meals': 4,
            'pullups': null,
            'sleep': 9,
            'stepper': null,
            'steps': 11000,
            'updated_at': '2022-08-18T19:55:18',
            'weight': '75.3'
          },
          {
            'date': '2022-08-17',
            'fiber_meals': 3,
            'id': 1427,
            'kettlebell_sets': 1,
            'protein_meals': 3,
            'pullups': null,
            'sleep': 9,
            'stepper': 500,
            'steps': 8500,
            'updated_at': '2022-08-17T18:48:43',
            'weight': '75.3'
          },
          {
            'date': '2022-08-16',
            'fiber_meals': 5,
            'id': 1411,
            'kettlebell_sets': null,
            'protein_meals': 3,
            'pullups': null,
            'sleep': 6,
            'stepper': null,
            'steps': 11000,
            'updated_at': '2022-08-16T19:30:58',
            'weight': '75.5'
          },
          {
            'date': '2022-08-15',
            'fiber_meals': 4,
            'id': 1391,
            'kettlebell_sets': 3,
            'protein_meals': 4,
            'pullups': 22,
            'sleep': 6,
            'stepper': null,
            'steps': 14000,
            'updated_at': '2022-08-15T21:50:20',
            'weight': '75.7'
          },
          {
            'date': '2022-08-14',
            'fiber_meals': 3,
            'id': 1383,
            'kettlebell_sets': null,
            'protein_meals': 4,
            'pullups': null,
            'sleep': 9,
            'stepper': null,
            'steps': 4000,
            'updated_at': '2022-08-14T22:01:04',
            'weight': '75.6'
          },
          {
            'date': '2022-08-13',
            'fiber_meals': 3,
            'id': 1373,
            'kettlebell_sets': null,
            'protein_meals': 4,
            'pullups': null,
            'sleep': 9,
            'stepper': null,
            'steps': 19000,
            'updated_at': '2022-08-13T21:12:05',
            'weight': '75.6'
          },
          {
            'date': '2022-08-12',
            'fiber_meals': 5,
            'id': 1350,
            'kettlebell_sets': 2,
            'protein_meals': 3,
            'pullups': 15,
            'sleep': 9,
            'stepper': 100,
            'steps': 8000,
            'updated_at': '2022-08-12T16:12:08',
            'weight': '75.7'
          }
        ]
      }
      ),
    )
  }),
]
