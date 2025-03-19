import SQLite from 'react-native-sqlite-storage';
import {Food} from '../models/food.ts';
import {ID} from '../models/id.ts';
import {Meal} from '../models/meal.ts';
import {FoodWeighted} from '../models/food-weighted.ts';

const db = SQLite.openDatabase(
    { name: 'app_data.db', location: 'default' },
    () => console.log('SQLite DB opened'),
    (error) => console.error('Error opening SQLite DB:', error)
);

export const initDB = () => {
    db.transaction(tx => {
        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS food (
        id TEXT PRIMARY KEY,
        name TEXT,
        weight INTEGER,
        kcal INTEGER,
        protein REAL,
        fat REAL,
        carbs REAL,
        fiber REAL,
        salt REAL,
        totalUse INTEGER
      );`
        );

        tx.executeSql(
            `CREATE TABLE IF NOT EXISTS meals (
        id TEXT PRIMARY KEY,
        date TEXT,
        name TEXT,
        items TEXT,
        summary TEXT
      );`
        );
    });
};

export const getFood = (): Promise<Food[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM food;', [], (_, result) => {
                const foodList: Food[] = [];
                for (let i = 0; i < result.rows.length; i++) {
                    foodList.push(result.rows.item(i));
                }
                resolve(foodList);
            }, (_, error) => reject(error));
        });
    });
};

export const addFoodToDB = (food: Food) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO food (id, name, weight, kcal, protein, fat, carbs, fiber, salt, totalUse) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
                food.id,
                food.name,
                food.weight,
                food.kcal,
                food.protein,
                food.fat,
                food.carbs,
                food.fiber ?? null,
                food.salt ?? null,
                food.totalUse ?? 0,
            ]
        );
    });
};

export const updateFoodInDB = (id: ID, updatedFood: Partial<Food>) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE food SET 
        name = ?, 
        weight = ?, 
        kcal = ?, 
        protein = ?, 
        fat = ?, 
        carbs = ?, 
        fiber = ?, 
        salt = ?, 
        totalUse = ?
      WHERE id = ?;`,
            [
                updatedFood.name ?? null,
                updatedFood.weight ?? null,
                updatedFood.kcal ?? null,
                updatedFood.protein ?? null,
                updatedFood.fat ?? null,
                updatedFood.carbs ?? null,
                updatedFood.fiber ?? null,
                updatedFood.salt ?? null,
                updatedFood.totalUse ?? null,
                id,
            ]
        );
    });
};

export const removeFoodFromDB = (id: ID) => {
    db.transaction(tx => {
        tx.executeSql('DELETE FROM food WHERE id = ?;', [id]);
    });
};

export const getMeals = (): Promise<Meal[]> => {
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql('SELECT * FROM meals;', [], (_, result) => {
                const mealList: Meal[] = [];
                for (let i = 0; i < result.rows.length; i++) {
                    const mealRow = result.rows.item(i);
                    const meal: Meal = {
                        id: mealRow.id,
                        date: mealRow.date,
                        name: mealRow.name ?? '',
                        items: JSON.parse(mealRow.items) as FoodWeighted[],
                        summary: mealRow.summary ? JSON.parse(mealRow.summary) : undefined,
                    };
                    mealList.push(meal);
                }
                resolve(mealList);
            }, (_, error) => reject(error));
        });
    });
};

export const addMealToDB = (meal: Meal) => {
    db.transaction(tx => {
        tx.executeSql(
            `INSERT INTO meals (id, date, name, items, summary) 
      VALUES (?, ?, ?, ?, ?);`,
            [
                meal.id,
                meal.date,
                meal.name ?? '',
                JSON.stringify(meal.items),
                meal.summary ? JSON.stringify(meal.summary) : null,
            ]
        );
    });
};

export const updateMealInDB = (id: ID, updatedMeal: Partial<Meal>) => {
    db.transaction(tx => {
        tx.executeSql(
            `UPDATE meals 
             SET date = ?, 
                 name = ?, 
                 items = ?, 
                 summary = ? 
             WHERE id = ?;`,
            [
                updatedMeal.date ?? null,
                updatedMeal.name ?? '',
                updatedMeal.items ? JSON.stringify(updatedMeal.items) : null,
                updatedMeal.summary ? JSON.stringify(updatedMeal.summary) : null,
                id,
            ]
        );
    });
};

export const removeMealFromDB = (id: ID) => {
    db.transaction(tx => {
        tx.executeSql('DELETE FROM meals WHERE id = ?;', [id]);
    });
};
