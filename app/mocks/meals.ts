import {mockFood} from './foods.ts';

export const meals = [
    {
        range: { gte: new Date('2023-03-01'), lte: new Date('2023-03-03') },
        rangeAsString: '1 марта - 3 марта',
        summary: {
            id: 'summary-1',
            name: 'Рацион 1 марта - 3 марта',
            weight: 500,
            kcal: 1200,
            protein: 60,
            fat: 40,
            carbs: 70,
        },
        data: [
            {
                id: '1',
                date: '2023-03-01',
                name: 'Завтрак',
                items: [
                    { foodId: '1', weight: 150, food: mockFood[0] },
                ],
                summary: mockFood[0],
            },
            {
                id: '2',
                date: '2023-03-01',
                name: 'Ужин',
                items: [
                    { foodId: '2', weight: 200, food: mockFood[1] },
                ],
                summary: mockFood[1],
            },
        ],
    },
    {
        range: { gte: new Date('2023-03-04'), lte: new Date('2023-03-06') },
        rangeAsString: '4 марта - 6 марта',
        summary: {
            id: 'summary-2',
            name: 'Рацион 4 марта - 6 марта',
            weight: 600,
            kcal: 1500,
            protein: 70,
            fat: 50,
            carbs: 90,
        },
        data: [
            {
                id: '3',
                date: '2023-03-04',
                name: 'Завтрак',
                items: [
                    { foodId: '3', weight: 180, food: mockFood[2] },
                ],
                summary: mockFood[2],
            },
            {
                id: '4',
                date: '2023-03-04',
                name: 'Обед',
                items: [
                    { foodId: '4', weight: 250, food: mockFood[3] },
                ],
                summary: mockFood[3],
            },
        ],
    },
];
